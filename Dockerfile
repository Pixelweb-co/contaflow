FROM php:8.0.0-apache

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
    && apt-get install -y sendmail libpng-dev libzip-dev zlib1g-dev libonig-dev libjpeg62-turbo-dev libfreetype6-dev jpegoptim optipng pngquant gifsicle libmagickwand-dev \
    && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-configure gd --with-jpeg --with-freetype \
    && docker-php-ext-install gd mysqli mbstring zip pdo pdo_mysql

RUN a2enmod rewrite