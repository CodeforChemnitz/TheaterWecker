# -*- coding: utf-8 -*-
from __future__ import absolute_import, unicode_literals

from math import floor

import pytz
import statsd
import time
from celery import shared_task
from celery.schedules import crontab
from celery.task.base import periodic_task
import datetime
import re
import requests
from bs4 import BeautifulSoup

from django.template.loader import render_to_string
from django.urls import reverse
from django.utils.timezone import now, make_aware, utc
from django.utils.translation import activate

from app.models import UserEmail, Performance, Institution, Category, City, Location, CategoryNotification

# import the logging library
import logging

# Get an instance of a logger
logger = logging.getLogger(__name__)

@shared_task
def send_verify_email(email, scheme, host, count):
    c = statsd.StatsClient('localhost', 8125)
    try:
        user_email = UserEmail.objects.get(email=email)
        user_email.mail("Willkommen beim TheaterWecker", render_to_string('email/welcome.email', {
            'verification_link': "%s://%s%s" % (scheme, host, reverse('app:verify', kwargs={
                'key': user_email.verification_key
            }))
        }))
        c.incr('send_verify_email')
        c.gauge('total.send_verify_email', 1, delta=True)
    except UserEmail.DoesNotExist as e:
        c.incr('send_verify_email.no_user')
        logger.error('User does not exist', exc_info=True)
        return
    except Exception as e:
        if count > 9:
            c.incr('send_verify_email.failed_finally')
            logger.error('Sending email failed after 10th retry', exc_info=True)
            return
        c.incr('send_verify_email.failed')
        logger.error('Sending email failed', exc_info=True)
        send_verify_email.apply_async((email, scheme, host, count + 1), countdown=(2 ** count) * 60)


@periodic_task(run_every=(crontab(hour="4", minute="33", day_of_week="*")))
def passed_performance_cleanup():
    logger.info('cleanup_performances has run')
    Performance.objects.filter(begin__lt=now()).delete()


URL = "http://www.theater-chemnitz.de/spielplan/gesamtspielplan"
time_location_re = re.compile("(?P<hour>\d{2}):(?P<minutes>\d{2})(\s*Uhr\s*)(?P<location>[\w\s]*)")
calendar_months = [
    '',
    'januar',
    'februar',
    'marz',
    'april',
    'mai',
    'juni',
    'juli',
    'august',
    'september',
    'oktober',
    'november',
    'dezember'
]

def get_plays(year, month):
    plan = requests.get(URL, params={
        "month": calendar_months[month],
        "year": year,
        "tip": 1,
    })
    if plan.status_code != 200:
        logger.error('got non-200 return code while scraping', exc_info=True)
        return []
    soup = BeautifulSoup(plan.text.replace('&nbsp;', ' '), "lxml")
    block_tops = soup.find_all("div", class_="block_top")
    plays = []
    for block_top in block_tops:
        date = block_top.find("div", class_="pr_box_data_01")
        if date:
            day = int(date.get_text())
            infos = block_top.find_all("div", class_="pr_box_info")
            for info in infos:
                play = {
                    "month": month,
                    "day": day,
                    "year": year
                }
                time_location_raw = info.find(class_="news_box_in_left_in_top")
                m = time_location_re.match(time_location_raw.get_text())
                play["hour"] = int(m.group("hour"))
                play["minutes"] = int(m.group("minutes"))
                play["location"] = m.group("location")
                # Gastspiel, Premiere etc.
                special_raw = info.find("span", class_="pr_red")
                if special_raw:
                    special = special_raw.get_text()
                    if special in ["Gastspiel"]:  # Ausnahmen
                        continue
                category_raw = info.find(class_="pr_box_content_right_table_top")
                if category_raw:
                    category = category_raw.get_text()
                    if category in ["Theaternahes Rahmenprogramm"]:
                        category = "Sonstiges"
                    play["category"] = category
                title_raw = info.find(class_="mini_title_link_b")
                if title_raw:
                    play["title"] = title_raw.get_text()
                else:
                    continue
                desciption_raw = info.find(class_="news_box_descript")
                if desciption_raw:
                    play["description"] = desciption_raw.get_text()
                tickets_raw = info.find("a", class_="karten")
                play["tickets"] = tickets_raw
                plays.append(play)
    if len(plays) == 0:
        logger.error('could not find a single play while scraping', exc_info=True)
    return plays

@periodic_task(run_every=(crontab(hour="*", minute="14,29,44,59", day_of_week="*")))
def scrape_performances_in_chemnitz():
    c = statsd.StatsClient('localhost', 8125)
    start = time.time()

    logger.info('run it')
    today = datetime.date.today()
    plays = get_plays(today.year, today.month)
    if today.month + 1 == 13:
        # plays.extend(get_plays(today.year + 1, 1)) see https://github.com/CodeforChemnitz/TheaterWecker/issues/6
        # don't be that clever and just :see_no_evil:
        # Yes, the Spielplan for January 2017 uses 2016 as query parameter
        plays.extend(get_plays(today.year, 1))
    else:
        plays.extend(get_plays(today.year, today.month + 1))

    city, _ = City.objects.get_or_create(name='Chemnitz')
    institution, _ = Institution.objects.get_or_create(name='Theater', city=city)

    c.timing('performance_count', len(plays))
    count_no_ticket = 0
    for play in plays:
        location, _ = Location.objects.get_or_create(name=play.get('location', "Theater Chemnitz"), institution=institution)
        category, _ = Category.objects.get_or_create(name=play.get('category', 'Sonstiges'), institution=institution)
        begin = make_aware(datetime.datetime(play['year'], play['month'], play['day'], play['hour'], play['minutes']), pytz.timezone('Europe/Berlin'))

        data = {
            "title": play.get('title'),
            "location": location,
            "category": category,
            "begin": begin.isoformat(),
            "description": play.get('description', ''),
        }

        if not play['tickets']:
            count_no_ticket += 1
            try:
                performance = Performance.objects.get(
                   **data
                )
            except Performance.DoesNotExist:
                pass
            else:
                c.gauge('chemnitz.scrape_performances.performance_deleted', 1, delta=True)
                performance.delete()
                logger.warning('performance deleted', exc_info=True)
        else:
            performance, created = Performance.objects.get_or_create(
                **data
            )
            if created:
                c.gauge('chemnitz.scrape_performances.performance_created', 1, delta=True)
                logger.warning('performance created', exc_info=True)

    c.gauge('chemnitz.performance_count', len(plays))
    c.gauge('chemnitz.performance_count.no_tickets', count_no_ticket)
    end = time.time()
    c.timing('scrape_performances_in_chemnitz.timed', floor((end - start) * 1000))

@periodic_task(run_every=(crontab(hour="*", minute="*/15", day_of_week="*")))
def send_notifications():
    c = statsd.StatsClient('localhost', 8125)
    start = time.time()

    activate('de')

    deltas = CategoryNotification.objects.values('interval').distinct()

    for delta in deltas:
        performances = Performance.objects.filter(
            begin__gte=datetime.datetime.now(tz=utc) - datetime.timedelta(minutes=10) + delta['interval'],
            begin__lte=datetime.datetime.now(tz=utc) + datetime.timedelta(minutes=5) + delta['interval'],
        )

        for performance in performances:
            notifications = CategoryNotification.objects.filter(
                verified=True,
                interval=delta['interval'],
                category=performance.category
            )
            for notification in notifications:
                c.gauge('total.notification_send', 1, delta=True)
                # todo move this to another task for proper scale out
                notification.user.mail(
                    "Es gibt noch Karten für '%s'" % performance.title,
                    render_to_string(
                        'email/notification.email', {
                            'performance': performance
                        }
                    )
                )

    end = time.time()
    c.timing('notification.timed', floor((end - start) * 1000))

