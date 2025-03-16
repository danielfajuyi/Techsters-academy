import express from "express";
import cors from "cors";
import "dotenv/config.js";
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks } from "./controllers/webhooks.js";

// Initialize Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Api Working");
});

app.post("/clerk", clerkWebhooks);

// Database connection and server start should be inside the module
// but not automatically executed on import
const startServer = async () => {
  try {
    await connectDB();
    console.log("Connected to database");
  } catch (err) {
    console.error("Database connection error:", err);
  }
};

// For local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  startServer().then(() => {
    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  });
}

// Export for Vercel
export default app;
