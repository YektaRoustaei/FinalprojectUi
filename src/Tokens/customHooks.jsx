import { useState, useEffect } from 'react';
import { getAuthenticatedUser } from './common';
import { useNavigate } from 'react-router-dom';

export function useUser() {
    const [user, setUser] = useState(null);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        async function getUserDetails() {
            const { authenticated, user } = await getAuthenticatedUser();
            if (!authenticated) {
                console.log( 'User is not Authenticated');
                return;
            }
            setUser(user);
            setAuthenticated(authenticated);
        }
        getUserDetails();
    }, []);

    return { user, authenticated };
}