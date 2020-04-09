const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

const WeekSchema = new Schema(
  {
    owner: { type: ObjectId, ref: 'User' },
    days: [{ type: ObjectId, ref: 'Day' }],
  },
  { timestamps: true }
);

const Week = mongoose.model('Week', WeekSchema);

module.exports = Week;
