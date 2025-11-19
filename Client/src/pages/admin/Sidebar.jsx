import { ChartBar, SquareLibrary, Users, } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { Link, Outlet } from "react-router-dom";

const Sidebar = () => {
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="flex flex-row">
      {/* <div className="flex overflow-y-hidden"> */}
      <div className="border-r w-40 h-screen">
        <div className="space-y-4 fixed p-5 h-screen">
          {user?.role === "Trainer" && (
            <>
              <Link to="dashboard" className="flex items-center gap-2">
                <ChartBar size={15} />
                <h1>Dashboard</h1>
              </Link>
              <Link to="course" className="flex items-center gap-2">
                <SquareLibrary size={15} />
                <h1>Courses</h1>
              </Link>
            </>
          )}

          {user?.role === "Admin" && (
            <>
              <Link to="dashboard" className="flex items-center gap-2">
                <ChartBar size={15} />
                <h1>Analytics</h1>
              </Link>

              <Link to="manage-users" className="flex items-center gap-2">
                <Users size={15} />
                <h1>Manage Users</h1>
              </Link>

              <Link to="manage-courses" className="flex items-center gap-2">
                <SquareLibrary size={15} />
                <h1>Manage Courses</h1>
              </Link>
            </>
          )}
        </div>
        {/* </div> */}
      </div>
      <div className="flex-1 mx-auto p-10">
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;
