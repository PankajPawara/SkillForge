import React from "react";
import {
  useGetAllCoursesQuery,
  useDeleteCourseMutation,
  useTogglePublishCourseMutation
} from "@/features/api/adminApi";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import LoadingSpinner from "@/components/LoadingSpinner";

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

  if (isLoading)
    return <LoadingSpinner />;

  if (isError) return <p className="text-red-500">Failed to load courses</p>;

  return (
    <div className="max-w-7xl mx-auto ">
      <h1 className="text-2xl font-bold mb-4 text-center">Manage Courses</h1>

      <Card className="p-6 bg-white dark:bg-gray-700 shadow-sm rounded-xl">
        {/* Responsive table wrapper */}
        <div className="w-full overflow-x-auto rounded-md border">
          <Table className="w-full text-sm">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Thumbnail</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Creator</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data?.courses?.map((course) => (
                <TableRow key={course._id}>
                  <TableCell className="text-center">
                    <img
                      src={course.courseThumbnail}
                      className="h-14 w-24 object-cover rounded-md mx-auto"
                      alt="thumbnail"
                    />
                  </TableCell>

                  <TableCell>{course.courseTitle}</TableCell>
                  <TableCell>₹{course.coursePrice || "Unknown"}</TableCell>
                  <TableCell>{course.creator?.name || "Unknown"}</TableCell>

                  <TableCell className="font-medium">
                    {course.isPublished ? (
                      <span className="text-green-600">Published</span>
                    ) : (
                      <span className="text-red-600">Unpublished</span>
                    )}
                  </TableCell>

                  <TableCell className="text-center space-x-2 whitespace-nowrap">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => navigate(`${course._id}`)}
                      className="hover:bg-gray-700 dark:hover:bg-gray-400"
                    >
                      <Pencil size={16} className="mr-1" /> Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(course._id)}
                      className="bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-800"
                    >
                      <Trash2 size={16} className="mr-1" /> Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default ManageCourses;
