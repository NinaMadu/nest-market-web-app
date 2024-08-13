import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Contact({ listing }) {
  const [seller, setSeller] = useState(null);
  const [message, setMessage] = useState('');
  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        if( data.success === false ){
            return;
        }
        setSeller(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSeller();

  }, [listing.userRef]);




  return (
    <div>
      {seller && (
        <div className='flex flex-col gap-2'>
          <p>
            Contact <span className='font-semibold'>{seller.username}</span>{' '}
            for{' '}
            <span className='font-semibold'>{listing.title.toLowerCase()}</span>
          </p>
          <textarea
            name='message'
            id='message'
            rows='2'
            value={message}
            onChange={onChange}
            placeholder='Enter your message here...'
            className='w-full border p-3 rounded-lg'
          ></textarea>

          <Link
          to={`mailto:${seller.email}?subject=Regarding ${listing.title}&body=${message}`}
          className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
          >
            Send Message          
          </Link>
        </div>
      )}
    </div>
  );
}