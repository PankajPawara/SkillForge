import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateLectureMutation,
  useGetCourseLectureQuery,
} from "@/features/api/courseApi";
import { ArrowLeft, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Lecture from "./Lecture";
import { Card } from "@/components/ui/card";

const CreateLecture = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const params = useParams();
  const courseId = params.courseId;
  const navigate = useNavigate();

  const [createLecture, { data, isLoading, isSuccess, error }] =
    useCreateLectureMutation();

  const {
    data: lectureData,
    isLoading: lectureLoading,
    isError: lectureError,
    refetch,
  } = useGetCourseLectureQuery(courseId);

  const createLectureHandler = async () => {
    await createLecture({ lectureTitle, courseId });
  };

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success(data.message);
    }
    if (error) {
      toast.error(error.data.message);
    }
  }, [isSuccess, error]);

  console.log(lectureData);

  return (
    <div className="flex-1 mx-10">
      <div className="flex mb-4 gap-2">
        <Button size="icon" variant="outline" className="rounded-full" onClick={() => history.back()}>
          <ArrowLeft />
        </Button>
        <div>
          <h1 className="font-bold text-xl">
            Let's add lectures, add some basic details for your new lecture
          </h1>
          <p className="text-sm">
            You can create lectures here and add video after successfull creation of lecture.
          </p>
        </div>
      </div>
      <Card className="space-y-2 p-5 bg-white dark:bg-gray-700">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            type="text"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            placeholder="Your Title Name"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button disabled={isLoading} onClick={createLectureHandler}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Create lecture"
            )}
          </Button>
        </div>
        <Card className={"p-5 bg-white dark:bg-gray-800"}>
          <div className="">
            {lectureLoading ? (
              <p>Loading lectures...</p>
            ) : lectureError ? (
              <p>Failed to load lectures.</p>
            ) : lectureData.lectures.length === 0 ? (
              <p>No lectures availabe</p>
            ) : (
              lectureData.lectures.map((lecture, index) => (
                <Lecture
                  key={lecture._id}
                  lecture={lecture}
                  courseId={courseId}
                  index={index}
                />
              ))
            )}
          </div>
        </Card>
      </Card>
    </div>
  );
};

export default CreateLecture;
