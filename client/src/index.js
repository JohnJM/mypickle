import { useContext, useState } from "preact/hooks";
import { TagContext } from "./hooks";
import { Navigation, TagAdder, MyPickleIcon } from "./components";
import "./styles.css";
import { AlertContext, useAlerts } from "./hooks/useAlerts";
import { Alerts } from "./components/Alerts";
import { GenerateCSVForm } from "./components/GenerateCSV";

//provider extracted to own component to avoid re-rendering all children on every state change
const ContextWrapper = ({ children, tag, alerts }) => (
  <TagContext.Provider value={{ ...tag }}>
    <AlertContext.Provider value={{ ...alerts }}>
      {children}
    </AlertContext.Provider>
  </TagContext.Provider>
);

const Header = ({ showNav }) => (
  <header>
    <MyPickleIcon />
    {showNav && <Navigation />}
  </header>
);

const AddTagPage = ({ category }) => (
  <main>
    {!category && <h1>Loading...</h1>}
    {category && (
      <>
        <h1>{category.name}</h1>
        <TagAdder />
      </>
    )}
  </main>
);

const Main = ({ category }) => {
  const { alerts } = useContext(AlertContext);
  const showGenerateCSVForm =
    typeof window !== "undefined" &&
    window.location.href.includes("/?generateCSV");

  return (
    <>
      <Header showNav={!showGenerateCSVForm} />
      {showGenerateCSVForm ? (
        <GenerateCSVForm />
      ) : (
        <AddTagPage {...{ category }} />
      )}
      {alerts && <Alerts />}
    </>
  );
};

const App = () => {
  const [category, setCategory] = useState();
  const [tags, setTags] = useState([]);
  const [initialised, setInitialised] = useState(false);
  const { removeAllAlerts, alerts, pushToAlerts, removeAlert } = useAlerts([]);

  return (
    <div className="App">
      <ContextWrapper
        {...{
          tag: {
            ...{
              category,
              setCategory,
              tags,
              setTags,
              initialised,
              setInitialised
            }
          },
          alerts: {
            ...{
              alerts,
              pushToAlerts,
              removeAlert,
              removeAllAlerts
            }
          }
        }}
      >
        <Main {...{ category }} />
      </ContextWrapper>
    </div>
  );
};

export default App;
