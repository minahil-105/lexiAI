"use client"
import React, { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getDeck, addCardToDeck, updateCard, deleteCard } from '@/app/actions/flashcards'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Separator } from "@/components/ui/separator"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from '@/components/ui/textarea'
import { Trash, X } from 'lucide-react'

const Page = ({ params: { deckId } }) => {
    const [openAddCardDialog, setOpenAddCardDialog] = useState(false)
    const [editDeck, setEditDeck] = useState(false)
    const [editingCard, setEditingCard] = useState(null)
    const frontRef = useRef()
    const backRef = useRef()
    const editFrontRef = useRef()
    const editBackRef = useRef()

    const queryClient = useQueryClient()

    const { data: deck, isLoading, isError, error } = useQuery({
        queryKey: ['deck', deckId],
        queryFn: async () => getDeck(deckId),
    })

    const { mutate: handleDeleteCard, isPending: isDeleting } = useMutation({
        mutationFn: async (cardId) => {
            await deleteCard({ deckId, cardId });
            setEditingCard(null);
        },
        onSuccess: () => queryClient.invalidateQueries(['deck', deckId])
    })

    const { mutate: handleAddCardToDeck } = useMutation({
        mutationFn: async () => {
            if (!frontRef.current.value || !backRef.current.value) return;
            return addCardToDeck({ deckId, frontContent: frontRef.current.value, backContent: backRef.current.value });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['deck', deckId]);
            setOpenAddCardDialog(false);
        }
    })

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
    })

    if (isLoading) return <div>Loading...</div>
    if (isError) return <div>Error: {error.message}</div>

    return (
        <section className='mx-40 mt-12 flex flex-col gap-3'>
            {/* header */}
            <div className='flex flex-col mb-10'>
                <div className='flex justify-between items-start gap-12 mb-2'>
                    <h1 className='text-3xl font-semibold'>{deck.name}</h1>
                    {/* navigation */}
                    <div className='flex gap-2'>
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
                                    handleAddCardToDeck()
                                    setOpenAddCardDialog(false)
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
                <p className='text-slate-400 mt-4'>{deck.description}</p>
            </div>

            {/* flashcards */}
            <div className="flex flex-wrap gap-4 justify-start ">
                {deck.cards?.map((flashcard) => (
                    <div key={flashcard.id} className={`${editDeck ? "flip-card-edit-mode" : "flip-card"} w-64 h-56`}>
                        <div className="flip-card-inner p-0 m-0 relative">
                            {editDeck &&
                                <Dialog open={editingCard?.id === flashcard.id} onOpenChange={(open) => open ? setEditingCard(flashcard) : setEditingCard(null)}>
                                    <DialogTrigger asChild>
                                        <Button variant="destructive" size="icon" className="absolute -top-3 -right-3 z-10 rounded-full h-7 w-7 ">
                                            <X size={18} />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Edit card</DialogTitle>
                                        </DialogHeader>
                                        <Textarea ref={editFrontRef} defaultValue={flashcard.frontContent} />
                                        <Textarea ref={editBackRef} defaultValue={flashcard.backContent} />
                                        <div className='flex gap-2'>
                                            <DialogClose asChild>
                                                <Button variant="secondary" className="w-full">Cancel</Button>
                                            </DialogClose>
                                            <Button variant="secondary" className="w-full" disabled={isDeleting} onClick={() => handleDeleteCard(flashcard.id)}>
                                                {isDeleting ? "Deleting..." : <Trash size={18} />}
                                            </Button>
                                            <Button className="w-full" onClick={handleEditCard} disabled={savePending}>
                                                {savePending ? "Saving..." : "Save"}</Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            }
                            <div className="flip-card-front bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-md shadow-md overflow-hidden">
                                <h3 className="font-semibold text-white text-lg">Front:</h3>
                                <p className="text-white text-base ">{flashcard.frontContent}</p>
                            </div>
                            <div className="flip-card-back bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-md shadow-md overflow-hidden">
                                <h3 className="font-semibold text-white text-lg">Back:</h3>
                                <p className="text-white text-base">{flashcard.backContent}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Page