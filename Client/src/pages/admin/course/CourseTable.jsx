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
import React from "react";
import { useNavigate } from "react-router-dom";

const CourseTable = () => {
  const { data, isLoading } = useGetCreatorCourseQuery();
  const navigate = useNavigate();

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
            {data.courses.map((course) => (
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
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );

};

export default CourseTable;
