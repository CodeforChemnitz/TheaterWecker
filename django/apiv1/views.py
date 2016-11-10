# -*- coding: utf-8 -*-
from rest_framework import filters
from rest_framework import viewsets

from .serializers import *
from app.models import *


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class InstitutionViewSet(viewsets.ModelViewSet):
    queryset = Institution.objects.all()
    serializer_class = InstitutionSerializer
    filter_backends = [
        filters.OrderingFilter
    ]
    ordering_fields = ['name']


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    filter_backends = [
        filters.OrderingFilter
    ]
    ordering_fields = ['name']


class PerformanceViewSet(viewsets.ModelViewSet):
    queryset = Performance.objects.all()
    serializer_class = PerformanceSerializer
    filter_backends = [
        filters.DjangoFilterBackend,
        filters.OrderingFilter
    ]
    filter_fields = ['institution', 'category']
    ordering_fields = ['title', 'begin', 'institution', 'category']


class PerformanceNotificationViewSet(viewsets.ModelViewSet):
    queryset = PerformanceNotification.objects.all()
    serializer_class = PerformanceNotificationSerializer
    filter_backends = [
        filters.DjangoFilterBackend,
    ]
    filter_fields = ['user', 'performance']


class CategoryNotificationViewSet(viewsets.ModelViewSet):
    queryset = CategoryNotification.objects.all()
    serializer_class = CategoryNotificationSerializer
    filter_backends = [
        filters.DjangoFilterBackend,
    ]
    filter_fields = ['user', 'category']
