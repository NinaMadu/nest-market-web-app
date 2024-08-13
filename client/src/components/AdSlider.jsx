import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ListingItem from './ListingItem';

const AdSlider = () => {
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

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 3, // Default number of slides to show
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024, // At 1024px and above (large screens)
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 950, // Between 768px and 1024px (tablets and small screens)
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480, // Below 768px (mobile devices)
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="px-4 py-8 mx-auto bg-[#c5f4de] rounded-2xl" style={{ maxWidth: '1280px' }}>
      <Slider {...settings}>
        {newestListings.map((listing) => (
          <div key={listing._id} className="px-2">
            <ListingItem listing={listing} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default AdSlider;
