"use client";
import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDeck, addCardToDeck, updateCard, deleteCard } from '@/app/actions/flashcards';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { Trash, X } from 'lucide-react';

const Page = ({ params: { deckId } }) => {
    const [openAddCardDialog, setOpenAddCardDialog] = useState(false);
    const [editDeck, setEditDeck] = useState(false);
    const [editingCard, setEditingCard] = useState(null);
    const frontRef = useRef();
    const backRef = useRef();
    const editFrontRef = useRef();
    const editBackRef = useRef();

    const queryClient = useQueryClient();

    const { data: deck, isLoading, isError, error } = useQuery({
        queryKey: ['deck', deckId],
        queryFn: async () => getDeck(deckId),
    });

    const { mutate: handleDeleteCard, isPending: isDeleting } = useMutation({
        mutationFn: async (cardId) => {
            await deleteCard({ deckId, cardId });
            setEditingCard(null);
        },
        onSuccess: () => queryClient.invalidateQueries(['deck', deckId])
    });

    const { mutate: handleAddCardToDeck } = useMutation({
        mutationFn: async () => {
            if (!frontRef.current.value || !backRef.current.value) return;
            return addCardToDeck({ deckId, frontContent: frontRef.current.value, backContent: backRef.current.value });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['deck', deckId]);
            setOpenAddCardDialog(false);
        }
    });

    const { mutate: handleEditCard, isPending: savePending } = useMutation({
        mutationFn: async () => {
            if (!editFrontRef.current.value || !editBackRef.current.value || !editingCard) return;
            return updateCard({
                deckId,
                cardId: editingCard.id,
                frontContent: editFrontRef.current.value,
                backContent: editBackRef.current.value
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['deck', deckId]);
            setEditingCard(null);
        }
    });

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {error.message}</div>;

    return (
        <section className='mx-4 sm:mx-8 md:mx-12 lg:mx-24 mt-8 sm:mt-12 md:mt-16 lg:mt-20 flex flex-col gap-4 sm:gap-6 md:gap-8 lg:gap-12'>
            {/* Header */}
            <div className='flex flex-col mb-6 sm:mb-8 md:mb-10 lg:mb-12'>
                <div className='flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-8 mb-4 sm:mb-6 md:mb-8'>
                    <h1 className='text-2xl sm:text-3xl md:text-4xl font-semibold'>{deck.name}</h1>
                    {/* Navigation */}
                    <div className='flex flex-col sm:flex-row gap-2 sm:gap-4'>
                        <Button variant="secondary" onClick={() => setEditDeck(!editDeck)}>
                            {editDeck ? 'Done' : 'Edit'}
                        </Button>

                        <Dialog open={openAddCardDialog} onOpenChange={setOpenAddCardDialog}>
                            <DialogTrigger>
                                <Button variant="secondary">Add Card</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add card to {deck.name} deck</DialogTitle>
                                </DialogHeader>
                                <Textarea ref={frontRef} placeholder="Front content" />
                                <Textarea ref={backRef} placeholder="Back content" />
                                <Button onClick={() => {
                                    handleAddCardToDeck();
                                    setOpenAddCardDialog(false);
                                }} className="w-full">Add Card</Button>
                            </DialogContent>
                        </Dialog>

                        <Link href={`/deck/${deck.id}/study`}>
                            <Button>
                                Study
                            </Button>
                        </Link>
                    </div>
                </div>
                <Separator />
                <p className='text-slate-400 mt-2 sm:mt-4 md:mt-6 lg:mt-8'>{deck.description}</p>
            </div>

            {/* Flashcards */}
            <div className="flex flex-wrap gap-4 sm:gap-6 md:gap-8 justify-center">
                {deck.cards?.map((flashcard) => (
                    <div key={flashcard.id} className={`${editDeck ? "flip-card-edit-mode" : "flip-card"} w-full sm:w-64 md:w-72 lg:w-80 h-48 sm:h-56 md:h-64 lg:h-72`}>
                        <div className="flip-card-inner p-0 m-0 relative">
                            {editDeck &&
                                <Dialog open={editingCard?.id === flashcard.id} onOpenChange={(open) => open ? setEditingCard(flashcard) : setEditingCard(null)}>
                                    <DialogTrigger asChild>
                                        <Button variant="destructive" size="icon" className="absolute -top-3 -right-3 z-10 rounded-full h-7 w-7">
                                            <X size={18} />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Edit card</DialogTitle>
                                        </DialogHeader>
                                        <Textarea ref={editFrontRef} defaultValue={flashcard.frontContent} />
                                        <Textarea ref={editBackRef} defaultValue={flashcard.backContent} />
                                        <div className='flex flex-col sm:flex-row gap-2 sm:gap-4'>
                                            <DialogClose asChild>
                                                <Button variant="secondary" className="w-full">Cancel</Button>
                                            </DialogClose>
                                            <Button variant="secondary" className="w-full" disabled={isDeleting} onClick={() => handleDeleteCard(flashcard.id)}>
                                                {isDeleting ? "Deleting..." : <Trash size={18} />}
                                            </Button>
                                            <Button className="w-full" onClick={handleEditCard} disabled={savePending}>
                                                {savePending ? "Saving..." : "Save"}
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            }
                            <div className="flip-card-front bg-gradient-to-r from-blue-500 to-purple-500 p-4 sm:p-6 md:p-8 rounded-md shadow-md overflow-hidden">
                                <h3 className="font-semibold text-white text-base sm:text-lg md:text-xl">Front:</h3>
                                <p className="text-white text-sm sm:text-base md:text-lg">{flashcard.frontContent}</p>
                            </div>
                            <div className="flip-card-back bg-gradient-to-r from-purple-500 to-pink-500 p-4 sm:p-6 md:p-8 rounded-md shadow-md overflow-hidden">
                                <h3 className="font-semibold text-white text-base sm:text-lg md:text-xl">Back:</h3>
                                <p className="text-white text-sm sm:text-base md:text-lg">{flashcard.backContent}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Page;
