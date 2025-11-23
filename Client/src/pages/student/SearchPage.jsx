import React, { useEffect, useState } from "react";
import Filter from "./Filter";
import SearchResult from "./SearchResult";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetSearchCourseQuery } from "@/features/api/courseApi";
import { Link, useSearchParams } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
// import LoadingSpinner from "@/components/LoadingSpinner";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import LoadingSpinner from "@/components/LoadingSpinner";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortByPrice, setSortByPrice] = useState("");

  const { data, isLoading } = useGetSearchCourseQuery({
    searchQuery: query,
    categories: selectedCategories,
    sortByPrice,
  });

  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    if (data?.courses) {
      setFilteredCourses(data.courses);
    }
  }, [data]);

  const handleFilterChange = (selectedCategories, price) => {
    if (!data?.courses) return;

    let filtered = [...data.courses]; // clone the original list

    if (selectedCategories.length > 0) {
      const lowerCaseCategories = selectedCategories.map((cat) => cat.toLowerCase());

      filtered = filtered.filter((course) =>
        lowerCaseCategories.some((cat) =>
          (course.category?.toLowerCase().includes(cat)) ||
          (course.courseTitle?.toLowerCase().includes(cat)) ||
          (course.description?.toLowerCase().includes(cat)) ||
          (course.subTitle?.toLowerCase().includes(cat))
        )
      );
    }

    setFilteredCourses(filtered);
    setSortByPrice(price);
  };


  if (isLoading) return <LoadingSpinner />;
  const isEmpty = !isLoading && filteredCourses?.length === 0;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="my-6">
        {query && (
          <h1 className="font-bold text-xl md:text-2xl">
            Result for{" "}
            <span className="text-blue-800 dark:text-blue-500 font-bold italic">{query}</span>
          </h1>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-5">
          <Filter handleFilterChange={handleFilterChange} />
        <Separator orientation="vertical" />
        <Card className="flex-1 bg-white dark:bg-gray-700 border p-5 rounded-lg shadow">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <CourseSkeleton key={idx} />
            ))
          ) : isEmpty ? (
            <CourseNotFound />
          ) : (
            filteredCourses?.map((course) => (
              <SearchResult key={course._id} course={course} />
            ))
          )}
        </Card>
      </div>
    </div>
  );
};

export default SearchPage;

const CourseNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-32 p-6">
      <AlertCircle className="text-red-500 h-16 w-16 mb-4" />
      <h1 className="font-bold text-2xl md:text-4xl text-gray-800 dark:text-gray-200 mb-2">
        Course Not Found
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
        Sorry, we couldn't find the course you're looking for.
      </p>
      <Link to="/">
        <Button className=" text-blue-500 rounded-full">Browse All Courses</Button>
      </Link>
    </div>
  );
};

const CourseSkeleton = () => {
  return (
    <div className="flex-1 flex flex-col md:flex-row justify-between border-b border-gray-300 py-4">
      <div className="h-32 w-full md:w-64">
        <Skeleton className="h-full w-full object-cover" />
      </div>

      <div className="flex flex-col gap-2 flex-1 px-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-1/3" />
        </div>
        <Skeleton className="h-6 w-20 mt-2" />
      </div>

      <div className="flex flex-col items-end justify-between mt-4 md:mt-0">
        <Skeleton className="h-6 w-12" />
      </div>
    </div>
  );
};
