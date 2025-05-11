import Disclaimer from "./Disclaimer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./UserContext"; // ✅ import context
import Homepage from "./Homepage";
import Home from "./Home";
import MetadataHome from "./MetadataHome";
import ExamPage from "./pages/ExamPage";
import AuthForm from "./AuthForm";
import ProtectedRoute from "./components/ProtectedRoute";

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
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route
            path="/exams/:examId"
            element={
              <ProtectedRoute>
                <ExamPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
