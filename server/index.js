import express from "express";
import cors from "cors";
import "dotenv/config.js";
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks } from "./controllers/webhooks.js";

// Initialize Express
const app = express();

// Middlewares
app.use(cors());

// Connect to database (use a proper async handling approach)
connectDB()
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

// Routes
app.get("/", (req, res) => res.send("Api Working"));
app.post("/clerk", express.json(), clerkWebhooks);

// For local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
}

// Export for Vercel
export default app;
