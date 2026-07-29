import { useState, useEffect } from "react";

export function useRateLimit(storageKey = "auth_attempts", maxAttempts = 5, lockoutDurationSeconds = 180) {
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [timer, setTimer] = useState(0);

  // Check if a active lockout exists in localStorage when component mounts
  useEffect(() => {
    const savedLockoutEnd = localStorage.getItem(`${storageKey}_lockout`);
    if (savedLockoutEnd) {
      const remainingMs = Number(savedLockoutEnd) - Date.now();
      if (remainingMs > 0) {
        setIsLocked(true);
        setTimer(Math.ceil(remainingMs / 1000));
      } else {
        localStorage.removeItem(`${storageKey}_lockout`);
      }
    }
  }, [storageKey]);

  // Handle countdown interval
  useEffect(() => {
    let interval = null;
    if (isLocked && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer <= 0 && isLocked) {
      setIsLocked(false);
      setAttempts(0);
      localStorage.removeItem(`${storageKey}_lockout`);
    }
    return () => clearInterval(interval);
  }, [isLocked, timer, storageKey]);

  // Call this function when an attempt fails
  const recordFailedAttempt = () => {
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    if (nextAttempts >= maxAttempts) {
      const lockoutEnd = Date.now() + lockoutDurationSeconds * 1000;
      localStorage.setItem(`${storageKey}_lockout`, lockoutEnd);
      setIsLocked(true);
      setTimer(lockoutDurationSeconds);
    }

    return maxAttempts - nextAttempts;
  };

  // Helper to display mm:ss
  const formatTime = () => {
    const mins = Math.floor(timer / 60);
    const secs = timer % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return {
    isLocked,
    timer,
    formattedTime: formatTime(),
    recordFailedAttempt,
    remainingAttempts: maxAttempts - attempts,
  };
}