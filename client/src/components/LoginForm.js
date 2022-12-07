import { useContext, useEffect, useState } from "preact/hooks";
import { constants } from "../constants";
import { useAxios } from "../hooks";
import { AlertContext } from "../hooks/useAlerts";

const LoginForm = ({ setShowLoginForm }) => {
  const [formState, setFormState] = useState({ username: "", password: "" });

  const { pushToAlerts } = useContext(AlertContext);

  const handleChange = ({ target: { name, value } }) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleError = ({ response: status }) => {
    if (status === 400) return "Incorrect credentials";
    if (status === 500) return constants.SERVER_500_MSG;
  };

  const { fetch, response, error } = useAxios({
    url: "/login",
    method: "post",
    handleError,
    body: {
      username: formState.username,
      password: formState.password
    }
  });

  const onSubmit = (e) => {
    e.preventDefault();
    fetch();
  };

  useEffect(() => {
    if (response?.token && !error) {
      pushToAlerts({
        text: `Logged in as ${response.name}`,
        type: "success"
      });
      setShowLoginForm(() => false);
    }
  }, [response, error]);

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
