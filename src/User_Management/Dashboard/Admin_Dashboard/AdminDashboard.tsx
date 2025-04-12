import { roles } from "../../../assets/data/users";
import Header from "../../../components/Header_Nav_Bar/Header";
import SideNavBar from "../../../components/Side_Nav_Bar/SideNavBar";

const AdminDashboard: React.FC = () => {

    const getProgressInfo = (amount: number) => {
      const percent = Math.min(amount * 10 + 20, 100); // Example formula
      let color = "bg-blue-600",
        bg = "bg-blue-200";

      if (percent <= 30) [color, bg] = ["bg-green-500", "bg-green-200"];
      else if (percent <= 50) [color, bg] = ["bg-pink-500", "bg-pink-200"];
      else if (percent <= 70) [color, bg] = ["bg-red-500", "bg-red-200"];

      return { percent, color, bg };
    };

  return (
    <>
      <Header />
      <div className="flex bg-gray-100">
        <SideNavBar />
        <section className="ml-[16%] mt-[4%]">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
                <div className="flex justify-between mb-6">
                  <div>
                    <div className="flex items-center mb-1">
                      <div className="text-2xl font-semibold">2</div>
                    </div>
                    <div className="text-sm font-medium text-gray-400">
                      Users
                    </div>
                  </div>
                </div>
                <a
                  href="/admin/users-list"
                  className="text-[#f84525] font-medium text-sm hover:text-red-800"
                >
                  View
                </a>
              </div>
              <div className="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
                <div className="flex justify-between mb-4">
                  <div>
                    <div className="flex items-center mb-1">
                      <div className="text-2xl font-semibold">100</div>
                    </div>
                    <div className="text-sm font-medium text-gray-400">
                      Researches
                    </div>
                  </div>
                </div>
                <a
                  href="/dierenartsen"
                  className="text-[#f84525] font-medium text-sm hover:text-red-800"
                >
                  View
                </a>
              </div>
              <div className="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
                <div className="flex justify-between mb-6">
                  <div>
                    <div className="text-2xl font-semibold mb-1">100</div>
                    <div className="text-sm font-medium text-gray-400">
                      Lorem Ipsum
                    </div>
                  </div>
                </div>
                <a
                  href=""
                  className="text-[#f84525] font-medium text-sm hover:text-red-800"
                >
                  View
                </a>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="p-6 relative flex flex-col min-w-0 mb-4 lg:mb-0 break-words bg-gray-50 dark:bg-gray-800 w-full shadow-lg rounded">
                <div className="rounded-t mb-0 px-0 border-0">
                  <div className="flex flex-wrap items-center px-4 py-2">
                    <div className="relative w-full max-w-full flex-grow flex-1">
                      <h3 className="font-semibold text-base text-gray-900 dark:text-gray-50">
                        Users
                      </h3>
                    </div>
                  </div>
                  <div className="block w-full overflow-x-auto">
                    <table className="items-center w-full bg-transparent border-collapse">
                      <thead>
                        <tr>
                          <th className="px-4 bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-100 align-middle border border-solid border-gray-200 dark:border-gray-500 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                            Role
                          </th>
                          <th className="px-4 bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-100 align-middle border border-solid border-gray-200 dark:border-gray-500 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                            Amount
                          </th>
                          <th className="px-4 bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-100 align-middle border border-solid border-gray-200 dark:border-gray-500 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left min-w-140-px">Percent</th>
                        </tr>
                      </thead>
                      <tbody>
                        {roles.map((role, idx) => {
                          const { percent, color, bg } = getProgressInfo(
                            role.amount
                          );
                          return (
                            <tr
                              key={idx}
                              className="text-gray-700 dark:text-gray-100"
                            >
                              <td className="px-4 py-4 text-xs whitespace-nowrap">
                                {role.name}
                              </td>
                              <td className="px-4 py-4 text-xs whitespace-nowrap">
                                {role.amount}
                              </td>
                              <td className="px-4 py-4 text-xs">
                                <div className="flex items-center">
                                  <span className="mr-2">{percent}%</span>
                                  <div className="relative w-full">
                                    <div
                                      className={`overflow-hidden h-2 text-xs flex rounded ${bg}`}
                                    >
                                      <div
                                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${color}`}
                                        style={{ width: `${percent}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                <div className="flex justify-between mb-4 items-start">
                  <div className="font-medium">Latest Researches</div>
                </div>
                <div className="overflow-hidden">
                  <table className="w-full min-w-[540px]">
                    <tbody>
                      <tr>
                        <td className="py-2 px-4 border-b border-b-gray-50">
                          <div className="flex items-center">
                            <a
                              href="#"
                              className="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate"
                            >
                              Lorem Ipsum
                            </a>
                          </div>
                        </td>
                        <td className="py-2 px-4 border-b border-b-gray-50">
                          <span className="text-[13px] font-medium text-gray-400">
                            02-02-2024
                          </span>
                        </td>
                        <td className="py-2 px-4 border-b border-b-gray-50">
                          <span className="text-[13px] font-medium text-gray-400">
                            17.45
                          </span>
                        </td>
                        <td className="py-2 px-4 border-b border-b-gray-50"></td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b border-b-gray-50">
                          <div className="flex items-center">
                            <a
                              href="#"
                              className="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate"
                            >
                              Lorem Ipsum
                            </a>
                          </div>
                        </td>
                        <td className="py-2 px-4 border-b border-b-gray-50">
                          <span className="text-[13px] font-medium text-gray-400">
                            02-02-2024
                          </span>
                        </td>
                        <td className="py-2 px-4 border-b border-b-gray-50">
                          <span className="text-[13px] font-medium text-gray-400">
                            17.45
                          </span>
                        </td>
                        <td className="py-2 px-4 border-b border-b-gray-50"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md lg:col-span-2">
                <div className="flex justify-between mb-4 items-start">
                  <div className="font-medium">Order Statistics</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div className="rounded-md border border-dashed border-gray-200 p-4">
                    <div className="flex items-center mb-0.5">
                      <div className="text-xl font-semibold">10</div>
                      <span className="p-1 rounded text-[12px] font-semibold bg-blue-500/10 text-blue-500 leading-none ml-1">
                        $80
                      </span>
                    </div>
                    <span className="text-gray-400 text-sm">Active</span>
                  </div>
                  <div className="rounded-md border border-dashed border-gray-200 p-4">
                    <div className="flex items-center mb-0.5">
                      <div className="text-xl font-semibold">50</div>
                      <span className="p-1 rounded text-[12px] font-semibold bg-emerald-500/10 text-emerald-500 leading-none ml-1">
                        +$469
                      </span>
                    </div>
                    <span className="text-gray-400 text-sm">Completed</span>
                  </div>
                  <div className="rounded-md border border-dashed border-gray-200 p-4">
                    <div className="flex items-center mb-0.5">
                      <div className="text-xl font-semibold">4</div>
                      <span className="p-1 rounded text-[12px] font-semibold bg-rose-500/10 text-rose-500 leading-none ml-1">
                        -$130
                      </span>
                    </div>
                    <span className="text-gray-400 text-sm">Canceled</span>
                  </div>
                </div>
                <div>
                  <canvas id="order-chart"></canvas>
                </div>
              </div>
              <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                <div className="flex justify-between mb-4 items-start">
                  <div className="font-medium">Earnings</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AdminDashboard;
