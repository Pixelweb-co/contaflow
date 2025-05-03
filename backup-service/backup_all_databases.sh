
#!/bin/bash

# Fecha actual para el nombre del archivo
DATE=$(date +%F)

# Respaldo de las bases de datos MySQL
mysqldump -h db -u root -p$MYSQL_ROOT_PASSWORD --all-databases > /backup/all_databases_$DATE.sql
