import { ChartBar, SquareLibrary, Users } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { Link, Outlet } from "react-router-dom";

const Sidebar = () => {
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="flex min-h-screen border-t pt-1">

      {/* SIDEBAR */}
      <aside
        className="
          md:w-48 w-full
          border-r 
          flex flex-col 
          items-center
          px-auto py-1
          md:p-5 
          space-y-4 
          bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
          shadow-lg
          fixed 
          left-0 
          md:h-screen
          z-10
        "
      >
        {user?.role === "Trainer" && (
          <div className="flex flex-row md:flex-col gap-4">
            <Link to="dashboard" className="flex flex-col md:flex-row items-center md:gap-2 hover:text-blue-400">
              <ChartBar size={16} />
              <span>Dashboard</span>
            </Link>

            <Link to="course" className="flex flex-col md:flex-row items-center md:gap-2 hover:text-blue-400">
              <SquareLibrary size={16} />
              <span>Courses</span>
            </Link>
          </div>
        )}

        {user?.role === "Admin" && (
          <div className="flex flex-row md:flex-col gap-4">
            <Link to="dashboard" className="flex flex-col md:flex-row items-center md:gap-2 hover:text-blue-400">
              <ChartBar />
              <span>Analytics</span>
            </Link>

            <Link to="manage-users" className="flex flex-col md:flex-row items-center md:gap-2 hover:text-blue-400">
              <Users />
              <span>Manage Users</span>
            </Link>

            <Link to="manage-courses" className="flex flex-col md:flex-row items-center md:gap-2 hover:text-blue-400">
              <SquareLibrary />
              <span>Manage Courses</span>
            </Link>
          </div>
        )}
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-5 mt-12 md:mt-0 md:ml-48 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Sidebar;
