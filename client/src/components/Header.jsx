import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import './Header.css';
import Logo from '../assets/Logo.png';

const Header = () => {

const { currentUser } =  useSelector((state) => state.user );
const [searchTerm, setSearchTerm] = useState('');
const navigate = useNavigate();

const handleSubmit = (e) => {
  e.preventDefault();
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set('searchTerm', searchTerm)
  const searchQuery = urlParams.toString()
  navigate(`/search?${searchQuery}`)
}

useEffect(() => {
  const urlParams = new URLSearchParams(location.search)
  const searchTermFormUrl = urlParams.get('searchTerm')
  if (searchTermFormUrl) {
    setSearchTerm(searchTermFormUrl);
  }
}, [location.search]);

return (
  <header className='bg-[#c1f0e7] shadow-md'>
    <div className='flex flex-col justify-center items-center max-w-6xl p-0'>
      <div className='w-full flex justify-between items-center px-3'>
        <Link to="/">
          <h1 className='text-outline text-xl'>
            <img className="w-24 h-20" src={Logo} />
            
          </h1>
        </Link>
        <form onSubmit={handleSubmit} className='text-slate-100 bg-slate-100 m-3 p-2 rounded-lg flex justify-center items-center'>
          <input 
            type='text' 
            placeholder='search here' 
            className='bg-white rounded-lg focus:outline-none w-24 h-10 sm:w-64 text-center mx-1'
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type='submit' className='flex items-center justify-center w-10 h-10 bg-white rounded-lg'>
            <FaSearch className='text-slate-600' />
          </button> 
        </form>
        
        <div className='flex items-end gap-4 pr-0'>
        
        </div>

        <div className='flex items-center gap-4 absolute right-4'>
              <div className="flex items-center gap-4">
        <Link to="/" className=' text-slate-500 font-bold hover:text-[#06c19f] '>
          Home
        </Link>
        <Link to="/about" className='text-slate-500 font-bold hover:text-[#06c19f] '>
          About
        </Link>
        </div>
        
            {!currentUser && (
              <Link to='/sign-up' className='hidden lg:block'>
                <button className='bg-[#44d1b7] text-white font-bold py-2 px-4 rounded hover:bg-[#06c19f]'>
                  Register
                </button>
              </Link>
            )}
            <Link to='/profile'>
              {currentUser ? (
                <img 
                  src={currentUser.avatar} 
                  alt="avatar"  
                  className="w-8 h-8 rounded-full object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src = "path/to/fallback/image.png"; }}
                />
              ) : (
                <button className='bg-[#44d1b7] text-white font-bold py-2 px-4 rounded hover:bg-[#06c19f]'>
                  Sign In
                </button>
              )}
            </Link>
            
          </div>
      </div>
     
    </div>
  </header>
);
}

export default Header