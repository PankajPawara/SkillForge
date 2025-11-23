import LoadingSpinner from "@/components/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetPublishedCreatorCoursesQuery } from "@/features/api/courseApi";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const Dashboard = () => {
  const { data, isLoading, isError } = useGetPublishedCreatorCoursesQuery();

  if (isLoading) return <LoadingSpinner />;

  const { publishedCourses = [], soldCourses = [] } = data || {};

  const courseData =
    soldCourses?.map((course) => ({
      name: course.courseId.courseTitle,
      price: course.courseId.coursePrice,
    })) || [];

  const totalRevenue = soldCourses?.reduce(
    (acc, item) => acc + (item.amount || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard title="Total Courses" value={publishedCourses.length} />
        <StatCard title="Total Sales" value={soldCourses.length} />
        <StatCard title="Total Revenue" value={`₹ ${totalRevenue || 0}`} />
      </div>

      {/* Line Chart */}
      <Card className=" bg-white dark:bg-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 w-full">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Course Prices</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="w-full h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={courseData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--chart-grid)" // theme-aware
                />
                <XAxis
                  dataKey="name"
                  stroke="gray"
                  angle={-30}
                  interval={0}
                  textAnchor="end"
                />
                <YAxis stroke="gray" />
                <Tooltip
                  wrapperStyle={{
                    backgroundColor: "var(--tooltip-bg)",
                    color: "black",
                    borderRadius: "6px",
                    padding: "6px 10px",
                  }}
                  formatter={(value, name) => [`₹${value}`, name]}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="gray"
                  strokeWidth={3}
                  dot={{
                    stroke: "blue",
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <Card className=" bg-white dark:bg-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center w-full">
    <CardHeader>
      <CardTitle className="text-lg font-semibold">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-3xl font-bold text-blue-900 dark:text-blue-500">
        {value}
      </p>
    </CardContent>
  </Card>
);

export default Dashboard;
