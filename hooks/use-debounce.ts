import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => { 
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}


// useDebounce is used to debounce a value. 
// Debouncing is a technique used to limit the rate at which a function is called. In this case, the useDebounce hook is used to limit the rate at which a value is updated. This is useful when you want to wait for a user to stop typing before performing an action.

// The hook takes two arguments: value and delay. The value argument is the value that needs to be debounced, and the delay argument is the time in milliseconds that the value should be debounced for.

// The hook uses the useEffect hook to set up a timer that calls the setDebouncedValue function after the specified delay. The setDebouncedValue function updates the debouncedValue state with the latest value.