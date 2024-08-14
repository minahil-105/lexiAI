"use client"
import React, { useState } from 'react';
import { Sun, Moon, Book, Plus, User } from 'lucide-react';
import { useUser, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from 'next/link';

const Navbar = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const { isSignedIn } = useUser();


    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        // You would typically update your app's theme state here
    };

    return (
        <nav className={`flex items-center justify-between p-4 shadow-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button */}
            </div>


            <Link href="/" className="flex items-center space-x-4">
                <Book className="h-8 w-8" />
                <span className="text-xl font-bold">Lexi AI</span>
            </Link>
            <div className="flex items-center gap-3">
                <a href="#" className="hover:text-blue-500 transition-colors">
                    <Plus className="h-6 w-6 mr-4" />
                </a>

                {!isSignedIn ? (
                    <>
                        <Link href="/sign-in" >
                            <button className="text-slate-900 border hover:bg-gray-700 px-3 py-2 rounded-lg text-sm font-medium">
                                Login
                            </button>
                        </Link>
                        <Link href="/sign-up" >
                            <button className={` px-3 py-2 rounded-lg text-sm font-medium ${isDarkMode ? "bg-white" : "text-slate-50 border bg-slate-800 hover:bg-gray-700"}`}>
                                Get Started
                            </button>
                        </Link>
                    </>
                ) : (
                    <UserButton />
                )}

                <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                    {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
                    <span className="sr-only">Toggle Dark Mode</span>
                </button>
            </div>
        </nav >
    );
};

export default Navbar;