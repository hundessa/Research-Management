import { useNavigate } from "react-router-dom";


const ResearcherSideNavBar: React.FC = () => {

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // await axios.post(
      //   "http://localhost:4000/logout",
      //   {},
      //   { withCredentials: true }
      // );
      // Cookies.remove("jwt");
      localStorage.clear();

      navigate("/login", { replace: true });
      window.location.reload();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };


    return (
      <>
        <div className="min-h-screen flex flex-row bg-gray-100 fixed mt-[64px] z-[1000]">
          <div className="flex flex-col w-56 bg-white rounded-r-3xl overflow-hidden">
            <ul className="flex flex-col py-4">
              <li>
                <a
                  href="/researcher/dashboard"
                  className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800"
                >
                  <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                    <i className="bx bx-home"></i>
                  </span>
                  <span className="text-sm font-medium">Dashboard</span>
                </a>
              </li>
              <li>
                <a
                  href="/researcher/researches"
                  className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800"
                >
                  <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                    <i className="bx bx-user"></i>
                  </span>
                  <span className="text-sm font-medium">My Researches</span>
                </a>
              </li>
              <li>
                <a
                  href="/researcher/finance-report"
                  className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800"
                >
                  <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                    <i className="bx bx-user"></i>
                  </span>
                  <span className="text-sm font-medium">Profile</span>
                </a>
              </li> <li>
                <a
                  href="/researcher/finance-form"
                  className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800"
                >
                  <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                    <i className="bx bx-user"></i>
                  </span>
                  <span className="text-sm font-medium">Profile111</span>
                </a>
              </li>
              <li>
                <a
                  href="/researcher/notification"
                  className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800"
                >
                  <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                    <i className="bx bx-bell"></i>
                  </span>
                  <span className="text-sm font-medium">Notifications</span>
                  <span className="ml-auto mr-6 text-sm bg-red-100 rounded-full px-3 py-px text-red-500">
                    5
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800"
                  onClick={handleLogout}
                >
                  <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                    <i className="bx bx-log-out"></i>
                  </span>
                  <span className="text-sm font-medium">Logout</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </>
    );
}

export default ResearcherSideNavBar;