# -*- coding: utf-8 -*-
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


class Institution(models.Model):
    class Meta:
        verbose_name = _('Institution')
        verbose_name_plural = _('Institutions')

    name = models.CharField(max_length=255)
    city = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Category(models.Model):
    class Meta:
        verbose_name = _('Category')
        verbose_name_plural = _('Categories')

    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Performance(models.Model):
    class Meta:
        verbose_name = _('Performance')
        verbose_name_plural = _('Performances')

    title = models.CharField(max_length=255)
    begin = models.DateTimeField()
    institution = models.ForeignKey('Institution')
    category = models.ForeignKey('Category', null=True, blank=True)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.title


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
        unique_together = ('user', 'category')

    user = models.ForeignKey('UserEmail')
    category = models.ForeignKey('Category')
    interval = models.DurationField()

    def __str__(self):
        return '%s ~> %s ~> %s' % (self.user, self.interval, self.category.name)
