FROM node:16.8.0-alpine3.13 as builder
WORKDIR /usr/src/app
COPY package.json .
COPY transformPackage.js .

RUN ["node", "transformPackage"]

FROM node:16.8.0-alpine3.13
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package-docker.json package.json
RUN apk update && apk upgrade

RUN npm install --quiet
#  && mv node_modules ../ && ln -sf ../node_modules node_modules

COPY .  .

EXPOSE 3080

ENV NODE_PATH=./dist

RUN npm run build

CMD ["npm", "start"]