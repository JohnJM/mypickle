import { useContext, useEffect, useState } from "preact/hooks";
import { AlertContext } from "../hooks/useAlerts";
import { useAxios } from "../hooks/useAxios";

const LoginForm = () => (
  <form>
    <input type="text">XD</input>
    <input type="submit" />
  </form>
);

const handleGenerateError = ({ response }) => {
  if (response.status === 403) return 0;

  if (response.data.error === "Failed on google sheet integration")
    return response.data.error;

  return "Server error";
};

const GenerateCSVForm = () => {
  const [showLoginForm, setShowLoginForm] = useState(true);
  const {pushToAlerts} = useContext(AlertContext)

  const { response, error, fetch } = useAxios({
    url: "/generateCSV",
    method: "post",
    handleError: handleGenerateError
  });

  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    if(response && response.generatedCSV && !error){
      console.log("success?", { response, error });
      setShowLoginForm(false);
      pushToAlerts({text: "Generated CSV", type: 'success'})
    }
  }, [response, error]);

  return (
    <div>
      {showLoginForm ? <LoginForm /> : <a href='/'>Done, click to return to the app</a>}
    </div>
  );
};

export { GenerateCSVForm };
