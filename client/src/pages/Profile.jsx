import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteuserFailure, signOutUserStart, signOutUserSuccess, signOutuserFailure } from '../redux/user/userSlice';
import { Link } from 'react-router-dom';
import { fetchWishlist } from '../services/WishlistService';
import Notification from '../components/Notifications';
import CreateListing from './CreateListing.jsx';
import Chat from '../components/Chat.jsx';
import { set } from 'mongoose';
import 'boxicons/css/boxicons.min.css';
import ConfirmationMessage from '../components/ConfirmationMessage.jsx';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';

const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [showWishlistError, setShowWishlistError] = useState(false);
  const dispatch = useDispatch();
  const [showProfile, setShowProfile] = useState(true);
  const [showUserItems, setShowUserItems] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showCreateAd, setShowCreateAd] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({});

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) =>
          setFormData({ ...formData, avatar: url })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteuserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteuserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();

      if (data.success === false) {
        dispatch(signOutuserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutuserFailure(error.message));
    }
  };

  const handleShowListing = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();

      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
      setShowProfile(false);
      setShowUserItems(true);
      setShowWishlist(false);
      setShowCreateAd(false);
      setShowMessages(false); 
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleMessages = () => {
    setShowProfile(false);
    setShowUserItems(false);
    setShowWishlist(false);
    setShowCreateAd(false);
    setShowMessages(true);
  }

  const fetchWishlistData = async () => {
    try {
      const data = await fetchWishlist(currentUser._id);
      if (data.success === false) {
        setShowWishlistError(true);
        return;
      }
      setWishlist(data.wishlist);
      setShowProfile(false);
      setShowUserItems(false); 
      setShowWishlist(true);
      setShowCreateAd(false); 
      setShowMessages(false);
    } catch (error) {
      setShowWishlistError(true);
    }
  };

  const handleShowUserItems = async () => {
    await handleShowListing();
    await fetchWishlistData();
  };

  const handleShowCreateAd = () => {
    setShowProfile(false);
    setShowUserItems(false);
    setShowWishlist(false);
    setShowCreateAd(true);
    setShowMessages(false);
  };

  return (
    <div className='w-full '>
        
        
      <div className='w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8'>
        <div className='col-span-1 md:col-span-1 lg:col-span-1 p-3'>
          <div className='flex flex-col gap-4'>
          <div class="min-h-screen flex flex-row bg-gray-100">
  <div class="flex flex-col w-56 bg-white rounded-r-3xl overflow-hidden">
  <div class="flex flex-col items-center justify-center h-24 mb-6">
    <h1 class="text-2xl font-semibold text-[#64748B]">Welcome Back!</h1>
    <h2 class="text-xl text-[#4E5A6A] mt-2">{currentUser.username ? currentUser.username : 'User'}</h2>
  </div>
    <ul class="flex flex-col py-4">
      <li>
        <a href="#" class="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
          <span class="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400"><i class="bx bx-user"></i></span>
          <span class="text-sm font-medium"
          onClick={() => setShowProfile(true)}>
            Profile</span>
        </a>
      </li>
      <li>
        <a href="#" class="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
          <span class="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400"><i class="bx bx-news"></i></span>
          <span class="text-sm font-medium"
          onClick={handleShowCreateAd}>
          Post an Add</span>
        </a>
      </li>
      <li>
        <a href="#" class="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
          <span class="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400"><i class="bx bx-list-ul"></i></span>
          <span class="text-sm font-medium"
          onClick={handleShowListing}>
          Posted Adds</span>
        </a>
      </li>
      <li>
        <a href="#" class="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
          <span class="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400"><i class="bx bx-shopping-bag"></i></span>
          <span class="text-sm font-medium"
          onClick={fetchWishlistData}>
          Wishlist</span>
        </a>
      </li>
      <li>
        <a href="#" class="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
          <span class="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400"><i class="bx bx-chat"></i></span>
          <span class="text-sm font-medium"
          onClick={handleMessages}>
          Chat</span>
        </a>
      </li>
      <li>
        <a
          href="#"
          className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800"
        >
          <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
            <i className="bx bx-log-out"></i>
          </span>
          <span
            className="text-sm font-medium"
            onClick={() => setShowLogoutConfirm(true)}
          >
            Logout
          </span>
        </a>
        {/* Confirmation Modal */}
        {showLogoutConfirm && (
          <div className="absolute top-full left-0 w-full mt-2 z-50">
            <ConfirmationMessage
              message="Are you sure you want to logout?"
              confirmColor="bg-red-400"
              onConfirm={() => {
                handleSignOut();
                setShowLogoutConfirm(false);
              }}
              onCancel={() => setShowLogoutConfirm(false)}
            />
          </div>
        )}
      </li>
      <li>
        <a href="#" class="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
          <span class="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400"><i class="bx bx-user-x"></i></span>
          <span class="text-sm font-medium"
           onClick={() => setShowDeleteConfirm(true)}>
          Delete Account</span>
          
        </a>
         {/* Confirmation Modal */}
         {showDeleteConfirm && (
          <div className="absolute top-full left-0 w-full mt-2 z-50">
            <ConfirmationMessage
              message="Are you sure you want to delete account?"
              confirmColor="bg-red-500"
              onConfirm={() => {
                handleDeleteUser();
                setShowDeleteConfirm(false);
              }}
              onCancel={() => setShowDeleteConfirm(false)}
            />
          </div>
        )}
      </li>      
    </ul>
  </div>
</div>
            
            <p className='text-red-700 mt-5'>{showListingsError ? 'Error in Listings' : ''}</p>
            <p className='text-red-700 mt-5'>{showWishlistError ? 'Error in Wishlist' : ''}</p>
          </div>
          </div>
        
  
        
        <div className='col-span-1 md:col-span-2 lg:col-span-4 p-3'>
          {showProfile ? (
            <div className='flex flex-col gap-4'>
              <h1 className='text-3xl font-semibold text-center my-7'>
                Account Details</h1>
              <form onSubmit={handleSubmit} className='flex flex-col md:grid md:grid-cols-2 gap-4'>
                <div className='flex flex-col items-center'>
                  <input
                    onChange={(e) => setFile(e.target.files[0])}
                    type='file'
                    ref={fileRef}
                    hidden
                    accept='image/*'
                  />
                  <img
                    onClick={() => fileRef.current.click()}
                    src={formData.avatar || currentUser.avatar}
                    alt='avatar'
                    className='w-64 h-64 rounded-full object-cover cursor-pointer self-center mt-2'
                  />
                  <p className='text-sm self-center'>
                    {fileUploadError ? (
                      <span className='text-red-700'>
                        Error Image Upload (image must be less than 2 MB)
                      </span>
                    ) : filePerc > 0 && filePerc < 100 ? (
                      <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
                    ) : filePerc === 100 ? (
                      <span className='text-green-700'>Image uploaded successfully</span>
                    ) : (
                      ''
                    )}
                  </p>
                </div>
                <div className='flex flex-col gap-4'>
                  <input
                    type='text'
                    placeholder='username'
                    id='username'
                    defaultValue={currentUser.username}
                    onChange={handleChange}
                    className='border p-3 rounded-lg'
                  />
                  <input
                    type='text'
                    placeholder='email'
                    id='email'
                    defaultValue={currentUser.email}
                    onChange={handleChange}
                    className='border p-3 rounded-lg'
                  />
                  <input
                    type='password'
                    placeholder='password'
                    onChange={handleChange}
                    id='password'
                    className='border p-3 rounded-lg'
                  />
                  <button className='bg-[#44D1B7] text-white p-3 rounded-lg uppercase text-center hover:opacity-95'>
                    {loading ? 'Loading...' : 'Update'}
                  </button>
  
                  {error && (
                    <Notification
                      type="error"
                      message={error}
                      onClose={() => setError(null)}
                    />
                  )}
  
                  {/* Success Message */}
                  {updateSuccess && (
                    <Notification
                      type="success"
                      message="Profile updated successfully!"
                      onClose={() => setUpdateSuccess(false)}
                    />
                  )}
                </div>
              </form>
            </div>
          ) : showUserItems ? (
            <div>
              {userListings && userListings.length > 0 ? (
                <div className='flex flex-col gap-4'>
                  <h1 className='text-3xl font-semibold text-center my-7'>
                    My Adds</h1>
                  {userListings.map((listing) => (
                    <div
                      key={listing._id}
                      className='border rounded-lg p-3 flex justify-between items-center gap-4'>
                      <Link to={`/listing/${listing._id}`}>
                        <img
                          src={listing.imageUrls[0]}
                          alt='listing cover'
                          className='w-20 h-20 object-contain'
                        />
                      </Link>
                      <Link
                        className='text-slate-700 font-semibold hover:underline truncate flex'
                        to={`/listing/${listing._id}`}>
                        <p>{listing.title}</p>
                      </Link>
                      <div className='flex flex-col items-center'>
                        <button
                          onClick={() => handleListingDelete(listing._id)}
                          className='text-red-700 uppercase'
                          title="Delete"
                          >
                          <FaTrashAlt className="text-xl" />
                        </button>
                        <Link to={`/update-listing/${listing._id}`}>
                          <button className='text-green-700 uppercase' title="Edit">
                          <FaEdit className="text-xl" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ):(
                <div className='flex justify-center items-center'>
    <p className='text-xl text-gray-600'>You have no listings yet.</p>
  </div>
              )}
              {showListingsError && (
                <Notification
                  type="error"
                  message="Error fetching listings."
                  onClose={() => setShowListingsError(false)}
                />
              )}
            </div>
          ) : showCreateAd ? (
            <div>
              <CreateListing />
            </div>
          ) : showWishlist ? (
            <div>
              {wishlist && wishlist.length > 0 ? (
                <div className='flex flex-col gap-4'>
                  <h1 className='text-3xl font-semibold text-center my-7'>
                    Wishlist</h1>
                  {wishlist.map((item) => (
                    <div
                      key={item._id}
                      className='border rounded-lg p-3 flex justify-between items-center gap-4'>
                      <Link to={`/listing/${item._id}`}>
                        <img
                          src={item.imageUrls[0]}
                          alt='wishlist item cover'
                          className='w-20 h-20 object-contain'
                        />
                      </Link>
                      <Link
                        className='text-slate-700 font-semibold hover:underline truncate flex'
                        to={`/listing/${item._id}`}>
                        <p>{item.title}</p>
                      </Link>
                      <div className='flex flex-col items-center'>
                        <button
                          onClick={() => handleListingDelete(item._id)}
                          className='text-red-700 uppercase'title="Delete"
                          >
                            <FaTrashAlt className="text-xl" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {showWishlistError && (
                    <Notification
                      type="error"
                      message="Error fetching wishlist."
                      onClose={() => setShowWishlistError(false)}
                    />
                  )}
                </div>
              ) : (
                <Notification
                  type="error"
                  message="No items to display!"
                  onClose={() => setShowWishlistError(false)}
                />
              )}
            </div>
          ) : showMessages ? (
            <div>
              <div className='flex flex-col gap-4'>
                  <h1 className='text-3xl font-semibold text-center my-7'>
                    Chat</h1>
              <Chat />
              </div>
            </div>
          ) : (
            <Notification
              type="error"
              message="No messages to display!"
              onClose={() => setShowWishlistError(false)}
            />
          )}
        </div>
      </div>
    </div>
    
  );
  
};

export default Profile;
