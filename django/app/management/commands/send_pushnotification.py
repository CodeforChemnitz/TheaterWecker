# -*- coding: utf-8 -*-
from datetime import timedelta

import locale

from django.core.management.base import BaseCommand, CommandError
from app.models import Performance
from app.tasks import send_push_notifications

locale.setlocale(locale.LC_ALL, 'de_DE.utf8')


class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument('device_id', type=str)

    def handle(self, *args, **options):

        if options['device_id']:
            print(options['device_id'])

            performance = Performance.objects.last()
            send_push_notifications.delay([options['device_id']], performance.id)
