# -*- coding: utf-8 -*-
from django.contrib.auth.models import User
from rest_framework import serializers

from app.models import *


class InstitutionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Institution
        fields = '__all__'


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class PerformanceSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Performance
        fields = '__all__'


class PerformanceNotificationSerializer(serializers.ModelSerializer):

    class Meta:
        model = PerformanceNotification
        fields = '__all__'


class CategoryNotificationSerializer(serializers.ModelSerializer):

    class Meta:
        model = CategoryNotification
        fields = '__all__'
