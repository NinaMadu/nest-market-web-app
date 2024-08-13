import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { MdLocationOn, MdCheckCircle, MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { toggleWishlist, fetchWishlist } from '../services/WishlistService';

export default function ListingItem({ listing }) {

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showWishlistError, setShowWishlistError] = useState(false); 

  const { currentUser } = useSelector((state) => state.user)

  const fetchWishlistData = useCallback(async () => {
    if (!currentUser?._id) return;

    try {
      const data = await fetchWishlist(currentUser._id);
      console.log('Fetched wishlist data:', data); // Log response data
      if (data.success === false) {
        setShowWishlistError(true);
        return;
      }
      const isItemInWishlist = data.wishlist.includes(listing._id);
      console.log('Is item wishlisted:', isItemInWishlist); // Log wishlist check
      setIsWishlisted(isItemInWishlist);
    } catch (error) {
      setShowWishlistError(true);
    }
  }, [currentUser?._id, listing._id]);

  useEffect(() => {
    fetchWishlistData();
  }, [fetchWishlistData]);

  const handleWishlistToggle = async (event) => {
    event.preventDefault(); 
    event.stopPropagation();

    try {
      const result = await toggleWishlist(listing._id);
      if (result.success) {
        setIsWishlisted(!isWishlisted);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  const handleMouseEnter = () => {
    setShowPopup(true);
  };

  const handleMouseLeave = () => {
    setShowPopup(false);
  };


  return (
    <div className='relative bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]'>
      <Link to={`/listing/${listing._id}`}>
      
      <div className='relative'>
        <img
          src={
            listing.imageUrls[0] ||
            'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'
          }
          alt='listing cover'
          className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'
        />
        <div className='inline-block'>
            <div 
              className='absolute top-2 right-2 p-1 cursor-pointer bg-white bg-opacity-70 rounded-full shadow-md backdrop-blur-md'
              onClick={handleWishlistToggle} onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {isWishlisted ? (
                <MdFavorite className='text-red-500' />
              ) : (
                <MdFavoriteBorder className='text-gray-500' />
              )}
            </div>
            {showPopup && (
              <div className='absolute top-2 right-10 p-1 bg-white border text-xs bg-opacity-50 border-gray-300 rounded shadow-lg z-10'>
                {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </div>
            )}
          </div>
        </div>
        <div className='p-3 flex flex-col gap-2 w-full'>
          <p className='truncate text-lg font-semibold text-slate-700'>
            {listing.title} - {listing.type === 'used' ? '(Used)' : '(Brandnew)'}
          </p>
          <div className='flex items-center gap-1'>
            <MdLocationOn className='h-4 w-4 text-green-700' />
            <p className='text-sm text-gray-600 truncate w-full'>
              {listing.address}
            </p>
          </div>
          <p className='text-sm text-gray-600 line-clamp-2'>
            {listing.description}
          </p>
          <p className='text-slate-500 mt-2 font-semibold text-center'>
            LKR {listing.price.toLocaleString()}            
          </p>
          {listing.negligible ? 
           <div className='flex items-center justify-center gap-1'>
           <MdCheckCircle className='h-4 w-4 text-green-700 ' />
           <i style={{ fontSize: '0.8rem' }}>Negotiable</i>
         </div>          
           : ''}
         
        </div>
      </Link>
      
    </div>
  );
}