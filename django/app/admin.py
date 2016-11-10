# -*- coding: utf-8 -*-
from django.contrib import admin

from app.models import *


@admin.register(Institution)
class InstitutionAdmin(admin.ModelAdmin):
    pass


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    pass


@admin.register(Performance)
class PerformanceAdmin(admin.ModelAdmin):
    pass