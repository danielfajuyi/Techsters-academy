import express from "express";
import { addCourse, educatorDashboardData, getEducatorCourses, getEnrolledStdentsData, updateRoleToEducator } from "../controllers/educatorController.js";
import { protectEducator } from "../middlewares/authMiddlewares.js";
import upload from "../configs/multer.js";

const educatorRouter = express.Router()

//Add Educator Role
educatorRouter.get("/update-role", updateRoleToEducator)

educatorRouter.post("/add-course", upload.single('image'), protectEducator, addCourse)

educatorRouter.get("/courses", protectEducator,getEducatorCourses)

educatorRouter.get("/dashboard", protectEducator, educatorDashboardData);

educatorRouter.get("/enrolled-students", protectEducator, getEnrolledStdentsData);

export default educatorRouter