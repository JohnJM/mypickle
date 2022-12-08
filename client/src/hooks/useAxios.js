import { useState, useEffect, useContext } from "preact/hooks";
import { AlertContext } from "./useAlerts";

const baseURL = "http://localhost:10000";

let axios;

// guard access to axios object so it doesn't explode during pre-render
const getAxios = async () => {
  try {
    if (typeof window === "undefined") return null;
    if (!axios) {
      axios = await import("axios").then((m) => m.default);
      axios.defaults.baseURL = baseURL;
    }
    return axios;
  } catch (err) {
    throw new Error(err);
  }
};

const useAxios = ({ url, method, body = null, handleError = () => {} }) => {
  const [response, setResponse] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [shouldFetch, setShouldFetch] = useState();
  const { pushToAlerts } = useContext(AlertContext);

  const fetch = () => {
    setError(() => undefined);
    setResponse(() => undefined);
    setLoading(() => undefined);
    setShouldFetch(true);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const axios = await getAxios();
      const { data } = await axios[method](url, body);
      setResponse(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      const formattedError = handleError(err);
      if (formattedError) {
        pushToAlerts({ text: formattedError, type: "error" });
        setResponse(formattedError);
      }
      setError(true);
    }
  };

  useEffect(() => {
    if (!response && shouldFetch) {
      fetchData();
    }
    return setShouldFetch(false);
  }, [method, url, body, shouldFetch]);

  return { response, error, fetch, loading };
};

export { useAxios };
