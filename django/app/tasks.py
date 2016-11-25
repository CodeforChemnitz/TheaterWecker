# -*- coding: utf-8 -*-
from __future__ import absolute_import, unicode_literals
from celery import shared_task

from django.template.loader import render_to_string
from django.urls import reverse

from app.models import UserEmail

# import the logging library
import logging

# Get an instance of a logger
logger = logging.getLogger('root')

@shared_task
def send_verify_email(email, scheme, host, count):
    try:
        user_email = UserEmail.objects.get(email=email)
        user_email.mail("Willkommen beim TheaterWecker", render_to_string('email/welcome.email', {
            'verification_link': "%s://%s%s" % (scheme, host, reverse('app:verify', kwargs={
                'key': user_email.verification_key
            }))

        }))
    except UserEmail.DoesNotExist as e:
        logger.error('User does not exist', exc_info=True)
        return
    except Exception as e:
        logger.error('Sending email failed', exc_info=True)
        if count > 9:
            logger.error('Sending email failed after 10th retry', exc_info=True)
            return
        send_verify_email.apply_async((email, scheme, host, count + 1), countdown=(2 ** count) * 60)


