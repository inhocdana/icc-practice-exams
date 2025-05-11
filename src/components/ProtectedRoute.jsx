import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import LoadingSpinner from "./LoadingSpinner"; // Create this if you don't have one
import Toast from "./Toast"; // Import the Toast component

const ProtectedRoute = ({ children, examId }) => {
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [user, setUser] = useState(null);
  const [showToast, setShowToast] = useState(false);

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

        const hasValidAccess = !error && data && data.ipmc2021_paid;
        setHasAccess(hasValidAccess);

        // Show toast if user doesn't have access
        if (!hasValidAccess) {
          setShowToast(true);
        }
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
    return <Navigate to="/" replace state={{ showAccessDeniedToast: true }} />;
  }

  return children;
};

export default ProtectedRoute;
