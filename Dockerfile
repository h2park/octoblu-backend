FROM node:8
MAINTAINER Octoblu <docker@octoblu.com>

EXPOSE 80

ENV NPM_CONFIG_LOGLEVEL error
ENV NODE_ENV production

HEALTHCHECK CMD curl --fail http://localhost:80/healthcheck || exit 1

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json yarn.lock /usr/src/app/

RUN yarn install

COPY . /usr/src/app

RUN yarn run build:production

CMD [ "node", "--max_old_space_size=256", "server.js" ]
