import axios from "axios";
import Header from "../Header_Nav_Bar/Header";
import SideNavBar from "../Side_Nav_Bar/SideNavBar";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


interface Researchers {
  name: string;
  // Add any other properties that a researcher object might have
}

interface ResearchItem {
  researchTitle: string;
  researchType: string;
  researchFile: string;
  status: string;
  researcher: Researchers;
  name: string;
  createdAt: string;
}

const SingleResearchPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [research, setResearch] = useState<ResearchItem | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          `http://localhost:4001/admin/researches-list/${id}`
        );
        setResearch(res.data);
        
      } catch (error) {
        console.error("Error fetching research detail:", error);
      }
    })();
  }, [id]);


  const handleStatusUpdate = async (newStatus: string) => {
    if (!research || !id) return;

    try {
      // Update research status
       await axios.patch(
        `http://localhost:4001/admin/researches-list/${id}`,
        {
          status: newStatus,
        }
      );

      setResearch((prev) => (prev ? { ...prev, status: newStatus } : prev));

      // If accepted, notify the dean
      if (newStatus === "accepted") {
        await axios.post("http://localhost:4001/admin/notification", {
          to: "Dean", // or specific dean ID/email
          message: `A new research titled "${research.researchTitle}" has been accepted.`,
          researchId: id,
          researcher: research.researcher.name,
          title: research.researchTitle,
          type: research.researchType,
          file: research.researchFile,
        });
      }

      alert(
        `Research ${
          newStatus === "accepted" ? "accepted" : "declined"
        } successfully.`
      );
    } catch (error) {
      console.error("Failed to update research status:", error);
      alert("Failed to update status.");
    }
  };

  if (!research) return <p>Loading...</p>;

  return (
    <>
      <Header />
      <section className="flex min-h-screen bg-gray-100">
        <SideNavBar />
        <div className="ml-[25%] mt-[5%]">
          <div className="space-y-6 text-2xl">
            <h1>
              <span className="text-2xl font-bold">Title: </span>
              {research.researchTitle}
            </h1>
            <p>
              <span className="font-bold">Type:</span> {research.researchType}
            </p>
            <p>
              <span className="font-bold">Status:</span> {research.status}
            </p>
            <p>
              <span className="font-bold">Researcher:</span>{" "}
              {research.researcher?.name || "Unknown"}
            </p>
            <p>
              <span className="font-bold">Uploaded At:</span>{" "}
              {research.createdAt
                ? new Date(research.createdAt).toLocaleString()
                : "Unknown"}
            </p>
            {/* If you have a file */}
            <a
              href={research.researchFile}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              View Uploaded File
            </a>
          </div>
          <div className="space-x-6 mt-6">
            <button
              className="px-4 py-2 bg-green-700 text-white rounded-lg cursor-pointer"
              onClick={() => handleStatusUpdate("accepted")}
            >
              Accept
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-lg cursor-pointer"
              onClick={() => handleStatusUpdate("rejected")}
            >
              Decline
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default SingleResearchPage;