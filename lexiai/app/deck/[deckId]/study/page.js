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
            setFlipped(false) // Reset flip state when changing cards
        })
    }, [api])

    if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>

    if (isError) return <div className="flex justify-center items-center h-screen">Error: {error.message}</div>

    if (!deck.cards || deck.cards.length === 0) return <div className="flex justify-center items-center h-screen">Deck is empty</div>

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-16">
            <Carousel setApi={setApi} className="w-full max-w-3xl">
                <CarouselContent>
                    {deck.cards.map((flashcard, index) => (
                        <CarouselItem key={index}>
                            <div className="flex justify-center items-center h-[70vh]">
                                <Card
                                    className={`flip-study-card w-full h-full ${flipped ? 'flipped' : ''}`}
                                    onClick={() => setFlipped(!flipped)}
                                >
                                    <CardContent className="h-full">
                                        <div className="flip-card-inner w-full h-full">
                                            <div className="flip-card-front bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-md shadow-md flex flex-col justify-center">
                                                <h3 className="font-semibold text-white text-2xl mb-4">Front:</h3>
                                                <p className="text-white text-xl">{flashcard.frontContent}</p>
                                            </div>
                                            <div className="flip-card-back bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-md shadow-md flex flex-col justify-center">
                                                <h3 className="font-semibold text-white text-2xl mb-4">Back:</h3>
                                                <p className="text-white text-xl">{flashcard.backContent}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
            <div className="flex justify-center w-full pt-4">
                <p className="text-sm text-muted-foreground">
                    Card {current} of {count}
                </p>
            </div>
        </div>
    )
}