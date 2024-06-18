import React, { useEffect, useState  } from 'react'
import { useParams } from 'react-router-dom';

export const Listing = () => {

    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

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
                setError(ture)
                setLoading(false)
            }
        }
        fetchListing();
    }, [])

  return (
    <main>
hi
    </main>
  )
}

export default Listing