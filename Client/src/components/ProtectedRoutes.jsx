import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import { useLoadUserQuery } from "@/features/api/authApi";

export const ProtectedRoute = ({ children }) => {
    const { data, isLoading } = useLoadUserQuery();
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export const AuthenticatedUser = ({ children }) => {
    const { isAuthenticated } = useSelector((store) => store.auth);

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export const AdminRoute = ({ children }) => {
    const { data, isLoading } = useLoadUserQuery();
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    if (isLoading) {
        return <LoadingSpinner />;
    }
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (user?.role !== "Trainer" && user?.role !== "Admin") {
        return <Navigate to="/" replace />;
    }

    return children;
};
