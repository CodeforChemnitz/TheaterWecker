# -*- coding: utf-8 -*-
from django.conf.urls import url, include
from rest_framework import routers

from .views import *
router = routers.DefaultRouter()

router.register(r'institutions', InstitutionViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'performances', PerformanceViewSet)
router.register(r'performancenotificationns', PerformanceNotificationViewSet)
router.register(r'categorynotifications', CategoryNotificationViewSet)
router.register(r'users', UserViewSet)

urlpatterns = [
    url(r'^', include(router.urls, namespace='router')),
]
