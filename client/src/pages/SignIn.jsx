//export { set } from 'mongoose';
import { useNavigate ,Link} from 'react-router-dom';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

const SignIn = () => {

  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  



  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

      try {
        dispatch(signInStart());

        const res = await fetch("/api/auth/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        console.log(data);

         /*if(data.success == false){
          dispatch(signInFailure(data.message));
          return;
        }*/

        if (!res.ok || data.success === false) {
          throw new Error(data.message || 'Failed to sign in');
        }

        dispatch(signInSuccess(data));
        navigate("/");


      } catch (error) {
       dispatch(signInFailure(error.message));
      }

    
  };



  return (
    <div 
    className="flex justify-center items-center min-h-screen bg-cover bg-center bg-no-repeat p-4"
    style={{ backgroundImage: "url('gs://mern-market-a23ec.appspot.com/Untitled.png')" }}
  >
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 transform -translate-y-10">
        <h1 className="text-3xl text-center font-semibold text-[#6b7d90] mb-6">Sign In</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            {loading ? "Loading.." : "Sign In"}
          </button>
          <OAuth />
        </form>
  
        <div className="flex justify-center gap-2 mt-5 text-sm">
          <p className="text-gray-600">Don't have an account?</p>
          <Link to="/sign-up" className="text-[#3dd0b1] font-medium hover:underline">
            Sign Up
          </Link>
        </div>
  
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
  
}

export default SignIn