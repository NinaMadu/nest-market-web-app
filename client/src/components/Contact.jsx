import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaPaperPlane } from 'react-icons/fa';

export default function Contact({ listing }) {
  const [seller, setSeller] = useState(null);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  // Get the current user from Redux
  const { currentUser, loading, error: userError } = useSelector(
    (state) => state.user
  );

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        if (data.success === false) {
          return;
        }
        setSeller(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSeller();
  }, [listing.userRef]);

  const handleSendMessage = async () => {
    if (!currentUser || !currentUser._id) {
      setError('You must be logged in to send a message.');
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/message/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          sender: currentUser._id, // Using the current user's ID from Redux
          receiver: listing.userRef,
          itemId: listing._id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setSuccess(true);
      setMessage('');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    }
  };

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

          <button
            onClick={handleSendMessage}
            className='bg-[#44D1B7] text-white text-center p-3 uppercase rounded-lg hover:opacity-95 flex justify-center items-center gap-2'
          >
            Send Message
            <FaPaperPlane className='text-white' />
          </button>

          {success && (
            <p className='text-green-500'>Message sent successfully!</p>
          )}
          {error && (
            <p className='text-red-500'>Error: {error}</p>
          )}
        </div>
      )}
    </div>
  );
}
