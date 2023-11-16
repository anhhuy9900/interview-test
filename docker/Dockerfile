FROM node:lts-alpine

ARG ENVIRONMENT

ENV NODE_ENV=$ENVIRONMENT

WORKDIR /home/node/interview-test/

COPY ["../", "/home/node/interview-test/"]

RUN npm i

CMD ["npm", "run", "start:dev"]

EXPOSE 3800