import * as yup from 'yup';

export const useryup = yup.object().shape({
  username: yup.string().min(3).max(20),
  email: yup.string().min(3).max(255).email(),
  password: yup.string().min(3).max(255),
});

export const recipeyup = yup.object().shape({
  name: yup.string().min(3).max(120),
  private: yup.boolean(),
  prepTime: yup.number().positive(),
  description: yup.string().min(20).max(2500),
});

export const ingredientyup = yup.object().shape({
  name: yup.string().min(3).max(120),
  kcal: yup.number().positive(),
  carbs: yup.number(),
  protein: yup.number().positive(),
  fats: yup.number().positive(),
  glycemixIndex: yup.number().positive(),
});
