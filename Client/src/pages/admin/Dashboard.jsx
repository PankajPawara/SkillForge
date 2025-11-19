import LoadingSpinner from "@/components/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetPublishedCreatorCoursesQuery } from "@/features/api/courseApi";
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {

  const { data, isLoading, isError } = useGetPublishedCreatorCoursesQuery();

  if (isLoading) return <LoadingSpinner />
  // if (isError) return <CourseNotFound />
  // console.log(data);

  const { publishedCourses, soldCourses } = data || [];

  const courseData = soldCourses?.map((course) => ({
    name: course.courseId.courseTitle,
    price: course.courseId.coursePrice
  }))

  const totalRevenue = soldCourses?.reduce((acc, element) => acc + (element.amount || 0), 0);
  const totalPublishedCourses = publishedCourses?.length;
  const totalSales = soldCourses?.length;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-col md:flex-row lg:flex-row gap-5">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 text-center w-full">
          <CardHeader>
            <CardTitle>Total Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{totalPublishedCourses || 0}</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 text-center w-full">
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{totalSales || 0}</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 text-center w-full">
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">₹ {totalRevenue || 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Course Prices Card */}
      <div className="w-full">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 w-full">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Course Prices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={courseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  stroke="#6b7280"
                  angle={-30} // Rotated labels for better visibility
                  textAnchor="end"
                  interval={0} // Display all labels
                />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  wrapperStyle={{
                    backgroundColor: "#fff",
                    color: "#000",
                  }}
                  formatter={(value, name) => [`₹${value}`, name]} />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#4a90e2" // Changed color to a different shade of blue
                  strokeWidth={3}
                  dot={{ stroke: "#4a90e2", strokeWidth: 2 }} // Same color for the dot
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
