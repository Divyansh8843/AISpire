import React from "react";
import { BarLoader } from "react-spinners";
import { Suspense } from "react";
const Layout = ({ children }) => {
  return (
    <div className="px-4 sm:px-5">
      <div className="container mx-auto">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-b from-gray-400 via-gray-200 to-gray-600 text-transparent tracking-tighter bg-clip-text pb-4 pr-2 text-center">
          Industry Insights
      </h1>
      </div>
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="gray" />}
      >
        {children}
      </Suspense>
    </div>
  );
};
export default Layout;
