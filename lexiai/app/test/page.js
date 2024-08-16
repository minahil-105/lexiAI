"use client"
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React, { useState } from 'react'
import { createDeck, getUserDecks, deleteDeck } from '../actions/flashcards'

const page = () => {


    const handleCreateDeck = (e) => {
        e.preventDefault()

        createDeck({
            name: 'test deck',
            description: 'test deck description'
        })
    }

    const handleGetDecks = async (e) => {
        e.preventDefault()
        const decks = await getUserDecks()
    }

    const handleDeleteDeck = async (e) => {
        e.preventDefault()
        // await deleteDeck({ deckId: "add correct id" });
    }

    return (
        <section className='container mt-20'>

            <Button onClick={handleCreateDeck}>
                create deck
            </Button>

            <Button onClick={handleGetDecks}>
                get user decks
            </Button>

            <Button onClick={handleDeleteDeck}>
                delete deck
            </Button>
        </section>
    )
}

export default page