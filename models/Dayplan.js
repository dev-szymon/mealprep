const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

const DaySchema = new Schema(
  {
    createdBy: { type: ObjectId, ref: 'User' },
    weekDay: {
      type: String,
      enum: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
    },
    meals: [{ type: ObjectId, ref: 'Meal' }]
  },
  { timestamps: true }
);

const Dayplan = mongoose.model('Day', DaySchema);

module.exports = Dayplan;
