#!/bin/bash

cd /var/theaterwecker/django

source /var/theaterwecker-venv/bin/activate

echo "Switch to update page ..."

# switch to upgrade page
rm /etc/nginx/sites-enabled/theaterwecker.conf
ln -s /etc/nginx/sites-available/update.conf /etc/nginx/sites-enabled/update.conf
echo "Reload nginx ..."
systemctl reload nginx

echo "Turn off services ..."

# stop worker
echo "Worker ..."
systemctl stop theaterwecker-worker
# stop the django app
echo "Web ..."
systemctl stop theaterwecker-web
# stop beat
echo "Beat ..."
systemctl stop theaterwecker-beat

echo "Django stuff ..."

# install new dependencies
pip install -r ../requirements.txt
./manage.py migrate
./manage.py collectstatic --no-input -c

echo "Turn on services ..."

# restart the django app
echo "Web ..."
systemctl start theaterwecker-web
# start worker
echo "Worker ..."
systemctl start theaterwecker-worker
# start beat
echo "Beat ..."
systemctl start theaterwecker-beat

echo "Switch to normal page ..."

# move back to normal page
rm /etc/nginx/sites-enabled/update.conf
ln -s /etc/nginx/sites-available/theaterwecker.conf /etc/nginx/sites-enabled/theaterwecker.conf
systemctl reload nginx

deactivate
