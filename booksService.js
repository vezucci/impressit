const uuid = require('uuid');

class BooksService {
  constructor({ dynamodb, tableName }) {
    this.db = dynamodb;
    this.BOOKS_TABLE_NAME = tableName;
  }

  async getAll() {
    let scanParams = {
      TableName: this.BOOKS_TABLE_NAME
    }

    let result = await this.db.scan(scanParams).promise();
    return result.Items;
  }

  async get(id) {
    let getParams = {
      TableName: this.BOOKS_TABLE_NAME,
      Key: {
        bookUuid: id
      }
    }

    let result = await this.db.get(getParams).promise();
    return result.Item;
  }

  async add(book) {
    const newBookUuid = uuid.v1();
    let putParams = {
      TableName: this.BOOKS_TABLE_NAME,
      Item: {
        bookUuid: newBookUuid,
        name: book.name,
        releaseDate: book.releaseDate,
        authorName: book.authorName
      }
    }

    await this.db.put(putParams).promise();
    return newBookUuid;
  }

  async update(id, book) {
    let updateParams = {
      TableName: this.BOOKS_TABLE_NAME,
      Key: {
        bookUuid: id
      },
      UpdateExpression: 'set #name = :name, #releaseDate = :releaseDate, #authorName = :authorName',
      ExpressionAttributeNames: {
        '#name': 'name',
        '#releaseDate': 'releaseDate',
        '#authorName': 'authorName'
      },
      ExpressionAttributeValues: {
        ':name': book.name,
        ':releaseDate': book.releaseDate,
        ':authorName': book.authorName
      }
    }

    await this.db.update(updateParams).promise();
  }

  async delete(id) {
    let deleteParams = {
      TableName: this.BOOKS_TABLE_NAME,
      Key: {
        bookUuid: id
      }
    }
    await this.db.delete(deleteParams).promise();
  }

}

module.exports = BooksService;