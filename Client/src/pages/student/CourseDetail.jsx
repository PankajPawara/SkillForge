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
    useGetCourseDetailWithStatusQuery
} from "@/features/api/purchaseApi";
import { AlertCircle, BadgeInfo, Lock, PlayCircle } from "lucide-react";
import React from "react";
import ReactPlayer from "react-player";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import MarkdownPreview from '@uiw/react-markdown-preview';
import { useTheme } from '@/components/ThemeProvider'

const CourseDetail = () => {
    const { courseId } = useParams();
    const { theme } = useTheme();
    const navigate = useNavigate();

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const user = useSelector((state) => state.auth.user);

    // Query to get course detail + purchase status, only if authenticated
    const {
        data: purchaseStatusData,
        isLoading: statusLoading,
        isError: statusError,
    } = useGetCourseDetailWithStatusQuery(courseId, { skip: !isAuthenticated });

    // Fallback query to just get course details (for unauthenticated users)
    const {
        data: courseData,
        isLoading: courseLoading,
        isError: courseError,
    } = useGetCourseDetailQuery(courseId);

    // Loading state
    if (statusLoading || courseLoading) return <LoadingSpinner />;

    // Error state
    if (statusError && courseError) {
        return <h1 className="text-center text-red-500">Failed to load course details.</h1>;
    }

    // Safe destructuring with fallback
    const purchased = purchaseStatusData?.purchased || false;
    const course = purchaseStatusData?.course || courseData?.course;

    // Final fallback check to avoid null access
    if (!course) {
        return <CourseNotFound/>;
    }

    const handleContinueCourse = () => {
        if (isAuthenticated && purchased) {
            navigate(`/course-progress/${courseId}`);
        }
    };

    return (
        <div className="mt-5 max-w-7xl mx-auto flex flex-row gap-5">
            {/* Course Top Banner */}
            <div className="max-w-4xl flex flex-col">
                <div className="w-full space-y-2">
                    <h1 className="font-bold text-2xl mx-auto">Course Details</h1>
                    <Card className="mx-auto p-5 flex flex-col gap-2">
                        <h1 className="font-bold text-2xl">
                            Course Title: {course.courseTitle}
                        </h1>
                        <p className="text-xl">Sub Title: {course.subTitle}</p>
                        <div className="flex flex-row gap-8">
                            <p>
                                Created By{" "}
                                <span className="text-blue-600 underline italic">
                                    {course.creator?.name}
                                </span>
                            </p>
                            <p>Total enrolled: {course.enrolledStudents?.length}</p>
                            <div className="flex items-center gap-2 text-sm">
                                <BadgeInfo size={16} />
                                <p>Last updated: {course.createdAt?.split("T")[0]}</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Course Description & content Section */}
                <div className="max-w-7xl my-5 flex flex-col">
                    <div className="w-full space-y-2">
                        <h1 className="font-bold text-2xl">Description</h1>
                        <Card className={"max-h-40 p-5"}>
                            <div className="h-40 overflow-y-auto prose max-w-none" data-color-mode={theme === 'dark' ? 'dark' : 'light'}>
                                <MarkdownPreview source={course.description} style={{ background: "transparent" }} />
                            </div>
                        </Card>

                        {/* Course Content */}
                        <Card className={"h-40 p-3"}>
                            <div className={"max-h-40 overflow-y-auto prose max-w-none"}>
                                <CardHeader className={"flex flex-row gap-2"}>
                                    <CardTitle>Course Content:  </CardTitle>
                                    <CardDescription>Total Lectures {course.lectures?.length || 0}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {course.lectures?.map((lecture, idx) => (
                                        <div key={idx} className="flex items-center gap-3 text-sm">
                                            <span>
                                                {purchased || lecture.isPreviewFree ? <PlayCircle size={14} /> : <Lock size={14} />}
                                            </span>
                                            <p>{idx+1} {lecture?.lectureTitle}</p>
                                        </div>
                                    ))}
                                </CardContent>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Video Player and Purchase Section */}
            <div className=" flex flex-col space-y-2">
                <h1 className="font-bold text-2xl">Course Preview</h1>
                <Card className={"max-w-7xl overflow-hidden"}>
                    <CardContent className="h-full flex flex-col justify-between">
                        <div className="w-[600px] aspect-video rounded-md overflow-hidden mb-4">
                            <ReactPlayer
                                width="100%"
                                height="100%"
                                url={course.lectures?.[0]?.videoUrl || ""}
                                 style={{ objectFit: "cover" }} 
                                controls={true}
                            />
                        </div>
                        <h1>Lecture: {course.lectures?.idx}{course.lectures?.[0]?.lectureTitle}</h1>
                        <Separator className="my-2" />
                        <h1 className="text-xl font-bold">
                            Course Price: ₹ {course.coursePrice}/-
                        </h1>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        {purchased ? (
                            <Button onClick={handleContinueCourse} className="w-full">
                                Continue Course
                            </Button>
                        ) : (
                            <BuyCourseButton courseId={courseId} />
                        )}
                    </CardFooter>
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
      <h1 className="font-bold text-2xl md:text-4xl text-gray-800 dark:text-gray-200 mb-2">
        Course Not Found
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
        Sorry, we couldn't find the course you're looking for.
      </p>
    </div>
  );
};
