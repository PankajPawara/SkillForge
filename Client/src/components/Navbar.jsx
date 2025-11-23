import { ChartBar, Info, LogOut, LucideLayoutDashboard, LucidePlaySquare, LucideTvMinimalPlay, Menu, School, SquareLibrary, User, Users } from "lucide-react";
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
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "./ui/sheet";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation, useLoadUserQuery, } from "@/features/api/authApi.js";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Description } from "@radix-ui/react-dialog";
// import LoadingSpinner from "./LoadingSpinner";

const Navbar = () => {

    const { data: userData, isLoading, refetch } = useLoadUserQuery();

    const { user } = useSelector((store) => store.auth);
    const [logoutUser, { data, isSuccess, isLoading: logoutLoading }] = useLogoutUserMutation();
    const navigate = useNavigate();
    // const dispatch = useDispatch();

    const logoutHandler = async () => {
        await logoutUser();
    };

    useEffect(() => {
        if (isSuccess) {
            refetch();
            navigate("/login");
            toast.success(data?.message || "User log out.");
        }

    }, [isSuccess, userData]);

    // if (isLoading) return <LoadingSpinner />;
    return (
        <div className="h-16 dark:bg-gray-700 bg-gray-100 shadow-lg fixed top-0 left-0 right-0 duration-300 z-10">
            {/* Desktop */}
            <div className="max-w-7xl mx-auto flex justify-between items-center gap-10 h-full p-4">
                <div>
                    <Link to="/" className="flex flex-row items-center gap-2">
                        <School size={"30"} />
                        <h1 className="block font-extrabold text-2xl">SkillForge </h1>
                    </Link>
                </div>
                {/* User icons and Dark mode icon */}
                <div className='flex items-center gap-2'>
                    <DarkMode />
                    {
                        user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage
                                            src={user?.photoUrl || "https://github.com/shadcn.png"}
                                            alt="@shadcn" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-45 bg-white dark:bg-gray-800" align="end" side="bottom">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem>
                                            <Link to="profile" className="flex items-center gap-2">
                                                <User size={15} />
                                                <h1>My Profile</h1>
                                            </Link>
                                        </DropdownMenuItem>
                                        {user?.role === "Admin" && (
                                            <>
                                                <DropdownMenuItem>
                                                    <Link to="admin/dashboard" className="flex items-center gap-2">
                                                        <LucideLayoutDashboard size={15} />
                                                        <h1>Dashboard</h1>
                                                    </Link>
                                                </DropdownMenuItem>
                                            </>
                                        )}
                                        {
                                            user?.role === "Trainer" && (
                                                <>
                                                    <Link to="trainer/dashboard" className="flex items-center gap-2">
                                                        <DropdownMenuItem>
                                                            <LucideLayoutDashboard size={15} />
                                                            Dashboard
                                                        </DropdownMenuItem>
                                                    </Link>
                                                </>
                                            )
                                        }

                                        {
                                            user?.role != "Admin" && (
                                                <>
                                                    <DropdownMenuItem>
                                                        <Link to="my-learning" className="flex items-center gap-2">
                                                            <LucidePlaySquare size={15} />
                                                            My Learning
                                                        </Link>
                                                    </DropdownMenuItem>
                                                </>
                                            )
                                        }
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <Link to="about" className="flex items-center gap-2">
                                            <Info size={15} />
                                            About
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={logoutHandler}>
                                        <div className="flex items-center gap-2">
                                            <LogOut size={15} />
                                            Logout
                                        </div>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Button variant="outline" onClick={() => navigate("/login")}>
                                    Login
                                </Button>
                                <Button onClick={() => navigate("/login")} className="hidden md:flex">
                                    Signup
                                </Button>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default Navbar;

