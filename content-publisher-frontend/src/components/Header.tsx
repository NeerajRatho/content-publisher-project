import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export default function Header() {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate("/login");
  };

  return (
    <header className="app-header">
      <div className="container">
        <div className="brand"><Link to="/">Content Publisher</Link></div>
        <nav>
          {auth.isAuthenticated ? (
            <>
              <span className="welcome">Hi, {auth.user?.name ?? auth.user?.email}</span>
              <Link to="/add">Add</Link>
              <button onClick={handleLogout} className="link-button">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
