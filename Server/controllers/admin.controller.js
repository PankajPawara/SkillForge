import { User } from "../models/user.model.js";
import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { deleteMediaFromCloudinary, deleteVideoFromCloudinary } from "../utils/cloudinary.js";
import { Lecture } from "../models/lecture.model.js";
import { CourseProgress } from "../models/courseProgress.model.js";

// Get all stats users, courses etc.
export const getAdminStats = async (_, res) => {
  try {
    const users = await User.find({});
    const courses = await Course.find({});
    const purchases = await CoursePurchase.find({ status: "completed" });

    const totalUsers = {
      students: users.filter(u => u.role === "Student").length,
      trainers: users.filter(u => u.role === "Trainer").length,
      admins: users.filter(u => u.role === "Admin").length,
    };

    const totalCourses = {
      published: courses.filter(c => c.isPublished).length,
      unpublished: courses.filter(c => !c.isPublished).length,
    };

    const revenue = purchases.reduce((sum, item) => sum + (item.amount || 0), 0);
    const totalEnrollment = purchases.length;

    return res.status(200).json({
      totalUsers,
      totalCourses,
      revenue,
      totalEnrollment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch admin stats" });
  }
};


// Get all users
export const getAllUsers = async (_, res) => {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json({ success: true, users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};

// Update user role or profile
export const updateUserByAdmin = async (req, res) => {
  try {
    const { name, email, mobile, role } = req.body;
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;
    user.mobile = mobile || user.mobile;
    user.role = role || user.role;

    await user.save();
    return res.status(200).json({ success: true, message: "User updated", user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to update user" });
  }
};

// Delete user
export const deleteUserByAdmin = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    //  DELETE USER PROFILE PHOTO FROM CLOUDINARY
    if (user.photoUrl) {
      const publicId = user.photoUrl.split("/").pop().split(".")[0];
      await deleteMediaFromCloudinary(publicId);
    }

    //  REMOVE USER FROM ALL ENROLLED COURSES
    await Course.updateMany(
      { enrolledStudents: userId },
      { $pull: { enrolledStudents: userId } }
    );

    //  DELETE ALL COURSES CREATED BY THIS USER
    const coursesCreated = await Course.find({ creator: userId });

    for (const course of coursesCreated) {

      // DELETE COURSE THUMBNAIL
      if (course.courseThumbnail) {
        const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
        await deleteMediaFromCloudinary(publicId);
      }

      // DELETE ALL LECTURE VIDEOS (publicId stored separately)
      const lectures = await Lecture.find({ _id: { $in: course.lectures } });

      for (const lecture of lectures) {
        if (lecture.publicId) {
          await deleteVideoFromCloudinary(lecture.publicId);
        }
      }

      // DELETE ALL LECTURES
      await Lecture.deleteMany({ _id: { $in: course.lectures } });

      // DELETE COURSE PURCHASES
      await CoursePurchase.deleteMany({ courseId: course._id });

      // DELETE COURSE PROGRESS
      await CourseProgress.deleteMany({ courseId: course._id });

      // DELETE COURSE ITSELF
      await course.deleteOne();
    }

    //  DELETE USER PURCHASE HISTORY
    await CoursePurchase.deleteMany({ userId });

    //  DELETE USER COURSE PROGRESS
    await CourseProgress.deleteMany({ userId });

    //  DELETE USER
    await user.deleteOne();

    return res.status(200).json({
      success: true,
      message: "User deleted along with all associated data",
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to delete user" });
  }
};

// GET: All courses with creator info
export const getAllCoursesForAdmin = async (_, res) => {
  try {
    const courses = await Course.find({})
      .populate("creator", "name email photoUrl")
      .populate("lectures");

    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};

// PATCH: Toggle course publish status
export const toggleCoursePublish = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.isPublished = !course.isPublished;
    await course.save();

    res.status(200).json({
      success: true,
      message: `Course ${course.isPublished ? "published" : "unpublished"} successfully.`,
    });
  } catch (error) {
    console.error("Failed to toggle publish status:", error);
    res.status(500).json({ message: "Failed to toggle course status" });
  }
};

// DELETE: Delete a course
export const deleteCourseByAdmin = async (req, res) => {
  try {
    const courseId = req.params.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    //  DELETE COURSE THUMBNAIL FROM CLOUDINARY
    if (course.courseThumbnail) {
      const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
      await deleteMediaFromCloudinary(publicId);
    }

    //  DELETE ALL LECTURE MEDIA AND DOCUMENTS
    const lectures = await Lecture.find({ _id: { $in: course.lectures } });

    for (const lecture of lectures) {
      if (lecture.publicId) {
        await deleteVideoFromCloudinary(lecture.publicId);
      }
    }

    // DELETE LECTURE DOCUMENTS FROM DB
    await Lecture.deleteMany({ _id: { $in: course.lectures } });

    //  REMOVE COURSE FROM USERS' ENROLLED LIST
    await User.updateMany(
      { enrolledCourses: courseId },
      { $pull: { enrolledCourses: courseId } }
    );

    //  DELETE PURCHASE RECORDS
    await CoursePurchase.deleteMany({ courseId });

    //  DELETE PROGRESS RECORDS
    await CourseProgress.deleteMany({ courseId });

    //  DELETE COURSE ITSELF
    await course.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully with all associated data",
    });

  } catch (error) {
    console.error("Failed to delete course:", error);
    return res.status(500).json({ message: "Failed to delete course" });
  }
};

// PATCH: Update a course (optional, title/price/description)
export const updateCourseByAdmin = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ success: true, message: "Course updated", course });
  } catch (error) {
    console.error("Failed to update course:", error);
    res.status(500).json({ message: "Failed to update course" });
  }
};
