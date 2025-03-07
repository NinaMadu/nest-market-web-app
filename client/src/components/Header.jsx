import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import "./Header.css";
import Logo from "../assets/Logo.png";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className="bg-[#c1f0e7] shadow-md w-full">
      <div className="flex flex-wrap justify-between items-center max-w-6xl mx-auto px-4 py-2">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img className="w-20 h-16 sm:w-24 sm:h-20" src={Logo} alt="Logo" />
        </Link>

        {/* Search Bar */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center bg-white rounded-lg shadow-md p-2 w-full sm:w-auto"
        >
          <input
            type="text"
            placeholder="Search here..."
            className="bg-white rounded-lg focus:outline-none w-full sm:w-64 h-10 text-center px-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="flex items-center justify-center w-10 h-10 bg-[#44d1b7] rounded-lg text-white hover:bg-[#06c19f]"
          >
            <FaSearch />
          </button>
        </form>

        {/* Navigation & User Options */}
        <div className="flex items-center gap-4">
          <nav className="hidden sm:flex gap-4">
            <Link to="/" className="text-slate-500 font-bold hover:text-[#06c19f]">
              Home
            </Link>
            <Link to="/about" className="text-slate-500 font-bold hover:text-[#06c19f]">
              About
            </Link>
          </nav>

          {/* Register / Sign-in / Profile */}
          {currentUser ? (
            <Link to="/profile">
              <img
                src={currentUser.avatar}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "path/to/fallback/image.png";
                }}
              />
            </Link>
          ) : (
            <Link to="/sign-up">
              <button className="bg-[#44d1b7] text-white font-bold py-2 px-4 rounded hover:bg-[#06c19f] hidden sm:block">
                Register
              </button>
            </Link>
          )}

          {!currentUser && (
            <Link to="/sign-in">
              <button className="bg-[#44d1b7] text-white font-bold py-2 px-4 rounded hover:bg-[#06c19f]">
                Sign In
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
