#!/bin/sh
set -e

echo "→ Rodando migrations..."
php artisan migrate --force

echo "→ Limpando e cacheando configurações..."
php artisan config:cache
php artisan route:cache

echo "→ Iniciando servidor na porta ${PORT:-8000}..."
exec php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
