import { useContext } from "preact/hooks";
import { AlertContext } from "../hooks/useAlerts";

const Alerts = () => {
  const { alerts, removeAlert } = useContext(AlertContext);
  return alerts.map(({ text, type }, index) => {
    const backgroundColor = type === "error" ? "red" : "green";
    return (
      <p
        style={{ backgroundColor }}
        onClick={() => removeAlert(index)}
        key={index}
      >
        {text}
      </p>
    );
  });
};

export { Alerts };
