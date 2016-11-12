# -*- coding: utf-8 -*-
from django import forms


class SubscribeForm(forms.Form):
    interval = forms.DurationField()
    categories = forms.ChoiceField()
    email = forms.EmailField()

    def __init__(self, *args, **kwargs):
        self.category_choices = kwargs.pop('category_choices')
        super(SubscribeForm, self).__init__(*args, **kwargs)
        self.categories.choices = self.category_choices
