start yarn build

pause

tar -cf manage.tar.gz ./manage

scp manage.tar.gz sma@10.170.129.129:/home/sma/deploy/frontend
