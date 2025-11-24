import LoadingSpinner from "@/components/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  useCompleteCourseMutation,
  useGetCourseProgressQuery,
  useInCompleteCourseMutation,
  useUpdateLectureProgressMutation,
} from "@/features/api/courseProgressApi";
import { CheckCircle, CheckCircle2, CirclePlay } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const CourseProgress = () => {
  const params = useParams();
  const courseId = params.courseId;

  const { data, isLoading, isError, refetch } =
    useGetCourseProgressQuery(courseId);

  const [updateLectureProgress] = useUpdateLectureProgressMutation();
  const [completeCourse, { data: markCompleteData, isSuccess: completedSuccess }] =
    useCompleteCourseMutation();
  const [
    inCompleteCourse,
    { data: markInCompleteData, isSuccess: inCompletedSuccess },
  ] = useInCompleteCourseMutation();

  useEffect(() => {
    toast.clearWaitingQueue();
    toast.dismiss();

    if (completedSuccess) {
      toast.success(markCompleteData.message, { toastId: "course-completed" });
      refetch();
    }

    if (inCompletedSuccess) {
      toast.success(markInCompleteData.message, { toastId: "course-incomplete" });
      refetch();
    }
  }, [completedSuccess, inCompletedSuccess]);

  const [currentLecture, setCurrentLecture] = useState(null);

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <p>Failed to load course details</p>;

  const { courseDetails, progress, completed } = data.data;
  const { courseTitle } = courseDetails;

  const initialLecture =
    currentLecture || (courseDetails.lectures && courseDetails.lectures[0]);

  const isLectureCompleted = (lectureId) =>
    progress.some((prog) => prog.lectureId === lectureId && prog.viewed);

  const handleLectureProgress = async (lectureId) => {
    await updateLectureProgress({ courseId, lectureId });
    refetch();
  };

  const handleSelectLecture = (lecture) => {
    setCurrentLecture(lecture);
    handleLectureProgress(lecture._id);
  };

  const handleCompleteCourse = async () => {
    await completeCourse(courseId);
  };

  const handleInCompleteCourse = async () => {
    await inCompleteCourse(courseId);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 mt-10 mb-10">
      {/* Header */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold dark:text-white">{courseTitle}</h1>

        <Button
          onClick={completed ? handleInCompleteCourse : handleCompleteCourse}
          variant={completed ? "outline" : "default"}
          className="flex items-center"
        >
          {completed ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Completed
            </>
          ) : (
            "Mark as completed"
          )}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Video Section */}
        <div
          className="
            flex-1 
            md:w-3/5 
            h-fit 
            rounded-lg 
            shadow-lg 
            p-4
            bg-white dark:bg-gray-700
          "
        >
          <video
            src={currentLecture?.videoUrl || initialLecture.videoUrl}
            controls
            className="w-full h-auto rounded-lg"
            onPlay={() =>
              handleLectureProgress(currentLecture?._id || initialLecture._id)
            }
          />

          <h3 className="font-semibold text-lg mt-3 dark:text-gray-200">
            Lecture{" "}
            {courseDetails.lectures.findIndex(
              (lec) =>
                lec._id === (currentLecture?._id || initialLecture._id)
            ) + 1}
            : {currentLecture?.lectureTitle || initialLecture.lectureTitle}
          </h3>
        </div>

        {/* Sidebar Section */}
        <div
          className="
            flex flex-col 
            w-full 
            md:w-2/5            
            md:pl-4 
            pt-4 md:pt-0
            border rounded-lg 
            shadow-lg 
          "
        >
          <h2 className="font-semibold text-xl md:my-2 mx-auto dark:text-gray-100">
            Course Lectures
          </h2>

          <ScrollArea className="h-[550px] w-full rounded-md">
            <ScrollBar orientation="horizontal" />

            <div className="p-2">
              {courseDetails?.lectures.map((lecture) => (
                <Card
                  key={lecture._id}
                  className={`
                    mb-3 cursor-pointer 
                    transition 
                    ${
                      lecture._id === currentLecture?._id
                        ? "bg-gray-200 dark:bg-gray-700"
                        : "bg-white dark:bg-gray-700"
                    }
                  `}
                  onClick={() => handleSelectLecture(lecture)}
                >
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center">
                      {isLectureCompleted(lecture._id) ? (
                        <CheckCircle2
                          size={24}
                          className="text-green-500 mr-2"
                        />
                      ) : (
                        <CirclePlay size={24} className="text-gray-500 mr-2" />
                      )}

                      <CardTitle className="text-sm md:text-base dark:text-gray-100">
                        {lecture.lectureTitle}
                      </CardTitle>
                    </div>

                    {isLectureCompleted(lecture._id) && (
                      <Badge
                        variant="outline"
                        className="bg-green-200 text-green-700 dark:bg-green-900 dark:text-green-300"
                      >
                        Done
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;
