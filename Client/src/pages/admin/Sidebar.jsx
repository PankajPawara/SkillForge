import { ChartBar, SquareLibrary, Users } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { Link, Outlet } from "react-router-dom";

const Sidebar = () => {
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="flex min-h-screen">

      {/* SIDEBAR */}
      <aside
        className="
          w-48 
          border-r 
          p-5 
          space-y-4 
          hidden 
          sm:block 
          bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
          shadow-lg
          fixed 
          left-0 
          h-screen
        "
      >
        {user?.role === "Trainer" && (
          <>
            <Link to="dashboard" className="flex items-center gap-2 hover:text-blue-600">
              <ChartBar size={16} />
              <span>Dashboard</span>
            </Link>

            <Link to="course" className="flex items-center gap-2 hover:text-blue-600">
              <SquareLibrary size={16} />
              <span>Courses</span>
            </Link>
          </>
        )}

        {user?.role === "Admin" && (
          <>
            <Link to="dashboard" className="flex items-center gap-2 hover:text-blue-600">
              <ChartBar size={16} />
              <span>Analytics</span>
            </Link>

            <Link to="manage-users" className="flex items-center gap-2 hover:text-blue-600">
              <Users size={16} />
              <span>Manage Users</span>
            </Link>

            <Link to="manage-courses" className="flex items-center gap-2 hover:text-blue-600">
              <SquareLibrary size={16} />
              <span>Manage Courses</span>
            </Link>
          </>
        )}
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-5 ml-48 sm:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Sidebar;
