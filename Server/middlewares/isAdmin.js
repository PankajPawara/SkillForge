
const isAdmin = (req, res, next) => {

  console.log("req:",req.user);
  
  // Ensure user object exists (set by authentication middleware)
  if (!req.user || !req.user.role) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: User not authenticated",
    });
  }

  // Check for Admin role
  if (req.user.role !== "Admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied: Admins only",
    });
  }

  next(); // User is authenticated and is admin, proceed
};

export default isAdmin;
