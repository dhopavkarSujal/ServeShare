import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import authRoutes from "./routes/auth_routes.js";

dotenv.config();
const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: "serveshare_secret_key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,   // true in production (HTTPS)
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("ServeShare API running");
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
