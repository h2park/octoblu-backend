FROM node:0.10.38

MAINTAINER Octoblu <docker@octoblu.com>

EXPOSE 80
ENV PATH $PATH:/usr/local/bin

RUN apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* && \
    mkdir -p /usr/src/app && \
    npm install -g gulp

WORKDIR /usr/src/app
COPY . /usr/src/app

RUN cd /usr/src/app && \
    npm install --production --silent && \
    NODE_ENV=production gulp

CMD [ "npm", "start" ]
