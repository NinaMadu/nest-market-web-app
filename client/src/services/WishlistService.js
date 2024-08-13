export const toggleWishlist = async (itemId) => {
    try {
      const response = await fetch('/api/user/wishlist/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ itemId }),
        credentials: 'include' 
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error toggling wishlist item:', error);
      throw error;
    }
  };

  export const fetchWishlist = async (userId) => {
    try {
        const response = await fetch(`/api/user/wishlist/${userId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching wishlist items:', error);
        throw error;
    }
};
  