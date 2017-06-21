FROM node:latest

RUN mkdir /src

RUN npm install nodemon -g

WORKDIR /src

ADD ./package.json /src/package.json

RUN npm install

EXPOSE 8019

CMD npm start