import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-amber-800">HackTTrain2</span>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-stone-700 hover:text-amber-800 font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="text-stone-700 hover:text-amber-800 font-medium transition-colors"
                >
                  Profile
                </Link>
                <button onClick={handleLogout} className="bg-amber-700 text-white px-4 py-2 rounded-md font-medium hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors text-sm">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-stone-700 hover:text-amber-800 font-medium transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-amber-700 text-white px-4 py-2 rounded-md font-medium hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors text-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="w-full h-0.5 bg-amber-700"></div>
      </div>
    </nav>
  );
};

export default Navbar;
