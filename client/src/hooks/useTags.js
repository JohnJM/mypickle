import { createContext } from "preact";
import { useContext, useEffect } from "preact/hooks";
import axios from 'axios';

export const TagContext = createContext();

const baseURL = "http://localhost:3001";

const api = axios.create({ baseURL });

let categories = [];

let currentIdx = 0;

let initialised = false;

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
  const { tags, setTags, category, setCategory } = useContext(TagContext);

  useEffect(() => {
    if (!initialised) {
      populateCategories(setCategory)
      initalised = true;
    }
  }, [setCategory]);

  const refresh = async () => {
    setTags([]);
    const nextCategory = getNextCategory();
    if (nextCategory) setCategory(nextCategory);
    else populateCategories(setCategory);
  };

  const submit = async () => {
    api.post(`/addTagsToCategory`, { categoryId: category.id, tagList: tags });
    refresh();
  };

  const skip = () => refresh();

  return { tags, setTags, category, setCategory, submit, skip };
};
