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
  add: async (event) => controller.add(event), 
  update: async (event) => controller.update(event),
  delete: async (event) => controller.delete(event),
  get: async (event) => controller.get(event),
  getAll: async (event) => controller.getAll(event)
};
