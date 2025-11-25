import LoadingSpinner from "@/components/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetCreatorCourseQuery } from "@/features/api/courseApi";
import { Edit, Lock, PlusCircle, Verified } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CourseTable = () => {
  const { refetch, data, isLoading } = useGetCreatorCourseQuery();
  const navigate = useNavigate();

  useEffect(() => {
    refetch();
  }, [data]);

  if (isLoading) return <LoadingSpinner></LoadingSpinner>
  // console.log("data: ", data);

  return (
    <Card className="flex flex-col bg-white dark:bg-gray-700 border rounded-lg p-6  gap-6 mx-4 md:mx-10">

      <h1 className="text-center text-xl font-semibold">A list of your courses</h1>

      {/* Top Button */}
      <div className="flex justify-end ">
        <Button
          className="bg-blue-600 text-white hover:bg-blue-800 flex items-center gap-2 "
          onClick={() => navigate(`create`)}
        >
          <PlusCircle className="w-4 h-4 " />
          Create a new course
        </Button>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto border rounded-lg shadow-sm">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[120px]">Price</TableHead>
              <TableHead className="text-center w-[150px]">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.courses.length > 0 ? data.courses.map((course) => (
              <TableRow key={course._id}>

                {/* Title */}
                <TableCell className="font-medium">
                  {course.courseTitle}
                </TableCell>

                {/* Published / Private */}
                <TableCell>
                  {course.isPublished ? (
                    <Badge className="bg-blue-500 text-white flex items-center gap-1">
                      <Verified className="w-4 h-4" />
                      Published
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-500 text-white flex items-center gap-1">
                      <Lock className="w-4 h-4" />
                      Private
                    </Badge>
                  )}
                </TableCell>

                {/* Price */}
                <TableCell className="font-medium">
                  ₹ {course?.coursePrice || "NA"}
                </TableCell>

                {/* Edit Button */}
                <TableCell className="text-center">
                  <Button
                    className="flex items-center gap-1"
                    onClick={() => navigate(`${course._id}`)}
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                </TableCell>

              </TableRow>
            ))
              : (
                <div className="flex flex-col items-center justify-center">
                  <EmptyState /></div>)
            }
          </TableBody>
        </Table>
      </div>
    </Card>
  );

};

export default CourseTable;

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center text-center py-20">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-20 w-20 text-gray-400 dark:text-gray-600 mb-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.3}
        d="M12 8c1.657 0 3-.895 3-2s-1.343-2-3-2-3 .895-3 2 1.343 2 3 2zM5.5 18c0-2.485 2.239-4.5 5-4.5s5 2.015 5 4.5M19 10h2m-1-1v2m-7-2h.01M4 10h.01M6.5 6.5l.01.01"
      />
    </svg>

    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
      No Courses found
    </h2>
    <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-md">
      We couldn’t load the courses. Please try again later.
    </p>
  </div>
);