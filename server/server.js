import express from "express";
import cors from "cors";
import "dotenv/config.js";
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks } from "./controllers/webhooks.js";
import educatorRouter from "./routes/educatorRoutes.js";
import { clerkMiddleware } from "@clerk/express";

const app = express();

// Connect to database
await connectDB();

// Middlewares
app.use(cors());
app.use(clerkMiddleware());
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("API Working"));
app.post("/clerk", clerkWebhooks);
app.use("/api.educator", express.json(), educatorRouter);
// For local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
}

// Export the Express app for Vercel
export default app;
