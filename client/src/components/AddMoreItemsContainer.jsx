import { useEffect, useState } from 'react';

const AddMoreItemsContainer = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const loggedIn = localStorage.getItem('restaurantLoggedIn') === 'true';
        setIsLoggedIn(loggedIn);
    }, []);

    if (!isLoggedIn) return null;

    return (
        <div id="addMoreItemsContainer">
            {/* Add your component-specific content here */}
        </div>
    );
};

export default AddMoreItemsContainer;
