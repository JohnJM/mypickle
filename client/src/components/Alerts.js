import { useContext } from "preact/hooks";
import { AlertContext } from "../hooks/useAlerts";
import { DeleteIcon } from "./icons";

const Alerts = () => {
  const { alerts, removeAlert } = useContext(AlertContext);

  const removeAlertAfterSomeTime = (id) => {
    setTimeout(() => {
      removeAlert(id);
    }, 1998);
  };

  return alerts.map(({ text, type, autoRm }, index) => {
    if (autoRm) removeAlertAfterSomeTime(index);
    return (
      <p
        class={`alert ${type === "error" && "alert-err"}`}
        onClick={() => removeAlert(index)}
        key={index}
      >
        {text}
        <DeleteIcon />
      </p>
    );
  });
};

export { Alerts };
