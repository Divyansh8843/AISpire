import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define all protected routes and their subroutes
const isProtectedRoute = createRouteMatcher([
  "/dashboard",
  "/resume(.*)",
  "/interview(.*)",
  "/cover-letter(.*)",
  "/onboarding(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  try {
    const { userId } = await auth();
    // Only log in development for debugging
    if (process.env.NODE_ENV !== "production") {
    console.log("[middleware] userId:", userId, "url:", req.url);
    }
    // Allow public access to signin and register
    if (req.nextUrl.pathname.startsWith("/signin") || req.nextUrl.pathname.startsWith("/register")) {
      return NextResponse.next();
    }
    // Allow public access to non-protected routes
    if (!isProtectedRoute(req)) {
      return NextResponse.next();
    }
    // Redirect unauthenticated users to signin (no redirect_url param)
    if (!userId) {
      const signinUrl = new URL("/signin", req.url);
      return NextResponse.redirect(signinUrl);
    }
    // Allow authenticated users
    return NextResponse.next();
  } catch (error) {
    // Log error only in development
    if (process.env.NODE_ENV !== "production") {
      console.error("Middleware error:", error);
    }
    // Redirect to signin on error
    const signinUrl = new URL("/signin", req.url);
    return NextResponse.redirect(signinUrl);
  }
});

// Exclude static files, Next.js internals, and public routes from middleware
export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)|signin|register).*)",
    "/(api|trpc)(.*)",
  ],
};
