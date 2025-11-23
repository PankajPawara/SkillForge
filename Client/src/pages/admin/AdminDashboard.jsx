import React from "react";
import { useGetAdminStatsQuery } from "@/features/api/adminApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingSpinner from "@/components/LoadingSpinner";

const AdminDashboard = () => {
  const { data, isLoading } = useGetAdminStatsQuery();

  if (isLoading) return <LoadingSpinner />;

  const { totalUsers = {}, totalCourses = {}, revenue = 0, totalEnrollment = 0 } = data || {};
  const totalUser = (totalUsers.admins || 0) + (totalUsers.students || 0) + (totalUsers.trainers || 0);

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center">Analytics</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">

        {/* Total Users */}
        <Card className="shadow-lg bg-white dark:bg-gray-700 hover:shadow-xl transition-all text-center">
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-4">
              {totalUser}
            </p>

            <div className="flex justify-center gap-8 text-left">
              <StatItem label="Admins" value={totalUsers.admins} />
              <StatItem label="Students" value={totalUsers.students} />
              <StatItem label="Trainers" value={totalUsers.trainers} />
            </div>
          </CardContent>
        </Card>

        {/* Total Courses */}
        <Card className="shadow-lg bg-white dark:bg-gray-700 hover:shadow-xl transition-all text-center">
          <CardHeader>
            <CardTitle>Total Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center gap-10">
              <StatItem label="Published" value={totalCourses.published} />
              <StatItem label="Unpublished" value={totalCourses.unpublished} />
            </div>
          </CardContent>
        </Card>

        {/* Revenue */}
        <Card className="shadow-lg bg-white dark:bg-gray-700 hover:shadow-xl transition-all text-center">
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              ₹ {revenue || 0}
            </p>
          </CardContent>
        </Card>

        {/* Total Enrollments */}
        <Card className="shadow-lg bg-white dark:bg-gray-700 hover:shadow-xl transition-all text-center">
          <CardHeader>
            <CardTitle>Total Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              {totalEnrollment || 0}
            </p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

const StatItem = ({ label, value }) => (
  <div className="flex flex-col items-center">
    <span className="text-sm text-gray-600 dark:text-gray-300">{label}</span>
    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
      {value || 0}
    </span>
  </div>
);

export default AdminDashboard;
