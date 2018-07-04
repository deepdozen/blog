#build image from current dockerfile

docker build -t node-10/node-web-app .

#create new docker container and remove it after it stops

docker run --rm -p 49160:8080 -d node-10/node-web-app

#goto npm console

docker exec -it b0cb7562f40b /bin/bash

#from npm console check http get request

root@b0cb7562f40b:/usr/src/app# curl -i localhost:8080

#from host terminal check http get request

Azins-MacBook-Pro:run deepdozen$ curl -i localhost:49160