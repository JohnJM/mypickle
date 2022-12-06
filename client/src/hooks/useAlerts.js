import { useState } from "preact/hooks";
import { createContext } from "preact";

const AlertContext = createContext();

const useAlerts = (list) => {
  const [alerts, setAlerts] = useState(list);
  const pushToAlerts = (alert) => {
    setAlerts((prev) => [...[...prev, alert]]);
  };
  const removeAlert = (id) => {
    const newAlerts = [...alerts];
    newAlerts.splice(id, 1);
    setAlerts(() => newAlerts);
  };

  return { alerts, pushToAlerts, removeAlert };
};

export { useAlerts, AlertContext };
