[![CI Build](https://github.com/xorde-microservices/file-storage/actions/workflows/push_main.yml/badge.svg)](https://github.com/xorde-microservices/file-storage/actions/workflows/push_main.yml)

# File Storage Microservice

A high-performance file storage microservice with simple API.

## Configuration

### Environment variables

#### APP_PORT <span style="color:red">*</span>

A port number which will be used to publish the service.

#### AUTH_JWT_SECRET <span style="color:red">*</span>

A JWT secret shared with your API server. Please note that this microservice does not authenticate your users, but rather validates JWT tokens users supply.

#### FILES_UPLOAD_DIR <span style="color:red">*</span>

A path to upload directory where files will be stored once uploaded. Please note that this microservice do not store file under their original name, rather it uses unique generated hexadecimal strings. For each uploaded file the microservice will also create a metadata file in JSON format.

#### AUTH_ENABLED

A boolean flag which enables or disables authentication. If set to `false` the microservice will not validate JWT tokens and will allow any user to upload files. Please note that this flag is only for development purposes and should not be used in production.

## Usage

### Docker

```bash

```

## Development

### Installation

```bash
### getting the sources
git clone git@github.com:xorde-microservices/file-storage.git

### install dependencies
npm install
```

### Configuring

Minimal `.env`:
```text
### optional, default: 3191
APP_PORT=<number>

### required, unless AUTH_ENABLED=false
AUTH_JWT_SECRET=<shared-jwt-secret>

### required, example: /tmp/upload 
FILES_UPLOAD_DIR=<upload-dir>
```

### Running

```bash
### run required development stack
npm run devstack:up

### start in watch mode
npm run start:dev
```
