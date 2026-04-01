import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
          Welcome to{" "}
          <span className="text-primary-600">HackTTrain2</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          A full-stack PERN application with authentication, protected routes,
          and a modern UI.
        </p>
        <div className="flex justify-center gap-4">
          {user ? (
            <Link to="/dashboard" className="btn-primary text-base px-8 py-3">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn-primary text-base px-8 py-3">
                Get Started
              </Link>
              <Link to="/login" className="btn-secondary text-base px-8 py-3">
                Login
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: "Secure Authentication",
            desc: "JWT-based auth with bcrypt password hashing and protected routes.",
            icon: "🔐",
          },
          {
            title: "PostgreSQL Database",
            desc: "Relational data storage with a clean model layer using pg.",
            icon: "🗄️",
          },
          {
            title: "Modern UI",
            desc: "Built with React, React Router, and TailwindCSS for a great UX.",
            icon: "🎨",
          },
        ].map((f) => (
          <div key={f.title} className="card text-center">
            <div className="text-4xl mb-4">{f.icon}</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
            <p className="text-gray-500 text-sm">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
