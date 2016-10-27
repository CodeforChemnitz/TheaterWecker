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


def get_plays(year, month):
    plan = requests.get(URL, params={
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
                m = time_location_re.match(time_location_raw.get_text())
                play["hour"] = int(m.group("hour"))
                play["minutes"] = int(m.group("minutes"))
                play["location"] = m.group("location")
                # Gastspiel, Premiere etc.
                special_raw = info.find("span", class_="pr_red")
                if special_raw:
                    special = special_raw.get_text()
                    if special == "Gastspiel":
                        continue
                    play["special"] = special
                typ_raw = info.find(class_="pr_box_content_right_table_top")
                if typ_raw:
                    play["typ"] = typ_raw.get_text()
                title_raw = info.find(class_="mini_title_link_b")
                if title_raw:
                    play["title"] = title_raw.get_text()
                desciption_raw = info.find(class_="news_box_descript")
                if desciption_raw:
                    play["description"] = desciption_raw.get_text()
                tickets_raw = info.find("a", class_="karten")
                play["tickets"] = True if tickets_raw else False
                plays.append(play)
    return plays


def main():
    today = datetime.date.today()
    plays = get_plays(today.year, today.month)
    if today.month+1 == 13:
        plays.extend(get_plays(today.year+1, 1))
    else:
        plays.extend(get_plays(today.year, today.month + 1))

    with open("data.json", "w") as fp:
        json.dump(plays, fp, indent=2)

if __name__ == "__main__":
    main()