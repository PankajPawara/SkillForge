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
        if (!course) {
            return res.status(404).json({ message: "Course not found!" });
        }

        // Check if a purchase already exists
        const existingPurchase = await CoursePurchase.findOne({
            courseId,
            userId,
        });

        // If completed purchase exists -> block new purchase
        if (existingPurchase && existingPurchase.status === "completed") {
            return res.status(400).json({
                success: false,
                message: "You have already purchased this course.",
            });
        }

        let purchaseRecord;

        // If PENDING purchase exists, update instead of creating new
        if (existingPurchase && existingPurchase.status === "pending") {
            purchaseRecord = existingPurchase;
        } else {
            // Create NEW purchase record
            purchaseRecord = new CoursePurchase({
                courseId,
                userId,
                creator: course.creator,
                amount: course.coursePrice,
                status: "pending",
            });
        }

        // Create Stripe Checkout Session
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
                userId: userId,
                purchaseId: purchaseRecord._id.toString(),
            },
            shipping_address_collection: {
                allowed_countries: ["IN"],
            },
        });

        if (!session.url) {
            return res.status(400).json({
                success: false,
                message: "Error while creating checkout session",
            });
        }

        // Update or Save purchase record
        purchaseRecord.paymentId = session.id;
        await purchaseRecord.save();

        console.log("Updated/Created Purchase → paymentId:", session.id);

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
    console.log("stripeWebhook called");

    let event;

    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.WEBHOOK_ENDPOINT_SECRET;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,  // raw body (must not be parsed automatically)
            sig,
            endpointSecret
        );
    } catch (err) {
        console.error("Webhook Signature Verification Failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
        console.log("Stripe checkout session completed");

        try {
            const session = event.data.object;
            console.log("session:" + session);
            const purchase = await CoursePurchase.findOne({
                paymentId: session.id,
            }).populate({ path: "courseId" });

            console.log("purchase:" + purchase);

            if (!purchase) {
                console.log("Purchase not found for session:", session.id);
                return res.status(404).json({ message: "Purchase not found" });
            }

            if (session.amount_total) {
                purchase.amount = session.amount_total / 100;
            }
            purchase.status = "completed";
            await purchase.save();
            console.log("Updated purchase status to completed for purchase ID:", purchase._id);

            // Unlock all lectures (by setting isPreviewFree to true)
            if (purchase.courseId?.lectures?.length > 0) {
                await Lecture.updateMany(
                    { _id: { $in: purchase.courseId.lectures } },
                    { $set: { isPreviewFree: true } }
                );
            }
            console.log("Unlocked all lectures for course ID:", purchase.courseId._id);

            // Add course to user's enrolledCourses
            await User.findByIdAndUpdate(
                purchase.userId,
                { $addToSet: { enrolledCourses: purchase.courseId._id } }, // Add course ID to enrolledCourses
                { new: true }
            );
            console.log("Added course to user's enrolledCourses for user ID:", purchase.userId);

            // Add user to course's enrolledStudents
            await Course.findByIdAndUpdate(
                purchase.courseId._id,
                { $addToSet: { enrolledStudents: purchase.userId } }, // Add user ID to enrolledStudents
                { new: true }
            );
            console.log("Added user to course's enrolledStudents for course ID:", purchase.courseId._id);
        } catch (error) {
            console.error("Error processing completed session:", error);
            return res.status(500).send("Internal server error");
        }
    }
    console.log("Webhook processing completed");
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
