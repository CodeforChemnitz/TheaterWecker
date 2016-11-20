#!/usr/bin/bash

rm /etc/nginx/sites-enabled/theaterwecker.conf
ln -s /etc/nginx/sites-available/update.conf /etc/nginx/sites-enabled/update.conf
systemctl reload nginx

sleep 10

rm /etc/nginx/sites-enabled/update.conf
ln -s /etc/nginx/sites-available/theaterwecker.conf /etc/nginx/sites-enabled/theaterwecker.conf
systemctl reload nginx