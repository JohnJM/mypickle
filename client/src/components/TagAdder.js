import { useState } from "preact/hooks";
import { useTags } from "../hooks";
import { DeleteIcon } from "./icons";

const ENTER_KEY = "Enter";

export const TagAdder = () => {
  const [currentTag, setCurrentTag] = useState("");
  const { tags, setTags } = useTags();

  // @TODO: make sure changing this from onKeyPress works
  const handleKeyDown = (event) => {
    if (event.key === ENTER_KEY) {
      if (currentTag && !tags.includes(currentTag))
        setTags((prevTags) => [...prevTags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const handleDelete = (tagToDelete) =>
    setTags((prevTags) => [...prevTags.filter((tag) => tag !== tagToDelete)]);

  return (
    <div className="tagAdder">
      <input
        className="tagInput"
        placeholder="Enter keywords..."
        value={currentTag}
        onInput={(e) => setCurrentTag(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className="submittedKeywords">
        {tags.map((tag) => (
          <div
            className="submittedKeyword"
            onClick={() => handleDelete(tag)}
            key={tag}
          >
            <span>{tag}</span>
            <DeleteIcon />
          </div>
        ))}
      </div>
    </div>
  );
};
