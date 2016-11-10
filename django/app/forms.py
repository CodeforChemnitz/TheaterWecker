from django import forms
from app.models import Category


class SubscribeForm(forms.Form):
    interval = forms.DurationField()
    categories = forms.ChoiceField(choices=Category.objects.all().values_list("pk","name"))
    email = forms.EmailField()
