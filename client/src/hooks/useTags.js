import { createContext } from "preact";
import { useContext, useEffect } from "preact/hooks";
import { constants } from "../constants";
import { AlertContext } from "./useAlerts";
import { useAxios } from "./useAxios";
export const TagContext = createContext();

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
const getCategoriesErrHandler = () => constants.SERVER_500_MSG;

/**
 * @typedef {Object} TagModel
 * @property {String[]} tags - The current list of tags held in state
 * @property {Function} setTags - Setter function to update tags
 * @property {String} category - The current category held in state
 * @property {Function} setCategory - Setter function to update category
 * @property {Function} submit - Submits current state to server and serves next category
 * @property {Function} skip - Serves next category without submitting current state
 */

/**
 * Returns tag and category state, along with helper functions to handle data fetching and tag submission
 * @returns {{ tags: String[], setTags: () => void, category: String, setCategory: () => void, submit: () => Promise<void>, skip: () => Promise<void> }}
 * Object containing state and helper functions
 */
export const useTags = () => {
  const { tags, setTags, category, setCategory, initialised, setInitialised } =
    useContext(TagContext);
  const { pushToAlerts } = useContext(AlertContext);

  const {
    fetch: fetchCategories,
    response: catRes,
    error: catErr
  } = useAxios({
    url: "/getCategories",
    method: "get",
    handleError: getCategoriesErrHandler
  });

  useEffect(() => {
    if (!initialised) {
      setInitialised(true);
      fetchCategories();
    }
  }, [setCategory, setInitialised, initialised]);

  useEffect(() => {
    if (catRes && !catErr) {
      categories = catRes.categories;
      setCategory(catRes.categories[0]);
    }
  }, [catRes, catErr]);

  const refresh = async () => {
    setTags([]);
    const nextCategory = getNextCategory();
    if (nextCategory) setCategory(nextCategory);
    else fetchCategories();
  };

  const postTagErrorHandler = ({ response }) => {
    if (response.status === 400) return "No tags provided";
    return constants.GENERIC_SERVER_ERR_MESSAGE;
  };
  const {
    fetch: postTags,
    response: postTagRes,
    error: postTagErr,
    loading
  } = useAxios({
    url: "/addTagsToCategory",
    method: "post",
    body: {
      categoryId: category?.id,
      tagList: tags
    },
    handleError: postTagErrorHandler
  });

  useEffect(() => {
    if (postTagRes?.success && !postTagErr) {
      pushToAlerts({
        autoRm: true,
        text: "Thanks - tag posted",
        type: "success"
      });
      refresh();
    }
  }, [postTagRes, postTagErr]);

  const submit = () => {
    postTags();
  };

  return {
    tags,
    setTags,
    category,
    setCategory,
    submit,
    skip: refresh,
    loading
  };
};
