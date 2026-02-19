export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.session.userRole) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!roles.includes(req.session.userRole)) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
};
