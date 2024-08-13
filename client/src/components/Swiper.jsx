import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import SwiperCore from 'swiper';

// Initialize Swiper modules
SwiperCore.use([Navigation, Pagination]);

const HomeCarousel = () => {
  const [newestListings, setNewestListings] = useState([]);

  useEffect(() => {
    const fetchNewestListings = async () => {
      try {
        const res = await fetch('/api/listing/get?sort=newest&limit=6');
        const data = await res.json();
        setNewestListings(data);
      } catch (error) {
        console.error('Error fetching newest listings:', error);
      }
    };

    fetchNewestListings();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <Swiper
        navigation
        pagination={{ clickable: true }}
        modules={[Navigation, Pagination]}
        className="mySwiper"
      >
        {newestListings.map((listing, index) => (
          <SwiperSlide key={index}>
            <div className="w-full h-auto object-cover">
              <img src={
            listing.imageUrls[0] ||
            'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'
          }
          alt='listing cover' />
              <div className="p-4">
                <h3 className="text-xl font-bold">{listing.title}</h3>
            
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HomeCarousel;
