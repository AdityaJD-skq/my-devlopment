// Environment Configuration
export const config = {
  // API Configuration
  apiUrl: 'http://localhost:5000/api',
  
  // Developer Account Settings
  developerEmails: ['admin@example.com', 'developer@example.com'],
  
  // JWT Configuration
  jwtExpirationDays: 7,
  
  // System Defaults
  defaultUserRole: 'Student',
  
  // Feature Flags
  enableActivityLogging: true,
  enableRoleBasedAccess: true,
  
  // User Roles in order of permission hierarchy (highest to lowest)
  userRoles: ['Developer', 'Admin', 'Teacher', 'Student']
};

/**
 * Check if an email is designated as a Developer account
 * @param email Email to check
 * @returns boolean
 */
export const isDeveloperEmail = (email: string): boolean => {
  return config.developerEmails.includes(email.toLowerCase());
};

/**
 * Get the role permission level (higher is more powerful)
 * @param role Role to check
 * @returns number
 */
export const getRoleLevel = (role: string): number => {
  const index = config.userRoles.indexOf(role);
  return index === -1 ? -1 : config.userRoles.length - index;
};

/**
 * Check if a role has permission over another role
 * @param actingRole The role taking the action
 * @param targetRole The role being acted upon
 * @returns boolean
 */
export const canRoleModify = (actingRole: string, targetRole: string): boolean => {
  return getRoleLevel(actingRole) > getRoleLevel(targetRole);
}; 