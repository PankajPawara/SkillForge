import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  useEditLectureMutation,
  useGetLectureByIdQuery,
  useRemoveLectureMutation
} from "@/features/api/courseApi";
import axios from "axios";
import { Loader2, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const MEDIA_API = "http://localhost:8080/api/v1/media";

const LectureTab = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const [uploadVideoInfo, setUploadVideoInfo] = useState(null);
  const [isFree, setIsFree] = useState(false);
  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [btnDisable, setBtnDisable] = useState(true);

  const params = useParams();
  const navigate = useNavigate();
  const { courseId, lectureId } = params;

  const { data: lectureData } = useGetLectureByIdQuery(lectureId);
  const lecture = lectureData?.lecture;

  useEffect(() => {
    if (lecture) {
      setLectureTitle(lecture.lectureTitle);
      setIsFree(lecture.isPreviewFree);
      setUploadVideoInfo(lecture.videoInfo);
      setBtnDisable(false);
    }
  }, [lecture]);

  const [editLecture, { data, isLoading, error, isSuccess }] =
    useEditLectureMutation();

  const [
    removeLecture,
    { data: removeData, isLoading: removeLoading, isSuccess: removeSuccess }
  ] = useRemoveLectureMutation();

  // -----------------------------
  // VIDEO UPLOAD HANDLER
  // -----------------------------
  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setBtnDisable(true);
    setMediaProgress(true);
    setUploadProgress(0);

    try {
      // delete previous video if exists
      if (lecture?.videoInfo?.publicId) {
        await axios.post(`${MEDIA_API}/delete-video`, {
          publicId: lecture.videoInfo.publicId,
        });
      }

      // upload new video
      const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
        onUploadProgress: ({ loaded, total }) => {
          setUploadProgress(Math.round((loaded * 100) / total));
        },
      });

      if (res.data.success) {
        setUploadVideoInfo({
          videoUrl: res.data.data.url,
          publicId: res.data.data.public_id,
        });

        toast.success("Video uploaded successfully.");
        setBtnDisable(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Video upload failed");
    } finally {
      setMediaProgress(false);
    }
  };

  // -----------------------------
  // UPDATE LECTURE HANDLER
  // -----------------------------
  const editLectureHandler = async () => {
    await editLecture({
      lectureTitle,
      videoInfo: uploadVideoInfo,
      isPreviewFree: isFree,
      courseId,
      lectureId,
    });
  };

  useEffect(() => {
    if (isSuccess) toast.success(data.message);
    if (error) toast.error(error.data.message);
  }, [isSuccess, error]);

  // -----------------------------
  // DELETE LECTURE HANDLER
  // -----------------------------
  const removeLectureHandler = async () => {
    await removeLecture({ courseId, lectureId });
  };

  useEffect(() => {
    if (removeSuccess) {
      toast.success(removeData.message);
      navigate(-1); // go back after delete
    }
  }, [removeSuccess]);

  return (
    <Card className="w-full bg-white dark:bg-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
      <CardHeader className="flex justify-between">
        <div>
          <CardTitle>Edit Lecture</CardTitle>
          <CardDescription>Make changes and click save when done.</CardDescription>
        </div>

        <Button disabled={removeLoading} 
        variant="destructive" 
        onClick={removeLectureHandler}
        className="bg-red-600 hover:bg-red-800 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-800"
        >
          {removeLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            <>
              <Trash2 className="mr-2" /> Delete Lecture
            </>
          )}
        </Button>
      </CardHeader>

      <CardContent>
        {/* Title */}
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            type="text"
            placeholder="Ex. Introduction to Javascript"
          />
        </div>

        {/* Video Upload */}
        <div className="my-5 space-y-2">
          <Label>
            Video <span className="text-red-500">*</span>
          </Label>
          <Input
            type="file"
            accept="video/*"
            onChange={fileChangeHandler}
            className="w-fit"
          />

          {uploadVideoInfo?.videoUrl ? (
            <p className="text-sm text-green-600">
              Current video: <a href={uploadVideoInfo.videoUrl} target="_blank" className="underline">Preview</a>
            </p>
          ) : (
            <p className="text-sm text-gray-500">No video uploaded</p>
          )}
        </div>

        {/* Free Preview Switch */}
        <div className="flex items-center space-x-2 my-5">
          <Switch checked={isFree} onCheckedChange={setIsFree} id="isFree" />
          <Label htmlFor="isFree">Is this video FREE?</Label>
        </div>

        {/* Upload Progress */}
        {mediaProgress && (
          <div className="my-4">
            <Progress value={uploadProgress} />
            <p className="text-sm mt-2">{uploadProgress}% uploaded</p>
          </div>
        )}

        {/* Update Button */}
        <Button disabled={isLoading || btnDisable} onClick={editLectureHandler}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            "Update Lecture"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default LectureTab;
