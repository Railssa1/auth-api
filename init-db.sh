#!/bin/bash

until mysql -h"$DB_HOST" -u"$DB_USER" -p"$DB_PASSWORD" -e "SELECT 1" &>/dev/null; do
  echo "Aguardando o MySQL..."
  sleep 5
done

echo "MySQL está disponível. Aplicando as migrações..."
npx prisma migrate deploy
