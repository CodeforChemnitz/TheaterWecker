# -*- coding: utf-8 -*-
from datetime import timedelta

from django.core.mail import send_mail
from django.http.response import HttpResponse
from django.views.decorators.http import require_http_methods
from django.shortcuts import render

from app.forms import SubscribeForm
from app.models import CategoryNotification
from app.models import Category


def index(request):
    return render(request, "index.html", {
        'categories': Category.objects.all()
    })

@require_http_methods(['POST'])
def subscribe(request):
    form = SubscribeForm(request.POST, category_choices=Category.objects.all().values_list("pk", "name"))

    if form.is_valid():
        email = form.cleaned_data.get('email')
        interval = form.cleaned_data.get('interval')
        for category in form.cleaned_data.get('categories', []):
            try:
                notification,_ = CategoryNotification.objects.get_or_create(
                    user=email,
                    category=Category.objects.get(id=category),
                    defaults={'interval': interval}
                )
                if notification.interval != interval:
                    notification.interval = interval
                    notification.save()

            except Exception as e:
                # TODO log exception
                print(e)
                return render(request, 'subscribe.html', {
                        'icon': 'img/boom.svg',
                        'text': 'Leider ist ein Fehler aufgetreten. Bitte versuche es erneut.',
                        'showBack': True
                    })

        try:
            # TODO send proper email
            send_mail("Willkommen beim TheaterWecker", "Wir werden dich bei der nächsten Gelegenheit benachrichtigen.",
                      "TheaterWecker <no-reply@mg.theaterwecker.com>", [email])
        except Exception as e:
            # TODO log exception
            print(e)
            # send the email later
        return render(request, 'subscribe.html', {
                'icon': 'img/ok.svg',
                'text': 'Danke, wir werden dich bei der nächsten Gelegenheit benachrichtigen.',
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
