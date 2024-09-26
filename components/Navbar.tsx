"use client";

import Link from "next/link";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { fetchLoggedUser } from "@/lib/api";
import { deleteCookie } from "cookies-next";

export default function Navbar() {
  const router = useRouter();
  const [hasFetchedUser, setHasFetchedUser] = useState(false);
  const [userName, setUserName] = useState("");

  function getInitials(displayName: string): string {
    if (!displayName) return ""; // Handle empty or undefined names

    // Split the name by spaces, map to get the first letter, then join the initials
    const initials = displayName
      .split(" ")
      .map((name) => name.charAt(0).toUpperCase()) // Get first letter and convert to uppercase
      .join("");

    return initials;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("ocpKey");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRoles");
    deleteCookie("token");
    deleteCookie("userId");
    deleteCookie("ocpKey");
    router.push("/login");
  };

  useEffect(() => {
    if (typeof window !== "undefined" && !hasFetchedUser) {
      const tokenString = localStorage.getItem("token");
      const ocpKeyString = localStorage.getItem("ocpKey");
      const displayNameString = localStorage.getItem("userName");

      // Make sure to check if the values are not null
      const token = tokenString ? JSON.parse(tokenString) : null;
      const ocpKey = ocpKeyString ? JSON.parse(ocpKeyString) : null;
      const displayName = displayNameString ? JSON.parse(displayNameString) : null;

      if (token && ocpKey && !displayName) {
        fetchLoggedUser(token, ocpKey)
          .then((data: any) => {
            console.log("User:", data);
            setHasFetchedUser(true);
            localStorage.setItem("userName", JSON.stringify(data.user.displayName));
            localStorage.setItem("userEmail", JSON.stringify(data.user.email));
            localStorage.setItem("userRoles", JSON.stringify(data.groupList));
            setUserName(data.user.displayName);
          })
          .catch((error: any) => {
            console.error("Error fetching logged user:", error);
          });
      }

      if (displayName) {
        setUserName(displayName);
      }
    }
  }, [hasFetchedUser]);

  return (
    <header className="bg-gray-800 bg-opacity-80 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          {/* <MountainIcon className="h-6 w-6 text-white" /> */}
          <Image src="/assets/images/konciv.jpg" alt="Konciv" width={30} height={30} className="object-contain bg-white rounded-lg" />
          <span className="text-white text-md font-bold">KONCIV</span>
        </Link>
        <div className="flex space-x-4 text-white">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 focus:outline-none">
                <i className="fas fa-envelope"></i>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link href="#" className="flex items-center" prefetch={false}>
                  {/* <div className="h-4 w-4" /> */}
                  <span>Message 1</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="#" className="flex items-center" prefetch={false}>
                  {/* <div className="h-4 w-4" /> */}
                  <span>Message 2</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 focus:outline-none">
                <i className="fas fa-bell"></i>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 bg-green-500 rounded-full" />
                  <span>Colliding work assignments on project 701</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 bg-yellow-500 rounded-full" />
                  <span>Someone requested a vacation in June</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 bg-red-500 rounded-full" />
                  <span>Test Danger danger</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="relative flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full ">
                  <Avatar className="h-8 w-8 ">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback className="bg-gray-400 text-white">{getInitials(userName) || ""}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link href="/employee/null" className="flex items-center gap-2 w-full" prefetch={false}>
                    <div className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="#" className="flex items-center gap-2 w-full" prefetch={false}>
                    <div className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  {/* <Link href="/login" className="flex items-center gap-2 w-full" prefetch={false}> */}
                  <div className="flex items-center gap-2 w-full cursor-pointer" onClick={handleLogout}>
                    <div className="h-4 w-4" />
                    <span>Logout</span>
                  </div>
                  {/* </Link> */}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}

function MenuIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function MountainIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}
