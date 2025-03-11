import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Navigation } from 'swiper/modules';
import ListingItem from '../components/ListingItem'; 
import SwiperCore from 'swiper';
import { FaHome, FaCar, FaMobileAlt, FaCouch, FaFootballBall, FaPlusCircle, FaTimes } from 'react-icons/fa';
import Logo from '../assets/Logo.png';
import AdSlider from '../components/AdSlider.jsx';
import { useSelector } from 'react-redux';
import 'swiper/css/bundle';
import Notification from '../components/Notification.jsx';

const Home = () => {

  const [realstaleListings, setRealstateListings] = useState([]);
  const [electronicListings, setElectronicListings] = useState([]);
  const [automobileListings, setAutomobileListings] = useState([]);
  const [furnitureListings, setFurnitureListings] = useState([]);
  const [sportListings, setSportListings] = useState([]);
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const [notification, setNotification] = useState(null);

  SwiperCore.use([Navigation]);

  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRealstaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?category=Real+Estate&limit=4');
        const data = await res.json();
        setRealstateListings(data);
        fetchElectronicListings();
      } catch (error) {
        console.log(error);
      }
    }

    const fetchElectronicListings = async () => {
      try {
        const res = await fetch('/api/listing/get?category=Electronics&limit=4');
        const data = await res.json();
        setElectronicListings(data);
        fetchAutomobileListings();
      } catch (error) {
        console.log(error);
      }
    }

    const fetchAutomobileListings = async () => {
      try {
        const res = await fetch('/api/listing/get?category=Automobile&limit=4');
        const data = await res.json();
        setAutomobileListings(data);
      } catch (error) {
        console.log(error);
      }
    }

    const fetchFurnitureListings = async () => {
      try {
        const res = await fetch('/api/listing/get?category=Furniture&limit=4');
        const data = await res.json();
        setFurnitureListings(data);
      } catch (error) {
        console.log(error);
      }
    }

    const fetchSportListings = async () => {
      try {
        const res = await fetch('/api/listing/get?category=Sports+Equipment&limit=4');
        const data = await res.json();
        setSportListings(data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchRealstaleListings();
    fetchElectronicListings();
    fetchAutomobileListings();
    fetchFurnitureListings();
    fetchSportListings();
  }, []);

  const handleCreateAdClick = () => {
    if (!currentUser) {
      setShowLoginMessage(true);
      setNotification({ type: 'error', message: 'You need to sign in to create a free ad.' });
    } else {
      navigate('/create-listing');
    }
  };

  const handleLoginMessageClose = () => {
    setShowLoginMessage(false);
  };

  return (
    <div className='flex flex-col gap-6 p-10 px-5 max-w-6xl mx-auto'>
      {/* Notification Component */}
      {notification && (
        <Notification 
          type={notification.type} 
          message={notification.message} 
          onClose={handleNotificationClose} 
        />
      )}

      <div className='flex flex-col lg:flex-row w-full max-w-6xl'>
        {/* Left Side */}
        <div className='flex-1'>
          <img className="w-auto h-60 items-center" src={Logo} />

          <h1 className="text-[#28d582] font-bold text-2xl lg:text-4xl">

            The best place to <br />
            <div className="flex items-center">
              <div className="flex flex-col text-[#44d1b7] font-bold text-3xl lg:text-6xl">
                <span className="mb-2">Buy</span>
                <span>Sell</span>
              </div>
              <div className="text-[#28d582] text-4xl lg:text-7xl block mt-2 p-2">
                Anything
              </div>
            </div></h1>



          {/*}
          <Link to={"/search"} className='text-xs sm:text-sm text-blue-800 mt-4 inline-block'>
            Start to search...
          </Link>*/}
        </div>

        {/* Right Side */}
        <div className='flex-1 lg:ml-6 mt-6 lg:mt-0'>
          <div className='bg-white p-6 rounded-lg shadow-md mb-4'>
            <h2 className='text-gray-800 font-bold text-2xl mb-4'>Explore Things by Category</h2>
            <div className='grid grid-cols-3 gap-3 my-4'>
              <Link to='/search?searchTerm=&type=all&category=Real+Estate&negligible=false&sort=created_at&order=desc' className='flex flex-col items-center text-gray-600 hover:text-gray-800'>
                <FaHome className='text-4xl' />
                <span>Real Estate</span>
              </Link>
              <Link to='/search?category=Automobile' className='flex flex-col items-center text-gray-600 hover:text-gray-800'>
                <FaCar className='text-4xl' />
                <span>Automobile</span>
              </Link>
              <Link to='/search?category=Electronics' className='flex flex-col items-center text-gray-600 hover:text-gray-800'>
                <FaMobileAlt className='text-4xl' />
                <span>Electronics</span>
              </Link>
              <Link to='/search?category=Furniture' className='flex flex-col items-center text-gray-600 hover:text-gray-800'>
                <FaCouch className='text-4xl' />
                <span>Furniture</span>
              </Link>
              <Link to='/search?category=Sports+Equipment' className='flex flex-col items-center text-gray-600 hover:text-gray-800'>
                <FaFootballBall className='text-4xl' />
                <span>Sports Equipment</span>
              </Link>
            </div>
          </div>



          <div className="bg-white p-6 rounded-lg shadow-md ">
            <h2 className="text-gray-800 font-bold text-2xl mb-4">Sell anything by Ads</h2>
            {showLoginMessage && (
                <div className="bg-yellow-200 p-4 rounded-lg mb-4 text-center relative">
                  
                  <p className="text-yellow-800">
                    You need to <Link to="/sign-in" className="text-blue-600 underline" onClick={handleLoginMessageClose}>sign in</Link> to create a free ad.
                    <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                    onClick={handleLoginMessageClose}                  >
                    <FaTimes className="text-xl" />
                  </button>
                  </p>
                </div>
              )}
            <div className='flex items-center justify-center'>
              
              <button className="flex items-center justify-center text-gray-500 font-semibold p-2 text-2xl rounded hover:text-gray-700"
                onClick={handleCreateAdClick}>
                <FaPlusCircle className="mr-2" />
                Create a free Ad
              </button>
            </div>
          </div>

        </div>
      </div>

      <div>
        <div className='my-3'>
          <h2 className='text-gray-800 font-bold text-2xl'>Newly Added Hot Deals</h2>
          <Link className='text-sm text-blue-800 hover:underline' to={'/search?'}>Show more Hot Deals</Link>
        </div>
        <AdSlider />
      </div>


      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {realstaleListings && realstaleListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-gray-800 font-bold text-2xl'>New Real Estate Deals</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?category=Real+Estate'}>Show more Real-state Deals</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {realstaleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {electronicListings && electronicListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-gray-800 font-bold text-2xl'>New Electronic Deals</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?category=Electronics'}>Show more Electronic Deals</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {electronicListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {automobileListings && automobileListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-gray-800 font-bold text-2xl'>New Automobile Deals</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?category=Automobile'}>Show more Automobile Deals</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {automobileListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {furnitureListings && furnitureListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-gray-800 font-bold text-2xl'>New Furniture Deals</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?category=Furniture'}>Show more Automobile Deals</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {furnitureListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {sportListings && sportListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-gray-800 font-bold text-2xl'>New Sport Equipment Deals</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?category=Sports+Equipment'}>Show more Sports Equipment Deals</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {sportListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home;
