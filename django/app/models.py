# -*- coding: utf-8 -*-

from django.db import models
from django.utils.translation import ugettext_lazy as _
# Create your models here.


class Institution(models.Model):
    class Meta:
        verbose_name = _("Institution")
        verbose_name_plural = _("Institutions")

    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
