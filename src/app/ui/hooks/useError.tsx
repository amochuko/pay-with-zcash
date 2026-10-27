import { useEffect, useState } from "react";

function useError(initialMessage = null, timeout = 5000) {
  const [error, setError] = useState(initialMessage);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, timeout);
      return () => clearTimeout(timer);
    }
  },[error, setError, timeout]);
}

export default useError;
