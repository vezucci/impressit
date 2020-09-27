const response = (statusCode, body) => ({ statusCode, body });

class BooksController {
  constructor({ booksService, booksValidator }) {
    this.booksService = booksService;
    this.booksValidator = booksValidator;
  }

  async add(event) {
    let data = null;
    try {
      data = JSON.parse(event.body);
    } catch (err) {
      console.log('There was an error parsing the body', err);
      return response(400);
    }

    const validationError = this.booksValidator(data);
    if (validationError) {
      return response(400, validationError.message);
    }
    
    try {
      await this.booksService.add(data);
    } catch (err) {
      console.log('There was an error saving a book', err);
      return response(500);
    }

    return response(201);
  }

  async update(event) {
    let data = null;
    try {
      data = JSON.parse(event.body);
    } catch (err) {
      console.log('There was an error parsing the body', err);
      return response(400);
    }

    const validationError = this.booksValidator(data);
    if (validationError) {
      return response(400, validationError.message);
    }

    const bookId = event.pathParameters.bookUuid;

    try {
      await this.booksService.update(bookId, data);
    } catch (err) {
      console.log('There was an error updating a book', err);
      return response(500);
    }

    return response(200);
  }

  async delete(event) {
    const bookId = event.pathParameters.bookUuid;

    try {
      await this.booksService.delete(bookId); 
    } catch (err) {
      console.log('There was an error deleting a book', err);
      return response(500);
    }

    return response(200);
  }

  async get(event) {
    const bookId = event.pathParameters.bookUuid;

    let book = null;
    try {
      book = await this.booksService.get(bookId);
    } catch (err) {
      console.log('There was an error getting a book', err);
      return response(500);
    }

    if (book === null) {
      return response(404);
    }

    return response(200, JSON.stringify(book));
  }

  async getAll() {
    let books = [];
    try {
      books = await this.booksService.getAll(); 
    } catch (err) {
      console.log('There was an error getting books', err);
      return response(500);
    }

    return response(200, JSON.stringify(books));
  }
}

module.exports = BooksController;