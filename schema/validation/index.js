const yup = require('yup');

const useryup = yup.object().shape({
  username: yup.string().min(3).max(20),
  email: yup.string().min(3).max(255).email(),
  password: yup.string().min(3).max(255),
});

const recipeyup = yup.object().shape({
  name: yup.string().min(3).max(120),
  public: yup.boolean(),
  prepTime: yup.number().positive(),
  description: yup.string().min(20).max(2500),
});

const ingredientyup = yup.object().shape({
  name: yup.string().min(3).max(120),
  kcal: yup.number().positive(),
  carbs: yup.number(),
  protein: yup.number().positive(),
  fats: yup.number().positive(),
  glycemixIndex: yup.number().positive(),
});

module.exports = { useryup, recipeyup, ingredientyup };
