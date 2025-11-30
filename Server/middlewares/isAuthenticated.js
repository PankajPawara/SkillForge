import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    let token;

    // 1. Check authorization header
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 2. Fallback: check cookies
    if (!token) {
      token = req.cookies?.token;
    }

    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    const decode = await jwt.verify(token, process.env.SECRET_KEY);
    
    if (!decode) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }

    req.id = decode.userId;
    next();
    
  } catch (error) {
    console.log(error);
  }
};
export default isAuthenticated;
