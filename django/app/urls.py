from django.conf.urls import url
from .views import *

urlpatterns = [
    url(r'^subscribe/$', subscribe, name="subscribe"),
    url(r'^$', index, name="index"),
]