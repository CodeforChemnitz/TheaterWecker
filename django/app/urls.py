from django.conf.urls import url
from .views import *

urlpatterns = [
    url(r'^subscribe/$', subscribe, name="subscribe"),
    url(r'^verify/(?P<key>[a-f0-9]{32})$', verify, name="verify"),
    url(r'^$', index, name="index"),
]