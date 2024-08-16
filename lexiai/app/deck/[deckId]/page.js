"use client"
import React, { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getDeck } from '@/app/actions/flashcards'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Separator } from "@/components/ui/separator"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from '@/components/ui/textarea'
import { addCardToDeck } from '@/app/actions/flashcards'



const page = ({ params: { deckId } }) => {

    const [openAddCardDialog, setOpenAddCardDialog] = useState(false)
    const frontRef = useRef()
    const backRef = useRef()

    const queryClient = useQueryClient()
    const { data: deck, isLoading, isError, error } = useQuery({
        queryKey: ['deck', deckId],
        queryFn: async () => {
            const data = await getDeck(deckId);
            return data;
        },
    })

    const { mutate: handleAddCardToDeck } = useMutation({
        mutationFn: async () => {
            console.log('Adding card to deck:', deckId);
            if (!frontRef.current.value || !backRef.current.value) {
                return;
            }
            const data = await addCardToDeck({ deckId, frontContent: frontRef.current.value, backContent: backRef.current.value });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries('deck')
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
                        <Link href={`/deck/${deck.id}/edit`}>
                            <Button variant="secondary">
                                Edit
                            </Button>
                        </Link>

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
                <p className='text-slate-400 mt-4'>{deck.description}  </p>

            </div>

            {/* flashcards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {deck.cards?.map((flashcard, index) => (
                    <div key={index} className="flip-card w-64 h-56">
                        <div className="flip-card-inner p-0 m-0">
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

export default page