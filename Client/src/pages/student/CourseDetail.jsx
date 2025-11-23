import BuyCourseButton from "@/components/BuyCourseButton";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  useGetCourseDetailQuery,
  useGetCourseDetailWithStatusQuery,
} from "@/features/api/purchaseApi";
import { AlertCircle, BadgeInfo, Lock, PlayCircle } from "lucide-react";
import React from "react";
import ReactPlayer from "react-player";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { useTheme } from "@/components/ThemeProvider";

const CourseDetail = () => {
  const { courseId } = useParams();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const {
    data: purchaseStatusData,
    isLoading: statusLoading,
    isError: statusError,
  } = useGetCourseDetailWithStatusQuery(courseId, { skip: !isAuthenticated });

  const {
    data: courseData,
    isLoading: courseLoading,
    isError: courseError,
  } = useGetCourseDetailQuery(courseId);

  if (statusLoading || courseLoading) return <LoadingSpinner />;

  if (statusError && courseError) {
    return <h1 className="text-center text-red-500">Failed to load course details.</h1>;
  }

  const purchased = purchaseStatusData?.purchased || false;
  const course = purchaseStatusData?.course || courseData?.course;

  if (!course) return <CourseNotFound />;

  const handleContinueCourse = () => {
    if (isAuthenticated && purchased) {
      navigate(`/course-progress/${courseId}`);
    }
  };

  return (
    <div className="mt-15 sm:px-5 md:px-20 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6">      
      {/* Video Preview */}
      <div className="col-span-3 space-y-4 lg:col-span-2">
        <Card className=" dark:bg-gray-700 bg-white ">
          <CardContent>
            <h1 className=" font-bold text-2xl mb-3 dark:text-gray-100">Course Preview</h1>

            <div className="mx-auto w-full aspect-video border rounded-lg overflow-hidden mb-4">
              <ReactPlayer
                width="100%"
                height="100%"
                url={course.lectures?.[0]?.videoUrl || ""}
                controls
              />
            </div>

            <h2 className="text-lg font-semibold dark:text-gray-200">
              Lecture: {course.lectures?.[0]?.lectureTitle}
            </h2>

            <Separator className="my-3" />

            <h1 className="text-xl font-bold dark:text-gray-100">
              Price: ₹ {course.coursePrice}/-
            </h1>
          </CardContent>

          <CardFooter className="flex justify-center">
            {purchased ? (
              <Button
                onClick={handleContinueCourse}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Continue Course
              </Button>
            ) : (
              <BuyCourseButton courseId={courseId} />
            )}
          </CardFooter>
        </Card>
      </div>

      {/* Left Section */}
      <div className="col-span-3 space-y-4 ">
        
        {/* Top Banner */}
        <Card className="p-5 dark:bg-gray-700 bg-white border">
          <h1 className="font-bold text-3xl dark:text-gray-100 text-gray-900">
            {course.courseTitle}
          </h1>
          <p className="text-lg dark:text-gray-300 text-gray-600 ">
            {course.subTitle}
          </p>

          <div className="flex flex-wrap gap-6">
            <p className="dark:text-gray-300">
              Created by{" "}
              <span className="text-blue-600 underline italic">
                {course.creator?.name}
              </span>
            </p>

            <p className="dark:text-gray-300">Enrolled: {course.enrolledStudents?.length}</p>

            <div className="flex items-center gap-2 text-sm dark:text-gray-400 text-gray-700">
              <BadgeInfo size={16} />
              <p>Updated: {course.createdAt?.split("T")[0]}</p>
            </div>
          </div>
        </Card>

        {/* Description */}
        <Card className="p-5  dark:bg-gray-700 bg-white border">
          <h2 className="font-bold text-xl mb-3 dark:text-gray-100">Description</h2>

          <div
            className="h-40 overflow-y-auto prose max-w-none dark:text-gray-300"
            data-color-mode={theme === "dark" ? "dark" : "light"}
          >
            <MarkdownPreview source={course.description} style={{ background: "transparent" }} />
          </div>
        </Card>

        {/* Course Content */}
        <Card className="p-5 dark:bg-gray-700 bg-white border">
          <CardHeader>
            <CardTitle className="dark:text-gray-100">Course Content</CardTitle>
            <CardDescription>Total Lectures: {course.lectures?.length || 0}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-3 max-h-60 overflow-y-auto">
            {course.lectures?.map((lecture, idx) => (
              <div key={idx} className="flex items-center gap-3 text-sm dark:text-gray-300">
                {purchased || lecture.isPreviewFree ? (
                  <PlayCircle size={14} className="text-[#2563EB]" />
                ) : (
                  <Lock size={14} className="text-gray-500" />
                )}
                <p>
                  {idx + 1}. {lecture.lectureTitle}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

    </div>
  );
};

export default CourseDetail;

const CourseNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-32 p-6">
      <AlertCircle className="text-red-500 h-16 w-16 mb-4" />
      <h1 className="font-bold text-3xl text-gray-900 dark:text-gray-100">
        Course Not Found
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
        Sorry, we couldn't find the course you're looking for.
      </p>
    </div>
  );
};
