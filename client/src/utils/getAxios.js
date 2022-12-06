const baseURL = "http://localhost:10000";
let axios;

// guard access to axios object so it doesn't explode during pre-render
const getAxios = async () => {
  if (typeof window === "undefined") return null;
  if (!axios) {
    axios = await import("axios").then((m) => m.default);
    axios.defaults.baseURL = baseURL;
  }
  return axios;
};



export { getAxios };
