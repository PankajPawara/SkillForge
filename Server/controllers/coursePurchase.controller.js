import Stripe from "stripe";
import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { Lecture } from "../models/lecture.model.js";
import { User } from "../models/user.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// CREATE CHECKOUT SESSION
export const createCheckoutSession = async (req, res) => {
    try {
        const userId = req.id;
        const { courseId } = req.body;

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found!" });

        // Check if the user already purchased this course
        const existingPurchase = await CoursePurchase.findOne({
            courseId,
            userId,
            status: "completed",
        });

        if (existingPurchase) {
            return res.status(400).json({
                success: false,
                message: "You have already purchased this course.",
            });
        }

        // Create a new purchase record with pending status
        const newPurchase = new CoursePurchase({
            courseId,
            userId,
            creator: course.creator,
            amount: course.coursePrice,
            status: "pending",
        });

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: course.courseTitle,
                            images: [course.courseThumbnail],
                        },
                        unit_amount: course.coursePrice * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `http://localhost:5173/course-progress/${courseId}`,
            cancel_url: `http://localhost:5173/course-detail/${courseId}`,
            metadata: {
                courseId: courseId,
                userId: userId, // Store to use in webhook
                purchaseId: newPurchase._id.toString(), // Extra safety
            },
            shipping_address_collection: {
                allowed_countries: ["IN"],
            },
        });

        if (!session.url) {
            return res
                .status(400)
                .json({ success: false, message: "Error while creating session" });
        }
        // Save payment session ID to match later
        newPurchase.paymentId = session.id;
        await newPurchase.save();

        return res.status(200).json({
            success: true,
            url: session.url,
        });
    } catch (error) {
        console.log("Error in createCheckoutSession:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// STRIPE WEBHOOK HANDLER
export const stripeWebhook = async (req, res) => {
    let event;

    try {
        const payloadString = JSON.stringify(req.body, null, 2);
        const secret = process.env.WEBHOOK_ENDPOINT_SECRET;

        const header = stripe.webhooks.generateTestHeaderString({
            payload: payloadString,
            secret,
        });

        event = stripe.webhooks.constructEvent(payloadString, header, secret);
    } catch (error) {
        console.error("Webhook error:", error.message);
        return res.status(400).send(`Webhook error: ${error.message}`);
    }

    if (event.type === "checkout.session.completed") {
        console.log("Stripe checkout session completed");

        try {
            const session = event.data.object;

            const purchase = await CoursePurchase.findOne({
                paymentId: session.id,
            }).populate({ path: "courseId" });

            if (!purchase) {
                console.log("Purchase not found for session:", session.id);
                return res.status(404).json({ message: "Purchase not found" });
            }

            if (session.amount_total) {
                purchase.amount = session.amount_total / 100;
            }
            purchase.status = "completd";
            await purchase.save();

            // Unlock all lectures (by setting isPreviewFree to true)
            if (purchase.courseId?.lectures?.length > 0) {
                await Lecture.updateMany(
                    { _id: { $in: purchase.courseId.lectures } },
                    { $set: { isPreviewFree: true } }
                );
            }

            // Add course to user's enrolledCourses
            await User.findByIdAndUpdate(
                purchase.userId,
                { $addToSet: { enrolledCourses: purchase.courseId._id } }, // Add course ID to enrolledCourses
                { new: true }
            );

            // Add user to course's enrolledStudents
            await Course.findByIdAndUpdate(
                purchase.courseId._id,
                { $addToSet: { enrolledStudents: purchase.userId } }, // Add user ID to enrolledStudents
                { new: true }
            );
        } catch (error) {
            console.error("Error processing completed session:", error);
            return res.status(500).send("Internal server error");
        }
    }

    return res.status(200).send("Webhook received");
};

// GET COURSE DETAIL + PURCHASE STATUS
export const getCourseDetailWithPurchaseStatus = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.id;

        const course = await Course.findById(courseId)
            .populate("creator")
            .populate("lectures");

        if (!course) {
            return res.status(404).json({ message: "Course not found!" });
        }

        const purchased = await CoursePurchase.findOne({
            userId,
            courseId,
            status: "completed",
        });

        return res.status(200).json({
            course,
            purchased: !!purchased,
        });
    } catch (error) {
        console.log("Error fetching course details:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
// GET COURSE DETAILS
export const getCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.id;

        const course = await Course.findById(courseId)
            .populate("creator")
            .populate("lectures");

        if (!course) {
            return res.status(404).json({ message: "Course not found!" });
        }

        return res.status(200).json({
            course,
        });
    } catch (error) {
        console.log("Error fetching course details:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// GET ALL PURCHASED COURSES BY A USER
export const getAllPurchasedCourse = async (req, res) => {
    try {
        const userId = req.id;

        const purchasedCourse = await CoursePurchase.find({
            status: "completed",
            userId: userId,
        }).populate("courseId");

        return res.status(200).json({
            purchasedCourse: purchasedCourse || [],
        });
    } catch (error) {
        console.log("Error fetching purchased courses:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
