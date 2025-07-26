import { use, useState } from "react";
import { useFormState } from "react-hook-form";
import { toast } from "sonner";

const useFetch = (cb) => {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fn = async (...args) => {
    setLoading(true);
    setError(null);
    try {
      if (typeof cb !== 'function') {
        throw new Error('Invalid callback function provided');
      }
      
      const response = await cb(...args);
      setData(response);
      setError(null);
    } catch (err) {
      console.error('useFetch error:', err);
      setError(err);
      if (err.message) {
        toast.error(err.message);
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return { data, loading, error, fn, setData };
};

export default useFetch;
