# -*- coding: utf-8 -*-
from datetime import timedelta

import locale

from django.core.management.base import BaseCommand
from django.db.models import Q
from django.utils.timezone import now
from app.models import Performance, CategoryNotification

locale.setlocale(locale.LC_ALL, 'de_DE.utf8')


class Command(BaseCommand):

    def handle(self, *args, **options):
        performances = Performance.objects.filter(
            begin__gte=now()+timedelta(minutes=20),
            #begin__lte=now()+timedelta(minutes=65),
        )
        print(performances)
        categories = list(set(performances.values_list('category', flat=True)))
        print(categories)
        notifications = CategoryNotification.objects.filter(
            category_id__in=categories
        ).exclude(
            Q(user__verified=False) |
            Q(verified=False)
        )

