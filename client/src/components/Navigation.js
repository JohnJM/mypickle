import { useContext } from "preact/hooks";
import { TagContext, useTags } from "../hooks";
import { AlertContext } from "../hooks/useAlerts";

export const Navigation = () => {
  const { tags } = useContext(TagContext);
  const { pushToAlerts } = useContext(AlertContext);
  const { submit, skip, loading } = useTags();

  const handleSubmit = () =>
    tags.length
      ? submit()
      : pushToAlerts({ text: "No tags provided!", type: "error" });

  if (loading) return <p>Submitting tags...</p>;

  return (
    <nav className="navigation">
      <button onClick={handleSubmit}>Submit</button>
      <button onClick={skip}>Skip</button>
    </nav>
  );
};
