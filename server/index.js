import express from "express";
import cors from "cors";
import "dotenv/config.js";
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks } from "./controllers/webhooks.js";

const app = express();

// Connect to database
(async () => {
  await connectDB();
})();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("API Working"));
app.post("/clerk", clerkWebhooks);

// Export the app (Vercel handles the server)
export default app;
