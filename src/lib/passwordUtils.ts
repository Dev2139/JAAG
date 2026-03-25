/**
 * Password utilities for profile security
 * 
 * NOTE: In production, consider using bcrypt or similar hashing libraries
 * For now, we're storing plain text passwords. Use at your own risk.
 */

/**
 * Verify if the provided password matches the stored password
 */
export const verifyProfilePassword = (inputPassword: string, storedPassword: string): boolean => {
  if (!inputPassword || !storedPassword) {
    return false;
  }
  return inputPassword === storedPassword;
};

/**
 * Validate password strength
 * Password should be at least 6 characters long
 */
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  message: string;
} => {
  if (!password) {
    return {
      isValid: false,
      message: "Password is required",
    };
  }

  if (password.length < 6) {
    return {
      isValid: false,
      message: "Password must be at least 6 characters long",
    };
  }

  return {
    isValid: true,
    message: "Password is valid",
  };
};

/**
 * Check if password matches confirmation password
 */
export const doPasswordsMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};
