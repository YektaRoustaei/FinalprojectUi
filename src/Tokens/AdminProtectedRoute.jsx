import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const AdminProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function checkAuth() {
            const AdminToken = localStorage.getItem('Admin_token');
            if (!AdminToken) {
                navigate('/admin/login');
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

AdminProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired
};

export default AdminProtectedRoute;
