import { HiChevronUpDown, HiPencil } from "react-icons/hi2";
import Header from "../../../../components/Header_Nav_Bar/Header";
import DeanSideNavBar from "../Navigations/DeanSideNavBar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaTrashAlt } from "react-icons/fa";


interface ResearchItem {
  _id: string;
  researchTitle: string;
  researchType: string;
  status: string;
  createdAt: string;
}

const DeanResearchesList: React.FC = () => {

     const [research, setResearch] = useState<ResearchItem[]>([]);
      const navigate = useNavigate();
    
      useEffect(() => {
        (async () => {
          try {
            const response = await axios.get<ResearchItem[]>(
              "http://localhost:4001/dean/researches-list",
              // { role: "Admin" },
              // { withCredentials: true }
            );
            setResearch(response.data.reverse());
          } catch (err) {
            console.log("error: ", err);
          }
        })();
      }, []);
  
  
    return (
      <>
        <Header />
        <section className="flex min-h-screen bg-gray-100">
          <DeanSideNavBar />
          <div>
            <div className="flex min-w-[1200px] ml-[25%] mt-[10%] bg-gray-100">
              <div className="relative flex flex-col w-full h-full text-slate-700 bg-white shadow-md rounded-xl bg-clip-border">
                <div className="relative mx-4 mt-4 overflow-hidden text-slate-700 bg-white rounded-none bg-clip-border">
                  <div className="flex items-center justify-between ">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">
                        Researches List
                      </h3>
                      {/* <p className="text-slate-500">
                                            Review each person before edit
                                          </p> */}
                    </div>
                  </div>
                </div>
                <div className="p-0 overflow-scroll">
                  <table className="w-full mt-4 text-left table-auto min-w-max">
                    <thead>
                      <tr>
                        <th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                          <p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
                            Title
                            <HiChevronUpDown className="w-4 h-4" />
                          </p>
                        </th>
                        <th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                          <p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
                            Type
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
                            Date
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
                      {research.map((research: ResearchItem, index) => (
                        <tr key={index}>
                          <td className="p-4 border-b border-slate-200">
                            <div className="flex items-center gap-3">
                              {/* <img
                                                                        src={research.imageUrl}
                                                                        alt={research.name}
                                                                        className="relative inline-block h-9 w-9 !rounded-full object-cover object-center"
                                                                      /> */}
                              <div className="flex flex-col">
                                <p className="text-sm font-semibold text-slate-700 truncate">
                                  {/* {research.researchName} */}
                                  {research.researchTitle.length > 50
                                    ? `${research.researchTitle.substring(
                                        0,
                                        50
                                      )}...`
                                    : research.researchTitle}
                                </p>
                                {/* <p className="text-sm text-slate-500">
                                                                          {research.researcheremail}
                                                                        </p> */}
                              </div>
                            </div>
                          </td>
                          <td className="p-4 border-b border-slate-200">
                            <div className="flex flex-col">
                              <p className="text-sm font-semibold text-slate-700">
                                {research.researchType}
                              </p>
                            </div>
                          </td>
                          <td className="p-4 border-b border-slate-200">
                            <div className="w-max">
                              <div
                                className={`relative grid items-center px-2 py-1 font-sans text-xs font-bold uppercase rounded-md select-none whitespace-nowrap ${
                                  research.status === "submitted"
                                    ? "bg-green-600"
                                    : research.status === "reviewed"
                                    ? "bg-yellow-400"
                                    : research.status === "underdefence"
                                    ? "bg-blue-400"
                                    : research.status === "finalized"
                                    ? "bg-violet-400"
                                    : research.status === "accepted"
                                    ? "bg-blue-800"
                                    : "bg-red-400 text-white"
                                }`}
                              >
                                <span className="text-white">
                                  {research.status}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 border-b border-slate-200">
                            <p className="text-sm text-slate-500">
                              {research.createdAt
                                ? new Date(research.createdAt).toLocaleString()
                                : "Unknown"}
                            </p>
                          </td>
                          <td className="p-4 border-b border-slate-200">
                            <button
                              className="relative cursor-pointer h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-slate-900 transition-all hover:bg-slate-900/10 active:bg-slate-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/dean/researches-list/${research._id}`
                                )
                              }
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
          </div>
        </section>
      </>
    );
}

export default DeanResearchesList;