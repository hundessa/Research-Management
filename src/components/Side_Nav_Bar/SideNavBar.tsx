

const SideNavBar: React.FC = () => {
    return (
      <>
        <div className="min-h-screen flex flex-row bg-gray-100 fixed mt-[64px] z-[1000]">
          <div className="flex flex-col w-56 bg-white rounded-r-3xl overflow-hidden">
           
            <ul className="flex flex-col py-4">
              <li>
                <a
                  href="/admin/dashboard"
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
                  href="/admin/users-list"
                  className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800"
                >
                  <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                    <i className="bx bx-user"></i>
                  </span>
                  <span className="text-sm font-medium">Users</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800"
                >
                  <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                    <i className="bx bx-book"></i>
                  </span>
                  <span className="text-sm font-medium">Researches</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800"
                >
                  <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                    <i className="bx bx-chat"></i>
                  </span>
                  <span className="text-sm font-medium">Chat</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800"
                >
                  <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                    <i className="bx bx-user"></i>
                  </span>
                  <span className="text-sm font-medium">Profile</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
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


export default SideNavBar;