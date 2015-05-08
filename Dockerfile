FROM node:0.10.38

MAINTAINER Octoblu <docker@octoblu.com>

EXPOSE 80
ENV PATH $PATH:/usr/local/bin

RUN apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN npm install -g gulp

COPY . /usr/src/app
RUN cd /usr/src/app && npm install --production --silent
RUN cd /usr/src/app && NODE_ENV=production gulp

CMD [ "npm", "start" ]
