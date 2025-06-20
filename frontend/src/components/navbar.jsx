"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AvatarImage, Avatar, AvatarFallback } from "./ui/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuItem,DropdownMenuSeparator,DropdownMenuContent } from "./ui/dropdown-menu";
import { Tally3 } from 'lucide-react';
import { context } from "@/context/context.js"
import axios from "axios";
import { showSuccess } from "./ui/sonner";
import { useContext } from "react";

function Navbar(){
    const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Problems', href: '/problems' },
    { label: 'Contests', href: '/contests' },
    { label: 'Discussions', href: '/discussions' },
    ];
    const pathname = usePathname();
    const {isLoggedIn,user,logout}= useContext(context);  
    const URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    // Logout 
    const handleLogout = async ()=>{
        console.log(":hello");
        try {
            const res = await axios.post(`${URL}/api/auth/logout`,{  
            },{
                withCredentials:true
            });
            if(res.status === 200){
                logout();
                showSuccess("Logged Out Successfully.");
            }
        } catch (error) {
            console.error(error);
        }
    }

    return(
        <>
        <nav className="bg-black p-4 h-16 flex items-center justify-between sticky top-0 z-50">
            <div className="text-yellow-500 text-xl font-bold font-sans">CodeBuddy</div>
            {/* until large screens, the navbar will be hidden */}
            <div className="flex space-x-4 max-lg:hidden">
            
                {navLinks.map(({ label, href }) => (
                        <Link
                            key={href}
                            href={href}
                            className={`text-xl font-light font-    mono py-2 transition-colors duration-200 p-2 ${
                            pathname === href
                                ? 'text-yellow-600 bg-slate-700'
                                : 'text-white hover:text-yellow-500'
                            }`}
                        >
                            {label}
                        </Link>
                ))}            
            </div>
            <div className={`flex items-center space-x-4 ${isLoggedIn == false ? "hidden":""} max-lg:hidden`} >
                <p className="text-white">{user?.username}</p>
                <DropdownMenu>
                    <DropdownMenuTrigger >
                        <Avatar className="cursor-pointer">
                        <AvatarImage src="/file.svg" alt="User Avatar" />
                        <AvatarFallback className="bg-green-600 text-white font-bold">{user?.username[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className={`${isLoggedIn == false ? "hidden":""} z-[1000] w-48 mt-2 bg-black border-2 border-amber-50`} sideOffset={8} align="end"> 
                        <DropdownMenuItem className="hover:bg-slate-700 text-white"><Link href={"/profile"}>Profile</Link></DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-slate-700 text-white"><Link href={"/settings"}>Settings</Link></DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="hover:bg-slate-700 text-white"
                            onSelect={(e) => {
                                e.preventDefault(); // optional
                                handleLogout();
                            }}
                            >
                            Logout
                        </DropdownMenuItem>

                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className={`flex items-center space-x-4 ${isLoggedIn == true ? "hidden":""} text-blue-500 max-lg:hidden`}>
                <Link href="/login" className="hover:text-white text-yellow-500 text-xl p-2 ">Login</Link>
                <p>Or   </p>  
                <Link href="/signup" className="text-white hover:text-yellow-500 text-xl">Register</Link>
            </div>
            
            {/* screen size large and less */}
            <div className="lg:hidden ">
                <DropdownMenu className="lg:hidden">
                    <DropdownMenuTrigger className="text-white items-center flex">
                        <Tally3 className="w-8 h-8 rotate-90 " />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent  className={`lg:hidden z-[1000] w-48 mt-2 bg-black border-2 border-amber-50" sideOffset={8} align="end `}>
                        <DropdownMenuItem className={` text-white ${isLoggedIn ? "" : "hidden"} my-2`}>
                            <Avatar className="cursor-pointer">
                            <AvatarImage src="/file.svg" alt="User Avatar" />
                                <AvatarFallback className="bg-green-600 text-white font-bold">{user?.username[0].toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <p className="text-white text-xl font-light font-mono py-2">{user?.username}</p>
                        </DropdownMenuItem>

                        <DropdownMenuItem className={` text-white ${isLoggedIn ? "hidden" : ""}`}>
                            <Link href="/login" className={`text-xl font-light font-mono py-2 transition-colors duration-200 p-2 hover:text-white text-yellow-500 `}>
                                Login   
                            </Link>
                            <p className="text-blue-500">Or</p>
                            
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem className={` text-white ${isLoggedIn ? "hidden" : ""}`}>
                            <Link href="/signup" className={`text-xl font-light font-mono py-2 transition-colors duration-200 p-2 text-white hover:text-yellow-500`}>
                                Register
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem className="hover:bg-slate-700 text-white">
                            <Link href="/" className={`text-xl font-light font-mono py-2 transition-colors duration-200 p-2 text-white hover:text-yellow-500`}>
                                Home
                            </Link>
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem className="hover:bg-slate-700 text-white">
                            <Link href="/problems" className={`text-xl font-light font-mono py-2 transition-colors duration-200 p-2 text-white hover:text-yellow-500`}>
                                Problems
                            </Link>
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem className="hover:bg-slate-700 text-white">
                            <Link href="/contests" className={`text-xl font-light font-mono py-2 transition-colors duration-200 p-2 text-white hover:text-yellow-500`}>
                                Contests
                            </Link>
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem className="hover:bg-slate-700 text-white">
                            <Link href="/discussions" className={`text-xl font-light font-mono py-2 transition-colors duration-200 p-2 text-white hover:text-yellow-500`}>
                                Discussions
                            </Link>
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem className={`hover:bg-slate-700 text-white ${isLoggedIn ? "" : "hidden"}`}>
                            <Link href="/profile" className={`text-xl font-light font-mono py-2 transition-colors duration-200 p-2 text-white hover:text-yellow-500`}>
                                Profile
                            </Link>
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem className={`hover:bg-slate-700 text-white ${isLoggedIn ? "" : "hidden"}`}>
                            <Link href="/settings" className={`text-xl font-light font-mono py-2 transition-colors duration-200 p-2 text-white hover:text-yellow-500`}>
                                Settings
                            </Link>

                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator />
            
                        <DropdownMenuItem className={`${isLoggedIn ? "hover:bg-slate-700 text-white" : "hidden"}`}>
                            <button onClick={handleLogout} className={`text-xl font-light font-mono py-2 transition-colors duration-200 p-2 text-white hover:text-yellow-500`}>
                                Logout
                            </button>
                        </DropdownMenuItem>
            
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>

        </>
    )
}

export default Navbar;