"use client"
import React, { useState } from 'react';
import { Sun, Moon, Book, Plus, User } from 'lucide-react';
import { useUser, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from 'next/link';
import { Button } from './ui/button';

const Navbar = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const { isSignedIn } = useUser();


    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        // You would typically update your app's theme state here
    };

    return (
        <nav className={`flex items-center justify-between p-4 shadow-md px-32 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button */}
            </div>


            <Link href="/" className="flex items-center space-x-4">
                <Book className="h-8 w-8" />
                <span className="text-xl font-bold">Lexi AI</span>
            </Link>
            <div className="flex items-center gap-3">
                <Link href="#" className="hover:text-blue-500 transition-colors">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <Plus size={18} />
                    </Button>
                </Link>

                {!isSignedIn ? (
                    <>
                        <Link href="/sign-in" ><Button variant="outline">Login</Button></Link>
                        <Link href="/sign-up" ><Button>Get Started</Button></Link>
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