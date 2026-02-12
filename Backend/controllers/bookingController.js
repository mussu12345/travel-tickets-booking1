import Booking from "../models/Booking.js";

// ✅ Create a new booking
export const createBooking = async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json({ message: "Booking saved successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Error saving booking", error: error.message });
  }
};

// ✅ Get all bookings (optional)
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error: error.message });
  }
};
