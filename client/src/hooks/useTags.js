import { createContext } from "preact";
import { useContext, useEffect } from "preact/hooks";

export const TagContext = createContext();

let categories = [];

let currentIdx = 0;

const getNextCategory = () => {
  if (currentIdx === categories.length - 1) { 
    currentIdx = 0;
    return false;
  }
  currentIdx++;
  console.log({ categories, currentIdx });
  return categories[currentIdx];
};

const populateCategories = async (setCategory) => {
  // @TODO: error handling
  const response = await fetch('http://localhost:3001/getCategories');
  const json = await response.json();
  categories = json.categories;
  setCategory(categories[0]);
}

export const useTags = () => {
  const { tags, setTags, category, setCategory } = useContext(TagContext);

  useEffect(() => populateCategories(setCategory), [setCategory]);

  const refresh = async () => {
    setTags([]);
    const nextCategory = getNextCategory();
    if (nextCategory) setCategory(nextCategory);
    else populateCategories(setCategory);
  };

  const submit = () => {
    // @TODO: post tags
    refresh();
  };

  const skip = () => refresh();

  return { tags, setTags, category, setCategory, submit, skip };
};
