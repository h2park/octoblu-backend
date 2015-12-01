FROM node:5.1-onbuild
MAINTAINER Octoblu <docker@octoblu.com>
EXPOSE 80

RUN node_modules/.bin/gulp production
