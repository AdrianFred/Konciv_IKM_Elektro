import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export function middleware(request: any) {
  const cookieStore = cookies();
  const user = cookieStore.get("userId")?.value;
  const token = cookieStore.get("token")?.value;
  const ocpKey = cookieStore.get("ocpKey")?.value;
  const { pathname } = request.nextUrl;

  console.log("Pathname:", pathname);

  // Allow access to the login page if user is not authenticated
  if (pathname === "/login") {
    if (user && token && ocpKey) {
      // User is authenticated but trying to access login, redirect to home
      console.log("User authenticated, redirecting to /");
      return NextResponse.redirect(new URL("/", request.url));
    }
    // Allow unauthenticated users to access the login page
    console.log("Allow unauthenticated user to access login");
    return NextResponse.next();
  }

  // If user is not authenticated, redirect to login for all other routes
  if (!user || !token || !ocpKey) {
    if (pathname !== "/login") {
      console.log("User not authenticated, redirecting to /login");
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // If on login page and not authenticated, allow to proceed (no redirection)
    return NextResponse.next();
  }

  // If authenticated and accessing any route other than login, allow access
  console.log("User authenticated, allow access to the page");
  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/project/:path*", "/itemList", "/employee/:path*", "/field"],
};
