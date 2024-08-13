import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteuserFailure, signOutUserStart, signOutUserSuccess, signOutuserFailure } from '../redux/user/userSlice';
import { Link } from 'react-router-dom';
import { fetchWishlist } from '../services/WishlistService';

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
    } catch (error) {
      setShowWishlistError(true);
    }
  };

  const handleShowUserItems = async () => {
    await handleShowListing();
    await fetchWishlistData();
  };

  return (
    <div className='w-full'>
      <h1 className='text-3xl font-semibold text-left mx-5 my-7'>Hello {currentUser.username ? currentUser.username : 'User'}!</h1>
      <div className='w-full grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-8'>
        
        <div className='col-span-1 md:col-span-1 lg:col-span-1 p-3'>
          <div className='flex flex-col gap-4'>
            <button
              onClick={() => setShowProfile(true)}
              className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'>
              Update Profile
            </button>
            <Link
              className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'
              to={"/create-listing"}>
              Create a free Ad
            </Link>
            <button
              onClick={handleShowListing}
              className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'>
              My Ads
            </button>
            <button
              onClick={fetchWishlistData}
              className='bg-blue-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'>
              My Wishlist
            </button>
            <button
              onClick={handleSignOut}
              className='bg-red-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'>
              Sign out
            </button>
            <button
              onClick={handleDeleteUser}
              className='bg-red-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'>
              Delete account
            </button>
            <p className='text-red-700 mt-5'>{showListingsError ? 'Error in Listings' : ''}</p>
            <p className='text-red-700 mt-5'>{showWishlistError ? 'Error in Wishlist' : ''}</p>
          </div>
        </div>

        <div className='col-span-1 md:col-span-3 lg:col-span-3 p-3'>
        {showProfile ? (
          <div className='flex flex-col gap-4'>
                  <h1 className='text-center mt-0 text-2xl font-semibold'>Your Profile</h1>
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
            <button className='bg-slate-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'>
              {loading ? 'Loading...' : 'Update'}
            </button>
            <p className='text-red-700 mt-5'>{error ? error : ''}</p>
            <p className='text-green-700 mt-5'>
              {updateSuccess ? 'Profile updated successfully!' : ''}
            </p>
            </div>
          </form>
          </div>
        ) : showUserItems ? (
            <div>
              {userListings && userListings.length > 0 && (
                <div>
                <div className='flex flex-col gap-4'>
                  <h1 className='text-center mt-0 text-2xl font-semibold'>Your Listings</h1>
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
                </div>
                
              )}
              </div>
              
              
        ) : showWishlist ? ( 
          <div>
            
            {wishlist && wishlist.length > 0 && (
                <div className='flex flex-col gap-4'>
                  <h1 className='text-center mt-0 text-2xl font-semibold'>Your Wishlist</h1>
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
                          className='text-red-700 uppercase'>
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </div>

      </div>
    </div>
  );
};

export default Profile;
