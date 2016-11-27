# Django

## Initial setup

```
./manage.py migrate
./manage.py createsuperuser
./manage.py loaddata cities institutions categories
```

## Start server, worker and beat

* having a redis server locally installed

```
./manage.py runserver
celery -A theaterwecker worker -l info
celery -A theaterwecker beat -l info -S django
```

## Prepare for wsgi

```
./manage.py collectstatic
```
