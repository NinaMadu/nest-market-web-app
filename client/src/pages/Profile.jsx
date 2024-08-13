import React from 'react'
import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { updateUserStart, updateUserSuccess, updateUserFailure } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { deleteUserStart, deleteUserSuccess, deleteuserFailure } from '../redux/user/userSlice';
import { signOutUserStart, signOutUserSuccess, signOutuserFailure } from '../redux/user/userSlice';
import { Link } from "react-router-dom";
import { fetchWishlist } from '../services/WishlistService';
//import Listing from '../../../api/models/listing.model';


const Profile = () => {

  const { currentUser, loading, error } = useSelector((state) => state.user)
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined)

  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [showWishlistError, setShowWishlistError] = useState(false); 
  const dispatch = useDispatch();
  

  console.log(formData)
  //console.log(userListings);

  useEffect(() => {
    if (file) {
      handleFileUpload(file)
    }
  }, [file]);

  
  const handleFileUpload = (file) => {
    const storage = getStorage(app);

    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storageRef, file)



    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((getDownloadURL) =>
          setFormData({ ...formData, avatar: getDownloadURL })
        )
      }
    )
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      )

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message))
        return;
      }

      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true)

    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  }

  const handleDeleteuser = async () => {
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`,
        {
          method: "DELETE",
        }
      )

      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteuserFailure(data.message))
        return;
      }
      dispatch(deleteUserSuccess(data));

    } catch (error) {
      dispatch(deleteuserFailure(error.message));
    }
  }

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart())
      const res = await fetch('/api/auth/signout')
      const data = await res.json()

      if (data.success === false) {
        dispatch(signOutuserFailure(data.message))
        return
      }
      dispatch(signOutUserSuccess(data))

    } catch (error) {
      dispatch(signOutuserFailure(error.message))
    }
  }

  const handleShowListing = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`)
      const data = await res.json()

      if (data.success === false) {
        setShowListingsError(true)
        return
      }


      setUserListings(data)

    } catch (error) {
      setShowListingsError(true)
    }
  }

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      })

      const data = await res.json();
      if (data.success === false) {
        console.log(error.message);
        return
      }

      setUserListings((prev) => prev.filter((listing) => (listing._id !== listingId)))

    } catch (error) {
      console.log(error.message);
    }
  }

  const fetchWishlistData = async () => {
    try {
        const data = await fetchWishlist(currentUser._id);
        if (data.success === false) {
            setShowWishlistError(true);
            return;
        }
        setWishlist(data.wishlist);
    } catch (error) {
        setShowWishlistError(true);
    }
};


  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3x1 font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

        <input
          onChange={(e) => setFile(e.target.files[0])}
          type='file' ref={fileRef} hidden accept='image/*' />


        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar} alt='avatar' className='w-30 h-30 rounded-full object-cover cursor-pointer self-center mt-2'></img>

        <p className='text-sm self-center'>

          {fileUploadError ? (
            <span className='text-red-700'>Error Image Upload (image must be less than 2 MB)</span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>Image uploaded successfully</span>
          ) : (
            ''
          )}
        </p>

        <input type='text' placeholder='username' id='username'
          defaultValue={currentUser.username} onChange={handleChange}
          className='border p-3 rounded-lg' />

        <input type='text' placeholder='email' id='email'
          defaultValue={currentUser.email} onChange={handleChange}
          className='border p-3 rounded-lg' />

        <input type='text' placeholder='password'
          onChange={handleChange}
          id='password' className='border p-3 rounded-lg' />

        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'>
          {loading ? "Loading..." : "Update"}
        </button>
        <Link className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95' to={"/create-listing"}>
          Create Listing
        </Link>

      </form>


      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteuser}
          className='text-red-700 cursor-pointer'>Delete account</span>
        <span onClick={handleSignOut}
          className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'>{updateSuccess ? "Profile updated successfully!" : ''}</p>

      <button onClick={handleShowListing} className='text-green-700 w-full'>
        Show Listing
      </button>
      <button onClick={fetchWishlistData} className='text-blue-700 w-full mt-5'>
        Show Wishlist
      </button>
      
      <p className='text-red-700 mt-5'>{showListingsError ? "Error in Listings" : ""}</p>
      <p className='text-red-700 mt-5'>{showWishlistError ? "Error in Wishlist" : ""}</p>

      {userListings && userListings.length > 0 && (
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>Your Listing</h1>
          {userListings.map((listing) => (
            <div key={listing._id}
              className='border rounded-lg p-3 flex justify-between items-cneter gap-4'
            >
              <Link to={`/listing/${listing._id}`}>
                <img src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='w-20 h-20 object-contain ' />
              </Link>
              <Link
                className='text-slate-700 font-semibold hover:underline truncate flex'
                to={`/listing/${listing._id}`}>
                <p>{listing.title}</p>
              </Link>

              <div className='flex flex-col item-center'>
                <button onClick={() => handleListingDelete(listing._id)}
                  className='text-red-700 uppercase'>
                  Delete
                </button>

                <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-green-700 uppercase'>
                    Edit
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

{wishlist && wishlist.length > 0 && (
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>Your Wishlist</h1>
          {wishlist.map((item) => (
            <div key={item._id}
              className='border rounded-lg p-3 flex justify-between items-center gap-4'>
              <Link to={`/listing/${item._id}`}>
                <img src={item.imageUrls[0]}
                  alt='wishlist item cover'
                  className='w-20 h-20 object-contain' />
              </Link>
              <Link
                className='text-slate-700 font-semibold hover:underline truncate flex'
                to={`/listing/${item._id}`}>
                <p>{item.title}</p>
              </Link>

              <div className='flex flex-col item-center'>
                <button onClick={() => handleListingDelete(item._id)}
                  className='text-red-700 uppercase'>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Profile