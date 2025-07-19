"use client";
import React from "react";
// import { CheckUser } from "../lib/check"; // Removed server-only import
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import {
  ChevronDown,
  FileText,
  Grab,
  GraduationCap,
  LayoutDashboard,
  PenBox,
  StarsIcon,
  Sun,
  Moon,
  X,
  Home as HomeIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import Footer from "./footer";
import { useUser } from "@clerk/nextjs";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: null },
  { href: "/dashboard", label: "Industry Insight", icon: LayoutDashboard },
];
const GROWTH_LINKS = [
  { href: "/resume", label: "Build Resume", icon: FileText },
  { href: "/cover-letter", label: "Cover Letter", icon: PenBox },
  { href: "/interview", label: "Interview Prep", icon: GraduationCap },
];

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { isLoaded, isSignedIn } = useUser();
  useEffect(() => {
    const setVh = () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    };
    setVh();
    window.addEventListener('resize', setVh);
    return () => window.removeEventListener('resize', setVh);
  }, []);
  if (!isLoaded) return null; // Prevent rendering until Clerk is ready
  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 border-b border-border shadow-sm backdrop-blur-md">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="AIspire logo"
            width={160}
            height={48}
            priority
            className="h-10 w-auto object-contain drop-shadow-sm"
          />
        </Link>
        
        <div className="hidden md:flex flex-1 items-center justify-center gap-6">
          <SignedIn>
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="group relative">
                <span className="flex items-center gap-2 font-semibold text-foreground hover:text-primary transition text-base px-2 py-1 rounded-md">
                  {link.icon && <link.icon className="h-5 w-5" />} {link.label}
                </span>
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 font-semibold text-foreground hover:text-primary transition text-base px-2 py-1 rounded-md">
                  <StarsIcon className="h-5 w-5" /> Growth Tools <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 mt-2 shadow-lg rounded-xl border border-border bg-background">
                {GROWTH_LINKS.map((link) => (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link href={link.href} className="flex items-center gap-2 px-3 py-2 text-foreground hover:bg-accent rounded-lg">
                      <link.icon className="h-5 w-5 text-primary" /> {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SignedIn>
          <SignedOut>
            <Link key="/" href="/" className="group relative">
              <span className="flex items-center gap-2 font-semibold text-foreground hover:text-primary transition text-base px-2 py-1 rounded-md">
                Home
              </span>
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
            </Link>
          </SignedOut>
        </div>
      
        <div className="hidden md:flex items-center gap-2">
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                  userButtonPopoverCard: "shadow-xl",
                  userPreviewMainIdentifier: "font-semibold",
                },
              }}
              afterSignOutUrl="/"
              onSignOut={() => {
                if (typeof window !== "undefined") {
                  window.localStorage.setItem("global-toast-message", "Signed out successfully!");
                }
              }}
            />
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <Button variant="outline" className="font-semibold">Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>
        
        <div className="md:hidden flex items-center">
          <Button variant="ghost" size="icon" onClick={() => setDrawerOpen(true)} aria-label="Open menu">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><rect width="20" height="2" x="2" y="6" rx="1" fill="currentColor"/><rect width="20" height="2" x="2" y="11" rx="1" fill="currentColor"/><rect width="20" height="2" x="2" y="16" rx="1" fill="currentColor"/></svg>
          </Button>
        </div>
       
        {drawerOpen && (
          <>
            <div className="fixed inset-0 bg-black/70 z-40" onClick={() => setDrawerOpen(false)} />
            <aside className="fixed top-0 left-0 w-screen bg-white shadow-2xl z-50 flex flex-col animate-slide-in border-r border-border md:hidden" style={{ height: 'calc(var(--vh, 1vh) * 100)' }}>
              {/* Fixed top bar for logo and close icon, just like mobile navbar */}
              <div className="fixed top-0 left-0 bg-black/80 w-full h-16 flex items-center justify-between px-4 z-50">
                <Link href="/" onClick={() => setDrawerOpen(false)} className="flex items-center">
                  <Image src="/logo.png" alt="AIspire logo" width={120} height={40} className="h-10 w-auto object-contain" />
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setDrawerOpen(false)} aria-label="Close menu">
                  <X className="h-6 w-6 text-white" />
                </Button>
              </div>
              {/* Drawer content below the bar */}
              <div className="flex-1 flex flex-col p-8 mt-16">
                <div className="border-b border-border mb-4" />
                <nav className="flex flex-col gap-4 mt-4">
                  <SignedIn>
                    {NAV_LINKS.map((link) => (
                      <Link key={link.href} href={link.href} onClick={() => setDrawerOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-lg py-4 font-semibold text-gray-900 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-md hover:scale-[1.02] hover:text-blue-700 cursor-pointer transition-all duration-300 flex items-center gap-3 rounded-xl border border-transparent hover:border-blue-200">
                          {link.label === "Home" ? <HomeIcon className="h-6 w-6 text-gray-900" /> : link.icon && <link.icon className="h-6 w-6 text-gray-900" />} {link.label}
                        </Button>
                      </Link>
                    ))}
                    <div className="mt-2">
                      <div className="mb-4">
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg border border-purple-100">
                          <span className="uppercase text-xs text-purple-700 font-bold tracking-widest flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            Growth Tools
                          </span>
                        </div>
                      </div>
                      {GROWTH_LINKS.map((link) => (
                        <Link key={link.href} href={link.href} onClick={() => setDrawerOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start text-lg py-4 font-semibold text-gray-900 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:shadow-md hover:scale-[1.02] hover:text-purple-700 cursor-pointer transition-all duration-300 flex items-center gap-3 pl-6 rounded-xl border border-transparent hover:border-purple-200">
                            <link.icon className="h-6 w-6 text-gray-900" /> {link.label}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </SignedIn>
                  <SignedOut>
                    <Link key="/" href="/" onClick={() => setDrawerOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start text-lg py-4 font-semibold text-gray-900 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-md hover:scale-[1.02] hover:text-blue-700 cursor-pointer transition-all duration-300 flex items-center gap-3 rounded-xl border border-transparent hover:border-blue-200">
                        <HomeIcon className="h-6 w-6 text-gray-900" /> Home
                      </Button>
                    </Link>
                  </SignedOut>
                </nav>
                <div>
                  <div className="w-full border-t border-gray-300 my-6" />
                  <div className="flex items-center gap-2 pl-2">
                    <SignedIn>
                      <UserButton
                        appearance={{
                          elements: {
                            avatarBox: "w-10 h-10",
                            userButtonPopoverCard: "shadow-xl",
                            userPreviewMainIdentifier: "font-semibold",
                          },
                        }}
                        afterSignOutUrl="/"
                        onSignOut={() => {
                          if (typeof window !== "undefined") {
                            window.localStorage.setItem("global-toast-message", "Signed out successfully!");
                          }
                        }}
                      />
                      <span className="text-lg font-semibold text-gray-900">Profile</span>
                    </SignedIn>
                    <SignedOut>
                      <SignInButton>
                        <Button variant="outline" className="font-semibold text-gray-900 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-md hover:scale-[1.02] hover:text-blue-700 cursor-pointer transition-all duration-300 border-2">Sign In</Button>
                      </SignInButton>
                    </SignedOut>
                  </div>
                </div>
                {/* Footer in mobile drawer */}
                <div className="fixed bottom-0 left-0 w-screen bg-black/80">
                  <Footer />
                </div>
              </div>
            </aside>
            <style jsx global>{`
              @keyframes slide-in {
                from { transform: translateX(-100%); }
                to { transform: translateX(0); }
              }
              .animate-slide-in {
                animation: slide-in 0.3s cubic-bezier(0.4,0,0.2,1) both;
              }
            `}</style>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
