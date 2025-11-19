import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, Loader2, Pencil } from "lucide-react";
import React, { useEffect, useState } from "react";
import Course from "./Course";
import {
  useLoadUserQuery,
  useUpdateUserMutation,
} from "@/features/api/authApi";
import { toast } from "react-toastify";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

const Profile = () => {
  const [input, setInput] = useState({
    name: "",
    mobile: "",
    email: "",
    role: "",
    photoUrl: "",
  });
  const [profilePhoto, setProfilePhoto] = useState("");

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const selectRole = (value) => {
    setInput({ ...input, role: value });
  };

  const { data, isLoading, refetch } = useLoadUserQuery();
  {
    if (isLoading) {
      refetch();
    }
  }
  useEffect(() => {
    refetch();
  })
  console.log("Loaded User Data:", data);

  useEffect(() => {
    if (data?.user) {
      const user = data?.user;
      setInput({
        name: user.name,
        mobile: user.mobile,
        email: user.email,
        role: user.role,
        photoUrl: "",
      });
    }
  }, [data]);

  const [
    updateUser,
    {
      data: updateUserData,
      isLoading: updateUserIsLoading,
      isError,
      error,
      isSuccess,
    },
  ] = useUpdateUserMutation();


  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePhoto(file);
  };

  const updateUserHandler = async () => {
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("mobile", input.mobile);
    formData.append("email", input.email);
    formData.append("role", input.role);
    formData.append("profilePhoto", profilePhoto);

    console.log("FormData sent:", [...formData]);
    await updateUser(formData);

  };

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success(data.message || "Profile updated.");
    }
    if (isError) {
      toast.error(error.message || "Failed to update profile");
    }
  }, [error, updateUserData, isSuccess, isError]);

  if (isLoading) return refetch(), <LoadingSpinner />;

  const user = data && data.user;

  // console.log(user);

  return (
    <div className="items-center max-w-7xl mx-auto px-4 my-5">
      <h1 className="font-bold text-3xl text-center mb-5">MY PROFILE</h1>
      <Card className="flex lg:flex-row md:flex-row sm:flex-col justify-center gap-8 p-2 rounded border">
        <div className="items-center">
          <Dialog>
            <DialogTrigger asChild>
              <Avatar className="h-46 w-46">
                <AvatarImage
                  src={user?.photoUrl || "https://github.com/shadcn.png"}
                  alt="@shadcn"
                />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Change Profile</DialogTitle>
                <DialogDescription>
                </DialogDescription>
              </DialogHeader>
              <div className="justify-center">
                <Avatar className="lg:h-100 lg:w-100 md:h-50 md:w-50 sm:h-50 sm:w-50 ml-7">
                  <AvatarImage
                    src={user?.photoUrl || "https://github.com/shadcn.png"}
                    alt="@shadcn"
                  />
                </Avatar>

                <div className="flex flex-row gap-4">
                  <Label className={"w-30"}>Choose Photo</Label>
                  <Input
                    onChange={onChangeHandler}
                    type="file"
                    accept="image/*"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  disabled={updateUserIsLoading}
                  onClick={updateUserHandler}
                >
                  {updateUserIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                      wait
                    </>
                  ) : (
                    "Update Photo"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </div>
        <div className="mt-4">
          <div>
            <h1 className="font-semibold text-gray-900 dark:text-gray-100 ">
              Name:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user.name}
              </span>
            </h1>
          </div>
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100 ">
              Mobile No:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user.mobile}
              </span>
            </h1>
          </div>
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100 ">
              Email:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user.email}
              </span>
            </h1>
          </div>
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100 ">
              Role:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user.role.toUpperCase()}
              </span>
            </h1>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="mt-2 mb-2">
                <Pencil />
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col justify-between gap-4 p-5">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    type="text"
                    name="name"
                    value={input.name}
                    onChange={changeEventHandler}
                    placeholder="Name"
                    className="col-span-3"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Mobile</Label>
                  <Input
                    type="tel"
                    name="mobile"
                    maxLength={10}
                    value={input.mobile}
                    onChange={changeEventHandler}
                    placeholder="9876543210"
                    className="col-span-3"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="text"
                    name="email"
                    value={input.email}
                    onChange={changeEventHandler}
                    placeholder="abc@gmail.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select
                    value={input.role}
                    onValueChange={selectRole}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Student">Student</SelectItem>
                        <SelectItem value="Trainer">Trainer</SelectItem>
                        {
                          user.role === "Admin" && (
                            <SelectItem value="Admin">Admin</SelectItem>
                          )
                        }
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  disabled={updateUserIsLoading}
                  onClick={updateUserHandler}
                >
                  {updateUserIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                      wait
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </Card>
      {
        user.role !== "Admin" && (
          <div>
            <h1 className="text-center text-lg font-bold my-8">MY ENROLLED COURSES</h1>
            <Card >
              {user.enrolledCourses.length === 0 ? (
                <h1>You haven't enrolled yet</h1>
              ) : (
                <>
                  <CardContent className="grid grid-cols-1 lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {user.enrolledCourses.map((course) => (
                      <Course course={course} key={course._id} />
                    ))}
                  </CardContent>
                </>
              )}
            </Card>
          </div>
        )
      }
    </div>
  );
};

export default Profile;