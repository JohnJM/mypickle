import { useContext } from "preact/hooks";
import { AlertContext } from "../hooks/useAlerts";

const Alerts = () => {
  const { alerts, removeAlert } = useContext(AlertContext);
  return alerts.map(({ text, type }, index) => {
    return (
      <p
        class={`alert ${type === "error" && "alert-err"}`}
        onClick={() => removeAlert(index)}
        key={index}
      >
        {text}
      </p>
    );
  });
};

export { Alerts };
