import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// 🧱 Booking Schema
const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  destination: { type: String, required: true },
  date: { type: Date, required: true },
  tickets: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model("Booking", bookingSchema);

// 🟢 POST - Create a new booking
router.post("/", async (req, res) => {
  try {
    const { name, email, destination, date, tickets } = req.body;

    if (!name || !email || !destination || !date || !tickets) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newBooking = new Booking({ name, email, destination, date, tickets });
    await newBooking.save();

    res.status(201).json({ message: "🎟️ Booking successful!", booking: newBooking });
  } catch (err) {
    console.error("❌ Error saving booking:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 🟣 GET - Get all bookings (for admin dashboard)
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error("❌ Error fetching bookings:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
