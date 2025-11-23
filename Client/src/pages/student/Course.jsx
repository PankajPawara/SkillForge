import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { Link } from "react-router-dom";

const Course = ({ course }) => {
  return (
    <Link to={`/course-detail/${course._id}`}>
      <Card
        className="
          overflow-hidden rounded-xl py-0 
          transition-all duration-300 shadow-md 
          hover:shadow-xl hover:scale-[1.02]

          bg-white dark:bg-gray-700
          border border-gray-200 dark:border-gray-600
        "
      >
        {/* Thumbnail */}
        <div className="relative">
          <img
            src={course.courseThumbnail}
            alt="course"
            className="w-full h-40 object-cover rounded-t-xl"
          />
        </div>

        {/* Bottom Content */}
        <CardContent className="px-5 pb-3">
          {/* Title */}
          <h1
            className="
              font-bold text-lg truncate hover:underline
              text-gray-900 dark:text-gray-100
            "
          >
            {course.courseTitle}
          </h1>

          {/* Creator + Level */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={course.creator?.photoUrl || "https://github.com/shadcn.png"}
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              <h1
                className="
                  text-sm font-medium 
                  text-gray-900 dark:text-gray-300
                "
              >
                {course.creator?.name}
              </h1>
            </div>

            {/* Level Badge */}
            <Badge
              className="
                text-white px-2 py-1 text-xs rounded-full
                bg-blue-600 hover:bg-blue-700
                dark:bg-blue-600 dark:hover:bg-blue-700
              "
            >
              {course.courseLevel}
            </Badge>
          </div>

          {/* Price */}
          <div
            className="
              text-lg font-bold mt-2
              text-gray-900 dark:text-gray-100
            "
          >
            ₹{course.coursePrice}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Course;
