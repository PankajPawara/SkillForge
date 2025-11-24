
import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { Lecture } from "../models/lecture.model.js";
import { User } from "../models/user.model.js";
import { CourseProgress } from "../models/courseProgress.model.js"; 
import {
    deleteMediaFromCloudinary,
    deleteVideoFromCloudinary,
    uploadMedia
} from "../utils/cloudinary.js";

export const createCourse = async (req, res) => {
    try {
        const { courseTitle, category } = req.body;
        if (!courseTitle || !category) {
            return res.status(400).json({
                message: "Course title and category is required."
            })
        }

        const course = await Course.create({
            courseTitle,
            category,
            creator: req.id
        });

        return res.status(201).json({
            course,
            message: "Course created."
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to create course"
        })
    }
}

export const searchCourse = async (req, res) => {
    try {
        const { query = "", categories = [], sortByPrice = "" } = req.query;
        console.log(categories);

        // create search query
        const searchCriteria = {
            isPublished: true,
            $or: [
                { courseTitle: { $regex: query, $options: "i" } },
                { subTitle: { $regex: query, $options: "i" } },
                { category: { $regex: query, $options: "i" } },
            ]
        }

        // if categories selected
        if (categories.length > 0) {
            searchCriteria.category = { $in: categories };
        }

        // define sorting order
        const sortOptions = {};
        if (sortByPrice === "low") {
            sortOptions.coursePrice = 1;//sort by price in ascending
        } else if (sortByPrice === "high") {
            sortOptions.coursePrice = -1; // descending
        }

        let courses = await Course.find(searchCriteria).populate({ path: "creator", select: "name photoUrl" }).sort(sortOptions);

        return res.status(200).json({
            success: true,
            courses: courses || []
        });

    } catch (error) {
        console.log(error);

    }
}

export const getPublishedCourse = async (_, res) => {
    try {
        const courses = await Course.find({ isPublished: true }).populate({ path: "creator", select: "name photoUrl" });
        if (!courses) {
            return res.status(404).json({
                message: "Course not found"
            })
        }
        return res.status(200).json({
            courses,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to get published courses"
        })
    }
}
export const getCreatorCourses = async (req, res) => {
    try {
        const userId = req.id;
        const courses = await Course.find({ creator: userId });
        if (!courses) {
            return res.status(404).json({
                courses: [],
                message: "Course not found"
            })
        };
        return res.status(200).json({
            courses,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to create course"
        })
    }
}

export const getPublishedCreatorCourses = async (req, res) => {
    try {
        const userId = req.id;

        const soldCourses = await CoursePurchase.find({
            creator: userId,
            status: "completed",
        }).populate("courseId")

        const publishedCourses = await Course.find({
            creator: userId,
            isPublished: true,
        }).populate("creator")
        
        // if (!soldCourses || soldCourses.length === 0) {
        //     return res.status(404).json({
        //         soldCourses: [],
        //         message: "No published courses found for this user."
        //     });
        // }

        return res.status(200).json({
            publishedCourses,
            soldCourses,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to fetch published courses for creator"
        });
    }
};

export const editCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const { courseTitle, subTitle, description, category, courseLevel, coursePrice } = req.body;
        const thumbnail = req.file;

        let course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                message: "Course not found!"
            })
        }
        let courseThumbnail;
        if (thumbnail) {
            if (course.courseThumbnail) {
                const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
                await deleteMediaFromCloudinary(publicId); // delete old image
            }
            // upload a thumbnail on clourdinary
            courseThumbnail = await uploadMedia(thumbnail.path);
        }


        const updateData = { courseTitle, subTitle, description, category, courseLevel, coursePrice, courseThumbnail: courseThumbnail?.secure_url };

        course = await Course.findByIdAndUpdate(courseId, updateData, { new: true });

        return res.status(200).json({
            course,
            message: "Course updated successfully."
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to create course"
        })
    }
}
export const getCourseById = async (req, res) => {
    try {
        const { courseId } = req.params;

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                message: "Course not found!"
            })
        }
        return res.status(200).json({
            course
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to get course by id"
        })
    }
}

export const createLecture = async (req, res) => {
    try {
        const { lectureTitle } = req.body;
        const { courseId } = req.params;

        if (!lectureTitle || !courseId) {
            return res.status(400).json({
                message: "Lecture title is required"
            })
        };

        // create lecture
        const lecture = await Lecture.create({ lectureTitle });

        const course = await Course.findById(courseId);
        if (course) {
            course.lectures.push(lecture._id);
            await course.save();
        }

        return res.status(201).json({
            lecture,
            message: "Lecture created successfully."
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to create lecture"
        })
    }
}
export const getCourseLecture = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId).populate("lectures");
        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            })
        }
        return res.status(200).json({
            lectures: course.lectures
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to get lectures"
        })
    }
}
export const editLecture = async (req, res) => {
    try {
        const { lectureTitle, videoInfo, isPreviewFree } = req.body;

        const { courseId, lectureId } = req.params;
        const lecture = await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({
                message: "Lecture not found!"
            })
        }

        // update lecture
        if (lectureTitle) lecture.lectureTitle = lectureTitle;
        if (videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
        if (videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
        if (isPreviewFree) lecture.isPreviewFree = isPreviewFree;

        await lecture.save();

        // Ensure the course still has the lecture id if it was not aleardy added;
        const course = await Course.findById(courseId);
        if (course && !course.lectures.includes(lecture._id)) {
            course.lectures.push(lecture._id);
            await course.save();
        };
        return res.status(200).json({
            lecture,
            message: "Lecture updated successfully."
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to edit lecture"
        })
    }
}
export const deleteLecture = async (req, res) => {
    try {
        const { lectureId } = req.params;

        // Find & delete the lecture from DB
        const lecture = await Lecture.findByIdAndDelete(lectureId);
        if (!lecture) {
            return res.status(404).json({
                message: "Lecture not found!"
            });
        }

        // Delete Cloudinary video if exists
        if (lecture.publicId) {
            await deleteVideoFromCloudinary(lecture.publicId);
        }

        // Remove lecture reference from ALL courses
        await Course.updateMany(
            { lectures: lectureId },
            { $pull: { lectures: lectureId } }
        );

        console.log("Lecture deleted successfully.");
        return res.status(200).json({
            message: "Lecture removed successfully."
        });

    } catch (error) {
        console.log("Failed to remove lecture:", error);
        return res.status(500).json({
            message: "Failed to remove lecture"
        });
    }
};

export const getLectureById = async (req, res) => {
    try {
        const { lectureId } = req.params;
        const lecture = await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({
                message: "Lecture not found!"
            });
        }
        return res.status(200).json({
            lecture
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to get lecture by id"
        })
    }
}


// publich unpublish course logic
export const togglePublishCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { publish } = req.query; // true, false
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                message: "Course not found!"
            });
        }
        // publish status based on the query paramter
        course.isPublished = publish === "true";
        await course.save();

        const statusMessage = course.isPublished ? "Published" : "Unpublished";
        return res.status(200).json({
            message: `Course is ${statusMessage}`
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to update status"
        })
    }
}
export const deleteCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        
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

