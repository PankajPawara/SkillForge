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
import React, { useEffect, useState } from "react";
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

const ManageUsers = () => {
  const { data, isLoading, refetch } = useGetAllUsersQuery();
  const [updateUser, { isLoading: updateUserIsLoading }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [editUser, setEditUser] = useState(null);

  const handleDelete = async (userId) => {
    if (confirm("Are you sure?")) {
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

  if (isLoading) return <p className="text-center mt-6">Loading users...</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 my-5">
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
      <Card className="p-10">
        <Card className={"w-full flex justify-center"}>
          <Table className="w-full shadow rounded mx-auto">
            <TableHeader >
              <TableRow className={"text-center"}>
                <TableHead className={"text-center"}>Profile</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className={"text-center"}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className={"mx-auto"}>
              {data?.users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className={"text-center"}>
                    <Avatar className="h-10 w-10 mx-auto">
                      <AvatarImage
                        src={user?.photoUrl || "https://github.com/shadcn.png"}
                        alt="@shadcn"
                      />
                      <AvatarFallback>A</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.mobile}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell className="space-x-2 text-center">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => setEditUser(user)}
                        >
                          <Pencil size={16} />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit User</DialogTitle>
                          <DialogDescription>
                            Update user details below and save.
                          </DialogDescription>
                        </DialogHeader>

                        {editUser && (
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-2">
                              <Label>Name</Label>
                              <Input
                                type="text"
                                value={editUser.name}
                                onChange={(e) =>
                                  setEditUser({ ...editUser, name: e.target.value })
                                }
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label>Mobile</Label>
                              <Input
                                type="text"
                                value={editUser.mobile}
                                onChange={(e) =>
                                  setEditUser({ ...editUser, mobile: e.target.value })
                                }
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label>Email</Label>
                              <Input
                                type="text"
                                value={editUser.email}
                                onChange={(e) =>
                                  setEditUser({ ...editUser, email: e.target.value })
                                }
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label>Role</Label>
                              <Select
                                value={editUser.role}
                                onValueChange={(value) =>
                                  setEditUser({ ...editUser, role: value })
                                }
                              >
                                <SelectTrigger className="w-[350px]">
                                  <SelectValue />
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
                            disabled={updateUserIsLoading}
                            onClick={handleUpdateUser}
                          >
                            {updateUserIsLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                              </>
                            ) : (
                              "Save Changes"
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(user._id)}
                    >
                      <Trash2 size={16} />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </Card>
    </div>
  );
};

export default ManageUsers;
