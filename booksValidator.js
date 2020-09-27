const Joi = require('joi');

const bookSchema = Joi.object({
  name: Joi.string().required(),
  authorName: Joi.string().required(),
  releaseDate: Joi.number().integer().required()
});

module.exports = (data) => {
  const { error } = bookSchema.validate(data);
  return error;
};