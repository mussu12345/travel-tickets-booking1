const Trip = require('../models/Trip');
const { validationResult } = require('express-validator');

// create trip (admin)
exports.createTrip = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const data = req.body;

    // seatsAvailable default to seatsTotal if not provided
    if (!data.seatsAvailable && data.seatsTotal) data.seatsAvailable = data.seatsTotal;

    const trip = await Trip.create({ ...data, createdBy: req.user._id });
    res.status(201).json(trip);
  } catch (err) { next(err); }
};

// get trips (with simple filters)
exports.getTrips = async (req, res, next) => {
  try {
    const { from, to, type, date } = req.query;
    const q = {};
    if (from) q.from = new RegExp('^' + from + '$', 'i');
    if (to) q.to = new RegExp('^' + to + '$', 'i');
    if (type) q.type = type;
    if (date) {
      const d = new Date(date);
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      q.departAt = { $gte: d, $lt: next };
    }
    const trips = await Trip.find(q).sort({ departAt: 1 });
    res.json(trips);
  } catch (err) { next(err); }
};

// get single
exports.getTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if(!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json(trip);
  } catch (err) { next(err); }
};

// update and delete (admin)
exports.updateTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if(!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json(trip);
  } catch (err) { next(err); }
};

exports.deleteTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);
    if(!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json({ message: 'Trip removed' });
  } catch (err) { next(err); }
};
