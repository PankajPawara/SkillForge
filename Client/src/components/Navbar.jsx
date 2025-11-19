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
        <div className="h-16 dark:bg-[#020817] bg-orange-300 fixed top-0 left-0 right-0 duration-300 z-10">
            {/* Desktop */}
            <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full p-4">
                <div>
                    <Link to="/" className="flex flex-row items-center gap-2">
                    <School size={"30"} />
                        <h1 className="hidden md:block font-extrabold text-2xl">SkillForge </h1>
                    </Link>
                </div>
                {/* User icons and Dark mode icon */}
                <div className='flex items-center gap-2'>
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
                                <DropdownMenuContent className="w-45">
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
                                <Button onClick={() => navigate("/login")}>Signup</Button>
                            </div>
                        )
                    }
                    <DarkMode />
                </div>
            </div>
            {/* Mobile device  */}
            <div className="flex md:hidden items-center justify-between px-4 h-full">
                <h1 className="font-extrabold text-2xl">SkillForge</h1>
                <MobileNavbar user={user} />
            </div>
        </div>
    );
};
const MobileNavbar = ({ user }) => {
    const navigate = useNavigate();
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    size="icon"
                    className="rounded-full hover:bg-gray-200"
                    variant="outline"
                >
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col">
                <SheetHeader className="flex flex-row items-center justify-between mt-5">
                    <SheetTitle className={"flex flex-row gap-1 items-center"}>
                        <School size={"20"} />
                        <Link to="/"><h1 className="text-lg font-bold">SkillForge</h1></Link>
                    </SheetTitle>
                    <DarkMode />
                </SheetHeader>
                <Separator className="border shadow"/>
                <Separator className="mr-2" />
                <nav className="flex  flex-col space-y-4">
                    <div className="flex justify-center ">
                        <Avatar className="h-20 w-20">
                            <AvatarImage
                                src={user?.photoUrl || "https://github.com/shadcn.png"}
                                alt="@shadcn" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </div>
                    <Separator className="mr-5 border" />
                    <Link to="profile" className="flex items-center gap-2">
                        <User size={15} /><h1>My Profile</h1>
                    </Link>
                    {user?.role === "Admin" && (<>
                        <Link to="admin/dashboard" className="flex items-center gap-2">
                            <LucideLayoutDashboard size={15} /><h1>Dashboard</h1>
                        </Link>
                    </>)}
                    {user?.role === "Trainer" && (<>
                        <Link to="trainer/dashboard" className="flex items-center gap-2">
                            <LucideLayoutDashboard size={15} />Dashboard
                        </Link>
                    </>)}
                    {user?.role != "Admin" && (<>
                        <Link to="my-learning" className="flex items-center gap-2">
                            <LucideTvMinimalPlay size={15} />My Learning
                        </Link>
                    </>)}
                    <Separator className="mr-2 border" />
                    <Link to="about" className="flex items-center gap-2">
                        <Info size={15} />About
                    </Link>
                </nav>
                <SheetFooter>
                    <Button className="text-bold" variant={"destructive"}
                        onClick={async () => {
                            await logoutUser();
                            navigate("/login");
                        }}>
                        <LogOut size={15} />Log out
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};
export default Navbar;

