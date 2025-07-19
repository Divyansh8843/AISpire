"use client";
import { SignUp, useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import React from "react";

export default function Page() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/"); // or "/dashboard" if you want
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) return null;
  if (isSignedIn) return null;
  return (
    
    <div className="flex items-center justify-center mt-16 py-8">
      <SignUp fallbackRedirectUrl="/" />
    </div>
  );
}