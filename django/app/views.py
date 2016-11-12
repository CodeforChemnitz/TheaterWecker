# -*- coding: utf-8 -*-
from django.views.decorators.http import require_http_methods
from django.shortcuts import render

from app.forms import SubscribeForm
from app.models import Category


def index(request):
    return render(request, "index.html")


@require_http_methods(['POST'])
def subscribe(request):
    form = SubscribeForm(request.POST, category_choices=Category.objects.all().values_list("pk", "name"))

    if form.is_valid():
        form.clean_data()

    return render(request, 'subscribe.html')
