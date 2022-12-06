import { useState, useEffect, useContext } from "preact/hooks";
import { getAxios } from "../utils";
import { AlertContext } from "./useAlerts";

const baseURL = "http://localhost:10000";

let axios;
// guard access to axios object so it doesn't explode during pre-render
const hookGetAxios = async () => {
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

const useAxios = ({ url, method, body = null, handleError }) => {
  const [response, setResponse] = useState();
  const [error, setError] = useState();
  const [shouldFetch, setShouldFetch] = useState(false);
  const { pushToAlerts } = useContext(AlertContext);

  const fetch = () => {
    setShouldFetch(true);
  };

  const fetchData = async () => {
    const axios = await hookGetAxios();
    axios[method](url, body)
      .then(({ data }) => {
        setResponse(data);
        return data;
      })
      .catch((err) => {
        const formattedError = handleError(err);
        if (formattedError) {
          pushToAlerts({ text: formattedError, type: "error" });
          setResponse(formattedError);
        }
        setError(true);
      });

    return { response, error };
  };

  useEffect(() => {
    if (!response && shouldFetch) {
      fetchData();
    }
    return setShouldFetch(false);
  }, [method, url, body, shouldFetch]);

  return { response, error, fetch };
};

export { useAxios };
