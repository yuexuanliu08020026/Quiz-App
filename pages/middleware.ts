import { NextResponse, NextRequest } from 'next/server';
import { getMe } from '@/lib-server/services/users';

export async function middleware(req: NextRequest) {

    const requestForSession = {
        headers: Object.fromEntries(req.headers.entries()), 
    };

    const me = await getMe({ req: requestForSession }); 

    if (!me?.id) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/"],
};