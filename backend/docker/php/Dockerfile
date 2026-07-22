FROM php:8.4-cli

RUN apt-get update && apt-get install -y \
    curl \
    git \
    libonig-dev \
    libpng-dev \
    libxml2-dev \
    libzip-dev \
    unzip \
    zip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-install \
    bcmath \
    exif \
    gd \
    mbstring \
    pcntl \
    pdo_mysql \
    xml \
    zip

RUN pecl install redis && docker-php-ext-enable redis

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY composer.json composer.lock ./
RUN composer install --no-interaction --prefer-dist --optimize-autoloader --no-scripts

COPY . .

RUN composer dump-autoload --optimize

COPY docker/php/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/entrypoint.sh"]
