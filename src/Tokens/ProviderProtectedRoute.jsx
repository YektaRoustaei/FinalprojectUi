// ProviderProtectedRoute.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProviderProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function checkAuth() {
            const ProviderToken = localStorage.getItem('Provider_token');
            if (!ProviderToken) {
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

ProviderProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired
};

export default ProviderProtectedRoute;
