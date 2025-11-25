import { Skeleton } from "@/components/ui/skeleton";
import React, { useEffect } from "react";
import Course from "./Course";
import { useGetPublishedCourseQuery } from "@/features/api/courseApi";
import { AlertCircle } from "lucide-react";

const Courses = () => {
  const { data, isLoading, isError, refetch } = useGetPublishedCourseQuery();
  // console.log("Data from courses:", data);

  useEffect(() => {
    refetch();
  }, [data]);

  if (isError) return <CoursesNotFound />;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {data?.courses.length === 0 ? (<EmptyState />)
        : <div>
          <h2 className="font-bold text-3xl text-center mb-10 dark:text-white">
            All Courses
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading
              ? Array.from({ length: 8 }).map((_, index) => (
                <CourseSkeleton key={index} />
              ))
              : data?.courses &&
              data.courses.map((course, index) => (
                <Course key={index} course={course} />
              ))}
          </div>
        </div>
      }
    </div>
  );
};

export default Courses;


// Skeleton UI Component
const CourseSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-900 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow rounded-lg overflow-hidden">
      <Skeleton className="w-full h-40" />

      <div className="px-5 py-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-7 w-7 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>

        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  );
};

// Error Component
const CoursesNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-40 p-8">
      <AlertCircle className="text-red-500 h-16 w-16 mb-4" />

      <h1 className="font-bold text-2xl md:text-4xl text-gray-900 dark:text-gray-200 mb-2">
        Something Went Wrong
      </h1>

      <p className="text-lg text-gray-600 dark:text-gray-400 mb-3 text-center px-2">
        We couldn’t load the courses. Please try again later.
      </p>
    </div>
  );
};

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
