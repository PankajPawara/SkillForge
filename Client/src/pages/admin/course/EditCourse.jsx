import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router-dom";
import CourseTab from "./CourseTab";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EditCourse = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 md:mx-10">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">

        {/* Back + Title */}
        <div className="flex items-center gap-3">
          <Button
            size="icon"
            variant="outline"
            className="rounded-full"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} />
          </Button>

          <h1 className="font-bold text-xl">
            Add detailed information for your course
          </h1>
        </div>

        {/* Add Lecture Button */}
        <Link to="lecture">
          <Button className="text-white bg-blue-600 hover:bg-blue-800">
            Add lectures
          </Button>
        </Link>
      </div>

      {/* Course Editing Component */}
      <CourseTab />
    </div>
  );
};

export default EditCourse;
