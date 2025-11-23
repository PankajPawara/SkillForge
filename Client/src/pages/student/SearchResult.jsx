import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import React from "react";
import { Link } from "react-router-dom";

const SearchResult = ({ course }) => {

  return (
    <Link to={`/course-detail/${course._id}`}>
      <Card
        className="flex flex-col md:flex-row justify-between items-center px-4 gap-4 w-full md:w-auto bg-indigo-50 dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl p-4"
      >
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-3/4">
          <img
            src={course.courseThumbnail}
            alt="course-thumbnial"
            className="h-32 w-full md:w-56 object-cover rounded"
          />
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-lg md:text-xl">{course.courseTitle}</h1>
            <p className="text-sm">{course.category}</p>
            <p className="text-sm">
              Intructor: <span className="font-bold">{course.creator?.name}</span>{" "}
            </p>
            <Badge className="w-fit mt-2 md:mt-0">{course.courseLevel}</Badge>
          </div>
        </div>
        <div className="mt-4 md:mt-0 md:text-right w-full md:w-auto">
          <h1 className="font-bold text-lg md:text-xl">₹{course.coursePrice}</h1>
        </div>
      </Card>
    </Link >
  );
};

export default SearchResult;
