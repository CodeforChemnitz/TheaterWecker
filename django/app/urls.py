from django.conf.urls import url
from .views import *

urlpatterns = [
    url(r'^subscribe/$', subscribe, name="subscribe"),
    url(r'^unsubscribe/$', unsubscribe, name="unsubscribe"),
    url(r'^verify/(?P<key>[a-f0-9]{32})$', verify, name="verify"),
    url(r'^impressum/$', impressum, name="impressum"),
    url(r'^$', index, name="index"),
]