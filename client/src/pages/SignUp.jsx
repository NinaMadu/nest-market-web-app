import { set } from 'mongoose';
import { useNavigate ,Link} from 'react-router-dom';
import React, { useState } from 'react'
import OAuth from '../components/OAuth';
import Notification from '../components/Notification';

const SignUp = () => {

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [notification, setNotification] = useState(null);


  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

      try {
        setLoading(true)
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
        const data = await res.json();
        console.log(data);

        if(data.success == false){
          setLoading(false);
          setError(data.message);
          setNotification({ type: 'error', message: data.message });
          return;
        }

        setLoading(false);
        //setError(nul);
        setNotification({ type: 'success', message: 'Sign up successful! Redirecting to sign-in.' });
        setTimeout(() => {
          navigate("/sign-in");
        }, 3000);


      } catch (error) {
        setLoading(false);
        setError(error.message);
        setNotification({ type: 'error', message: error.message });
      }

    
  };



  return (
    <div 
  className="flex justify-center items-center min-h-screen bg-cover bg-center bg-no-repeat p-4"
  style={{ backgroundImage: "url('https://your-public-image-url.com/Untitled.png')" }} // Replace with actual image URL
>
<div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 transform -translate-y-10">
    <h1 className="text-3xl text-center font-semibold text-[#6b7d90] mb-6">Sign Up</h1>
    
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input 
        type="text" 
        placeholder="Username" 
        className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3dd0b1]" 
        id="username" 
        onChange={handleChange} 
      />
      <input 
        type="email" 
        placeholder="Email" 
        className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3dd0b1]" 
        id="email" 
        onChange={handleChange} 
      />
      <input 
        type="password" 
        placeholder="Password" 
        className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3dd0b1]" 
        id="password" 
        onChange={handleChange} 
      />
      
      <button className="bg-[#3dd0b1] text-white p-3 rounded-lg uppercase font-semibold transition-all duration-300 hover:bg-[#6b7d90]">
        {loading ? "Loading.." : "Sign Up"}
      </button>

      <OAuth />
    </form>

    <div className="flex justify-center gap-2 mt-5 text-sm">
      <p className="text-gray-600">Already signed up?</p>
      <Link to="/sign-in" className="text-[#3dd0b1] font-medium hover:underline">
        Sign In
      </Link>
    </div>

    {error && <p className="text-red-500 text-center mt-4">{error}</p>}
  </div>

   {/* Notification Component */}
   {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)} // Close the notification when the user clicks the "X"
        />
      )}
</div>

  )
}

export default SignUp