import { useEffect, useState } from "react";

import { SERVER_URL } from "../config";

export const useFetch = (endpoint) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (loading || data) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`${SERVER_URL}${endpoint}`);
        console.log(`${SERVER_URL}${endpoint}`);
        const json = await res.json();
        setData(json);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, data, loading]);

  return { data, loading, error };
};
