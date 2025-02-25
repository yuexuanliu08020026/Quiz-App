import jwt from 'jsonwebtoken';
import { serialize,parse } from 'cookie';
import { NextApiRequest } from 'next';

const SECRET_KEY = process.env.SESSION_SECRET || 'your_secret_key';
const COOKIE_NAME = 'user_session';

// Generate a session token
export const createSession = (user: { id: string; email: string; username: string }) => {
    const token = jwt.sign({ id: user.id, email: user.email, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    return serialize(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
    });
};
export const verifySession = async (req: any) => {
    const cookies = req.headers.cookie;
    if (!cookies){
        throw new Error("Unauthunized")
    }

    const parsedCookies = parse(cookies);
    const token = parsedCookies[COOKIE_NAME];

    if (!token){
        throw new Error("Unauthunized")
    }

    return jwt.verify(token, SECRET_KEY) as { id: string; email: string; username:string };
};


// Clear session (Logout or expire)
export const clearSession = () => {
    return serialize(COOKIE_NAME, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        expires: new Date(0),
    });
};
