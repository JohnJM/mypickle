import { createContext } from "preact";
import { useContext, useEffect } from "preact/hooks";
export const TagContext = createContext();

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

let categories = [];

let currentIdx = 0;

const getNextCategory = () => {
  if (currentIdx === categories.length - 1) {
    currentIdx = 0;
    return false;
  }
  currentIdx++;
  return categories[currentIdx];
};

const populateCategories = async (setCategory) => {
  // @TODO: error handling
  const axios = await getAxios();
  const { data } = axios.get("/getCategories");
  categories = data.categories;
  setCategory(categories[0]);
};

/**
 * @typedef {Object} TagModel
 * @property {String[]} tags - The current list of tags held in state
 * @property {Function} setTags - Setter function to update tags
 * @property {String} category - The current category held in state
 * @property {Function} setCategory - Setter function to update category
 * @property {Function} submit - Submits current state to server and serves next category
 * @property {Function} skip - Serves next cateogry without submitting current state
 */

/**
 * Returns tag and category state, along with helper functions to handle data fetching and tag submission
 * @returns {{ tags: String[], setTags: () => void, category: String, setCategory: () => void, submit: () => Promise<void>, skip: () => Promise<void> }}
 * Object containing state and helper functions
 */

export const useTags = () => {
  const { tags, setTags, category, setCategory, initialised, setInitialised } =
    useContext(TagContext);

  useEffect(() => {
    if (!initialised) {
      setInitialised(true);
      populateCategories(setCategory);
    }
  }, [setCategory, setInitialised, initialised]);

  const refresh = async () => {
    setTags([]);
    const nextCategory = getNextCategory();
    if (nextCategory) setCategory(nextCategory);
    else populateCategories(setCategory);
  };

  const submit = async () => {
    const axios = await getAxios();
    axios.post("/addTagsToCategory", {
      categoryId: category.id,
      tagList: tags
    });
    refresh();
  };

  return { tags, setTags, category, setCategory, submit, skip: refresh };
};
