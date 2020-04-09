const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

const DaySchema = new Schema(
  {
    belongsTo: { type: ObjectId, ref: 'Week' },
    meals: [{ type: ObjectId, ref: 'Meal' }],
    weekDay: [Number],
    date: String,
  },
  { timestamps: true }
);

const Day = mongoose.model('Day', DaySchema);

module.exports = Day;
