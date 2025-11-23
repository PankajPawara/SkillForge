import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateTokens.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        const { name, mobile, email, role, createPassword, confirmPassword, } = req.body;
        if (!name || !mobile || !email || !role || !createPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            })
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exist with this email address."
            })
        }
        const user1 = await User.findOne({ mobile });
        if (user1) {
            return res.status(400).json({
                success: false,
                message: "User already exist with this mobile number."
            })
        }
        if (createPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match."
            });
        }

        const hashedPassword = await bcrypt.hash(confirmPassword, 10);
        await User.create({
            name,
            mobile,
            email,
            role,
            password: hashedPassword
        });
        return res.status(201).json({
            success: true,
            message: "Account created successfully."
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Registration failed."
        })
    }
}
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            })
        }

        const query = isNaN(username)
            ? { email: username }
            : { mobile: Number(username) };

        const user = await User.findOne(query);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Incorrect username."
            })
        }
        
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect password."
            })
        }
        generateToken(res,user);
        return res.status(200).json({
            success: true,
            message: `Welcome back ${user.name}`,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                role: user.role,
                photoUrl: user.photoUrl,
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Login failed."
        })
    }
}
export const logout = async (_, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to logout"
        })
    }
}
export const getUserProfile = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).select("-password").populate({ path: 'enrolledCourses', populate: { path: 'creator', select: 'name photoUrl' } })
        if (!user) {
            return res.status(404).json({
                message: "Profile not found",
                success: false
            })
        }
        return res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to load user"
        })
    }
}
export const updateProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { name, mobile, email, role } = req.body;
    const profilePhoto = req.file;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    let photoUrl = user.photoUrl;

    if (profilePhoto) {
      // Delete old profile photo from Cloudinary if it exists
      if (user.photoUrl) {
        const publicId = user.photoUrl.split("/").pop().split(".")[0];
        await deleteMediaFromCloudinary(publicId);
      }

      // Upload new profile photo to Cloudinary
      const cloudResponse = await uploadMedia(profilePhoto.path);
      photoUrl = cloudResponse.secure_url;
    }

    const updatedData = {
      name,
      mobile,
      email,
      role,
      photoUrl,
    };

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    }).select("-password");

    return res.status(200).json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully.",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};
