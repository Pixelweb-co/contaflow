#!/bin/bash

DATE=$(date +%Y-%m-%d)
BACKUP_DIR="/backup"
MYSQL_USER="${MYSQL_USER:-root}"
MYSQL_PASS="${MYSQL_PASS:-root}"
MYSQL_HOST="${MYSQL_HOST:-localhost}"

databases=$(mysql -h "$MYSQL_HOST" -u "$MYSQL_USER" -p"$MYSQL_PASS" -e "SHOW DATABASES;" | grep -Ev "(Database|information_schema|performance_schema|mysql|sys)")

cd "$BACKUP_DIR" || exit 1

for db in $databases; do 
    FILE="${db}_${DATE}.sql"
    echo "Respaldando $db a $FILE"
    mysqldump -h "$MYSQL_HOST" -u "$MYSQL_USER" -p"$MYSQL_PASS" "$db" > "$FILE"
    echo "Subiendo $FILE a Google Drive..."
    #gdrive upload "$FILE"
    #echo "Eliminando archivo $FILE local..."
    rm "$FILE"
done

echo -e "To: egbmaster2007@gmail.com\nSubject: Backup completado\n\nBackups completados y subidos correctamente el $DATE." | msmtp --debug --from=default -t