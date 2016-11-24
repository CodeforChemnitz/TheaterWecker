# -*- coding: utf-8 -*-
from uuid import uuid4

from django.views.decorators.http import require_http_methods
from django.shortcuts import render, get_object_or_404

from app.forms import SubscribeForm
from app.models import CategoryNotification, Category, UserEmail, Institution, City
from app.tasks import send_verify_email

# import the logging library
import logging

# Get an instance of a logger
logger = logging.getLogger('root')

def index(request, institution=None):
    if institution:
        inst = get_object_or_404(Institution, pk=institution)
    else:
        # FIXME - TODO - just do it
        city = City.objects.get(name='Chemnitz')
        inst = Institution.objects.filter(city=city).first()
    return render(request, "index.html", {
        'categories': Category.objects.filter(institution=inst)
    })


@require_http_methods(['POST'])
def subscribe(request):
    form = SubscribeForm(request.POST, category_choices=Category.objects.all().values_list("pk", "name"))

    if form.is_valid():
        email = form.cleaned_data.get('email')
        user_email, _ = UserEmail.objects.get_or_create(email=email)
        user_email.verified = False
        user_email.verification_key = uuid4().hex
        user_email.save()
        interval = form.cleaned_data.get('interval')
        for category in form.cleaned_data.get('categories', []):
            try:
                notification,_ = CategoryNotification.objects.get_or_create(
                    user=user_email,
                    category=Category.objects.get(id=category),
                    verified=False,
                    defaults={'interval': interval}
                )
                if notification.interval != interval:
                    notification.interval = interval
                    notification.save()

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

        send_verify_email.delay(email, request.scheme, request.get_host(), 0)

        return render(request, 'subscribe.html', {
                'icon': 'img/ok.svg',
                'text': 'Danke, wir haben dir eine E-Mail zur Bestätigung geschickt.',
                'showBack': False
            })

    if form.has_error('email'):
        return render(request, 'subscribe.html', {
                'icon': 'img/pencil.svg',
                'text': 'Deine E-Mail-Adresse scheint nicht korrekt zu sein. Bitte versuche es erneut.',
                'showBack': True
            })
    if form.has_error('categories'):
        return render(request, 'subscribe.html', {
                'icon': 'img/woot.svg',
                'text': 'Scheinbar hast du keine Kategorie angegeben. Bitte versuche es erneut.',
                'showBack': True
            })

    return render(request, 'subscribe.html', {
            'icon': 'img/boom.svg',
            'text': 'Leider ist ein Fehler aufgetreten. Bitte versuche es erneut.',
            'showBack': True
        })


def verify(request, key=None):
    if not key:
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
            return render(request, 'subscribe.html', {
                'icon': 'img/boom.svg',
                'text': 'Leider ist ein Fehler aufgetreten. Bitte versuche es erneut.',
                'showBack': True
            })
        else:
            return render(request, 'subscribe.html', {
                'icon': 'img/ok.svg',
                'text': 'Danke, wir werden dich bei der nächsten Gelegenheit benachrichtigen.',
                'showBack': False
            })
