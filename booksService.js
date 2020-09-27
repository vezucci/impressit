const uuid = require('uuid');

const TABLE_NAME = process.env.DYNAMODB_BOOK_TABLE;

class BooksService {
  constructor(dynamodb) {
    this.db = dynamodb;
  }

  async getAll() {
    let scanParams = {
      TableName: TABLE_NAME
    }

    let result = await this.db.scan(scanParams).promise();

    console.log(JSON.stringify(result));
    return result.Items;
  }

  async get(id) {
    let getParams = {
      TableName: TABLE_NAME,
      Key: {
        bookUuid: id
      }
    }

    let result = await this.db.get(getParams).promise();

    console.log(JSON.stringify(result));
    return result.Item;
  }

  async add(book) {
    let putParams = {
      TableName: TABLE_NAME,
      Item: {
        bookUuid: uuid.v1(),
        name: book.name,
        releaseDate: book.releaseDate,
        authorName: book.authorName
      }
    }

    await this.db.put(putParams).promise();
  }

  async update(id, book) {
    
    let updateParams = {
      TableName: TABLE_NAME,
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

    let result = await this.db.update(updateParams).promise();

    console.log(JSON.stringify(result));
    return result.Item;
  }

  async delete(id) {
    let deleteParams = {
      TableName: TABLE_NAME,
      Key: {
        bookUuid: id
      }
    }

    const result = await this.db.delete(deleteParams).promise();
    console.log(JSON.stringify(result));
  }

}

module.exports = BooksService;