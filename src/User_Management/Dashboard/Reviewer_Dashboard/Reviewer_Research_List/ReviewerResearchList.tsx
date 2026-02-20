import Header from "../../../../components/Header_Nav_Bar/Header";
import ReviewerSideNavBar from "../Navigation/ReviewerSideNavBar";
import { HiChevronUpDown, HiPencil } from "react-icons/hi2";
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../../../api/axios";


interface ResearchItem {
  _id: string;
  researchTitle: string;
  researchType: string;
  status: string;
  createdAt: string;
}


const ReviewerResearchList: React.FC = () => {

  // const { reviewerId } = useParams<{ reviewerId: string }>();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const reviewerId = user?.id;
    const [research, setResearch] = useState<ResearchItem[]>([]);
    const navigate = useNavigate();

  useEffect(() => {
    if (!reviewerId) {
      console.warn("Reviewer ID is missing");
      return;
    }
      (async () => {
        try {
          const response = await API.get<ResearchItem[]>(
            `/reviewer-researches/${reviewerId}`
            // { role: "Admin" },
            // { withCredentials: true }
          );
          setResearch(response.data.reverse());
        } catch (err) {
          console.log("error: ", err);
        }
      })();
    }, [reviewerId]);


    if (!research) {
      return <div>Loading...</div>;
    }
    return (
      <>
        <Header />
        <div className="flex min-h-screen bg-gray-100">
          <ReviewerSideNavBar />
          <section>
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
                            Action
                          </p>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {research.map((research, index) => (
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
                                className={`relative grid items-center px-2 py-1 font-sans text-xs font-bold text-green-900 uppercase rounded-md select-none whitespace-nowrap ${
                                  research.status === "Active"
                                    ? "bg-green-600"
                                    : "bg-red-400 text-slate-500"
                                }`}
                              >
                                <span className="text-white">
                                  {research.status}
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
                              onClick={() =>
                                navigate(
                                  `/reviewer/researches-list/${research._id}`
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
          </section>
        </div>
      </>
    );
}

export default ReviewerResearchList;