import { createContext, useState, useEffect, useContext } from "react";
import io from "socket.io-client";

// Create socket connection to the backend
const socket = io("http://localhost:4001"); // adjust your backend URL

const NotificationContext = createContext<unknown>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useNotifications = () => {
  return useContext(NotificationContext);
};
type Notification = {
  id: string;
  title: string;
  content: string;
  timestamp: Date;
};
export const NotificationProvider = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // 1. Fetch stored notifications from backend
    const fetchNotifications = async () => {
      try {
        const res = await fetch("http://localhost:4001/admin/notification"); // your route
        const data = await res.json();
        type BackendNotification = {
          _id: string;
          message: string;
          timestamp: string;
        };
        const formatted = (data as BackendNotification[]).map((n) => ({
          id: n._id,
          title: "New Research Uploaded",
          content: n.message,
          timestamp: new Date(n.timestamp),
        }));
        setNotifications(formatted);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();

    // 2. Listen for real-time notifications via socket
    socket.on("new-research-uploaded", (notification) => {
      setNotifications((prevNotifications) => [
        notification,
        ...prevNotifications, // prepend new notifications
      ]);
    });

    return () => {
      socket.off("new-research-uploaded");
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

