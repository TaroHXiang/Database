import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./login";
import AdminDashboard from "./AdminDashboard";
import ReaderUserPage from "./readeruser";
import AuthorManager from "./authoruser";
import WorkManager from "./work";
import RecommendManager from "./recommend";
import RewardManager from "./reward";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/reader" element={<ReaderUserPage />} />
        <Route path="/author" element={<AuthorManager />} />
        <Route path="/work" element={<WorkManager/>} />
        <Route path="/recommend" element={<RecommendManager/>} />
        <Route path="/reward" element={<RewardManager/>} />
      </Routes>
    </Router>
  );
}
