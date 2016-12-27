FROM node:6
MAINTAINER Octoblu <docker@octoblu.com>

EXPOSE 80

ENV NPM_CONFIG_LOGLEVEL error
ENV NODE_ENV production

HEALTHCHECK CMD curl --fail http://localhost:80/healthcheck || exit 1

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN npm install --silent --global yarn

COPY package.json yarn.lock /usr/src/app/

RUN yarn install
RUN yarn run build:production

COPY . /usr/src/app

CMD [ "node", "--max_old_space_size=256", "server.js" ]
