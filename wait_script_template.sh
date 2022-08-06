#!/bin/sh

while true; do
    nc -z $DB_HOST 3306
    MYSQL_RUNNING=$?
    if [ $MYSQL_RUNNING -eq "0"]; then
        echo "===== MySQL is online ======"
        break;
    else echo "MySQL is offline...."
    fi
    sleep 1
done


exec "$@"

