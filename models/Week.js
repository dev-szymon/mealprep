const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

const WeekSchema = new Schema(
  {
    user: { type: ObjectId, ref: 'User' },
    mon: [{ type: ObjectId, ref: 'Meal' }],
    tue: [{ type: ObjectId, ref: 'Meal' }],
    wed: [{ type: ObjectId, ref: 'Meal' }],
    thu: [{ type: ObjectId, ref: 'Meal' }],
    fri: [{ type: ObjectId, ref: 'Meal' }],
    sat: [{ type: ObjectId, ref: 'Meal' }],
    sun: [{ type: ObjectId, ref: 'Meal' }]
  },
  { timestamps: true }
);

const Week = mongoose.model('Week', WeekSchema);

module.exports = Week;
