import { useState } from "preact/hooks";
import { TagContext } from "./hooks";
import { Navigation, TagAdder, MyPickleIcon } from "./components";
import "./styles.css";

export default function App() {
  const [category, setCategory] = useState(undefined);
  const [tags, setTags] = useState([]);
  return (
    <div className="App">
      <TagContext.Provider value={{ tags, setTags, category, setCategory }}>
        <header>
          <MyPickleIcon />
          <Navigation />
        </header>
        <main>
          {!category && <h1>Loading...</h1>}
          {category && (
            <>
              <h1>{category.name}</h1>
              <TagAdder />
            </>
          )}
        </main>
      </TagContext.Provider>
    </div>
  );
}
