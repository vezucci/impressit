'use strict';

const AWS = require('aws-sdk');
const BooksService = require('./booksService');
const BooksController = require('./booksController');
const booksValidator = require('./booksValidator');

const BOOKS_TABLE_NAME = process.env.DYNAMODB_BOOK_TABLE;
const dynamodb = new AWS.DynamoDB.DocumentClient();

const controller = new BooksController({
  booksService: new BooksService({ 
    dynamodb, 
    tableName: BOOKS_TABLE_NAME 
  }),
  booksValidator
});

module.exports = {
  add: controller.add, 
  update: controller.update,
  delete: controller.delete,
  get: controller.get,
  getAll: controller.getAll
};
