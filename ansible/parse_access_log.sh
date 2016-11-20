#!/bin/bash

sed -n '/'$(date '+%d\/%b\/%Y:%H:%M' -d '1 minute ago')'/,$ p' /var/log/nginx/access.log | goaccess -a --keep-db-files --db-path=/var/goaccess --load-from-disk -o /var/www/report/index.html
