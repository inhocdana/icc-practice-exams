import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Homepage from "./Homepage"; // ✅ New import
import MetadataHome from "./MetadataHome";
import ExamPage from "./ExamPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/preview" element={<Homepage />} /> {/* ✅ New route */}
        <Route path="/metadata" element={<MetadataHome />} />
        <Route path="/exam/:examId" element={<ExamPage />} />
      </Routes>
    </Router>
  );
}

export default App;

