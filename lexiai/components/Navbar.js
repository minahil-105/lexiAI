"use client";
import React, { useState, useRef } from 'react';
import { Book, Plus } from 'lucide-react';
import { useUser, UserButton } from "@clerk/nextjs";
import Link from 'next/link';
import { Button } from './ui/button';
import { navLinks } from '@/lib/data';
import { usePathname } from 'next/navigation';
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog";
import { Input } from './ui/input';
import { createDeck } from '@/app/actions/flashcards';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ModeToggle } from "@/components/mode-toggle"; 
import { useTheme } from "next-themes";

const Navbar = () => {
    const { isSignedIn } = useUser();
    const pathname = usePathname();
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { theme, setTheme } = useTheme();
    // Create form dialog fields
    const nameRef = useRef(null);
    const descriptionRef = useRef(null);
    const contentRef = useRef(null);

    const queryClient = useQueryClient();
    const { mutate: handleCreateDeck } = useMutation({
        mutationFn: async (formData) => {
            await createDeck(formData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries('decks');
            console.log('Deck created successfully');
        }
    });

    return (
        <nav className={`flex items-center justify-between p-4 shadow-md lg:px-32 md:px-12 sm:px-6 ${
            theme === "light"
              ? "bg-gradient-to-r from-pink-100 to-blue-400 to-purple-600 text-gray-800"
              : "bg-gradient-to-r from-gray-900 to-indigo-800 to-purple-900 text-white"
          } relative`}>
            <Link href="/" className="flex items-center space-x-4">
                <Book className={`h-8 w-8 ${theme === "light" ? "text-gray-800" : "text-white"}`} />
                <span className="text-xl font-bold">Lexi AI</span>
            </Link>

            <div className="hidden lg:flex gap-2 md:gap-4">
                {navLinks.map((link, index) => (
                    <Link href={link.href} key={index}>
                        <Button
                            variant="ghost"
                            className="rounded-2xl py-0 hover:bg-purple-200 hover:text-gray-800 transition-colors"
                        >
                            {link.title}
                        </Button>
                    </Link>
                ))}
            </div>

            <div className="flex items-center gap-3">
            <ModeToggle />
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full group hover:bg-white transition-colors"
                        >
                            <Plus
                                size={18}
                                className="text-white group-hover:text-black transition-colors"
                            />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create new Deck</DialogTitle>
                            <DialogDescription>
                                Create a new deck to store your flashcards and let AI do the rest.
                            </DialogDescription>
                        </DialogHeader>
                        <div className='flex flex-col gap-2'>
                            <Input placeholder="Deck Name" ref={nameRef} />
                            <Input placeholder="Deck Description" ref={descriptionRef} />
                            <Textarea placeholder="Generate using Lexi AI (leave blank for empty deck)" ref={contentRef} />
                            <DialogClose asChild>
                                <Button onClick={() => handleCreateDeck({
                                    name: nameRef.current.value,
                                    description: descriptionRef.current.value,
                                    content: contentRef.current.value
                                })} className="w-full">Create Deck</Button>
                            </DialogClose>
                        </div>
                    </DialogContent>
                </Dialog>

                {!isSignedIn ? (
                    <>
                        <Link href="/sign-in">
                            <Button
                                variant="outline"
                                className="bg-white text-black border-white transition-colors"
                            >
                                Login
                            </Button>
                        </Link>
                    </>
                ) : (
                    <UserButton />
                )}

                {/* Mobile menu button */}
                <button
                    onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                    className="lg:hidden text-white"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden absolute top-16 right-0 w-48 bg-gradient-to-r from-teal-400 to-purple-500 text-white shadow-lg p-4 rounded-lg z-10 overflow-y-auto">
                    {navLinks.map((link, index) => (
                        <Link href={link.href} key={index}>
                            <Button
                                variant="ghost"
                                className="w-full text-left hover:bg-white hover:text-black transition-colors mb-2"
                            >
                                {link.title}
                            </Button>
                        </Link>
                    ))}
                    {!isSignedIn ? (
                        <Link href="/sign-in">
                            <Button
                                variant="outline"
                                className="w-full bg-white text-black border-white transition-colors"
                            >
                                Login
                            </Button>
                        </Link>
                    ) : (
                        <UserButton />
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
