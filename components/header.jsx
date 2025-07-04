import React from "react";
import { CheckUser } from "../lib/check";
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
} from "lucide-react";
const Header = async () => {
  await CheckUser();
  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-black/60">
      <nav className="container mx-auto px-2  h-16 flex items-center justify-between">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="AIspire logo"
            width={200}
            height={60}
            className="h-12 py-1 w-auto object-contain"
          />
        </Link>
        <div className="flex gap-2 items-center">
          <SignedIn>
            <Link href={"/dashboard"}>
              <Button variant="outline">
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden md:block">Industry Insight</span>
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button>
                  <StarsIcon className="h-4 w-4" />
                  <span className="hidden md:block">Growth Tools</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href={"/resume"} className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span className="hidden md:block">Build Resume</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  {" "}
                  <Link
                    href={"/cover-letter"}
                    className="flex items-center gap-2"
                  >
                    <PenBox className="w-4 h-4" />
                    <span className="hidden md:block">Cover Letter</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  {" "}
                  <Link href={"/interview"} className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    <span className="hidden md:block">Interview Prep</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                  userButtonPopoverCard: "shadow-xl",
                  userPreviewMainIdentifier: "font-semibold",
                },
              }}
              afterSignOutUrl="/"
            />
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <Button variant="outline">Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </nav>
    </header>
  );
};

export default Header;
