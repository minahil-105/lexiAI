import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { deleteDeck } from '@/app/actions/flashcards'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { BookOpen, Trash } from 'lucide-react'
import Link from 'next/link'

const DeckItem = ({ deck }) => {
    const queryClient = useQueryClient();
    const { mutate: handleDeleteDeck, isPending } = useMutation({
        mutationFn: async (deckId) => {
            await deleteDeck({ deckId });
        },
        onSuccess: () => {
            queryClient.invalidateQueries('decks');
        }

    })

    return (
        <Card className="w-44 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all">
            <CardHeader>
                <CardTitle>{deck.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription>{deck.description}</CardDescription>
            </CardContent>
            <CardFooter className="flex gap-3 justify-end">
                <Button onClick={() => handleDeleteDeck(deck.id)} size='icon' variant="secondary" disabled={isPending}>
                    <Trash size={20} />
                </Button>
                <Link href={`/deck/${deck.id}`}>
                    <Button onClick={() => { }} size='icon'>
                        <BookOpen size={20} />
                    </Button>
                </Link>

            </CardFooter>
        </Card>
    )
}

export default DeckItem