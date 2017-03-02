# -*- coding: utf-8 -*-
import random

from app.models import Performance
from app.tasks import send_push_notifications, send_verify_notification


def performance_test_push_notifications(modeladmin, request, queryset):
    p = random.choice(list(Performance.objects.all()))
    ds = queryset.values_list('device_id', flat=True)
    send_push_notifications.delay(ds, p.id)
performance_test_push_notifications.short_description = "Send performance test notification"


def verification_test_push_notifications(modeladmin, request, queryset):
    for q in queryset:
        send_verify_notification.delay(q.device_id, 0)
verification_test_push_notifications.short_description = "Send verification test notification"
