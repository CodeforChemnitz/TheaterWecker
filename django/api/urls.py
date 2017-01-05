# -*- coding: utf-8 -*-
from django.conf.urls import url
from .views import *

urlpatterns = [
    url(r'^device/$', device, name="device"),
    url(r'^verify/(?P<key>[a-f0-9]{32})$', verify, name="verify"),
    url(r'^subscribe/$', subscribe, name="subscribe"),
    url(r'^categories/$', categories, name="categories"),
]
