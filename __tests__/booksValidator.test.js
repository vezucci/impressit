const Joi = require('joi');
const sut = require('../booksValidator');

describe('booksValidator', () => {
  
  test('should return undefined if params are valid', () => {
    const testParams = {
      name: 'Galapagos',
      authorName: 'K. Vonnegut',
      releaseDate: 12413
    }

    const result = sut(testParams);

    expect(result).toBe(undefined);
  });

  test('should return error if params are invalid', () => {
    const testParams = {
      name: 'Invalid',
      releaseDate: 12413
    }

    const result = sut(testParams);

    expect(Joi.isError(result)).toBe(true);
  });

});
