import { NextResponse } from 'next/server';

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|images|assets|favicon.ico|sw.js|.html|.txt).*)'],
};

export function middleware(req) {
  const response = NextResponse.next();

  // if (
  //   !req.cookies.get('refreshToken') &&
  //   lng &&
  //   (req.nextUrl.pathname.startsWith(`/${lng}/upload`) ||
  //     req.nextUrl.pathname.startsWith(`/${lng}/user/bookmarks`))
  // ) {
  //   return NextResponse.redirect(new URL(`/${lng}/?login=true`, req.url));
  // }

  return response;
}
