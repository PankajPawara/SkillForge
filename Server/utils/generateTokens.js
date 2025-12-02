import jwt from "jsonwebtoken";

export const generateToken = (res, user, message) => {
  const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
    expiresIn: '1d',
  });

  return res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true, 
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    })
    .json({
      success: true,
      message,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        enrolledCourses: user.enrolledCourses,
        photoUrl: user.photoUrl,
      },
    });
};
