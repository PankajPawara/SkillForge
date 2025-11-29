import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./database/db.js";
import userRoute from "./routes/user.route.js";
import courseRoute from "./routes/course.route.js";
import mediaRoute from "./routes/media.route.js";
import purchaseRoute from "./routes/purchaseCourse.route.js";
import courseProgressRoute from "./routes/courseProgress.route.js";
import adminRoutes from "./routes/admin.route.js"
import { stripeWebhook } from "./controllers/coursePurchase.controller.js";
dotenv.config({});

// call database connection here
connectDB();
const app = express();

const PORT = process.env.PORT || 4080;

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));

app.use(cookieParser());

// default middleware
app.use(express.json());

// apis
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/purchase", purchaseRoute);
app.use("/api/v1/progress", courseProgressRoute);
app.use("/api/v1/admin", adminRoutes);
 
// RAW body ONLY for Stripe webhook
app.post(
  "/api/v1/purchase/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);



 
app.listen(PORT, () => {
    console.log(`Server listen at port ${PORT}`);
})
