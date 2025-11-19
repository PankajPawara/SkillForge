import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router-dom";
import CourseTab from "./CourseTab";
import { ArrowLeft } from "lucide-react";

const EditCourse = () => {
  return (
    <div className="flex-1 mx-10">
      <div className="flex items-center gap-2 mb-5">
        <Button size="icon" variant="outline" className={"rounded-full"} onClick={() => history.back()}>
          <ArrowLeft size={16} />
        </Button>
        <h1 className="font-bold text-xl">
          Add detail information regarding course
        </h1>
        <Link to="lecture">
          <Button className="bg-blue-600 hover:bg-blue-800">Add lectures</Button>
        </Link>
      </div>
      <CourseTab />
    </div>
  );
};

export default EditCourse;
