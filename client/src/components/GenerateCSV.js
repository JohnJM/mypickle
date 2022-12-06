import { useContext, useEffect, useState } from "preact/hooks";
import { AlertContext } from "../hooks/useAlerts";
import { useAxios } from "../hooks/useAxios";
import { LoginForm } from "./LoginForm";

const handleGenerateError = ({ response }) => {
  if (response.status === 403) return "Please login first";
  if (response.data.error === "Failed on google sheet integration")
    return response.data.error;

  return "Server error";
};

const GenerateCSVForm = () => {
  const [showLoginForm, setShowLoginForm] = useState(true);
  const { pushToAlerts } = useContext(AlertContext);

  const { response, error, fetch } = useAxios({
    url: "/generateCSV",
    method: "post",
    handleError: handleGenerateError
  });

  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    if (response && response.generatedCSV && !error) {
      setShowLoginForm(false);
      pushToAlerts({ text: "Generated CSV", type: "success" });
    }
  }, [response, error]);

  return (
    <div>
      {showLoginForm ? (
        <LoginForm />
      ) : (
        <>
          <a href="/">Return to the app</a>
          <a href="/public/output.csv">view output.csv</a>
        </>
      )}
    </div>
  );
};

export { GenerateCSVForm };
