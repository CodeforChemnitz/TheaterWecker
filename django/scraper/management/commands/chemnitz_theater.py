import calendar
import datetime
import locale
import re

import requests
from bs4 import BeautifulSoup
from django.core.management.base import BaseCommand, CommandError
from app.models import Institution, Category, Performance, City, Location

locale.setlocale(locale.LC_ALL, 'de_DE.utf8')

class Command(BaseCommand):

    URL = "http://www.theater-chemnitz.de/spielplan/gesamtspielplan"
    time_location_re = re.compile("(?P<hour>\d{2}):(?P<minutes>\d{2})(\s*Uhr\s*)(?P<location>[\w\s]*)")

    def get_plays(self, year, month):
        plan = requests.get(self.URL, params={
            "month": calendar.month_name[month].lower(),
            "year": year,
            "tip": 1,
        })
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
                    m = self.time_location_re.match(time_location_raw.get_text())
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
                        else:
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
        return plays

    def handle(self, *args, **options):
        today = datetime.date.today()
        plays = self.get_plays(today.year, today.month)
        if today.month + 1 == 13:
            plays.extend(self.get_plays(today.year + 1, 1))
        else:
            plays.extend(self.get_plays(today.year, today.month + 1))

        city, _ = City.objects.get_or_create(name='Chemnitz')
        institution, _ = Institution.objects.get_or_create(name='Theater Chemnitz', city=city)

        for play in plays:
            location, _ = Location.objects.get_or_create(name=play.get('location', "Theater Chemnitz"), institution=institution)
            category, _ = Category.objects.get_or_create(name=play.get('category', 'Sonstiges'), institution=institution)
            begin = datetime.datetime(play['year'], play['month'], play['day'], play['hour'], play['minutes'])

            data = {
                "title": play.get('title'),
                "location": location,
                "category": category,
                "begin": begin.isoformat(),
                "description": play.get('description', ''),
            }

            if not play['tickets']:
                try:
                    performance = Performance.objects.get(
                       **data
                    )
                except Performance.DoesNotExist:
                    pass
                else:
                    performance.delete()
            else:
                performance, _ = Performance.objects.get_or_create(
                    **data
                )
