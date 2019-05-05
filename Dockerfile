FROM keymetrics/pm2:latest-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

ADD . .
