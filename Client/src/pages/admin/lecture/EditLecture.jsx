import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import LectureTab from "./LectureTab";

const EditLecture = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="flex-1 md:mx-10 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          size="icon"
          variant="outline"
          className="rounded-full"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} />
        </Button>

        <h1 className="font-bold text-xl md:text-2xl">
          Update Your Lecture
        </h1>
      </div>

      {/* Tabs Component */}
      <LectureTab />
    </div>
  );
};

export default EditLecture;
