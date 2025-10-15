import { FaTrashAlt } from "react-icons/fa";
import { HiChevronUpDown, HiPencil } from "react-icons/hi2";
import DirectorateSideNavBar from "../Navigation/DirectorateSideNavBar";
import Header from "../../../../components/Header_Nav_Bar/Header";
import { useEffect, useState } from "react";
import axios from "axios";



interface UsersItem {
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  status: string;
}


const DirectorateUsersList: React.FC = () => {

    const [users, setUsers] = useState<UsersItem[]>([]);
    
         useEffect(() => {
           (async () => {
             try {
               const response = await axios.get<UsersItem[]>(
                 "http://localhost:4001/admin-users-list"
               );
               setUsers(response.data);
             } catch (error) {
               console.log("error: ", error);
             }
           })();
         }, []);
    
    
    return (
      <>
        <Header />
        <div className="flex min-h-screen bg-gray-100">
          <DirectorateSideNavBar />
          <section className="ml-[10%] mt-[2%]">
            <div className="flex min-w-[1200px] mx-[10%] mt-12">
              <div className="relative flex flex-col w-full h-full text-slate-700 bg-white shadow-md rounded-xl bg-clip-border">
                <div className="relative mx-4 mt-4 overflow-hidden text-slate-700 bg-white rounded-none bg-clip-border">
                  <div className="flex items-center justify-between ">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">
                        Users List
                      </h3>
                      <p className="text-slate-500">
                        Review each person before edit
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-0 overflow-scroll">
                  <table className="w-full mt-4 text-left table-auto min-w-max">
                    <thead>
                      <tr>
                        <th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                          <p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
                            Member
                            <HiChevronUpDown className="w-4 h-4" />
                          </p>
                        </th>
                        <th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                          <p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
                            Role
                            <HiChevronUpDown className="w-4 h-4" />
                          </p>
                        </th>
                        <th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                          <p className="flex items-center justify-between gap-2 font-sans text-sm  font-normal leading-none text-slate-500">
                            Status
                            <HiChevronUpDown className="w-4 h-4" />
                          </p>
                        </th>
                        <th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                          <p className="flex items-center justify-between gap-2 font-sans text-sm  font-normal leading-none text-slate-500">
                            Action
                          </p>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, index) => (
                        <tr key={index}>
                          <td className="p-4 border-b border-slate-200">
                            <div className="flex items-center gap-3">
                              {/* <img
                                src={user.imageUrl}
                                alt={user.name}
                                className="relative inline-block h-9 w-9 !rounded-full object-cover object-center"
                              /> */}
                              <div className="flex flex-col">
                                <p className="text-sm font-semibold text-slate-700">
                                  {user.firstname + " " + user.lastname}
                                </p>
                                <p className="text-sm text-slate-500">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 border-b border-slate-200">
                            <div className="flex flex-col">
                              <p className="text-sm font-semibold text-slate-700">
                                {user.role}
                              </p>
                              <p className="text-sm text-slate-500">
                                {user.role}
                              </p>
                            </div>
                          </td>
                          <td className="p-4 border-b border-slate-200">
                            <div className="w-max">
                              <div
                                className={`relative grid items-center px-2 py-1 font-sans text-xs font-bold text-green-900 uppercase rounded-md select-none whitespace-nowrap ${
                                  user.status === "Active"
                                    ? "bg-green-600"
                                    : "bg-red-400 text-slate-500"
                                }`}
                              >
                                <span className="text-white">
                                  {user.status}
                                </span>
                              </div>
                            </div>
                          </td>
                          {/* <td className="p-4 border-b border-slate-200">
                            <p className="text-sm text-slate-500">
                              {user.date}
                            </p>
                          </td> */}
                          <td className="p-4 border-b border-slate-200">
                            <button
                              className="relative cursor-pointer h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-slate-900 transition-all hover:bg-slate-900/10 active:bg-slate-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                              type="button"
                            >
                              <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                                <HiPencil className="w-4 h-4" />
                              </span>
                            </button>
                            <button
                              className="relative cursor-pointer h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-red-600 transition-all hover:bg-red-600/10 active:bg-red-600/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                              type="button"
                            >
                              <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                                <FaTrashAlt className="w-4 h-4" />
                              </span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between p-3">
                  <p className="block text-sm text-slate-500">Page 1 of 10</p>
                  <div className="flex gap-1">
                    <button
                      className="rounded border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all hover:opacity-75 focus:ring focus:ring-slate-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                      type="button"
                    >
                      Previous
                    </button>
                    <button
                      className="rounded border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all hover:opacity-75 focus:ring focus:ring-slate-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                      type="button"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </>
    );
}

export default DirectorateUsersList;