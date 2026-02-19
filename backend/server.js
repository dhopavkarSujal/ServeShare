import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import authRoutes from "./routes/auth_routes.js";
import donationRoutes from "./routes/donation_routes.js";

dotenv.config();
const app = express();

// ✅ 1. Enable CORS FIRST
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// ✅ 2. Parse JSON
app.use(express.json());

// ✅ 3. Session
app.use(session({
  secret: "serveshare_secret_key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24
  }
}));

// ✅ 4. Routes AFTER middleware
app.use("/api/auth", authRoutes);
app.use("/api/donations", donationRoutes);

app.get("/", (req, res) => {
  res.send("ServeShare API running");
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});