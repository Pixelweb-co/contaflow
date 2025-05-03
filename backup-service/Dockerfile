
FROM ubuntu:20.04

# Actualiza y instala las dependencias necesarias
# Instalar dependencias previas
RUN apt-get update && apt-get install -y \
    libx11-xcb1 \
    libgbm1 \
    libasound2 \
    libnss3 \
    libxss1 \
    fonts-liberation \
    xdg-utils \
    wget

# Descargar e instalar Google Chrome
RUN curl -sSL https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb -o google-chrome.deb && \
    dpkg -i google-chrome.deb || apt-get install -f -y
RUN apt-get update && apt-get install -y     mysql-client     cron     curl     jq     && rm -rf /var/lib/apt/lists/*

# Instalar el SDK de Google Drive
RUN curl -sSL https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb -o google-chrome.deb &&     dpkg -i google-chrome.deb &&     apt-get install -f

# Copiar los scripts dentro del contenedor
COPY backup_all_databases.sh /backup/backup_all_databases.sh
COPY upload_to_drive.sh /backup/upload_to_drive.sh

# Dar permisos de ejecución
RUN chmod +x /backup/backup_all_databases.sh
RUN chmod +x /backup/upload_to_drive.sh

# Configuración de cron
COPY crontab /etc/cron.d/backup-cron
RUN chmod 0644 /etc/cron.d/backup-cron

# Ejecutar cron
CMD ["cron", "-f"]
