const Joi = require('joi');

const validateRegister = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters',
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email',
      'string.empty': 'Email is required',
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters',
      'string.empty': 'Password is required',
    }),
  });

  return schema.validate(data);
};

const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email',
      'string.empty': 'Email is required',
    }),
    password: Joi.string().required().messages({
      'string.empty': 'Password is required',
    }),
  });

  return schema.validate(data);
};

const validateMovie = (data, isUpdate = false) => {
  const schema = Joi.object({
    title: isUpdate ? Joi.string().min(1).max(200) : Joi.string().min(1).max(200).required(),
    description: isUpdate ? Joi.string() : Joi.string().required(),
    genre: isUpdate ? Joi.array().items(Joi.string()) : Joi.array().items(Joi.string()).required(),
    duration: isUpdate ? Joi.number().min(1) : Joi.number().min(1).required(),
    releaseDate: isUpdate ? Joi.date() : Joi.date().required(),
    director: isUpdate ? Joi.string() : Joi.string().required(),
    cast: Joi.array().items(Joi.string()),
    language: Joi.array().items(Joi.string()),
    rating: Joi.number().min(0).max(10),
    posterUrl: Joi.string().uri(),
    trailerUrl: Joi.string().uri(),
  });

  return schema.validate(data);
};

const validateTheatre = (data, isUpdate = false) => {
  const schema = Joi.object({
    name: isUpdate ? Joi.string().min(1) : Joi.string().min(1).required(),
    city: isUpdate ? Joi.string() : Joi.string().required(),
    address: isUpdate ? Joi.string() : Joi.string().required(),
    phone: isUpdate ? Joi.string() : Joi.string().required(),
    email: isUpdate ? Joi.string().email() : Joi.string().email().required(),
    amenities: Joi.array().items(Joi.string()),
    isParkingAvailable: Joi.boolean(),
    isFood: Joi.boolean(),
  });

  return schema.validate(data);
};

const validateScreen = (data, isUpdate = false) => {
  const schema = Joi.object({
    screenNumber: isUpdate ? Joi.number().min(1) : Joi.number().min(1).required(),
    theatreId: isUpdate ? Joi.string() : Joi.string().required(),
    capacity: isUpdate ? Joi.number().min(1) : Joi.number().min(1).required(),
    layout: isUpdate ? Joi.object({
      rows: Joi.number().min(1),
      columns: Joi.number().min(1),
    }) : Joi.object({
      rows: Joi.number().min(1).required(),
      columns: Joi.number().min(1).required(),
    }).required(),
    facilities: Joi.array().items(Joi.string()),
  });

  return schema.validate(data);
};

const validateShow = (data, isUpdate = false) => {
  const schema = Joi.object({
    movieId: isUpdate ? Joi.string() : Joi.string().required(),
    theatreId: isUpdate ? Joi.string() : Joi.string().required(),
    screenId: isUpdate ? Joi.string() : Joi.string().required(),
    dateTime: isUpdate ? Joi.date() : Joi.date().required(),
    format: Joi.string().valid('2D', '3D', 'IMAX'),
    language: Joi.string(),
    seatPrice: isUpdate ? Joi.number().min(0) : Joi.number().min(0).required(),
    totalSeats: isUpdate ? Joi.number().min(1) : Joi.number().min(1).required(),
  });

  return schema.validate(data);
};

const validateBooking = (data) => {
  const schema = Joi.object({
    showId: Joi.string().required(),
    seats: Joi.array().items(Joi.string()).required(),
    email: Joi.string().email(),
    phone: Joi.string(),
    paymentMethod: Joi.string(),
  });

  return schema.validate(data);
};

module.exports = {
  validateRegister,
  validateLogin,
  validateMovie,
  validateTheatre,
  validateScreen,
  validateShow,
  validateBooking,
};
