const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

const MealSchema = new Schema(
  {
    day: { type: ObjectId, ref: 'Day' },
    recipe: { type: ObjectId, ref: 'Recipe' },
    label: {
      type: String,
      enum: ['brf', '2ndbrf', 'lunch', 'dinner', 'snack', 'supper'],
    },
  },
  { timestamps: true }
);

const Meal = mongoose.model('Meal', MealSchema);

module.exports = Meal;
