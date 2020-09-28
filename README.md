# Serverless REST API - Books Managing Service

This service allows to setup a RESTful Web Services allowing you to create, list, get, update and delete Books records. DynamoDB is used to store the data.

## Use-cases

- API for a Web Application
- API for a Mobile Application

## Setup

```bash
npm install
```

## Test

```bash
npm run test
```

## Deploy

In order to deploy the endpoint simply run

```bash
serverless deploy --stage dev
```

## Usage

You can create, retrieve, update, or delete books with the following commands:

### Create a Book

```bash
curl -X POST https://XXXXXXX.execute-api.us-east-1.amazonaws.com/dev/book/add --data '{ "authorName": "Ivan Franko", "name": "Crossroads" "releaseDate": 123141 }'
```

### List all Books

```bash
curl https://XXXXXXX.execute-api.us-east-1.amazonaws.com/dev/books
```

Example output:
```bash
[{"id":"06727ca0-4755-11ea-8468-8d85f6c3aebb","authorName":"Ivan Franko", "name": "Crossroads", "releaseDate":1479138570824},{"id":"06727ca0-4755-11ea-8468-8d85f6c3aebb","authorName":"Taras Shevchenko", "name":"Kobzar","releaseDate":1479138570824}]
```

### Get one Book

```bash
# Replace the <bookUuid> part with a real id from your books table
curl https://XXXXXXX.execute-api.us-east-1.amazonaws.com/dev/book/<bookUuid>
```

Example Result:
```bash
{"id":"06727ca0-4755-11ea-8468-8d85f6c3aebb","authorName":"Ivan Franko",releaseDate":1479138570824}%
```

### Update a Book

```bash
# Replace the <bookUuid> part with a real id from your books table
curl -X PUT https://XXXXXXX.execute-api.us-east-1.amazonaws.com/dev/book/<bookUuid>/update --data '{ "authorName": "Uncle Bob", "name": "Clean Code"  "releaseDate": 241241 }'
```

### Delete a Book

```bash
# Replace the <bookUuid> part with a real id from your books table
curl -X DELETE https://XXXXXXX.execute-api.us-east-1.amazonaws.com/dev/book/<bookUuid>/delete
```
