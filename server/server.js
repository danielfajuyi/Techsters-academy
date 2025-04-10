import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks, paystackWebhooks } from "./controllers/webhooks.js";
import educatorRouter from "./routes/educatorRoutes.js";
import { clerkMiddleware } from "@clerk/express";
import connectCloudinary from "./configs/cloudinary.js";
import courseRouter from "./routes/courseRoute.js";
import userRouter from "./routes/userRoute.js";

// initialize Experess
const app = express();

//connect to database
await connectDB();
await connectCloudinary();

//middlewares
app.use(cors());
app.use(clerkMiddleware());

//Routes
app.get("/", (req, res) => res.send("API Working"));
app.post("/clerk", express.json(), clerkWebhooks);
app.use("/api/educator", express.json(), educatorRouter);
app.use("/api/course", express.json(), courseRouter);
app.use("/api/user", express.json(), userRouter);
app.post("/paystack-webhook", express.json(), paystackWebhooks);

// app.post("/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

//port

const PORT = process.env.PORT || 5000;
const liveServer = "https://techsters-academy.vercel.app/";
const displayText = "api is working";

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT} local server`);
  console.log(`access live server at ${liveServer}`);
  console.log(`live server display text === ${displayText}`);
});
