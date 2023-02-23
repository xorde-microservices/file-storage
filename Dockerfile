FROM node:lts-alpine as builder

WORKDIR /opt/app

COPY . .

### show npm & node versions and disable npm update notifications
RUN npm config set update-notifier false

### required to build such modules as bcrypt on exotic platforms such as arm64
RUN apk add python3-dev make gcc g++

RUN npm install && npm run build

FROM node:lts-alpine

### turn production mode on
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/app

### copy app files
COPY --from=builder /opt/app/dist ./dist
COPY --from=builder /opt/app/node_modules ./node_modules

COPY package.json .
COPY ci/docker/entrypoint.sh .

### provide entrypoint script
ENTRYPOINT "./entrypoint.sh"
