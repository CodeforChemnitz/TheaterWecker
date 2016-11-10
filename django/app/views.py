from django.http.response import HttpResponse
from django.views.decorators.http import require_http_methods
from django.shortcuts import render
from django.app.forms import SubscribeForm


def index(request):
    return render(request, "index.html")



@require_http_methods(['POST'])
def subscribe(request):
    form = SubscribeForm(request.POST)

    if form.is_valid():
        form.clean_data()


    return render(request, 'subscribe.html')
