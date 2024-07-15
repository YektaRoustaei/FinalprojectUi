import axios from 'axios';

export function storeTokenInLocalStorage(token, key = 'token') {
    localStorage.setItem(key, token);
}

export function getTokenFromLocalStorage(key = 'token') {
    return localStorage.getItem(key);
}

export async function getAuthenticatedUser() {
    const defaultReturnObject = { authenticated: false, user: null };

    try {
        const token = getTokenFromLocalStorage();

        if (!token) {
            return defaultReturnObject;
        } else {
            console.log('Token:', token); // Log the token to the console
        }

        let url = 'http://127.0.0.1:8000/api/seeker/get-info';
        if (token === 'Provider_token') {
            url = 'http://127.0.0.1:8000/api/provider/get-info';
        }
        else if (token === 'Admin_token') {
            url = 'http://127.0.0.1:8000/api/admin';
        }

        const response = await axios({
            method: 'GET',
            url: url,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const { authenticated = false, user = null } = response.data;
        return authenticated ? { authenticated, user } : defaultReturnObject;
    } catch (err) {
        console.log('getAuthenticatedUser, Something Went Wrong', err);
        return defaultReturnObject;
    }
}
