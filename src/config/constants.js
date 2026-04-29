/**
 * Role mapping: frontend role selection → database role
 */
export const ROLE_MAP = {
  user: "donor",
  ngo: "ngo",
  admin: "admin",
};

/**
 * Get dashboard path for a given role
 */
export const getRoleDashboard = (role) => {
  switch (role) {
    case "admin":
      return "/admin";
    case "ngo":
      return "/ngo";
    case "donor":
      return "/user";
    default:
      return "/user";
  }
};
