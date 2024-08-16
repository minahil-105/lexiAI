"use client"
import React, { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { Skeleton } from './ui/skeleton'
import { getUserDecks } from '@/app/actions/flashcards'
import { useQuery } from '@tanstack/react-query'
import DeckItem from './DeckItem'



const DeckList = ({ query }) => {
    const { isLoaded, isSignedIn } = useUser()
    const { data: decks, isLoading, isError, error } = useQuery({
        queryKey: ['decks'],
        queryFn: async () => {
            const data = await getUserDecks();
            return data;
        },
    })

    if (!isLoaded || isLoading) (
        <div className='mt-20 mx-auto 2xl:mx-56 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 sm: gap-6'>
            {[...Array(6)].map((_, index) => <Skeleton key={index} className="w-80 h-64" />)}
        </div>
    )

    if (!isSignedIn)
        return <h1>Please sign in to view your forms.</h1>

    if (isError)
        return <div>Error loading forms: {error.message}</div>;

    if (!decks || decks.length === 0)
        return <div className='text-2xl mt-20 tracking-tight'>Create flashcards and let Lexi do the rest</div>

    const filteredItems = decks.filter((deck) => deck.name && deck.name.toLowerCase().includes(query.toLowerCase()))
    return (
        <div className='mt-20 mx-auto 2xl:mx-56 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 sm: gap-6 transition-all'>
            {filteredItems.map((deck, index) => (
                <React.Fragment key={index}>
                    <DeckItem deck={deck} />
                </React.Fragment>
            ))}

        </div>
    )
}

export default DeckList