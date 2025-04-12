import Header from "../../../components/Header_Nav_Bar/Header";
import ResearcherSideNavBar from "./Navigations/ResearcherSideNavbar";


const ResearcherDashboard: React.FC = () => {
    return (
        <>
            <Header />
            <div className="flex">
<ResearcherSideNavBar />
            <section></section>
            </div>
        </>
    )
}

export default ResearcherDashboard;