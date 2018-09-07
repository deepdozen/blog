#remove image with previous build (latest)
docker rmi 3c49c3038887

#build image from current dockerfile

docker build -t node-10/node-web-app .

#create new docker container connect it to the same mongo use network set env variable and remove container after it stops
docker run --rm -e "GEOCODER_API_KEY=API_KEY_02" --net=48cfa89ca1a3 -p 49160:8080 -d node-10/node-web-app

#same as above + nodejs console
docker run --rm -e "GEOCODER_API_KEY=API_KEY_02" --net=f839fdeb7604 -p 49160:8080 node-10/node-web-app

#goto npm console

docker exec -it b0cb7562f40b /bin/bash

#from npm console check http get request

root@b0cb7562f40b:/usr/src/app# curl -i localhost:8080

#from host terminal check http get request

hostMachine$ curl -i localhost:49160