"use client"
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getDeck } from '@/app/actions/flashcards'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Separator } from "@/components/ui/separator"


const page = ({ params: { deckId } }) => {
    const { data: deck, isLoading, isError, error } = useQuery({
        queryKey: ['deck', deckId],
        queryFn: async () => {
            const data = await getDeck(deckId);
            return data;
        },
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


                        <Button variant="secondary">
                            Add Card
                        </Button>

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