const Joi = require('joi');
const { sendError } = require('../utils/helpers');

const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const messages = error.details.map(detail => detail.message);
      return sendError(res, 400, 'Validation error', messages);
    }

    req.validatedBody = value;
    next();
  };
};

module.exports = { validate };
