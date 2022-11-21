import { createContext } from "preact";
import { useContext, useEffect } from "preact/hooks";
import axios from 'axios';

export const TagContext = createContext();

const baseURL = "https://mypickle.onrender.com";

const api = axios.create({ baseURL });

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
  const { data } = await api.get('/getCategories');
  categories = data.categories;
  setCategory(categories[0]);
}

export const useTags = () => {
  const { tags, setTags, category, setCategory, initialised, setInitialised } = useContext(TagContext);

  useEffect(() => {
    if (!initialised) {
      setInitialised(true);
      populateCategories(setCategory)
    }
  }, [setCategory, setInitialised, initialised]);

  const refresh = async () => {
    setTags([]);
    const nextCategory = getNextCategory();
    if (nextCategory) setCategory(nextCategory);
    else populateCategories(setCategory);
  };

  const submit = async () => {
    api.post('/addTagsToCategory', { categoryId: category.id, tagList: tags });
    refresh();
  };

  const skip = () => refresh();

  return { tags, setTags, category, setCategory, submit, skip };
};
