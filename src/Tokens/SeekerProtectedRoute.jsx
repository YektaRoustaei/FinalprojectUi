import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const SeekerProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function checkAuth() {
            const Seeker_token = localStorage.getItem('Seeker_token');
            if (!Seeker_token) {
                navigate('/login');
            } else {
                setIsAuthenticated(true);
            }
            setIsLoading(false);
        }
        checkAuth();
    }, [navigate]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? children : null;
};

SeekerProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired
};

export default SeekerProtectedRoute;
