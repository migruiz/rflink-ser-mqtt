FROM balenalib/raspberrypi3-alpine-node:8-latest
RUN [ "cross-build-start" ]




RUN apk add --update gcc make python g++ linux-headers udev 


RUN mkdir /App/
COPY App/package.json  /App/package.json


RUN cd /App \
&& npm  install 


COPY App /App

RUN [ "cross-build-end" ]  

ENTRYPOINT ["node","/App/app.js"]