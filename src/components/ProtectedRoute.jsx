import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import LoadingSpinner from "./LoadingSpinner"; // Create this if you don't have one

const ProtectedRoute = ({ children, examId }) => {
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check auth status
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      if (!user) {
        setLoading(false);
        return;
      }

      // Check exam access
      if (examId === "ipmc2021") {
        const { data, error } = await supabase
          .from("exam_access")
          .select("ipmc2021_paid")
          .eq("user_id", user.id)
          .single();

        setHasAccess(!error && data && data.ipmc2021_paid);
      }
      setLoading(false);
    };

    getUser();
  }, [examId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: window.location.pathname }}
      />
    );
  }

  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
