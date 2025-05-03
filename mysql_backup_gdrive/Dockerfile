FROM debian:bullseye

RUN apt-get update && apt-get install -y \
    default-mysql-client \
    cron \
    curl \
    msmtp \
    msmtp-mta \
    mailutils \
    unzip \
    wget \
    gnupg \
    ca-certificates \
    && apt-get clean

RUN wget -O /tmp/gdrive.zip https://github.com/prasmussen/gdrive/releases/download/2.1.1/gdrive-linux-x64.zip && \
    unzip /tmp/gdrive.zip -d /usr/local/bin && \
    chmod +x /usr/local/bin/gdrive && \
    rm /tmp/gdrive.zip

RUN mkdir -p /backup /root/.gdrive

COPY mysql_backup_and_upload.sh /usr/local/bin/backup.sh
COPY msmtprc /etc/msmtprc
COPY mycron /etc/cron.d/mycron

RUN chmod +x /usr/local/bin/backup.sh && \
    chmod 0644 /etc/cron.d/mycron

RUN crontab /etc/cron.d/mycron

CMD ["cron", "-f"]