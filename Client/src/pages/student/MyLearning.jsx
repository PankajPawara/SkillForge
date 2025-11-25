import React from "react";
import Course from "./Course";
import { useLoadUserQuery } from "@/features/api/authApi";

const MyLearning = () => {
  const { data, isLoading } = useLoadUserQuery();

  const myLearning = data?.user?.enrolledCourses || [];

  return (
    <div className="max-w-7xl mx-auto my-10 px-4">
      <h1 className="font-bold text-3xl text-center mb-10">MY LEARNING</h1>

      <div className="min-h-[300px]">
        {isLoading ? (
          <MyLearningSkeleton />
        ) : myLearning.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {myLearning.map((course, index) => (
              <Course key={index} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLearning;

/* ---------------- SKELETON ---------------- */
const MyLearningSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {[...Array(4)].map((_, index) => (
      <div
        key={index}
        className="bg-gray-300 dark:bg-gray-700 rounded-lg h-40 animate-pulse"
      ></div>
    ))}
  </div>
);

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
      No Courses Enrolled
    </h2>
    <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-md">
      You haven't enrolled in any course yet. Start learning now and grow your skills!
    </p>
  </div>
);
