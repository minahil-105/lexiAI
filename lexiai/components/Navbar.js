"use client"
import React, { useState, useRef } from 'react';
import { Sun, Moon, Book, Plus } from 'lucide-react';
import { useUser, UserButton } from "@clerk/nextjs";
import Link from 'next/link';
import { Button } from './ui/button';
import { navLinks } from '@/lib/data';
import { usePathname } from 'next/navigation';
import { Textarea } from "@/components/ui/textarea"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"
import { Input } from './ui/input';
import { createDeck } from '@/app/actions/flashcards';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { query } from 'firebase/firestore';


const Navbar = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const { isSignedIn } = useUser();
    const pathname = usePathname();

    // create form dialog fields
    const nameRef = useRef(null);
    const descriptionRef = useRef(null);
    const contentRef = useRef(null);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        // You would typically update your app's theme state here
    };

    const queryClient = useQueryClient();
    const { mutate: handleCreateDeck } = useMutation({
        mutationFn: async (formData) => {
            await createDeck(formData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries('decks');
            console.log('Deck created successfully');
        }
    })


    return (
        <nav className={`flex items-center justify-between p-4 shadow-md lg:px-32 md:px-12 sm:px-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} relative`}>
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button */}
            </div>

            <Link href="/" className="flex items-center space-x-4">
                <Book className="h-8 w-8" />
                <span className="text-xl font-bold">Lexi AI</span>
            </Link>

            <div className='flex gap-2 absolute left-1/2 -translate-x-1/2'>
                {navLinks.map((link, index) => (
                    <Link href={link.href} className="hover:text-blue-500 transition-colors" key={index}>
                        <Button
                            variant="ghost"
                            className={`rounded-2xl py-0 hover:bg-[#7c3aed]/[0.2]`}
                        >
                            {link.title}
                        </Button>
                    </Link>
                ))}
            </div>

            <div className="flex items-center gap-3">
                <Link href="#" className="hover:text-blue-500 transition-colors">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <Plus size={18} />
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
                                <Input placeholder="Deck Description    " ref={descriptionRef} />
                                <Textarea placeholder="Description of the Deck" ref={contentRef} />
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