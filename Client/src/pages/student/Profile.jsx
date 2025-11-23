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
import { Loader2, Pencil } from "lucide-react";
import React, { useEffect, useState } from "react";
import Course from "./Course";
import {
  useLoadUserQuery,
  useUpdateUserMutation,
} from "@/features/api/authApi";
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

const Profile = () => {
  const [input, setInput] = useState({
    name: "",
    mobile: "",
    email: "",
    role: "",
  });

  const [profilePhoto, setProfilePhoto] = useState(null);

  const { data, isLoading, refetch } = useLoadUserQuery();

  useEffect(() => {
    if (data?.user) {
      const user = data.user;
      setInput({
        name: user.name,
        mobile: user.mobile,
        email: user.email,
        role: user.role,
      });
    }
  }, [data]);

  const [updateUser, { isLoading: updateUserIsLoading, isSuccess, isError, error }] =
    useUpdateUserMutation();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectRole = (value) => {
    setInput({ ...input, role: value });
  };

  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePhoto(file);
  };

  const updateUserHandler = async () => {
    const formData = new FormData();
    Object.keys(input).forEach((key) => formData.append(key, input[key]));
    if (profilePhoto) formData.append("profilePhoto", profilePhoto);

    await updateUser(formData);
  };

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success("Profile updated successfully!");
    }
    if (isError) {
      toast.error(error?.message || "Failed to update profile");
    }
  }, [isSuccess, isError, error]);

  if (isLoading) return <div className="text-center p-8">Loading...</div>;

  const user = data?.user;

  return (
    <div className="items-center max-w-7xl mx-auto px-4 my-5">
      <h1 className="font-bold text-3xl text-center mb-5">MY PROFILE</h1>

      <Card className="flex flex-col justify-center md:flex-row bg-gray-200 dark:bg-gray-800 items-center gap-8 p-6 rounded-lg border">
        
        {/* Avatar + Change Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Avatar className="h-32 w-32 md:h-40 md:w-40 cursor-pointer object-cover shadow-md hover:scale-105 transition-all">
              <AvatarImage
                src={user?.photoUrl || "https://github.com/shadcn.png"}
                alt="profile"
              />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Profile Photo</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>

            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-28 w-28">
                <AvatarImage
                  src={user?.photoUrl || "https://github.com/shadcn.png"}
                  alt="profile"
                />
              </Avatar>

              <div className="w-full">
                <Label>Choose Photo</Label>
                <Input type="file" accept="image/*" onChange={onChangeHandler} />
              </div>
            </div>

            <DialogFooter>
              <Button disabled={updateUserIsLoading} onClick={updateUserHandler}>
                {updateUserIsLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                  </>
                ) : (
                  "Update Photo"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* User Details */}
        <div className="flex flex-col gap-3 w-full md:w-auto">
          <p className="text-lg font-semibold">
            Name: <span className="font-normal">{user?.name}</span>
          </p>
          <p className="text-lg font-semibold">
            Mobile: <span className="font-normal">{user?.mobile}</span>
          </p>
          <p className="text-lg font-semibold">
            Email: <span className="font-normal">{user?.email}</span>
          </p>
          <p className="text-lg font-semibold">
            Role: <span className="font-normal">{user?.role?.toUpperCase()}</span>
          </p>

          {/* Edit Profile Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="flex gap-2 w-fit mt-2">
                <Pencil className="h-4 w-4" /> Edit Profile
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Update your profile details and click Save.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4">
                <div>
                  <Label>Name</Label>
                  <Input name="name" value={input.name} onChange={changeEventHandler} />
                </div>
                <div>
                  <Label>Mobile</Label>
                  <Input
                    name="mobile"
                    maxLength={10}
                    value={input.mobile}
                    onChange={changeEventHandler}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input name="email" value={input.email} onChange={changeEventHandler} />
                </div>
                <div>
                  <Label>Role</Label>
                  <Select value={input.role} onValueChange={selectRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Student">Student</SelectItem>
                        <SelectItem value="Trainer">Trainer</SelectItem>
                        {user.role === "Admin" && (
                          <SelectItem value="Admin">Admin</SelectItem>
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button disabled={updateUserIsLoading} onClick={updateUserHandler}>
                  {updateUserIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
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

      {/* Enrolled Courses */}
      {user.role !== "Admin" && (
        <div className="mt-10">
          <h1 className="text-center text-lg font-bold mb-6">MY ENROLLED COURSES</h1>

          <Card className=" bg-gray-200 dark:bg-gray-800">
            <CardContent className="p-4">
              {user.enrolledCourses.length === 0 ? (
                <p className="text-center py-6">You haven’t enrolled in any course yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {user.enrolledCourses.map((course) => (
                    <Course key={course._id} course={course} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Profile;
