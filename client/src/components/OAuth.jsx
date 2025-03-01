//import React from 'react'
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice.js';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';

export const OAuth = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth, provider);

            //console.log(result);

            const res = await fetch("/api/auth/google", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL,
                }),
            });

            const data = await res.json()

            dispatch(signInSuccess(data))

            navigate("/")

        } catch (error) {
            console.log('Could not sign in with Google', error)
        }
    }

    return (
        
        <button 
          onClick={handleGoogleClick} 
          className="flex items-center justify-center gap-2 border border-gray-300 bg-white p-3 rounded-lg shadow-md mt-0 text-gray-700 font-medium hover:bg-gray-100 transition-all"
        >
          <FcGoogle size={22} /> {/* Google Logo */}
          <span>Sign in with Google</span>
        </button>
      
    );
}

export default OAuth
