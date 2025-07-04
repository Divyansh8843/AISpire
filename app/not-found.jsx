import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100vh] px-4 text-center">
      <h1 className="text-6xl font-bold bg-gradient-to-b from-gray-400 via-gray-200 to-gray-600 text-transparent md:text-6xl lg:txt-7xl xl:text-8xl tracking-tighter bg-clip-text pb-2 mb-4 pr-2">
        404
      </h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-8">
        Oops! The page you're loooking for doesn't exist or has been moved.
      </p>
      <Link href="/">
        <Button>Back To Home</Button>
      </Link>
    </div>
  );
};

export default NotFound;
