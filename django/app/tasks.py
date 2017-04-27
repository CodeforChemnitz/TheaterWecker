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
from django.conf import settings

from django.template.loader import render_to_string
from django.urls import reverse
from django.utils.timezone import now, make_aware, utc
from django.utils.translation import activate

from app.models import UserEmail, Performance, Institution, Category, City, Location, CategoryNotification, UserDevice

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
            })),
            'unsubscribe_link': "%s://%s%s?email=%s" % (scheme, host, reverse('app:unsubscribe'), email),
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


@shared_task
def send_unsubscribe_email(email, count):
    c = statsd.StatsClient('localhost', 8125)
    try:
        user_email = UserEmail.objects.get(email=email)
        user_email.mail("Auf Wiedersehen", render_to_string('email/unsubscribe.email', {}))
        c.incr('send_unsubscribe_email')
        c.gauge('total.send_unsubscribe_email', 1, delta=True)
    except UserEmail.DoesNotExist as e:
        c.incr('send_unsubscribe_email.no_user')
        logger.error('User does not exist', exc_info=True)
        return
    except Exception as e:
        if count > 9:
            c.incr('send_unsubscribe_email.failed_finally')
            logger.error('Sending email failed after 10th retry', exc_info=True)
            return
        c.incr('send_unsubscribe_email.failed')
        logger.error('Sending email failed', exc_info=True)
        send_verify_email.apply_async((email, count + 1), countdown=(2 ** count) * 60)


@shared_task
def send_verify_notification(device, count):
    c = statsd.StatsClient('localhost', 8125)
    try:
        user_device = UserDevice.objects.get(device_id=device)
        user_device.notify(data={
            'headings': {
                'de': 'Willkommen beim TheaterWecker',
                'en': 'Willkommen beim TheaterWecker',
            },
            'contents': {
                'de': 'Tippe hier, um dein Gerät zu verifizieren.',
                'en': 'Tippe hier, um dein Gerät zu verifizieren.',
            },
            'data': {
                'verification': user_device.verification_key,
            },
        })
        c.incr('send_verify_notification')
        c.gauge('total.send_verify_notification', 1, delta=True)
    except UserDevice.DoesNotExist as e:
        c.incr('send_verify_notification.no_user')
        logger.error('User does not exist', exc_info=True)
        return
    except Exception as e:
        if count > 9:
            c.incr('send_verify_notification.failed_finally')
            logger.error('Sending notification failed after 10th retry', exc_info=True)
            return
        c.incr('send_verify_notification.failed')
        logger.error('Sending notification failed', exc_info=True)
        send_verify_notification.apply_async((device, count + 1), countdown=(2 ** count) * 60)


@periodic_task(run_every=(crontab(hour="4", minute="33", day_of_week="*")))
def passed_performance_cleanup():
    logger.info('cleanup_performances has run')
    Performance.objects.filter(begin__lt=now()).delete()


URL = "http://www.theater-chemnitz.de/spielplan/repertoire"
time_re = re.compile("(?P<hour>\d{2}):(?P<minutes>\d{2})(\s*Uhr\s*)")

def get_plays(year, month):
    plan = requests.get("{}/{}/{}".format(URL, year, month))
    if plan.status_code != 200:
        logger.error('got non-200 return code while scraping', exc_info=True)
        return []
    soup = BeautifulSoup(plan.text.replace('&nbsp;', ' '), "lxml")
    news_items = soup.find_all("div", class_="cc_news_item")
    plays = []
    for block_top in news_items:
        date = block_top.find("div", class_="cc_news_date")
        if date:
            day = int(date.find(class_="cc_day").get_text().strip('.'))
            play = {
                "month": month,
                "day": day,
                "year": year
            }
            time_raw = date.find(class_="cc_timeresp")
            m = time_re.match(time_raw.get_text())
            play["hour"] = int(m.group("hour"))
            play["minutes"] = int(m.group("minutes"))
            play["location"] = block_top.find(class_="cc_content").get_text()
            # Gastspiel, Premiere etc.
            special_raw = block_top.find(class_="cc_premiere")
            if special_raw:
                special = special_raw.get_text()
                if special in ["Gastspiel"]:  # Ausnahmen
                    continue
            category_raw = date.find(class_="cc_type")
            if category_raw:
                category = category_raw.get_text()
                if category in ["Theaternahes Rahmenprogramm"]:
                    category = "Sonstige"
                play["category"] = category
            title_raw = block_top.find("h2")
            if title_raw:
                play["title"] = title_raw.get_text()
            else:
                continue
            desciption_raw = block_top.find("h3")
            if desciption_raw:
                play["description"] = desciption_raw.get_text()
            tickets_raw = block_top.find("a", class_="cc_ticket")
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
        plays.extend(get_plays(today.year+1, 1))
    else:
        plays.extend(get_plays(today.year, today.month + 1))

    city, _ = City.objects.get_or_create(name='Chemnitz')
    institution, _ = Institution.objects.get_or_create(name='Theater', city=city)

    c.timing('performance_count', len(plays))
    count_no_ticket = 0
    for play in plays:
        location, _ = Location.objects.get_or_create(name=play.get('location', "Theater Chemnitz"), institution=institution)
        category, _ = Category.objects.get_or_create(name=play.get('category', 'Sonstige'), institution=institution)
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


@shared_task
def send_push_notifications(devices, performance_id):
    c = statsd.StatsClient('localhost', 8125)
    start = time.time()

    try:
        performance = Performance.objects.get(pk=performance_id)

        payload = {
            'app_id': settings.ONE_SIGNAL['APP_ID'],
            'include_player_ids': devices,
            'headings': {
                'en': "Es gibt noch Karten für '%s'" % performance.title,
                'de': "Es gibt noch Karten für '%s'" % performance.title,
            },
            'contents': {
                'en': performance.description,
                'de': performance.description,
            },
            'data': {
                'performance': {
                    'title': performance.title,
                    'begin': performance.begin.isoformat(),
                    'location': performance.location.__str__(),
                    'description': performance.description,
                }
            }
        }
        requests.post(
            url=settings.ONE_SIGNAL['URL'],
            headers={
                'Authorization': 'key=%s' % settings.ONE_SIGNAL['KEY'],
                'Content-Type': 'application/json; charset=utf-8'
            },
            json=payload,
        )
    except Performance.DoesNotExist as e:
        c.incr('send_push_notifications.no_performance')
        logger.error('Performance does not exist', exc_info=True)
        return
    except requests.exceptions.RequestException as e:
        c.incr('send_push_notifications.request_exception')
        logger.error('Request Exception', exc_info=True)
        return
    except Exception as e:
        c.incr('send_push_notifications.failed')
        logger.error('Sending email failed', exc_info=True)
        return

    end = time.time()
    c.timing('send_push_notifications.timed', floor((end - start) * 1000))


@shared_task
def send_email_notification(email, performance_id):
    c = statsd.StatsClient('localhost', 8125)
    start = time.time()
    try:
        user_email = UserEmail.objects.get(email=email)
        performance = Performance.objects.get(pk=performance_id)

        user_email.mail(
            "Es gibt noch Karten für '%s'" % performance.title,
            render_to_string(
                'email/notification.email', {
                    'performance': performance
                }
            )
        )

        c.incr('send_email_notification')
        c.gauge('total.send_email_notification', 1, delta=True)
    except UserEmail.DoesNotExist as e:
        c.incr('send_email_notification.no_user')
        logger.error('User does not exist', exc_info=True)
        return
    except Performance.DoesNotExist as e:
        c.incr('send_email_notification.no_performance')
        logger.error('Performance does not exist', exc_info=True)
        return
    except Exception as e:
        c.incr('send_email_notification.failed')
        logger.error('Sending email failed', exc_info=True)
        return

    end = time.time()
    c.timing('send_email_notifications.timed', floor((end - start) * 1000))


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
            devices = []
            for notification in notifications:
                c.gauge('total.notification_send', 1, delta=True)
                # todo move this to another task for proper scale out
                if notification.user:
                    send_email_notification.delay(notification.user.email, performance.pk)
                if notification.device:
                    devices.append(notification.device.device_id)
            send_push_notifications.delay(devices, performance.pk)

    end = time.time()
    c.timing('notification.timed', floor((end - start) * 1000))

