import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useLoginUserMutation, useRegisterUserMutation } from "@/features/api/authApi";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Login = () => {
  const [signupInput, setSignupInput] = useState({
    name: "",
    mobile: "",
    email: "",
    role: "Student",
    createPassword: "",
    confirmPassword: "",
  });

  const [loginInput, setLoginInput] = useState({
    username: "",
    password: "",
  });

  const [
    registerUser,
    { data: registerData,
      error: registerError,
      isLoading: registerIsLoading,
      isSuccess: registerIsSuccess },
  ] = useRegisterUserMutation();

  const [
    loginUser,
    { data: loginData,
      error: loginError,
      isLoading: loginIsLoading,
      isSuccess: loginIsSuccess },
  ] = useLoginUserMutation();

  const changeInputHandler = (e, type) => {
    const { name, value } = e.target;
    if (type === "signup") {
      setSignupInput({ ...signupInput, [name]: value });
    } else {
      setLoginInput({ ...loginInput, [name]: value });
    }
  };

  const selectRole = (value) => {
    setSignupInput({ ...signupInput, role: value });
  };

  const navigate = useNavigate();
  const handleRegistration = async (type) => {
    const inputData = type === "signup" ? signupInput : loginInput;

    if (type === "signup" && signupInput.createPassword !== signupInput.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const action = type === "signup" ? registerUser : loginUser;
    await action(inputData);
  };

  useEffect(() => {
    if (registerIsSuccess && registerData) {
      toast.success(registerData.message || "Signup Successful.");
    }

    if (registerError) {
      toast.error(registerError.data?.message || "Signup failed.");
    }

    if (loginIsSuccess && loginData) {
      toast.success(loginData.message || "Login Successful.");
      navigate("/");
    }

    if (loginError) {
      toast.error(loginError.data?.message || "Login failed.");
    }
  }, [
    registerIsSuccess,
    registerError,
    registerData,
    loginIsSuccess,
    loginError,
    loginData,
    navigate
  ]);


  return (
    <div className="flex items-center justify-center mt-10 md:mt-20 mb-30">
      <Tabs defaultValue="login" className="w-[90vw] md:w-[40vw]">
        <TabsList className="w-full bg-white dark:bg-gray-700">
          <TabsTrigger value="signup">Signup</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>

        {/* SIGNUP FORM */}
        <TabsContent value="signup" className="">
          <Card className=" bg-white dark:bg-gray-700">
            <CardHeader>
              <CardTitle>Signup</CardTitle>
              <CardDescription>
                Please fill all the details & click on signup to continue...
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input
                  name="name"
                  value={signupInput.name}
                  onChange={(e) => changeInputHandler(e, "signup")}
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="mobile">Mobile No.</Label>
                <Input
                  maxLength={10}
                  type="tel"
                  name="mobile"
                  value={signupInput.mobile}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d{0,10}$/.test(value)) {
                      changeInputHandler(e, "signup");
                    }
                  }}
                  placeholder="ex. 9876543210"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={signupInput.email}
                  onChange={(e) => changeInputHandler(e, "signup")}
                  placeholder="ex. abc@gmail.com"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label>Role</Label>
                <Select value={signupInput.role} onValueChange={selectRole}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Role</SelectLabel>
                      <SelectItem value="Student">Student</SelectItem>
                      <SelectItem value="Trainer">Trainer</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="createPassword">Create Password</Label>
                <Input
                  type="password"
                  id="createPassword"
                  name="createPassword"
                  value={signupInput.createPassword}
                  onChange={(e) => changeInputHandler(e, "signup")}
                  placeholder="Create password"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={signupInput.confirmPassword}
                  onChange={(e) => changeInputHandler(e, "signup")}
                  placeholder="Confirm Password"
                  required
                />
              </div>
              {registerError && (
                <p className="text-sm text-red-500">
                  {registerError.data?.message || "Signup failed"}
                </p>
              )}
            </CardContent>
            <CardFooter>
              <Button className="bg-blue-700 w-full text-white hover:bg-blue-800"
                disabled={registerIsLoading}
                onClick={() => handleRegistration("signup")}>
                {registerIsLoading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" /> Please wait...
                  </>
                ) : (
                  "Signup"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* LOGIN FORM */}
        <TabsContent value="login" className="mb-10">
          <Card className=" bg-white dark:bg-gray-700">
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Welcome back! Please login to continue...
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 ">
              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  name="username"
                  value={loginInput.username}
                  onChange={(e) => changeInputHandler(e, "login")}
                  placeholder="Email or Mobile No."
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  value={loginInput.password}
                  onChange={(e) => changeInputHandler(e, "login")}
                  placeholder="Enter your password"
                  required
                />
              </div>
              {loginError && (
                <p className="text-sm text-red-500">
                  {loginError.data?.message || "Login failed"}
                </p>
              )}
            </CardContent>
            <CardFooter>
              <Button className="text-white w-full bg-green-600 hover:bg-green-700"
                disabled={loginIsLoading} onClick={() => handleRegistration("login")}>
                {loginIsLoading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" /> Please wait...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Login;
