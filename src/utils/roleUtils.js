/**
 * Role utility functions for multi-tenant role-based access control
 *
 * Company Roles:
 * - company_owner: Full access to company resources
 * - company_admin: Administrative access to company resources
 * - company_manager: Manager-level access to company resources
 * - company_driver: Limited driver-specific access
 *
 * Platform Roles (for SaaS platform management):
 * - platform_admin: Platform-wide administrative access
 * - platform_support: Platform support access
 * - user: Regular platform user
 */

// Admin roles that have full company management access
export const ADMIN_ROLES = [
  "company_owner",
  "company_admin",
  "company_manager",
];

// Owner/Admin roles for sensitive operations
export const OWNER_ADMIN_ROLES = ["company_owner", "company_admin"];

// All valid company roles
export const COMPANY_ROLES = [
  "company_owner",
  "company_admin",
  "company_manager",
  "company_driver",
];

// Platform roles
export const PLATFORM_ROLES = ["platform_admin", "platform_support", "user"];

/**
 * Check if user has admin-level access (owner, admin, or manager)
 * @param {Object} user - User object with companyRole
 * @returns {boolean}
 */
export const isAdmin = (user) => {
  return ADMIN_ROLES.includes(user?.companyRole);
};

/**
 * Check if user is owner or admin (for sensitive operations)
 * @param {Object} user - User object with companyRole
 * @returns {boolean}
 */
export const isOwnerOrAdmin = (user) => {
  return OWNER_ADMIN_ROLES.includes(user?.companyRole);
};

/**
 * Check if user is a driver
 * @param {Object} user - User object with companyRole
 * @returns {boolean}
 */
export const isDriver = (user) => {
  return user?.companyRole === "company_driver";
};

/**
 * Check if user is a company owner
 * @param {Object} user - User object with companyRole
 * @returns {boolean}
 */
export const isOwner = (user) => {
  return user?.companyRole === "company_owner";
};

/**
 * Check if user has platform admin access
 * @param {Object} user - User object with platformRole
 * @returns {boolean}
 */
export const isPlatformAdmin = (user) => {
  return user?.platformRole === "platform_admin";
};

/**
 * Check if user has any of the specified roles
 * @param {Object} user - User object with companyRole
 * @param {string[]} allowedRoles - Array of allowed role strings
 * @returns {boolean}
 */
export const hasRole = (user, allowedRoles = []) => {
  return allowedRoles.includes(user?.companyRole);
};

/**
 * Format role name for display (convert snake_case to Title Case)
 * @param {string} role - Role string (e.g., "company_admin")
 * @returns {string} - Formatted role (e.g., "Company Admin")
 */
export const formatRoleName = (role) => {
  if (!role) return "User";
  return role
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Get user's display role (removes "company_" prefix for cleaner display)
 * @param {Object} user - User object with companyRole
 * @returns {string}
 */
export const getDisplayRole = (user) => {
  if (!user?.companyRole) return "User";
  return user.companyRole.replace("company_", "").replace(/_/g, " ");
};

/**
 * Check if user can access a specific feature
 * @param {Object} user - User object
 * @param {string} feature - Feature name
 * @returns {boolean}
 */
export const canAccessFeature = (user, feature) => {
  const featurePermissions = {
    vehicles: isAdmin(user),
    drivers: isAdmin(user),
    clients: isAdmin(user),
    routes: isAdmin(user),
    maintenance: isAdmin(user),
    workflow: isAdmin(user),
    analytics: isAdmin(user),
    liveTracking: isAdmin(user),
    adminPanel: isOwnerOrAdmin(user),
    userManagement: isOwnerOrAdmin(user),
    companySettings: isOwner(user),
    trips: true, // All users can access trips (but with different views)
    profile: true, // All users can access profile
    dashboard: true, // All users can access dashboard
  };

  return featurePermissions[feature] || false;
};

/**
 * Get permissions object for a user
 * @param {Object} user - User object with companyRole
 * @returns {Object} - Object with permission flags
 */
export const getUserPermissions = (user) => {
  return {
    canManageVehicles: isAdmin(user),
    canManageDrivers: isAdmin(user),
    canManageClients: isAdmin(user),
    canManageRoutes: isAdmin(user),
    canManageMaintenance: isAdmin(user),
    canManageWorkflows: isAdmin(user),
    canViewAnalytics: isAdmin(user),
    canAccessAdminPanel: isOwnerOrAdmin(user),
    canManageUsers: isOwnerOrAdmin(user),
    canManageCompany: isOwner(user),
    canViewTrips: true,
    canCreateTrips: isAdmin(user),
    canEditTrips: isAdmin(user),
    canDeleteTrips: isAdmin(user),
    canViewOwnTrips: isDriver(user),
    canUpdateTripProgress: isDriver(user),
    isDriver: isDriver(user),
    isAdmin: isAdmin(user),
    isOwnerOrAdmin: isOwnerOrAdmin(user),
  };
};
