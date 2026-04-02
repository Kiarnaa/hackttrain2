import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  console.log("AdminRoute - loading:", loading, "user:", user);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Liste des emails admin autorisés
  const adminEmails = [
    "admin@ethkl.com",
    "superadmin@ethkl.com",
    "testadmin@example.com"  // Pour les tests
    // Ajoutez ici les emails des admins
  ];

  const isAdmin = user && adminEmails.includes(user.email);
  console.log("AdminRoute - isAdmin:", isAdmin, "user email:", user?.email);

  return isAdmin ? children : <Navigate to="/" replace />;
};

export default AdminRoute;