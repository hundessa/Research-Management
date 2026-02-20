import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Header from "../../../../components/Header_Nav_Bar/Header";
import SideNavBar from "../../../../components/Side_Nav_Bar/SideNavBar";
import API from "../../../../api/axios";

const UserCreation: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false); // 👈 Track visibility
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const generatePassword = () => {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let newPassword = "";
    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      newPassword += charset[randomIndex];
    }
    setPassword(newPassword);
  };

  const handleSubmit = async () => {
    try {
      const response = await API.post("/signup", {
        firstname,
        lastname,
        email,
        password,
        role,
      });

    const { message } = response.data;
    if (message === "User already exists") {
      alert("User already exists");
    } else {
      alert("Account created")
    }
    } catch (error) {
      console.log("There was an error creating user: ", error);
      alert("there was an error creating a user. Please try again")
    }
    
  }

  return (
    <>
      <Header />
      <div className="flex min-h-screen bg-gray-100">
        <SideNavBar />
        <div className="flex items-center justify-center mt[-200px] w-full">
          <div className="mx-auto w-full max-w-[550px]">
            <form onSubmit={(e) => e.preventDefault()} method="POST">
              <div className="mb-5">
                <label
                  htmlFor="name"
                  className="mb-3 block text-base font-medium text-[#07074D]"
                >
                  First Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  placeholder="First Name"
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="subject"
                  className="mb-3 block text-base font-medium text-[#07074D]"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  name="subject"
                  id="subject"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  placeholder="Last Name"
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="email"
                  className="mb-3 block text-base font-medium text-[#07074D]"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@domain.com"
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="email"
                  className="mb-3 block text-base font-medium text-[#07074D]"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 pr-12 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  />

                  {/* 👁 Eye icon inside the input field */}
                  <div
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-[#6B7280]"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={generatePassword}
                  className="rounded-md bg-[#6A64F1] text-white px-4 py-2 font-medium hover:bg-[#5b58e5] mt-2"
                >
                  Generate
                </button>
              </div>
              <div className="mb-5">
                <label
                  htmlFor="role"
                  className="mb-3 block text-base font-medium text-[#07074D]"
                >
                  Role
                </label>
                <select
                  name="role"
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                >
                  <option value="">Select a role</option>
                  <option value="researcher">Researcher</option>
                  <option value="dean">Faculty Dean</option>
                  <option value="reviewer">Reviewer</option>
                  <option value="coordinator">Coordinator</option>
                  <option value="directorate">Directorate</option>
                  <option value="finance">Finance Head</option>
                </select>
              </div>

              <div>
                <button className="hover:shadow-form rounded-md bg-[#6A64F1] py-3 px-8 text-base font-semibold text-white outline-none" onClick={handleSubmit}>
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserCreation;
