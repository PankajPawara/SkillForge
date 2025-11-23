import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
  useUpdateUserMutation,
} from "@/features/api/adminApi";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Loader2, Pencil, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card } from "@/components/ui/card";
import LoadingSpinner from "@/components/LoadingSpinner";

const ManageUsers = () => {
  const { data, isLoading, refetch } = useGetAllUsersQuery();

  const [updateUser, { isLoading: updateUserIsLoading }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const [editUser, setEditUser] = useState(null);

  const handleDelete = async (userId) => {
    if (confirm("Are you sure you want to delete this user?")) {
      await deleteUser(userId);
      toast.success("User deleted");
      refetch();
    }
  };

  const handleUpdateUser = async () => {
    try {
      await updateUser({
        userId: editUser._id,
        payload: {
          name: editUser.name,
          email: editUser.email,
          mobile: editUser.mobile,
          role: editUser.role,
        },
      }).unwrap();

      toast.success("User updated successfully");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update user");
    }
  };

  if (isLoading)
    return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Manage Users</h1>

      <Card className="p-6 bg-white dark:bg-gray-700 shadow-sm rounded-xl">
        {/* Table wrapper for horizontal scroll on mobile */}
        <div className="w-full overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center w-24">Profile</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-center w-40">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data?.users.map((user) => (
                <TableRow key={user._id}>
                  {/* Avatar */}
                  <TableCell className="text-center">
                    <Avatar className="h-10 w-10 mx-auto">
                      <AvatarImage
                        src={user?.photoUrl || "https://github.com/shadcn.png"}
                      />
                      <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </TableCell>

                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.mobile}</TableCell>
                  <TableCell>{user.role}</TableCell>

                  {/* Actions */}
                  <TableCell className="flex justify-center items-center gap-2 py-4">

                    {/* Edit Dialog */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => setEditUser(user)}
                          className="flex gap-1 hover:bg-gray-700 dark:hover:bg-gray-400"
                        >
                          <Pencil size={16} /> Edit
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="bg-white dark:bg-gray-700">
                        <DialogHeader>
                          <DialogTitle>Edit User</DialogTitle>
                          <DialogDescription>
                            Modify the user details below.
                          </DialogDescription>
                        </DialogHeader>

                        {editUser && (
                          <div className="grid gap-4 py-4 ">
                            <div className="grid grid-cols-4 items-center gap-2">
                              <Label>Name</Label>
                              <Input
                                value={editUser.name}
                                onChange={(e) =>
                                  setEditUser({ ...editUser, name: e.target.value })
                                }
                                className="col-span-3"
                              />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-2">
                              <Label>Mobile</Label>
                              <Input
                                value={editUser.mobile}
                                onChange={(e) =>
                                  setEditUser({ ...editUser, mobile: e.target.value })
                                }
                                className="col-span-3"
                              />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-2">
                              <Label>Email</Label>
                              <Input
                                value={editUser.email}
                                onChange={(e) =>
                                  setEditUser({ ...editUser, email: e.target.value })
                                }
                                className="col-span-3"
                              />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-2">
                              <Label>Role</Label>
                              <Select
                                value={editUser.role}
                                onValueChange={(value) =>
                                  setEditUser({ ...editUser, role: value })
                                }
                              >
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>

                                <SelectContent>
                                  <SelectGroup>
                                    <SelectItem value="Student">Student</SelectItem>
                                    <SelectItem value="Trainer">Trainer</SelectItem>
                                    <SelectItem value="Admin">Admin</SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}

                        <DialogFooter>
                          <Button
                            onClick={handleUpdateUser}
                            disabled={updateUserIsLoading}
                            className="w-full"
                          >
                            {updateUserIsLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              "Save Changes"
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {/* Delete Button */}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(user._id)}
                      className="flex gap-1 bg-red-600 dark:bg-red-700  hover:bg-red-700 dark:hover:bg-red-800"
                    >
                      <Trash2 size={16} /> Delete
                    </Button>

                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default ManageUsers;
