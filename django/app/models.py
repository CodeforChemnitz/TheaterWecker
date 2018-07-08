# -*- coding: utf-8 -*-
import requests
from django.conf import settings
from django.core.mail import send_mail
from django.db import models
from django.utils.translation import ugettext_lazy as _


class UserEmail(models.Model):
    class Meta:
        verbose_name = _('User Email')
        verbose_name_plural = _('User Emails')

    email = models.EmailField(unique=True)
    verified = models.BooleanField(default=False)
    verification_key = models.CharField(max_length=255, null=True, blank=True, unique=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        check = "✓" if self.verified else "×"
        return "%s (%s)" % (self.email, check)

    def mail(self, subject, message):
        send_mail(
            subject=subject,
            message=message,
            recipient_list=[self.email],
            from_email=settings.DEFAULT_FROM_EMAIL
        )


class UserDevice(models.Model):
    class Meta:
        verbose_name = _('User Device')
        verbose_name_plural = _('User Devices')

    device_id = models.CharField(max_length=255, unique=True)
    verified = models.BooleanField(default=False)
    verification_key = models.CharField(max_length=255, null=True, blank=True, unique=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def notify(self, data):
        payload = {
            'app_id': settings.ONE_SIGNAL['APP_ID'],
            'include_player_ids': [self.device_id]
        }
        payload.update(data)
        requests.post(
            url=settings.ONE_SIGNAL['URL'],
            headers={
                'Authorization': 'key=%s' % settings.ONE_SIGNAL['KEY'],
                'Content-Type': 'application/json; charset=utf-8'
            },
            json=payload,
        )

    def __str__(self):
        check = "✓" if self.verified else "×"
        return "%s (%s)" % (self.device_id, check)


class City(models.Model):
    class Meta:
        verbose_name = _('City')
        verbose_name_plural = _('Cities')

    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name


class Institution(models.Model):
    class Meta:
        verbose_name = _('Institution')
        verbose_name_plural = _('Institutions')

    name = models.CharField(max_length=255)
    city = models.ForeignKey('City')

    def __str__(self):
        return self.name


class Location(models.Model):
    class Meta:
        verbose_name = _('Location')
        verbose_name_plural = _('Locations')

    name = models.CharField(max_length=255)
    institution = models.ForeignKey('Institution')

    def __str__(self):
        return self.name


class Category(models.Model):
    class Meta:
        verbose_name = _('Category')
        verbose_name_plural = _('Categories')
        ordering = ['name']

    name = models.CharField(max_length=255)
    institution = models.ForeignKey('Institution')

    def __str__(self):
        return self.name


class Performance(models.Model):
    class Meta:
        verbose_name = _('Performance')
        verbose_name_plural = _('Performances')
        ordering = ['begin']

    eventid = models.IntegerField(blank=True, null=True, unique=True)
    title = models.CharField(max_length=255)
    begin = models.DateTimeField()
    location = models.ForeignKey('Location')
    category = models.ForeignKey('Category', null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    url = models.URLField(blank=True, null=True)

    def __str__(self):
        return "%s (%s)" % (self.title, self.begin)


class PerformanceNotification(models.Model):
    class Meta:
        verbose_name = _('Performance Notification')
        verbose_name_plural = _('Performance Notifications')
        unique_together = ('user', 'performance')

    user = models.ForeignKey('UserEmail')
    performance = models.ForeignKey('Performance')
    interval = models.DurationField()

    def __str__(self):
        return '%s ~> %s ~> %s' % (self.user, self.interval, self.performance.title)


class CategoryNotification(models.Model):
    class Meta:
        verbose_name = _('Category Notification')
        verbose_name_plural = _('Category Notifications')
        unique_together = ('user', 'device', 'category', 'verified')

    user = models.ForeignKey('UserEmail', null=True, blank=True)
    device = models.ForeignKey('UserDevice', null=True, blank=True)
    category = models.ForeignKey('Category')
    interval = models.DurationField()
    verified = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        check = "✓" if self.verified else "×"
        u = 'N/A'
        if self.user:
            u = self.user
        elif self.device:
            u = self.device
        return '%s ~> %s ~> %s (%s)' % (u, self.interval, self.category.name, check)
