import { useState } from "preact/hooks";
import { constants } from "../constants";
import { useAxios } from "../hooks";

const LoginForm = () => {
  const [formState, setFormState] = useState({ username: "", password: "" });

  const handleChange = ({ target: { name, value } }) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleError = ({ response: status }) => {
    if(status === 400) return 'Incorrect credentials';
    if(status === 500) return constants.SERVER_500_MSG
  };

  const { fetch, response, error } = useAxios({
    url: "/login",
    method: "post",
    handleError
  });

  const onSubmit = (e) => {
    e.preventDefault();
    fetch();
  };

  return (
    <form {...{ onSubmit }}>
      <input
        placeholder="username"
        name="username"
        class="tagInput"
        type="text"
        onInput={handleChange}
      ></input>
      <input
        placeholder="password"
        name="password"
        class="tagInput"
        type="text"
        onInput={handleChange}
      ></input>
      <button class="pickleButton" type="submit" value="submit">
        Submit
      </button>
    </form>
  );
};

export { LoginForm };
