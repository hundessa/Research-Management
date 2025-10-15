import { useNotifications } from "../../contexts/NotificationContext";
import Header from "../Header_Nav_Bar/Header";
import SideNavBar from "../Side_Nav_Bar/SideNavBar";

interface Notification {
  id: string;
  title: string;
  content: string;
  timestamp: Date;
}

type NotificationsContextType = {
  notifications: Notification[];
};

const NotificationList = () => {
  const { notifications } = useNotifications() as NotificationsContextType;

  return (
    <>
      <Header />
      <section className="flex min-h-screen bg-gray-100">
        <SideNavBar />
        <div className="lg:ml-[25%] mt-[5%]">
          <h3 className="text-xl font-semibold mb-2">Notifications</h3>
          {notifications.length === 0 ? (
            <p>No new notifications</p>
          ) : (
            <ul className="space-y-2">
              {notifications.map((notification, index) => (
                <li key={index} className="text-sm text-blue-700">
                  <strong>{notification.title}</strong>: {notification.content}
                  <div className="text-xs text-gray-500">
                    {new Date(notification.timestamp).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
};

export default NotificationList;
