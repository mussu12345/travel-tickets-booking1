const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
  title: { type: String, required: true },            // e.g., "Indigo 6E123"
  type: { type: String, enum: ['flight','bus','train'], default: 'flight' },
  from: { type: String, required: true },
  to: { type: String, required: true },
  departAt: { type: Date, required: true },
  arriveAt: { type: Date, required: true },
  price: { type: Number, required: true },
  seatsTotal: { type: Number, required: true },
  seatsAvailable: { type: Number, required: true },
  description: { type: String },
  image: { type: String }, // path if using uploads
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Trip', TripSchema);
