import { useState } from "preact/hooks";
import { TagContext } from "./hooks";
import { Navigation, TagAdder, MyPickleIcon } from "./components";
import "./styles.css";

// provider extracted to own component to avoid re-rendering all children on every state change
const ContextWrapper = ({ children, ...values }) => (
  <TagContext.Provider value={{ ...values }}>{children}</TagContext.Provider>
);

export default function App() {
  const [category, setCategory] = useState(undefined);
  const [tags, setTags] = useState([]);
  const [initialised, setInitialised] = useState(false);
  return (
    <div className="App">
      <ContextWrapper
        {...{
          category,
          setCategory,
          tags,
          setTags,
          initialised,
          setInitialised
        }}
      >
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
      </ContextWrapper>
    </div>
  );
}
