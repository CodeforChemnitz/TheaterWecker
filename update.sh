#!/bin/bash

cd /var/theaterwecker/django

source /var/theaterwecker-venv/bin/activate

#stop worker
systemctl stop theaterwecker-worker

# switch to upgrade page
rm /etc/nginx/sites-enabled/theaterwecker.conf
ln -s /etc/nginx/sites-available/update.conf /etc/nginx/sites-enabled/update.conf
systemctl reload nginx

# install new dependencies
pip install -r ../requirements.txt
./manage.py migrate
./manage.py collectstatic --no-input -c

# restart the django app
systemctl restart theaterwecker-web

# move back to normal page
rm /etc/nginx/sites-enabled/update.conf
ln -s /etc/nginx/sites-available/theaterwecker.conf /etc/nginx/sites-enabled/theaterwecker.conf
systemctl reload nginx

# start worker
systemctl start theaterwecker-worker

deactivate
