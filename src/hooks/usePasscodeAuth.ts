import { useState, useEffect } from 'react';

const PASSCODE = '2139';
const STORAGE_KEY = 'passcode_verified';

export const usePasscodeAuth = () => {
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check if user already verified on mount
  useEffect(() => {
    const verified = localStorage.getItem(STORAGE_KEY);
    if (verified === 'true') {
      setIsVerified(true);
    }
    setIsLoading(false);
  }, []);

  const verify = (passcode: string): boolean => {
    if (passcode === PASSCODE) {
      localStorage.setItem(STORAGE_KEY, 'true');
      setIsVerified(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setIsVerified(false);
  };

  return {
    isVerified,
    isLoading,
    verify,
    logout,
  };
};
