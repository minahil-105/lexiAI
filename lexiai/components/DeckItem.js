import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { deleteDeck } from '@/app/actions/flashcards';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BookOpen, Trash } from 'lucide-react';
import Link from 'next/link';

const DeckItem = ({ deck }) => {
    const queryClient = useQueryClient();
    const { mutate: handleDeleteDeck, isPending } = useMutation({
        mutationFn: async (deckId) => {
            await deleteDeck({ deckId });
        },
        onSuccess: () => {
            queryClient.invalidateQueries('decks');
        }
    });

    return (
        <Card className="w-full max-w-sm mx-auto p-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 rounded-md">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">{deck.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription className="text-gray-200">
                    {deck.description}
                </CardDescription>
            </CardContent>
            <CardFooter className="flex gap-3 justify-end mt-4">
                <Button 
                    onClick={() => handleDeleteDeck(deck.id)} 
                    size='icon' 
                    variant="secondary" 
                    disabled={isPending}
                    className="bg-red-500 hover:bg-red-600 text-white rounded-full"
                >
                    <Trash size={20} />
                </Button>
                <Link href={`/deck/${deck.id}`}>
                    <Button size='icon' className="bg-blue-500 hover:bg-blue-600 text-white rounded-full">
                        <BookOpen size={20} />
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}

export default DeckItem;
