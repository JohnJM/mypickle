import { useContext, useEffect, useState } from "preact/hooks";
import { AlertContext } from "../hooks/useAlerts";
import { useAxios } from "../hooks/useAxios";
import { LoginForm } from "./LoginForm";

const handleGenerateError = ({ response }) => {
  if (response.status === 403) return "Unauthorised; admin login required";
  if (response.data.error === "Failed on google sheet integration")
    return response.data.error;

  return "Server error";
};

const GenerateCSVForm = () => {
  const [showLoginForm, setShowLoginForm] = useState(true);
  const { pushToAlerts, removeAllAlerts } = useContext(AlertContext);

  const { response, error, fetch } = useAxios({
    url: "/generateCSV",
    method: "post",
    handleError: handleGenerateError
  });

  useEffect(() => {
    fetch();
  }, [showLoginForm]);

  useEffect(() => {
    if (response?.generatedCSV && !error) {
      removeAllAlerts();
      setShowLoginForm(false);
      pushToAlerts({ text: "Generated CSV", type: "success" });
    }
  }, [response, error, showLoginForm]);
  1;

  return (
    <div>
      {showLoginForm ? (
        <LoginForm {...{ setShowLoginForm }} />
      ) : (
        <>
          <a href="/">Return to the app</a> <br />
          <br />
          <a href="/public/output.csv">Download sheet (output.csv)</a>
        </>
      )}
    </div>
  );
};

export { GenerateCSVForm };
