const Joi = require('@hapi/joi');

const recipejoi = Joi.object({
  name: Joi.string().alphanum().min(3).max(50).required(),
  description: Joi.string().min(3).max(500).required()
  }),
