#!/usr/bin/bash

cd /var/theaterwecker

source bin/activate

rm /etc/nginx/sites-enabled/theaterwecker.conf
ln -s /etc/nginx/sites-available/update.conf /etc/nginx/sites-enabled/update.conf
systemctl reload nginx

pip install -r requirements.txt

rm /etc/nginx/sites-enabled/update.conf
ln -s /etc/nginx/sites-available/theaterwecker.conf /etc/nginx/sites-enabled/theaterwecker.conf
systemctl reload nginx