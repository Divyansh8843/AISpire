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
      console.log(...args);
      console.log("post request go");
      const response = await cb(...args);
      setData(response);
      setError(null);
    } catch (err) {
      setError(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  return { data, loading, error, fn, setData };
};

export default useFetch;
