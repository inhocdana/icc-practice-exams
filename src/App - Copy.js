import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./Homepage"; // New marketing homepage
import MetadataHome from "./MetadataHome";
import ExamPage from "./ExamPage";
import AuthForm from "./AuthForm";
import Home from "./Home - Copy";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} /> {/* New homepage */}
        <Route path="/exams" element={<Home />} />{" "}
        {/* Clean route for quiz selector */}
        <Route path="/metadata" element={<MetadataHome />} />
        <Route path="/exam/:examId" element={<ExamPage />} />
        <Route path="/auth" element={<AuthForm />} />
      </Routes>
    </Router>
  );
}

export default App;
