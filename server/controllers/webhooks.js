import { Webhook } from "svix";
import crypto from "crypto";
import User from "../models/User.js";
import Stripe from "stripe";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";

// API Controller Function to Manage Clerk User with Database

export const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = req.body;
    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };
        await User.create(userData);
        res.json({});
        break;
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };
        await User.findByIdAndUpdate(data.id, userData);
        res.json({});
        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        res.json({});
        break;
      }

      default:
        break;
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

// export const stripeWebhooks = async (request, response) => {
//   const sig = request.headers["stripe-signature"];

//   let event;

//   try {
//     event = Stripe.webhooks.constructEvent(
//       request.body,
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET
//     );
//   } catch (error) {
//     response.status(400).send(`webhook Error: ${error.message}`);
//   }

//   //Handle the event
//   switch (event.type) {
//     case "payment_intent.succeeded": {
//       const paymentIntent = event.data.object;
//       const paymentIntentId = paymentIntent.id;

//       const session = await stripeInstance.checkout.sessions.list({
//         payment_intent: paymentIntentId,
//       });

//       const { purchaseId } = session.data[0].metadata;
//       const purchaseData = await Purchase.findById(purchaseId);
//       const userData = await User.findById(purchaseData.userId);
//       const courseData = await Course.findById(
//         purchaseData.courseId.toString()
//       );

//       courseData.enrolledStudents.push(userData);
//       await courseData.save();

//       userData.enrolledCourses.push(courseData._id);
//       await userData.save();

//       purchaseData.status = "completed";
//       await purchaseData.save();

//       break;
//     }

//     case "payment_intent.payment_failed": {
//       const paymentIntent = event.data.object;
//       const paymentIntentId = paymentIntent.id;

//       const session = await stripeInstance.checkout.sessions.list({
//         payment_intent: paymentIntentId,
//       });

//       const { purchaseId } = session.data[0].metadata;

//       const purchaseData = await Purchase.findById(purchaseId);
//       purchaseData.status = "failed";
//       await purchaseData.save();

//       break;
//     }

//     //...handle other event types
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }

//   //Return a response to acknowledge receipt of the event
//   response.json({ received: true });
// };

export const paystackWebhooks = async (req, res) => {
  try {
    // Validate the Paystack signature
    const paystackSignature = req.headers["x-paystack-signature"];
    if (!paystackSignature) {
      return res.status(400).send("Webhook Error: No signature provided");
    }

    const secret = process.env.PAYSTACK_SECRET_KEY;
    const hash = crypto
      .createHmac("sha512", secret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (hash !== paystackSignature) {
      return res.status(400).send("Webhook Error: Invalid signature");
    }

    const event = req.body;
    console.log("Paystack Webhook Event:", event);

    switch (event.event) {
      case "charge.success": {
        const paymentData = event.data;
        const purchaseId = paymentData.metadata.purchaseId;

        const purchaseData = await Purchase.findById(purchaseId);
        if (!purchaseData) {
          return res.status(404).send("Webhook Error: Purchase not found");
        }

        const userData = await User.findById(purchaseData.userId);
        const courseData = await Course.findById(
          purchaseData.courseId.toString()
        );

        if (!userData || !courseData) {
          return res
            .status(404)
            .send("Webhook Error: User or Course not found");
        }

        // Enroll user in the course
        courseData.enrolledStudents.push(userData);
        await courseData.save();

        userData.enrolledCourses.push(courseData._id);
        await userData.save();

        // Mark purchase as completed
        purchaseData.status = "completed";
        await purchaseData.save();

        break;
      }

      case "charge.failed": {
        const paymentData = event.data;
        const purchaseId = paymentData.metadata.purchaseId;

        const purchaseData = await Purchase.findById(purchaseId);
        if (purchaseData) {
          purchaseData.status = "failed";
          await purchaseData.save();
        }

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.event}`);
    }

    // Acknowledge Paystack's webhook event
    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Paystack Webhook Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
