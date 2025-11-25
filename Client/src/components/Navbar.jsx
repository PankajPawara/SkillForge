import { ChartBar, Info, LogOut, LucideLayoutDashboard, LucidePlaySquare, Menu, School, SquareLibrary, User, Users } from "lucide-react";
import React, { useEffect } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import DarkMode from "@/DarkMode";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation, useLoadUserQuery } from "@/features/api/authApi.js";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import LoadingSpinner from "./LoadingSpinner";

const Navbar = () => {

    const { data: userData, isLoading } = useLoadUserQuery();
    const { user } = useSelector((store) => store.auth);

    const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        await logoutUser();
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message || "Logged out successfully");
            navigate("/login");
        }
    }, [isSuccess]);


    // Block navbar UI until user loads (prevents redirect issues)
    if (isLoading) {
        return (
            <div className="h-16 flex items-center justify-center bg-gray-100 dark:bg-gray-700 shadow-lg">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="h-16 dark:bg-gray-700 bg-gray-100 shadow-lg fixed top-0 left-0 right-0 duration-300 z-10">
            <div className="max-w-7xl mx-auto flex justify-between items-center gap-10 h-full p-4">

                {/* Logo */}
                <div>
                    <Link to="/" className="flex flex-row items-center gap-2 cursor-pointer">
                        <School size={30} />
                        <h1 className="font-extrabold text-2xl">SkillForge</h1>
                    </Link>
                </div>

                {/* Icons */}
                <div className="flex items-center gap-2">
                    <DarkMode />

                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Avatar className="h-10 w-10 cursor-pointer">
                                    <AvatarImage src={user?.photoUrl || "https://github.com/shadcn.png"} />
                                    <AvatarFallback>SN</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="w-45 bg-white dark:bg-gray-800" align="end">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />

                                <DropdownMenuGroup>

                                    <DropdownMenuItem onClick={() => navigate("/profile")}
                                        className="flex items-center gap-2 cursor-pointer">
                                        <User size={15} /> My Profile
                                    </DropdownMenuItem>

                                    {user?.role === "Admin" && (
                                        <DropdownMenuItem onClick={() => navigate("/admin/dashboard")}
                                            className="flex items-center gap-2 cursor-pointer">
                                            <LucideLayoutDashboard size={15} /> Dashboard
                                        </DropdownMenuItem>
                                    )}

                                    {user?.role === "Trainer" && (
                                        <DropdownMenuItem onClick={() => navigate("/trainer/dashboard")}
                                            className="flex items-center gap-2 cursor-pointer">
                                            <LucideLayoutDashboard size={15} /> Dashboard
                                        </DropdownMenuItem>
                                    )}

                                    {user?.enrolledCourses > 0 && (
                                        <DropdownMenuItem onClick={() => navigate("/my-learning")}
                                            className="flex items-center gap-2 cursor-pointer">
                                            <LucidePlaySquare size={15} /> My Learning
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuGroup>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem onClick={() => navigate("/about")}
                                    className="flex items-center gap-2 cursor-pointer">
                                    <Info size={15} /> About
                                </DropdownMenuItem>

                                <DropdownMenuItem onClick={logoutHandler}
                                    className="flex items-center gap-2 cursor-pointer">
                                    <LogOut size={15} /> Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button variant="outline" onClick={() => navigate("/login")}>Login</Button>
                            <Button onClick={() => navigate("/signup")} className="hidden md:flex">Signup</Button>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
};

export default Navbar;
