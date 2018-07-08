from django.conf.urls import url
from .views import *

urlpatterns = [
    url(r'^subscribe/$', subscribe, name="subscribe"),
    url(r'^p/(?P<performance_id>\d*)$', redirect_performance, name="redirect_performance"),
    url(r'^unsubscribe/$', unsubscribe, name="unsubscribe"),
    url(r'^verify_mail/(?P<key>[a-f0-9]{32})$', verify_email, name="verify_email"),
    url(r'^verify_push/(?P<key>[a-f0-9]{32})$', verify_push, name="verify_push"),
    url(r'^impressum/$', impressum, name="impressum"),
    url(r'^$', index, name="index"),
]