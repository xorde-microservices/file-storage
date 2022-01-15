# to build docker image please run:
# docker build -t xorde/kafka-huobi .
FROM node:lts-alpine AS development

WORKDIR /tmp/build
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:lts-alpine

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/app
COPY package*.json ./
RUN npm install --only=production
COPY --from=development /tmp/build/dist/ ./dist
EXPOSE 3000
CMD [ "node", "dist/main" ]

# to enter into shell of this container please run:
# docker run --rm -it --entrypoint /bin/sh xorde/kafka-huobi
