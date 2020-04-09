const Joi = require('@hapi/joi');

const recipejoi = Joi.object({
  name: Joi.string().alphanum().min(3).max(20).required(),
  kcal: Joi.number(),
  carbs: Joi.number(),
  protein: Joi.number(),
  fat: Joi.number()
  }),
