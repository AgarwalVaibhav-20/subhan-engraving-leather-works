"use client";
import { User as UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/UserContext";
import { useSession, signOut } from "next-auth/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import axios from "axios";

export function DropdownMenuDemo() {
  const [previewImage , setPreviewImage] = useState<string | null>(null);
  const { user } = useAuth();
  const { data: session } = useSession();

  console.log("Context user:", user?.profileImage);
  console.log("NextAuth session:", session?.expires.toString());
  console.log("Fetched user data--->", session?.user?.profileImage);
  console.log(user?.profileImage);
  console.log(user?.fullname)


  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`/api/profile`);
      setPreviewImage(res.data.user.profileImage);
      console.log("Fetched user data:", res.data.user.profileImage);
    };
    fetchData();
  }, [user]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="cursor-pointer border-none outline-none rounded-full w-9 h-9 overflow-hidden">
          {user?.role === "user" ? (
            <Image
              src={`${
                previewImage || "/default-profile.png"
              }`}
              alt={user?.fullname || "Profile"}
              title={user?.fullname}
              width={36}
              height={36}
              className="rounded-full object-cover"
            />
          ) : (
            <UserIcon className="w-full h-full p-1 text-gray-600" />
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 mt-5 mr-10" align="center">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile">Profile</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuItem asChild>
          <Link href="/hc">Help Center</Link>
        </DropdownMenuItem>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Email</DropdownMenuItem>
              <DropdownMenuItem>Message</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>More...</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuItem asChild>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full text-left text-xs cursor-pointer"
          >
            Logout
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
