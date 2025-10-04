FROM php:8.2-fpm-alpine

RUN apk update && apk add --no-cache \
    icu-dev \
    libzip-dev \
    git

RUN docker-php-ext-install pdo pdo_mysql intl opcache zip

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

USER www-data

CMD ["php-fpm", "-d", "xdebug.mode=off"]