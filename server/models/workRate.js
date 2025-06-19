const { Schema, model, Types } = require('mongoose');

/**
 * A single rating left by one customer for one worker.
 * We keep the worker _id as a reference (so we can query all
 * ratings that belong to that worker) and – purely for UX –
 * we duplicate the customer’s display-name in `customerName`.
 */
const workRateSchema = new Schema(
  {
    workerId:   { type: Types.ObjectId, ref: 'User', required: true },
    customerId: { type: Types.ObjectId, ref: 'User', required: true },

    /* 1-to-5 stars (whole numbers) */
    rate:       { type: Number, min: 1, max: 5, required: true },

    /* optional free-text */
    feedback:   { type: String, trim: true, default: '' },

    /* cached so UI can render without an extra join */
    customerName: { type: String, required: true },
  },
  { timestamps: true }               // createdAt / updatedAt
);

module.exports = model('WorkRate', workRateSchema);
