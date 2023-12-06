import { Route, Routes } from "react-router-dom";
import "./App.css";
import DashboardPage from "./pages/DashboardPage";
import AdminRoute from "./Layouts/AdminRoute";
import CustomerPage from "./pages/CustomerPage";
import LoanApplicationPage from "./pages/LoanApplicationPage";
import FeedBackPage from "./pages/FeedBackPage";
import ProjectsPage from "./pages/ProjectsPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import Hometype from "./pages/Package/Hometype";
import Packages from "./pages/Package/Packages";
import AddSettings from "./pages/AddSettings";
// import CustomerPackage from "./pages/CustomerPackage";
import Materials from "./pages/Package/Materials";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<AdminRoute />}>
          {/* <Route index element={<DashboardPage />} /> */}
          <Route path="/customer" element={<CustomerPage />} />
          <Route path="/loan" element={<LoanApplicationPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/feedback" element={<FeedBackPage />} />
          <Route path="/Settings" element={<SettingsPage />} />
          <Route path="/hometype" element={<Hometype />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/addsettings" element={<AddSettings />} />
          {/* <Route path="/customer-package/:userId" element={<CustomerPackage/>}/> */}
          <Route path="/materials" element={<Materials />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>
  );
}

export default App;
