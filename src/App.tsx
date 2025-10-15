import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./User_Management/Login";
import HomePage from "./Home_Page/HomePage";
import AdminDashboard from "./User_Management/Dashboard/Admin_Dashboard/AdminDashboard";
import UserCreation from "./User_Management/Dashboard/Admin_Dashboard/Create_User/UserCreation";
import UsersList from "./User_Management/Dashboard/Admin_Dashboard/Users_List/UsersList";
import ResearcherDashboard from "./User_Management/Dashboard/Reseacher_Dashboard/ResearcherDashboard";
import ResearcherResearchesList from "./User_Management/Dashboard/Reseacher_Dashboard/Researcher_Researches_List/ResearcherResearchesList";
import ResearcherResearchUpload from "./User_Management/Dashboard/Reseacher_Dashboard/Research_Upload/ResearcherResearchUpload";
import AdminResearchesList from "./User_Management/Dashboard/Admin_Dashboard/Researches_List/AdminResearcheslist";
import { NotificationProvider } from "./contexts/NotificationContext";
import NotificationList from "./components/Notification/NotificationLists";
import SingleResearchPage from "./components/Notification/SingleResearchPage";
import DeanDashboard from "./User_Management/Dashboard/Dean_Dashboard/DeanDashboard";
import DeanResearchesList from "./User_Management/Dashboard/Dean_Dashboard/Dean_Researches_List/DeanResearchesList";
import DeanSingleResearchPage from "./User_Management/Dashboard/Dean_Dashboard/Dean_Researches_List/DeanSingleResearchPage";
import DeanNotification from "./User_Management/Dashboard/Dean_Dashboard/Dean_Notificaion/DeanNotification";
import CoordinatorDashBoard from "./User_Management/Dashboard/Coordinator_Dashboard/CoordinatorDashboard";
import CoordinatorUsersList from "./User_Management/Dashboard/Coordinator_Dashboard/Coordinator_Users_List/CoordinatorUserslist";
import CoordinatorSingleUserPage from "./User_Management/Dashboard/Coordinator_Dashboard/Coordinator_Reseache_Page/CoordinatorSIngleResearchPage";
import CoordinatorResearchesList from "./User_Management/Dashboard/Coordinator_Dashboard/Coordinator_Reseache_Page/CoordinatorResearchesList";
import CoordinatorNotification from "./User_Management/Dashboard/Coordinator_Dashboard/Coordinator_Notification/CoordinatorNotification";
import ReviewerDashboard from "./User_Management/Dashboard/Reviewer_Dashboard/ReviewerDashboard";
import ReviewerResearchList from "./User_Management/Dashboard/Reviewer_Dashboard/Reviewer_Research_List/ReviewerResearchList";
import ReviewerSingleResearch from "./User_Management/Dashboard/Reviewer_Dashboard/Reviewer_Research_List/ReviewerSingleResearch";
import ResearcherNotification from "./User_Management/Dashboard/Reseacher_Dashboard/Researcher_Notification/ResearcherNotification";
import DirectorateDashboard from "./User_Management/Dashboard/Directorate_Dashboard/DirectorateDashboard";
import DirectorateUsersList from "./User_Management/Dashboard/Directorate_Dashboard/Directorate_Users_List/DirectorateUsersList";
import DirectorateResearchesList from "./User_Management/Dashboard/Directorate_Dashboard/Directorate_Research_List/DirectorateResearchList";
import ResearcherFinanceForm from "./User_Management/Dashboard/Reseacher_Dashboard/Researcher_Finance_Form/ResearcherFinanceForm";
import ResearcherSingleResearchPage from "./User_Management/Dashboard/Reseacher_Dashboard/Researcher_Researches_List/ResearcherSingleResearchPage";
import DirectorateNotification from "./User_Management/Dashboard/Directorate_Dashboard/Directorate_Notification/DirectorateNotification";
import DirectorateFinanceRequests from "./User_Management/Dashboard/Directorate_Dashboard/Directorate_Finance/DirectorateFinance";
import FinanceDashboard from "./User_Management/Dashboard/Finance_Dashboard/FinanceDashboard";
import FinanceNotification from "./User_Management/Dashboard/Finance_Dashboard/FinanceNotification";
import FinanceFinanceRequests from "./User_Management/Dashboard/Finance_Dashboard/FinanceFinanceRequest";
import ResearcherFinanceReports from "./User_Management/Dashboard/Reseacher_Dashboard/Researcher_Finance_Form/ResearcherFinanceReport";
import CoordinatorFinanceRequests from "./User_Management/Dashboard/Coordinator_Dashboard/Coordinator_Finance/CoordinatorFinanceRequestList";

function App() {
  return (
    <>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users-list" element={<UsersList />} />
            <Route path="/admin/user-creation" element={<UserCreation />} />
            <Route path="/admin/researches-list"element={<AdminResearchesList />}/>
            <Route path="/admin/researches-list/:id" element={<SingleResearchPage />} />
            <Route path="/admin/notifications" element={<NotificationList />} />
            <Route path="/dean/dashboard" element={<DeanDashboard />} />
            <Route path="/dean/researches-list" element={<DeanResearchesList />} />
            <Route path="/dean/researches-list/:id" element={<DeanSingleResearchPage />} />
            <Route path="/dean/notifications" element={<DeanNotification />} />
            <Route path="/coordinator/dashboard" element={<CoordinatorDashBoard />} />
            <Route path="/coordinator/users-list" element={<CoordinatorUsersList />} />
            <Route path="/coordinator/researches-list" element={<CoordinatorResearchesList />} />
            <Route path="/coordinator/researches-list/:id" element={<CoordinatorSingleUserPage />} />
            <Route path="/coordinator/notifications" element={<CoordinatorNotification />} />
            <Route path="/coordinator/finance-requests-list" element={<CoordinatorFinanceRequests />} />
            <Route path="/researcher/dashboard" element={<ResearcherDashboard />} />
            <Route path="/researcher/researches" element={<ResearcherResearchesList />} />
            <Route path="/researcher/researches/:id" element={<ResearcherSingleResearchPage />} />
            <Route path="/researcher/research-upload" element={<ResearcherResearchUpload />} />
            <Route path="/researcher/notification" element={<ResearcherNotification />} />
            <Route path="/researcher/finance-form" element={<ResearcherFinanceForm researchId={undefined} />} />
            <Route path="/researcher/finance-report" element={<ResearcherFinanceReports />} />
            <Route path="/reviewer/dashboard" element={<ReviewerDashboard />} />
            <Route path="/reviewer/researches-list" element={<ReviewerResearchList />} />
            <Route path="/reviewer/researches-list/:id" element={<ReviewerSingleResearch />} />
            <Route path="/directorate/dashboard" element={<DirectorateDashboard />} />
            <Route path="/directorate/users-list" element={<DirectorateUsersList />} />
            <Route path="/directorate/researches-list" element={<DirectorateResearchesList />} />
            <Route path="/directorate/notifications" element={<DirectorateNotification />} />
            <Route path="/directorate/finance-request" element={<DirectorateFinanceRequests />} />
            <Route path="/finance/dashboard" element={<FinanceDashboard />} />
            <Route path="/finance/notifications" element={<FinanceNotification />} />
            <Route path="/finance/finance-request" element={<FinanceFinanceRequests />} />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </>
  );
}

export default App;
