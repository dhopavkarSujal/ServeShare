import express from "express";                 // Import Express framework
import cors from "cors";                       // Import CORS to allow cross-origin requests
import dotenv from "dotenv";                   // Load environment variables from .env file
import session from "express-session";         // Session middleware for login management

// Import route files
import authRoutes from "./routes/auth_routes.js";       // Authentication routes (login/register)
import donationRoutes from "./routes/donation_routes.js"; // Donation routes
import adminRoutes from "./routes/admin_routes.js";     // Admin panel routes
import profileRoutes from "./routes/profile.js";        // User profile routes
import ngoRoutes from "./routes/ngos.js";               // NGO routes

dotenv.config(); // Load environment variables

const app = express(); // Create Express app instance

// ✅ Enable CORS to allow frontend (React) to access backend
app.use(cors({
  origin: "http://localhost:3000",  // Allow requests from React app
  credentials: true                 // Allow cookies/session sharing
}));

// ✅ Parse incoming JSON data from requests
app.use(express.json());

// ✅ Setup session configuration
app.use(session({
  secret: "serveshare_secret_key",  // Secret key to sign session ID cookie
  resave: false,                    // Do not save session if not modified
  saveUninitialized: false,         // Do not create session until something stored
  cookie: {
    secure: false,                  // Set true only in production (HTTPS)
    httpOnly: true,                 // Prevent JS access to cookies
    maxAge: 1000 * 60 * 60 * 24     // Cookie expires in 1 day
  }
}));

// ✅ Register API routes AFTER middleware
app.use("/api/auth", authRoutes);           // Authentication endpoints
app.use("/api/donations", donationRoutes);  // Donation endpoints
app.use("/api/ngos", ngoRoutes);            // NGO listing endpoints
app.use("/api/admin", adminRoutes);         // Admin endpoints
app.use("/api/profile", profileRoutes);     // Profile update/fetch endpoints

// ✅ Serve uploaded images statically
app.use("/uploads", express.static("uploads"));

// ✅ Root test route
app.get("/", (req, res) => {
  res.send("ServeShare API running");
});

// ✅ Start server on port 5000
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});