FROM node:5
MAINTAINER Octoblu, Inc. <docker@octoblu.com>

EXPOSE 80
ENV NPM_CONFIG_LOGLEVEL error

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm -s install --production
COPY . /usr/src/app/
RUN node_modules/.bin/gulp production

CMD [ "node", "--max-old-space-size=300", "server.js" ]
