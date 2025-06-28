const Joi = require("joi");

exports.userRegisterSchema = Joi.object({
  username: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

exports.userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});
