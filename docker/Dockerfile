FROM node:lts-alpine

ARG ENVIRONMENT

ENV NODE_ENV=$ENVIRONMENT

WORKDIR /home/node/interview-test/

COPY ["package*.json", "/home/node/interview-test/"]

RUN npm i

COPY ["/", "/home/node/interview-test/"]

CMD ["npm", "run", "start:dev"]

EXPOSE 3800