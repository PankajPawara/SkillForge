import React from "react";
import { useGetAllCoursesQuery, useDeleteCourseMutation, useTogglePublishCourseMutation } from "@/features/api/adminApi";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

const ManageCourses = () => {
  const { data, isLoading, isError, refetch } = useGetAllCoursesQuery();
  const [deleteCourse] = useDeleteCourseMutation();
  const [togglePublish] = useTogglePublishCourseMutation();

  const navigate = useNavigate();

  const handleDelete = async (courseId) => {
    try {
      await deleteCourse(courseId).unwrap();
      toast.success("Course deleted successfully");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete course");
    }
  };

  const handleTogglePublish = async (courseId) => {
    try {
      await togglePublish(courseId).unwrap();
      toast.success("Course status updated");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update status");
    }
  };

  if (isLoading) return <div className="flex justify-center mt-10"><Loader2 className="animate-spin" /></div>;
  if (isError) return <p className="text-red-500">Failed to load courses</p>;
  console.log(isError);

  return (
    <div className="max-w-7xl mx-auto px-4 my-5">
      <h1 className="text-2xl font-bold mb-4">Manage Courses</h1>
      <Card className="p-10">
        <Card className={"w-full flex justify-center"}>
          <Table className="w-full shadow rounded mx-auto">
            <TableHeader>
              <TableRow>
                <TableHead className={"text-center"}>Thumbnail</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Creator</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className={"text-center"}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.courses?.map((course) => (
                <TableRow key={course._id}>
                  <TableCell className={"mx-auto text-center"}><img src={course.courseThumbnail} className="h-12 w-20 object-cover mx-auto rounded" alt="thumb" /></TableCell>
                  <TableCell>{course.courseTitle}</TableCell>
                  <TableCell>₹{course.coursePrice || "Unknown"}</TableCell>
                  <TableCell>{course.creator?.name || "Unknown"}</TableCell>
                  <TableCell>{course.isPublished ? "Published" : "Unpublished"}</TableCell>
                  <TableCell className="space-x-2 text-center">
                    <Button size="sm" variant="default" onClick={() => navigate(`${course._id}`)}>
                      <Pencil size={16} />Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(course._id)}>
                      <Trash2 size={16} />Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </Card>
    </div>
  );
};

export default ManageCourses;
