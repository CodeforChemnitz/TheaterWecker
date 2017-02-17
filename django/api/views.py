# -*- coding: utf-8 -*-
from datetime import timedelta
from uuid import uuid4

import statsd, json, logging, re
from django.http.response import HttpResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from app.models import *
from app.tasks import send_verify_notification

# Get an instance of a logger
logger = logging.getLogger(__name__)


check_uuid = re.compile('^[0-9a-f-]{36}$')

@csrf_exempt
@require_http_methods(['POST'])
def device(request):
    c = statsd.StatsClient('localhost', 8125)
    c.incr('subscribe.success')
    c.gauge('total.subscribe.success', 1, delta=True)
    device_id = request.body.decode("utf-8")

    if check_uuid.match(device_id) is None:
        return HttpResponse("", status=400)

    user_device, created = UserDevice.objects.get_or_create(device_id=device_id)
    if not created:
        if not user_device.verified:
            send_verify_notification.delay(device_id, 0)
        return HttpResponse(json.dumps({'verified': user_device.verified}), status=200, content_type="application/json")

    user_device.verified = False
    user_device.verification_key = uuid4().hex
    user_device.save()

    # TODO send verification key via PUSH
    send_verify_notification.delay(device_id, 0)

    return HttpResponse(json.dumps({}), status=201, content_type="application/json")


def verify(request, key=None):
    c = statsd.StatsClient('localhost', 8125)
    if not key:
        c.incr('verify.device.failed')
        c.gauge('total.verify.device.failed', 1, delta=True)
        return HttpResponse("", status=400)

    try:
        user_device = UserDevice.objects.get(verification_key=key)
        user_device.verified = True
        user_device.save()
    except UserEmail.DoesNotExist:
        c.incr('verify.device.failed')
        c.gauge('total.verify.device.failed', 1, delta=True)
        return HttpResponse("", status=400)

    c.incr('verify.device.success')
    c.gauge('total.verify.device.success', 1, delta=True)
    return HttpResponse("")


@csrf_exempt
@require_http_methods(['POST'])
def subscribe(request):
    c = statsd.StatsClient('localhost', 8125)

    data = json.loads(request.body.decode("utf-8") )

    try:
        user_device = UserDevice.objects.get(device_id=data.get('deviceId', ''))
    except UserDevice.DoesNotExist:
        return HttpResponse("", status=404)

    if not user_device.verified:
        return HttpResponse("", status=412)

    CategoryNotification.objects.filter(device=user_device).delete()

    for category in data.get('categories', []):
        try:
            notification,_ = CategoryNotification.objects.get_or_create(
                device=user_device,
                category=Category.objects.get(id=category),
                verified=True,
                defaults={'interval': timedelta(hours=4)}
            )

        except Exception as e:
            logger.error('Saving category failed', exc_info=True, extra={
                # Optionally pass a request and we'll grab any information we can
                'request': request,
            })
            return HttpResponse("", status=500)

    c.incr('subscribe.device.success')
    c.gauge('total.subscribe.device.success', 1, delta=True)
    return HttpResponse("", status=201)


def categories(request):
    city = City.objects.get(name='Chemnitz')
    inst = Institution.objects.filter(city=city).first()
    cats = Category.objects.filter(institution=inst).values('id', 'name')
    return HttpResponse(json.dumps(list(cats)), content_type="application/json")


def subscriptions(request, device_id):

    user_device = get_object_or_404(UserDevice, device_id=device_id, verified=True)
    cat_ids = CategoryNotification.objects.filter(device=user_device).values_list('category', flat=True)

    return HttpResponse(json.dumps(list(cat_ids)), content_type="application/json")
