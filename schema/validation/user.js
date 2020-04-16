const yup = require('yup');

module.exports = useryup = yup.object().shape({
  username: yup.string().min(3).max(20),
  email: yup.string().min(3).max(255).email(),
  password: yup.string().min(3).max(255),
});
