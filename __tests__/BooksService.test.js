const sinon = require('sinon');
const BooksService = require('../BooksService');

describe('BooksService', () => {

  const testTableName = 'TEST_BOOKS_TABLE';
  const testBookId = 'some-random-id';

  let sut, dynamodbStub;
  
  beforeEach(() => {
    dynamodbStub = {
      put:    sinon.stub().returns({ promise: () => Promise.resolve() }),
      delete: sinon.stub().returns({ promise: () => Promise.resolve() }),
      update: sinon.stub().returns({ promise: () => Promise.resolve() }),
      scan:   sinon.stub(),
      get:    sinon.stub(),
    };

    sut = new BooksService({
      dynamodb: dynamodbStub,
      tableName: testTableName
    });
  });

  afterEach(() => {
    sinon.restore();
  })
  
  describe('add', () => {
    test('should call dynamoDB with correct params and return createdId', async () => {
      const testBook = {
        name: 'Sapiens',
        authorName: 'Yuval Harari',
        releaseDate: 12345
      };
      
      const expectedParams = {
        TableName: testTableName,
        Item: {
          name: testBook.name,
          releaseDate: testBook.releaseDate,
          authorName: testBook.authorName,
        }
      }
      
      const createdId = await sut.add(testBook);
      
      expectedParams.Item.bookUuid = createdId;
      const callParam = dynamodbStub.put.args[0][0];

      expect(dynamodbStub.put.calledOnce).toBe(true);
      expect(createdId).toBeTruthy()
      expect(callParam).toStrictEqual(expectedParams);
    });
  })

  describe('update', () => {
    test('should call dynamoDB with correct params', async () => {
      const testBook = {
        bookUuid: testBookId,
        name: 'Sapiens',
        authorName: 'Yuval Harari',
        releaseDate: 12345
      };
      
      const expectedParams = {
        TableName: testTableName,
        Key: {
          bookUuid: testBookId
        },
        UpdateExpression: 'set #name = :name, #releaseDate = :releaseDate, #authorName = :authorName',
        ExpressionAttributeNames: {
          '#name': 'name',
          '#releaseDate': 'releaseDate',
          '#authorName': 'authorName'
        },
        ExpressionAttributeValues: {
          ':name': testBook.name,
          ':releaseDate': testBook.releaseDate,
          ':authorName': testBook.authorName
        }
      }
      
      await sut.update(testBookId, testBook);
      
      const callParam = dynamodbStub.update.args[0][0];
      expect(dynamodbStub.update.calledOnce).toBe(true);
      expect(callParam).toStrictEqual(expectedParams);
    });
  })

  describe('delete', () => {
    test('should call dynamoDB with correct params', async () => {
      const expectedParams = {
        TableName: testTableName,
        Key: {
          bookUuid: testBookId
        }
      }
      
      await sut.delete(testBookId);
      
      const callParam = dynamodbStub.delete.args[0][0];
      expect(dynamodbStub.delete.calledOnce).toBe(true);
      expect(callParam).toStrictEqual(expectedParams);
    });
  })

  describe('get', () => {
    test('should call dynamoDB with correct params and return response from DB', async () => {
      
      const expectedResponseFromDB = {
        Item: {
          bookUuid: testBookId,
          name: 'Sapiens',
          authorName: 'Yuval Harari',
          releaseDate: 12345
        }
      }
      
      const expectedParams = {
        TableName: testTableName,
        Key: {
          bookUuid: testBookId
        }
      };

      dynamodbStub.get = sinon.stub().returns({ promise: () => Promise.resolve(expectedResponseFromDB) });
      
      const result = await sut.get(testBookId);
      
      const callParam = dynamodbStub.get.args[0][0];
      expect(dynamodbStub.get.calledOnce).toBe(true);
      expect(callParam).toStrictEqual(expectedParams);
      expect(result).toStrictEqual(expectedResponseFromDB.Item);
    });
  })

  describe('getAll', () => {
    test('should call dynamoDB with correct params and return response from DB', async () => {
      const expectedResponseFromDB = {
        Items: [
          {
            bookUuid: testBookId,
            name: 'Sapiens',
            authorName: 'Yuval Harari',
            releaseDate: 12345
          },
          {
            bookUuid: testBookId + 1,
            name: 'Homo Deus',
            authorName: 'Yuval Harari',
            releaseDate: 24144
          }
        ]
      }

      const expectedParams = {
        TableName: testTableName
      }

      dynamodbStub.scan = sinon.stub().returns({ promise: () => Promise.resolve(expectedResponseFromDB) });
      
      const result = await sut.getAll();
      
      const callParam = dynamodbStub.scan.args[0][0];
      expect(dynamodbStub.scan.calledOnce).toBe(true);
      expect(callParam).toStrictEqual(expectedParams);
      expect(result).toStrictEqual(expectedResponseFromDB.Items);
    });
  })
  

})