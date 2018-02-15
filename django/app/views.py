# -*- coding: utf-8 -*-
from uuid import uuid4
import statsd
from django.conf import settings
from django.db.models import Q

from django.views.decorators.http import require_http_methods
from django.shortcuts import render, get_object_or_404

from app.forms import SubscribeForm, UnsubscribeForm
from app.models import CategoryNotification, Category, UserEmail, Institution, City, UserDevice
from app.tasks import send_verify_email, send_unsubscribe_email

# import the logging library
import logging

# Get an instance of a logger
logger = logging.getLogger(__name__)


def index(request, institution=None):
    c = statsd.StatsClient('localhost', 8125)
    c.incr('index_loads')
    c.gauge('total.index_loads', 1, delta=True)
    if institution:
        inst = get_object_or_404(Institution, pk=institution)
    else:
        # FIXME - TODO - just do it
        city = City.objects.get(name='Chemnitz')
        inst = Institution.objects.filter(city=city).first()
    return render(request, "index.html", {
        'categories': Category.objects.filter(institution=inst),
        'ONE_SIGNAL_APP_ID': settings.ONE_SIGNAL['APP_ID']
    })


def impressum(request):
    return render(request, "impressum.html")


@require_http_methods(['POST'])
def subscribe(request):
    c = statsd.StatsClient('localhost', 8125)
    form = SubscribeForm(request.POST, category_choices=Category.objects.all().values_list("pk", "name"))

    if form.is_valid():
        email = form.cleaned_data.get('email')
        device = form.cleaned_data.get('device')
        interval = form.cleaned_data.get('interval')

        if email:
            user_email, _ = UserEmail.objects.get_or_create(email=email)
            user_email.verified = False
            user_email.verification_key = uuid4().hex
            user_email.save()
        else:
            user_email = None

        if device:
            user_device, _ = UserDevice.objects.get_or_create(device=device)
            user_device.verified = False
            user_device.verification_key = uuid4().hex
            user_device.save()
        else:
            user_device = None

        interval = form.cleaned_data.get('interval')
        CategoryNotification.objects.filter(Q(user=user_email) | Q(device=user_device)).delete()
        for category in form.cleaned_data.get('categories', []):
            try:
                CategoryNotification.objects.create(
                    user=user_email,
                    device=user_device,
                    category=Category.objects.get(id=category),
                    verified=user_email is not None,
                    interval=interval
                )

            except Exception as e:
                logger.error('Saving category failed', exc_info=True, extra={
                    # Optionally pass a request and we'll grab any information we can
                    'request': request,
                })
                return render(request, 'subscribe.html', {
                        'icon': 'img/boom.svg',
                        'text': 'Leider ist ein Fehler aufgetreten. Bitte versuche es erneut.',
                        'showBack': True
                    })

        if email:
            send_verify_email.delay(email, request.scheme, request.get_host(), 0)

        c.incr('subscribe.success')
        c.gauge('total.subscribe.success', 1, delta=True)
        return render(request, 'subscribe.html', {
                'icon': 'img/ok.svg',
                'text': 'Danke, wir haben dir eine E-Mail zur Bestätigung geschickt.',
                'showBack': False
            })

    if form.has_error('email'):
        c.incr('subscribe.fail_email')
        c.gauge('total.subscribe.fail_email', 1, delta=True)
        return render(request, 'subscribe.html', {
                'icon': 'img/pencil.svg',
                'text': 'Deine E-Mail-Adresse scheint nicht korrekt zu sein. Bitte versuche es erneut.',
                'showBack': True
            })
    if form.has_error('categories'):
        c.incr('subscribe.fail_categories')
        c.gauge('total.subscribe.fail_categories', 1, delta=True)
        return render(request, 'subscribe.html', {
                'icon': 'img/woot.svg',
                'text': 'Scheinbar hast du keine Kategorie angegeben. Bitte versuche es erneut.',
                'showBack': True
            })

    c.incr('subscribe.fail')
    c.gauge('total.subscribe.fail', 1, delta=True)
    return render(request, 'subscribe.html', {
            'icon': 'img/boom.svg',
            'text': 'Leider ist ein Fehler aufgetreten. Bitte versuche es erneut.',
            'showBack': True
        })


def verify(request, key=None):
    c = statsd.StatsClient('localhost', 8125)
    if not key:
        c.incr('verify.failed')
        c.gauge('total.verify.failed', 1, delta=True)
        return render(request, 'subscribe.html', {
            'icon': 'img/boom.svg',
            'text': 'Leider ist ein Fehler aufgetreten. Bitte versuche es erneut.',
            'showBack': True
        })

    else:
        try:
            user_email = UserEmail.objects.get(verification_key=key)
            user_email.verified = True
            user_email.save()
            notifications = CategoryNotification.objects.filter(user=user_email)
            # remove previously verified notifications on re-verify
            notifications.filter(verified=True).delete()

            # verify new notifications
            unverified_notifications = notifications.filter(verified=False)
            for n in unverified_notifications:
                n.verified = True
                n.save()
        except UserEmail.DoesNotExist:
            c.incr('verify.failed')
            c.gauge('total.verify.failed', 1, delta=True)
            return render(request, 'subscribe.html', {
                'icon': 'img/boom.svg',
                'text': 'Leider ist ein Fehler aufgetreten. Bitte versuche es erneut.',
                'showBack': True
            })
        else:
            c.incr('verify.success')
            c.gauge('total.verify.success', 1, delta=True)
            return render(request, 'subscribe.html', {
                'icon': 'img/ok.svg',
                'text': 'Danke, wir werden dich bei der nächsten Gelegenheit benachrichtigen.',
                'showBack': False
            })


def unsubscribe(request):

    if request.method == "POST":
        form = UnsubscribeForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data.get('email')
            user_email = get_object_or_404(UserEmail, email=email)
            if user_email.verified:
                send_unsubscribe_email.delay(email, 0)
            user_email.verified = False
            user_email.save()
            CategoryNotification.objects.filter(user=user_email).delete()
            return render(request, 'subscribe.html', {
                'icon': 'img/cry.svg',
                'text': 'Schade! Wir sehen dich hoffentlich bald wieder.',
                'showBack': True
            })
    else:
        form = UnsubscribeForm()

    return render(request, 'unsubscribe.html', {
        'form': form,
        'email': request.GET.get('email', '')
    })
