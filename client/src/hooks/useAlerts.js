import { useEffect, useState } from "preact/hooks";
import { createContext } from "preact";

const AlertContext = createContext();

const useAlerts = (list) => {
  const [alerts, setAlerts] = useState(list);

  const pushToAlerts = (alert) => {
    if (alerts.length >= 5) removeAlert(alerts[0]);
    setAlerts((prev) => [...prev, alert]);
  };

  const removeAlert = (id) => {
    const newAlerts = [...alerts];
    newAlerts.splice(id, 1);
    setAlerts(() => newAlerts);
  };

  const removeAllAlerts = () => {
    setAlerts(() => []);
  };

  return { alerts, pushToAlerts, removeAlert, removeAllAlerts };
};

export { useAlerts, AlertContext };
