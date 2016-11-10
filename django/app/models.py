# -*- coding: utf-8 -*-
from django.conf import settings
from django.db import models
from django.utils.translation import ugettext_lazy as _


class Institution(models.Model):
    class Meta:
        verbose_name = _('Institution')
        verbose_name_plural = _('Institutions')

    name = models.CharField(max_length=255)
    city = models.CharField(max_length=255)


class Category(models.Model):
    class Meta:
        verbose_name = _('Category')
        verbose_name_plural = _('Categories')

    name = models.CharField(max_length=255)


class Performance(models.Model):
    class Meta:
        verbose_name = _('Performance')
        verbose_name_plural = _('Performances')

    title = models.CharField(max_length=255)
    begin = models.DateTimeField()
    institution = models.ForeignKey('Institution')
    category = models.ForeignKey('Category', null=True, blank=True)
    description = models.TextField(null=True, blank=True)


class PerformanceNotification(models.Model):
    class Meta:
        verbose_name = _('Performance Notification')
        verbose_name_plural = _('Performance Notifications')
        unique_together = ('user', 'performance')

    user = models.EmailField()
    performance = models.ForeignKey('Performance')
    interval = models.DurationField()


class CategoryNotification(models.Model):
    class Meta:
        verbose_name = _('Category Notification')
        verbose_name_plural = _('Category Notifications')
        unique_together = ('user', 'category')

    user = models.EmailField()
    category = models.ForeignKey('Category')
    interval = models.DurationField()
