#!/bin/bash

cd /var/theaterwecker/django

source /var/theaterwecker-venv/bin/activate


# switch to upgrade page
rm /etc/nginx/sites-enabled/theaterwecker.conf
ln -s /etc/nginx/sites-available/update.conf /etc/nginx/sites-enabled/update.conf
systemctl reload nginx

# stop worker
systemctl stop theaterwecker-worker
# stop the django app
systemctl stop theaterwecker-web
# stop beat
systemctl stop theaterwecker-beat

# install new dependencies
pip install -r ../requirements.txt
./manage.py migrate
./manage.py collectstatic --no-input -c

# restart the django app
systemctl start theaterwecker-web
# start worker
systemctl start theaterwecker-worker
# start beat
systemctl start theaterwecker-beat

# move back to normal page
rm /etc/nginx/sites-enabled/update.conf
ln -s /etc/nginx/sites-available/theaterwecker.conf /etc/nginx/sites-enabled/theaterwecker.conf
systemctl reload nginx

deactivate
