import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./UserContext"; // ✅ import context
import Homepage from "./Homepage";
import Home from "./Home";
import MetadataHome from "./MetadataHome";
import ExamPage from "./ExamPage";
import AuthForm from "./AuthForm";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/exams" element={<Home />} />
          <Route path="/metadata" element={<MetadataHome />} />
          <Route path="/exam/:examId" element={<ExamPage />} />
          <Route path="/auth" element={<AuthForm />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
