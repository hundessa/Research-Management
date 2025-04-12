import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./User_Management/Login";
import HomePage from "./Home_Page/HomePage";
import AdminDashboard from "./User_Management/Dashboard/Admin_Dashboard/AdminDashboard";
import UserCreation from "./User_Management/Dashboard/Admin_Dashboard/Create_User/UserCreation";
import UsersList from "./User_Management/Dashboard/Admin_Dashboard/Users_List/UsersList";
import ResearcherDashboard from "./User_Management/Dashboard/Reseacher_Dashboard/ResearcherDashboard";
import ResearcherResearchesList from "./User_Management/Dashboard/Reseacher_Dashboard/Researcher_Researches_List/ResearcherResearchesList";
import ResearcherResearchUpload from "./User_Management/Dashboard/Reseacher_Dashboard/Research_Upload/ResearcherResearchUpload";


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users-list" element={<UsersList />} />
          <Route path="admin/user-creation" element={<UserCreation />} />
          <Route path="/researcher/dashboard" element={<ResearcherDashboard />} />
          <Route path="/researcher/researches" element={<ResearcherResearchesList />} />
          <Route path="/researcher/research-upload" element={<ResearcherResearchUpload />} />
      </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
