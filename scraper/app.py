#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import datetime
import calendar
import json
import locale
import re

import requests
from bs4 import BeautifulSoup

# Use German month names
locale.setlocale(locale.LC_ALL, 'de_DE.utf8')

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



def main():
    today = datetime.date.today()
    plays = get_plays(today.year, today.month)
    if today.month+1 == 13:
        plays.extend(get_plays(today.year+1, 1))
    else:
        plays.extend(get_plays(today.year, today.month + 1))

    for play in plays:
        print(play)


if __name__ == "__main__":
    main()