import { useTags } from "../hooks";

export const Navigation = () => {
  const { submit, skip } = useTags();

  return (
    <nav className="navigation">
      <button onClick={submit}>Submit</button>
      <button onClick={skip}>Skip</button>
    </nav>
  );
};
