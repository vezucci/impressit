const sinon = require('sinon');

const BooksController = require('../BooksController');
const BooksService = require('../BooksService');


describe('BooksController', () => {

  const testBookId = 'dbscd7-sfwuwu-aaf';

  let sut, booksValidatorStub, booksServiceStub;
  
  beforeEach(() => {
    booksValidatorStub = sinon.stub();
    booksServiceStub = sinon.createStubInstance(BooksService);

    sut = new BooksController({
      booksValidator: booksValidatorStub,
      booksService: booksServiceStub,
    });
  });

  afterEach(() => {
    sinon.restore();
  })
  
  describe('add book', () => {
    
    test('should return 400 if invalid JSON', async () => {
      const testEvent = { body: '{invalid//json' };
      
      const response = await sut.add(testEvent);

      expect(response.statusCode).toBe(400);
      expect(response.body).toBe('Invalid JSON');
    });

    test('should return 400 and message if invalid parameters', async () => {
      const testEvent = { body: '{}'};
      booksValidatorStub.returns({ message: 'Error message'});
      
      const response = await sut.add(testEvent);
      
      expect(response.statusCode).toBe(400);
      expect(response.body).toBe('Error message');
    });

    test('should return 500 if fails to save a book', async () => {
      const testEvent = { body: '{}'};
      booksServiceStub.add.throws();

      const response = await sut.add(testEvent);

      expect(response.statusCode).toBe(500);
    });

    test('should return 201 and created Id when saved a book', async () => {
      const testEvent = { body: '{}'};
      booksServiceStub.add.returns(testBookId);

      const response = await sut.add(testEvent);

      expect(response.statusCode).toBe(201);
      expect(response.body).toBe(testBookId);
    });

  })
  
  describe('update book', () => {
    test('should return 400 if invalid JSON', async () => {
      const testEvent = { body: '{invalid//json' };
      
      const response = await sut.update(testEvent);

      expect(response.statusCode).toBe(400);
      expect(response.body).toBe('Invalid JSON');
    });

    test('should return 400 and message if invalid parameters', async () => {
      const testEvent = { body: '{}'};
      booksValidatorStub.returns({ message: 'Error message'});
      
      const response = await sut.update(testEvent);
      
      expect(response.statusCode).toBe(400);
      expect(response.body).toBe('Error message');
    });

    test('should return 500 if fails to update a book', async () => {
      const testEvent = { 
        body: '{}',
        pathParameters: {
          bookUuid: testBookId
        }
      };
      booksServiceStub.update.throws();

      const response = await sut.update(testEvent);

      expect(response.statusCode).toBe(500);
    });

    test('should return 200 and when updated a book', async () => {
      const testEvent = { 
        body: '{}',
        pathParameters: {
          bookUuid: testBookId
        }
      };

      const response = await sut.update(testEvent);

      expect(response.statusCode).toBe(200);
    });

  });

  describe('delete book', () => {
    test('should return 500 if fails to delete a book', async () => {
      const testEvent = { 
        body: '{}',
        pathParameters: {
          bookUuid: testBookId
        }
      };
      booksServiceStub.delete.throws();

      const response = await sut.delete(testEvent);

      expect(response.statusCode).toBe(500);
    });

    test('should return 200 and when deleted a book', async () => {
      const testEvent = { 
        body: '{}',
        pathParameters: {
          bookUuid: testBookId
        }
      };

      const response = await sut.delete(testEvent);

      expect(response.statusCode).toBe(200);
    });
  });

  describe('get book', () => {
    test('should return 500 if fails to get a book', async () => {
      const testEvent = { 
        pathParameters: {
          bookUuid: testBookId
        }
      };
      booksServiceStub.get.throws();

      const response = await sut.get(testEvent);

      expect(response.statusCode).toBe(500);
    });

    test('should return 200 and JSON when gets a book', async () => {
      const testEvent = { 
        pathParameters: {
          bookUuid: testBookId
        }
      };
      const expectedBook = {
        bookUuid: testBookId,
        name: 'Game of Thrones',
        authorName: 'R.R. Martin',
        releaseDate: 12345
      }
      booksServiceStub.get.withArgs(testBookId).returns(expectedBook);

      const response = await sut.get(testEvent);

      expect(response.statusCode).toBe(200);
      expect(response.body).toBe(JSON.stringify(expectedBook));
    });
  });

  describe('get all books', () => {
    test('should return 500 if fails to get a book', async () => {
      const testEvent = { 
        pathParameters: {
          bookUuid: testBookId
        }
      };
      booksServiceStub.getAll.throws();

      const response = await sut.getAll(testEvent);

      expect(response.statusCode).toBe(500);
    });

    test('should return 200 and JSON when gets a book', async () => {
      const testEvent = {};
      const expectedBooks = [
        {
          bookUuid: 'random-id-1',
          name: 'A Game of Thrones',
          authorName: 'R.R. Martin',
          releaseDate: 12345
        },
        {
          bookUuid: 'random-id-2',
          name: 'A Clash of Kings',
          authorName: 'R.R. Martin',
          releaseDate: 43241
        }
      ];
      booksServiceStub.getAll.returns(expectedBooks);

      const response = await sut.getAll(testEvent);

      expect(response.statusCode).toBe(200);
      expect(response.body).toBe(JSON.stringify(expectedBooks));
    });
  });

})