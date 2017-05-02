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

URL = "http://www.theater-chemnitz.de/spielplan/repertoire"
BASE_URL = "http://www.theater-chemnitz.de/"
time_re = re.compile("(?P<hour>\d{2}):(?P<minutes>\d{2})(\s*Uhr\s*)")
url_id_re = re.compile("\/(?P<id>\d+)\/$")
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
    plan = requests.get("{}/{}/{:02d}/".format(URL, year, month))
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
            time_raw = date.find(class_="cc_timeresp").get_text().split(' ')[0].split(':')
            play["hour"] = int(time_raw[0])
            play["minutes"] = int(time_raw[1])
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
                    category = "Sonstiges"
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
            play["tickets"] = tickets_raw["href"] if tickets_raw else None
            # ID & URL
            id_raw = block_top.find(class_="cc_newscol2").find("a")["href"]
            if id_raw:
                play["url"] = "{}{}".format(BASE_URL, id_raw)
                play["id"] = int(id_raw.strip("/").split("/")[-1])
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
