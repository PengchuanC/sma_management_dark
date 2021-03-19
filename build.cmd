yarn build

tar -cvf manage.tar.gz ./manage

scp manage.tar.gz sma@10.170.129.129:/home/sma/deploy/frontend
