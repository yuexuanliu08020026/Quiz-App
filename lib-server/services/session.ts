import jwt from 'jsonwebtoken';
import { serialize,parse } from 'cookie';
import { Session } from '@/types/models/Session';

const SECRET_KEY = process.env.SESSION_SECRET || 'your_secret_key';
const COOKIE_NAME = 'user_session';

// Generate a session token
export const createSession = (session: Session) => {
    const token = jwt.sign(session, SECRET_KEY, { expiresIn: '1h' });
    console.log(`Running Environment ${process.env.NODE_ENV}`)
    return serialize(COOKIE_NAME, token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
    });
};
export const verifySession = async (req: any) => {
    const cookies = req.headers.cookie;
    console.log(`Request Cookie ${JSON.stringify(cookies)}`)
    if (!cookies){
        throw new Error("Unauthunized")
    }

    const parsedCookies = parse(cookies);
    const token = parsedCookies[COOKIE_NAME];

    if (!token){
        throw new Error("Unauthunized")
    }

    return jwt.verify(token, SECRET_KEY) as Session;
};


// Clear session (Logout or expire)
export const clearSession = () => {
    return serialize(COOKIE_NAME, '', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
        expires: new Date(0),
    });
};
