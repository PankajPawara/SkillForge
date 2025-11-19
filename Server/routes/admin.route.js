import express from "express";
import isAdmin  from "../middlewares/isAdmin.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getAdminStats } from "../controllers/admin.controller.js";
import {
  getAllUsers,
  updateUserByAdmin,
  deleteUserByAdmin,
  getAllCoursesForAdmin,
  toggleCoursePublish,
  deleteCourseByAdmin,
  updateCourseByAdmin
} from "../controllers/admin.controller.js";

const router = express.Router();

// Only accessible to admin
router.get("/stats", isAuthenticated, getAdminStats);

// Admin manages users
router.get("/users", isAuthenticated, getAllUsers);
router.put("/users/:userId", isAuthenticated, updateUserByAdmin);
router.delete("/users/:userId", isAuthenticated, deleteUserByAdmin);

// Admin manages courses
router.get("/courses",isAuthenticated, getAllCoursesForAdmin);
router.patch("/course/toggle-publish/:id", isAuthenticated, toggleCoursePublish);
router.delete("/course/:id", isAuthenticated, deleteCourseByAdmin);
router.patch("/course/:id", isAuthenticated, updateCourseByAdmin);

export default router;
