# File Storage Microservice

A high-performance file storage micro-service with simple API.

## Configuration

### Environment variables

#### APP_JWT_SECRET <span style="color:red">*</span>

A JWT secret shared with your API server. Please note that this microservice does not authenticate your users, but rather validates JWT tokens users supply.

#### FILES_UPLOAD_DIR <span style="color:red">*</span>

A path to upload directory where files will be stored once uploaded. Please note that this microservice do not store file under their original name, rather it uses unique generated hexadecimal strings. For each uploaded file the microservice will also create a metadata file in JSON format.

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
#++ required
APP_JWT_SECRET=<shared-jwt-secret>
#-- optional, default: 3191
APP_PORT=<number>

### files
#++ required, example: /tmp/upload 
FILES_UPLOAD_DIR=<upload-dir>

### db for local development:
#-- required 
DB_HOST=localhost

### db config shared with devstack:
#-- optional, default: 5432, current values used for local development
DB_PORT=25184
#++ required
DB_USERNAME=file-storage
#++ required
DB_PASSWORD=file-storage_password
#++ required
DB_NAME=file-storage

#-- db dev:
DB_MODE=sync
DB_MIGRATIONS=true

### kafka
#++ required, example: pkc-lzvrd.us-west4.gcp.confluent.cloud:9092
KAFKA_BROKERS=<string>
#++ required, example: AseCek48s3jLs3Asjss
KAFKA_USERNAME=<string>
#++ required, example: Vdk40Sj3AadVfA0s5kw
KAFKA_PASSWORD=<string>
#-- optional, default: false
KAFKA_SSL=true
#++ required, example: file-storage
KAFKA_TOPICS=<string>
#-- optional, default: file-storage
KAFKA_GROUP_ID=<string>
```

### Running

```bash
### run required development stack
npm run devstack:up

### start in watch mode
npm run start:dev
```
