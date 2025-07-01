"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AvatarImage, Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuContent,
  DropdownMenuLabel,
} from "./ui/dropdown-menu";
import { Tally3 } from "lucide-react";
import { context } from "@/context/context.js";
import axios from "axios";
import { showSuccess } from "./ui/sonner";
import { useContext } from "react";

function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, user, logout } = useContext(context);
  const URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Problems", href: "/problems" },
    { label: "Contests", href: "/contests" },
    { label: "Discussions", href: "/discussions" },
  ];

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        `${URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      if (res.status === 200) {
        logout();
        showSuccess("Logged Out Successfully.");
        router.push("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="bg-black p-4 h-16 flex items-center justify-between sticky top-0 z-50">
      <div className="text-yellow-500 text-xl font-bold font-sans">
        CodeBuddy
      </div>

      {/* Desktop Nav */}
      <div className="flex space-x-4 max-lg:hidden">
        {navLinks.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className={`text-xl font-light font-mono py-2 p-2 transition-colors duration-200 ${
              pathname === href
                ? "text-yellow-600 bg-slate-700"
                : "text-white hover:text-yellow-500"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Desktop User Info */}
      {isLoggedIn ? (
        <div className="flex items-center space-x-4 max-lg:hidden">
          <p className="text-white">{user?.username}</p>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="cursor-pointer">
                <AvatarImage
                  src={user?.profile || "/file.svg"}
                  alt="User Avatar"
                />
                <AvatarFallback className="bg-green-600 text-white font-bold">
                  {user?.username?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="z-[1000] w-48 mt-2 bg-black border-2 border-amber-50"
              sideOffset={8}
              align="end"
            >
              <DropdownMenuItem asChild>
                <Link href={`/profile/${user?.username}?id=${user?._id}`}
                className="hover:bg-slate-700 text-white">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="hover:bg-slate-700 text-white">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="hover:bg-slate-700 text-white"
                onSelect={(e) => {
                  e.preventDefault();
                  handleLogout();
                }}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div className="flex items-center space-x-4 text-blue-500 max-lg:hidden">
          <Link
            href="/login"
            className="hover:text-white text-yellow-500 text-xl p-2"
          >
            Login
          </Link>
          <p>Or</p>
          <Link
            href="/signup"
            className="text-white hover:text-yellow-500 text-xl"
          >
            Register
          </Link>
        </div>
      )}

      {/* Mobile Dropdown */}
      <div className="lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger className="text-white items-center flex">
            <Tally3 className="w-8 h-8 rotate-90" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="lg:hidden z-[1000] w-56 mt-2 bg-black border-2 border-amber-50"
            sideOffset={8}
            align="end"
          >
            {isLoggedIn && (
              <>
                <DropdownMenuLabel className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage
                      src={user?.profile | ""}
                      alt="User Avatar"
                    />
                    <AvatarFallback className="bg-green-600 text-white font-bold">
                      {user?.username?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-white">{user?.username}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
              </>
            )}

            {!isLoggedIn && (
              <>
                <DropdownMenuItem className="text-white">
                  <Link
                    href="/login"
                    className="text-yellow-500 text-xl font-light font-mono p-2"
                  >
                    Login
                  </Link>
                  <p className="text-blue-500 ml-2">Or</p>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white">
                  <Link
                    href="/signup"
                    className="text-white hover:text-yellow-500 text-xl font-light font-mono p-2"
                  >
                    Register
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}

            {navLinks.map(({ label, href }) => (
              <DropdownMenuItem
                key={href}
                className="hover:bg-slate-700 text-white"
              >
                <Link
                  href={href}
                  className="text-xl font-light font-mono p-2 text-white hover:text-yellow-500"
                >
                  {label}
                </Link>
              </DropdownMenuItem>
            ))}

            {isLoggedIn && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href="/profile"
                    className="text-xl hover:bg-slate-700 text-white font-light font-mono p-2 px-4 hover:text-yellow-500"
                  >
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/settings"
                    className="hover:bg-slate-700 text-white px-4 text-xl font-light font-mono p-2 hover:text-yellow-500"
                  >
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="hover:bg-slate-700 text-white">
                  <button
                    onClick={handleLogout}
                    className="text-xl font-light font-mono p-2 hover:text-yellow-500"
                  >
                    Logout
                  </button>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}

export default Navbar;
