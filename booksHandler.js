'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

const validate = (data) => {
  return true;
};

module.exports = {
  add: async (event, context) => {

    let data = null;
    try {
      data = JSON.parse(event.body);
    } catch (err) {
      console.log('There was an error parsing the body', err);
      return {
        statusCode: 400
      }
    }

    if (!validate(data)) {
      console.log('Body is invalid');
      return {
        statusCode: 400
      }
    }

    let putParams = {
      TableName: process.env.DYNAMODB_BOOK_TABLE,
      Item: {
        bookUuid: uuid.v1(),
        name: data.name,
        releaseDate: data.releaseDate,
        authorName: data.authorName
      }
    }
    
    let putResult = {};
    try {
      let dynamodb = new AWS.DynamoDB.DocumentClient();
      putResult = await dynamodb.put(putParams).promise();
    } catch (err) {
      console.log('There was an error saving a book', { putParams, err });
      return {
        statusCode: 500
      }
    }

    return {
      statusCode: 201
    }

  }, 
  update: async (event, context) => {
    let data = null;
    try {
      data = JSON.parse(event.body);
    } catch (err) {
      console.log('There was an error parsing the body', err);
      return {
        statusCode: 400
      }
    }

    if (!validate(data)) {
      console.log('Body is invalid');
      return {
        statusCode: 400
      }
    }

    let updateParams = {
      TableName: process.env.DYNAMODB_BOOK_TABLE,
      Key: {
        bookUuid: event.pathParameters.bookUuid
      },
      UpdateExpression: 'set #name = :name, #releaseDate = :releaseDate, #authorName = :authorName',
      ExpressionAttributeNames: {
        '#name': 'name',
        '#releaseDate': 'releaseDate',
        '#authorName': 'authorName'
      },
      ExpressionAttributeValues: {
        ':name': 'data.name',
        ':releaseDate': 'data.releaseDate',
        ':authorName': 'data.authorName'
      }
    }

    let result = {};
    try {
      let dynamodb = new AWS.DynamoDB.DocumentClient();
      result = await dynamodb.update(updateParams).promise();
    } catch (err) {
      console.log('There was an error updating a book', updateParams);
      return {
        statusCode: 500
      }
    }

    return {
      statusCode: 200
    }
  },
  delete: async (event, context) => {
    let deleteParams = {
      TableName: process.env.DYNAMODB_BOOK_TABLE,
      Key: {
        bookUuid: event.pathParameters.bookUuid
      }
    }

    let result = null;
    try {
      let dynamodb = new AWS.DynamoDB.DocumentClient();
      result = await dynamodb.delete(deleteParams).promise(); 
    } catch (err) {
      console.log('There was an error deleting a book', getParams);
      return {
        statusCode: 500
      }
    }

    return {
      statusCode: 200
    }
  },
  get: async (event, context) => {
    let getParams = {
      TableName: process.env.DYNAMODB_BOOK_TABLE,
      Key: {
        bookUuid: event.pathParameters.bookUuid
      }
    }

    let result = null;
    try {
      let dynamodb = new AWS.DynamoDB.DocumentClient();
      result = await dynamodb.get(getParams).promise(); 
    } catch (err) {
      console.log('There was an error getting a book', getParams);
      return {
        statusCode: 500
      }
    }

    if (result.Item === null) {
      return {
        statusCode: 404
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result.Item)
    }
  },
  getAll: async (event, context) => {
    let scanParams = {
      TableName: process.env.DYNAMODB_BOOK_TABLE
    }

    let result = null;
    try {
      let dynamodb = new AWS.DynamoDB.DocumentClient();
      result = await dynamodb.scan(scanParams).promise(); 
    } catch (err) {
      console.log('There was an error getting books', scanParams);
      return {
        statusCode: 500
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result.Items)
    }
  },
};
