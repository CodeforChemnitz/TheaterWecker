import locale

from django.core.management.base import BaseCommand
from django.utils.timezone import now
from app.models import Performance

locale.setlocale(locale.LC_ALL, 'de_DE.utf8')


class Command(BaseCommand):

    def handle(self, *args, **options):
        Performance.objects.filter(begin__lt=now()).delete()
