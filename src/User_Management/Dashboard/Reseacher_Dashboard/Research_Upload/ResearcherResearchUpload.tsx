import { useState } from "react";
import Header from "../../../../components/Header_Nav_Bar/Header";
import ResearcherSideNavBar from "../Navigations/ResearcherSideNavbar";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../firebase";
import { FaCloudUploadAlt } from "react-icons/fa";
import API from "../../../../api/axios";

const ResearcherResearchUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null); // Updated to support any file type
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [researchTitle, setResearchTitle] = useState("");
  const [researchType, setResearchType] = useState("");

  const allowedFileTypes = ["application/pdf", "application/msword"]; // .pdf and .doc MIME types

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      // Check if the file is of the allowed types
      if (!allowedFileTypes.includes(file.type)) {
        setError("Please select a PDF or DOC file.");
        setSelectedFile(null);
        setFilePreview(null);
        return;
      }

      setError(null); // Reset error if the file type is valid
      setSelectedFile(file);

      // Handle file preview (for PDFs and DOCs, just display the file name and size)
      setFilePreview(null);
    }
  };

  const handleCreate = async () => {
    if (!selectedFile) {
      setError("Please select a file");
      return;
    }

    setUploading(true); // Start uploading state

    try {
      // Upload the file to Firebase Storage
      const storageRef = ref(storage, `researches/${selectedFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Progress tracking
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.error("Upload failed:", error);
          setUploading(false);
          setError("Upload failed. Please try again.");
        },
        async () => {
          // Get the download URL after upload is successful
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

const storedUser = localStorage.getItem("user");

let userId = "";
let firstname = "";

if (storedUser) {
  try {
    const parsedUser = JSON.parse(storedUser);
    userId = parsedUser.id;
    firstname = parsedUser.firstname;
  } catch (e) {
    console.error("Error parsing user from localStorage", e);
  }
}
          console.log(userId, firstname);
          
          // Now, send the file URL and other details to the backend
          const formData = {
            researchFile: downloadURL, // Send the Firebase file URL
            researchTitle,
            researchType,
            status: "submitted",
            researcher: {
              id: userId,
              name: firstname,
            },
          };

          const response = await API.post(
            "/research-upload",
            formData
          );
          const { message } = response.data;

          if (message === "File uploaded successfuly") {
            alert("File Uploaded Successfully");
          } else {
            setError(message.error);
          }

          setUploading(false); // End uploading state
        }
      );
    } catch (error) {
      console.error("There was an error uploading file:", error);
      setUploading(false);
      alert("There was an error uploading file. Please try again.");
    }

    // Reset form after successful creation
    setResearchTitle("");
    setResearchType("");
    setSelectedFile(null);
    setFilePreview(null);
  };

  return (
    <>
      <Header />
      <div className="flex min-h-screen bg-gray-100">
        <ResearcherSideNavBar />
        <section></section>
        <div className="flex items-center justify-center mt[-200px] w-full">
          <div className="mx-auto w-full max-w-[550px]">
            <form>
              <div className="mb-5">
                <label
                  htmlFor="name"
                  className="mb-3 block text-base font-medium text-[#07074D]"
                >
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  placeholder="Research Title"
                  onChange={(e) => setResearchTitle(e.target.value)}
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="role"
                  className="mb-3 block text-base font-medium text-[#07074D]"
                >
                  Type
                </label>
                <select
                  name="researchtype"
                  id="researchtype"
                  onChange={(e) => setResearchType(e.target.value)}
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                >
                  <option value="">Select a type</option>
                  <option value="normalresearch">Normal Research</option>
                  <option value="communityengagement">
                    Community Engagement
                  </option>
                </select>
              </div>

              <div className="mb-5">
                <label
                  htmlFor="role"
                  className="mb-3 block text-base font-medium text-[#07074D]"
                >
                  Upload File
                </label>
                <label id="select-file" className="cursor-pointer">
                  <FaCloudUploadAlt className="cursor-pointer size-16 hover:text-gray-700 w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" />
                  <input
                    hidden
                    type="file"
                    accept=".pdf,.doc" // Restrict to .pdf and .doc files
                    onChange={handleFileChange}
                  />
                </label>
                {selectedFile && !filePreview && (
                  <div className="mt-2 text-gray-500">
                    <p>{selectedFile.name}</p>
                    <p>{(selectedFile.size / 1024).toFixed(2)} KB</p>
                  </div>
                )}

                {error && (
                  <div className="text-red-500 text-xs mt-2">{error}</div>
                )}
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleCreate}
                  className="hover:shadow-form rounded-md bg-[#6A64F1] py-3 px-8 text-base font-semibold text-white outline-none cursor-pointer"
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResearcherResearchUpload;
