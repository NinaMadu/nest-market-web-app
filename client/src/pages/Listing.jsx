import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css/bundle";
import { useSelector } from 'react-redux';


import {
    FaMapMarkerAlt,
    FaShare,
} from 'react-icons/fa';
import Contact from '../components/Contact';

export const Listing = () => {

    SwiperCore.use([Navigation, Thumbs]);

    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const params = useParams();
    const [copied, setCopied] = useState(false);
    const [contact, setContact] = useState(false);
    const { currentUser } = useSelector((state) => state.user);
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    console.log(listing);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/listing/get/${params.listingId}`)
                const data = await res.json();
                if (data.success == false) {
                    setError(true);
                    setLoading(false);
                    return;
                }

                setListing(data);
                setLoading(false);
                setError(false)

            } catch (error) {
                setError(true)
                setLoading(false)
            }
        }
        fetchListing();
    }, [params.listingId]);

    return (
        <main>
    {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
    {error && <p className='text-center my-7 text-2xl'>Something went wrong!</p>}
    {listing && !loading && !error && (
        <div className='w-7/8 md:w-3/4 mx-auto flex flex-col items-center mt-4 p-2'>
            {/* Centered Swiper component */}
            <div className='w-full flex justify-center'>
                <Swiper
                    navigation
                    thumbs={{ swiper: thumbsSwiper }}
                    className="w-full max-w-3xl"
                >
                    {listing.imageUrls.map((url) => (
                        <SwiperSlide key={url}>
                            <div
                                className='h-[550px] w-full'
                                style={{
                                    background: `url(${url}) center no-repeat`,
                                    backgroundSize: 'cover',
                                }}
                            ></div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <div className='w-full flex justify-center'>
                <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={10}
                    slidesPerView={4}
                    watchSlidesProgress
                    className="mt-2 w-full max-w-3xl"
                >
                    {listing.imageUrls.map((url) => (
                        <SwiperSlide key={url}>
                            <div
                                className='h-[100px] w-full'
                                style={{
                                    background: `url(${url}) center no-repeat`,
                                    backgroundSize: 'cover',
                                }}
                            ></div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            
            {/* Floating Share button */}
            <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
                <FaShare
                    className='text-slate-500'
                    onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                    }}
                />
            </div>
            
            {copied && (
                <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
                    Link Copied!
                </p>
            )}
            
            {/* Left-aligned content below Swiper */}
            <div className='w-full flex flex-col max-w-4xl mx-auto p-3 gap-4 text-left'>
                <p className='text-2xl font-semibold'>
                    {listing.title} - {listing.type === 'used' ? '(Used)' : '(Brand New)'}
                </p>
                <p className='flex items-center mt-6 gap-2 text-slate-600 text-sm'>
                    <FaMapMarkerAlt className='text-green-700' />
                    {listing.address}
                </p>
                <div className='flex gap-4'>
                    <p className='bg-[#44D1B7] w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                        LKR {listing.price}.00
                    </p>
                    {listing.negligible && <i style={{ fontSize: '0.8rem' }}>Negligible</i>}
                </div>
                <p className='text-slate-800'>
                    <span className='font-semibold text-black'>Description - </span>
                    {listing.description}
                </p>
                {currentUser && listing.userRef !== currentUser._id && !contact && (
                                <button
                                onClick={() => setContact(true)}
                                className='bg-[#44D1B7] text-white rounded-lg uppercase p-3 hover:opacity-95'
                                >Contact Seller</button>
                            )}

                            { contact && <Contact listing={listing} />}
            </div>
        </div>
    )}
</main>

    );
}

export default Listing