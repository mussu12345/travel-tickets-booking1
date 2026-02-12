import http from "http";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new MongoClient(process.env.MONGODB_URI);
let bookingsCollection;

// Connect to MongoDB Atlas
async function connectDB() {
  try {
    await client.connect();
    const db = client.db("travelDB");
    bookingsCollection = db.collection("bookings");
    console.log("✅ Connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}
connectDB();

// Create the HTTP server
const server = http.createServer(async (req, res) => {
  // Serve static files (HTML, CSS, JS)
  if (req.method === "GET") {
    if (req.url === "/" || req.url === "/home.html") {
      const file = fs.readFileSync(path.join(__dirname, "../frontend/home.html"));
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(file);
      return;
    }

    // serve other static files
    try {
      const filePath = path.join(__dirname, "../frontend", req.url);
      const ext = path.extname(filePath);
      const contentType =
        ext === ".css"
          ? "text/css"
          : ext === ".js"
          ? "application/javascript"
          : "text/html";
      const file = fs.readFileSync(filePath);
      res.writeHead(200, { "Content-Type": contentType });
      res.end(file);
    } catch {
      res.writeHead(404);
      res.end("Not Found");
    }
    return;
  }

  // API route - POST /api/bookings
  if (req.method === "POST" && req.url === "/api/bookings") {
    let body = "";
    req.on("data", chunk => (body += chunk.toString()));
    req.on("end", async () => {
      try {
        const data = JSON.parse(body);

        if (!data.name || !data.email || !data.destination || !data.date || !data.tickets) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "All fields are required" }));
          return;
        }

        const result = await bookingsCollection.insertOne({
          ...data,
          createdAt: new Date()
        });

        console.log("🎟️ New booking stored:", result.insertedId);

        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Booking successful!" }));
      } catch (err) {
        console.error("❌ Error saving booking:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Internal Server Error" }));
      }
    });
    return;
  }
// 📩 Contact Form Route
if (req.method === "POST" && req.url === "/api/contact") {
  let body = "";
  req.on("data", chunk => body += chunk.toString());
  req.on("end", async () => {
    try {
      const data = JSON.parse(body);
      const { name, email, subject, message } = data;

      if (!name || !email || !subject || !message) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "All fields are required" }));
        return;
      }

      const db = client.db("travelDB");
      const contactCollection = db.collection("contacts");

      await contactCollection.insertOne({
        name,
        email,
        subject,
        message,
        createdAt: new Date(),
      });

      console.log("📨 New contact message saved:", name);

      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Message received successfully!" }));
    } catch (err) {
      console.error("❌ Error saving contact:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Internal Server Error" }));
    }
  });
  return;
}

  // Default
  res.writeHead(404);
  res.end("Not Found");
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
