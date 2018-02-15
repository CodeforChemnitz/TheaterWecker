# -*- coding: utf-8 -*-
from django import forms


class SubscribeForm(forms.Form):
    interval = forms.DurationField(required=True)
    categories = forms.MultipleChoiceField(required=True)
    email = forms.EmailField(required=False)
    device = forms.UUIDField(required=False)

    def __init__(self, *args, **kwargs):
        self.category_choices = kwargs.pop('category_choices')
        super(SubscribeForm, self).__init__(*args, **kwargs)
        self.fields['categories'].choices = self.category_choices


class UnsubscribeForm(forms.Form):
    email = forms.EmailField(required=True)
