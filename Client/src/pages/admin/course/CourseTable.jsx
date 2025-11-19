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
    <Card className="flex flex-col border rounded p-10 gap-5 mx-10">
      <div>
        <Button className="bg-blue-600 hover:bg-blue-800" onClick={() => navigate(`create`)} ><PlusCircle />Create a new course</Button>
      </div>
      <h1 className="text-center">A list of your courses</h1>
      <div className="overflow-x-auto border rounded-lg shadow">
        <Table className="min-w-full">
          <TableCaption></TableCaption>
          <TableHeader className={"items-center"}>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Price</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.courses.map((course) => (
              <TableRow key={course._id}>
                <TableCell>{course.courseTitle}</TableCell>
                <TableCell> {course.isPublished ? (
                  <>
                    <Badge className="bg-blue-400 text-white">
                      <Verified className="w-4 h-4" />
                      Published
                    </Badge>
                  </>
                ) : (
                  <>
                    <Badge className="bg-gray-500 text-white">
                      <Lock className="w-4 h-4" />
                      Private
                    </Badge>
                  </>
                )} </TableCell>
                <TableCell className="font-medium">₹ {course?.coursePrice || "NA"}</TableCell>
                <TableCell className="text-center">
                  <Button onClick={() => navigate(`${course._id}`)}><Edit />Edit Course</Button>
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
