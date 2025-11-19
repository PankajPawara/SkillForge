import React, { useEffect } from "react";
import { useGetAdminStatsQuery } from "@/features/api/adminApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingSpinner from "@/components/LoadingSpinner";

const AdminDashboard = () => {
    const { data, isLoading, refetch } = useGetAdminStatsQuery();

    useEffect(() => {
        refetch();
    }, []);

    console.log("Admin Dashbard Data: ", data);

    if (isLoading) return <LoadingSpinner />;

    const { totalUsers, totalCourses, revenue, totalEnrollment } = data || {};
console.log("Total users",totalUsers);
    const totalUser=totalUsers.admins + totalUsers.students + totalUsers.trainers
    return (
        <div className="max-w-7xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Analytics</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                    <CardHeader>
                        <CardTitle>
                            Total Users<p className="text-3xl font-bold text-blue-600"> {totalUser || 0}</p>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className={"flex gap-10 justify-center"}>
                        <div className="flex items-center gap-2">
                            Admins:<p className="text-3xl font-bold text-blue-600"> {totalUsers?.admins || 0}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            Students:<p className="text-3xl font-bold text-blue-600"> {totalUsers?.students || 0}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            Trainers:<p className="text-3xl font-bold text-blue-600"> {totalUsers?.trainers || 0}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                    <CardHeader>
                        <CardTitle>Total Courses</CardTitle>
                    </CardHeader>
                    <CardContent className={"flex gap-10 justify-center flex items-center"}>
                        <div className="flex items-center gap-2">
                            Published:<p className="text-3xl font-bold text-blue-600"> {totalCourses?.published || 0}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            Unpublished:<p className="text-3xl font-bold text-blue-600"> {totalCourses?.unpublished || 0}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                    <CardHeader>
                        <CardTitle>Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-blue-600">₹ {revenue}</p>
                    </CardContent>
                </Card>

                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                    <CardHeader>
                        <CardTitle>Total Enrollments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-blue-600">{totalEnrollment}</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
