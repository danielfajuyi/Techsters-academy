import Course from "../models/Course.js";
import { CourseProgress } from "../models/CourseProgress.js";
import { Purchase } from "../models/Purchase.js";
import User from "../models/User.js";
import Stripe from "stripe";
import axios from "axios";

// For paystack
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = process.env.PAYSTACK_BASE_URL;
//Get user data

export const getUserData = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User Not Found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//Users Enrolled Courses With Lecture Links

export const userEnrolledCourses = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const userData = await User.findById(userId).populate("enrolledCourses");

    res.json({ sucess: true, enrolledCourses: userData.enrolledCourses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Purchase Course with Paystack
export const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const { origin } = req.headers;
    const userId = req.auth.userId;

    // Fetch user and course data
    const userData = await User.findById(userId);
    const courseData = await Course.findById(courseId);

    if (!userData || !courseData) {
      return res.json({ success: false, message: "User or Course Not Found" });
    }
    // Calculate course price with discount
    const amount = (
      courseData.coursePrice -
      (courseData.discount * courseData.coursePrice) / 100
    ).toFixed(2);

    // Create purchase record
    const newPurchase = await Purchase.create({
      courseId: courseData._id,
      userId,
      amount,
    });
    const callbackUrl = `${origin.replace(/\/$/, "")}/loading/my-enrollments`;

    // Initialize Paystack Payment
    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        email: userData.email,
        amount: Math.floor(newPurchase.amount * 100), // Convert to kobo
        // amount: Math.floor(newPurchase.amount) * 100,
        currency: process.env.CURRENCY.toUpperCase(),
        metadata: {
          purchaseId: newPurchase._id.toString(),
          courseId: courseData._id.toString(),
          courseTitle: courseData.courseTitle, // Equivalent to Stripe's product_data.name
          quantity: 1,
          unit_amount: Math.floor(newPurchase.amount * 100), // Same as Stripe's unit amount
        },
        callback_url: callbackUrl,
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Return Paystack payment URL
    res.json({
      success: true,
      session_url: response.data.data.authorization_url, // Matches Stripe format
    });
  } catch (error) {
    console.error("Paystack Error:", error.response?.data || error.message);
    res.json({
      success: false,
      message: error.response?.data?.message || "Payment Initialization Failed",
    });
  }
};

//Update User Course Progress
export const updateUserCourseProgress = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { courseId, lectureId } = req.body;
    const progressData = await CourseProgress.findOne({ userId, courseId });

    if (progressData) {
      if (progressData.lectureCompleted.includes(lectureId)) {
        return res.json({
          success: true,
          message: "Lecture Already Completed",
        });
      }

      progressData.lectureCompleted.push(lectureId);
      await progressData.save();
    } else {
      await CourseProgress.create({
        userId,
        courseId,
        lectureCompleted: [lectureId],
      });
    }

    res.json({ success: true, message: "Progress Updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//Get user Course Progress
export const getUserCourseProgress = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { courseId } = req.body;
    const progressData = await CourseProgress.findOne({ userId, courseId });
    res.json({ success: true, progressData });
  } catch (error) {
    res.json({ sucess: false, message: error.message });
  }
};

//Add  User Ratings to Course

export const addUserRating = async (req, res) => {
  const userId = req.auth.userId;
  const { courseId, rating } = req.body;

  if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
    return res.json({ success: false, message: "Invalid Details" });
  }

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.json({ success: false, message: "Course not found" });
    }

    const user = await User.findById(userId);
    if (!user || !user.enrolledCourses.includes(courseId)) {
      return res.json({
        success: false,
        message: "User has not purchased this course",
      });
    }

    const existingRatingIndex = course.courseRating.findIndex(
      (r) => r.userId.toString() === userId.toString()
    );

    if (existingRatingIndex > -1) {
      // ✅ Update the existing rating
      course.courseRating[existingRatingIndex].rating = rating;
    } else {
      // ✅ Add a new rating
      course.courseRating.push({ userId, rating });
    }

    await course.save();

    return res.json({
      success: true,
      message: "Rating Added",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
