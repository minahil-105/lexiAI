"use client"
import React, { useState, useEffect } from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { useQuery } from '@tanstack/react-query'
import { getDeck } from '@/app/actions/flashcards'

export default function CarouselDApiDemo({ params: { deckId } }) {
    const [flipped, setFlipped] = useState(false);
    const [api, setApi] = useState()
    const [current, setCurrent] = useState(0)
    const [count, setCount] = useState(0)

    const { data: deck, isLoading, isError, error } = useQuery({
        queryKey: ['deck', deckId],
        queryFn: async () => {
            const data = await getDeck(deckId);
            return data;
        },
    })

    useEffect(() => {
        if (!api) return

        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap() + 1)

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1)
        })
    }, [api])

    if (isLoading) return <div>Loading...</div>

    if (isError) return <div>Error: {error.message}</div>

    if (!deck.cards || deck.cards.length === 0) return <div>Deck is empty</div>

    return (
        <section className="mx-20 flex flex-col items-center justify-center mt-16 ">
            <Carousel setApi={setApi} className="w-full max-w-xl">
                <CarouselContent >
                    {deck.cards.map((flashcard, index) => (
                        <CarouselItem key={index}>
                            <Card className="border-none" onClick={() => setFlipped(!flipped)}>
                                <CardContent className={`flex flip-study-card aspect-square items-center justify-center py-16 cursor-pointer ${flipped ? 'flipped' : ''}`}>
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
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
            <div className="text-center text-sm text-muted-foreground">
                Card {current} of {count}
            </div>
        </section>
    )
}

