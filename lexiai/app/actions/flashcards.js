"use server"

import { auth } from '@clerk/nextjs/server';
import { db, storage } from '@/firebase';
import { addDoc, collection, doc, getDoc, getDocs, updateDoc, deleteDoc, query, where, serverTimestamp, writeBatch } from 'firebase/firestore';
import { uploadBytes, getDownloadURL, ref, deleteObject } from 'firebase/storage';

/*
users: {
    userId: {
        username: string,
        email: string,
        createdAt: timestamp,
        decks: {
            deckId: {
                deckName: string,
                description: string,
                createdAt: timestamp,
                lastModified: timestamp
                cards: {
                    cardId: {
                        frontContent: string,
                        backContent: string,
                        createdAt: timestamp,
                        lastReviewed: timestamp,
                        nextReview: timestamp
                    }
                }
            }
        },
    },
}
*/
// Get all decks for a user
export async function getUserDecks() {
    const { userId } = auth();
    if (!userId) return { error: 'User not authenticated' };

    const decksQuery = query(collection(db, 'decks'), where('userId', '==', userId));
    const decksSnapshot = await getDocs(decksQuery);

    return decksSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        description: doc.data().description,
    }));
}

// Delete a deck
export async function deleteDeck({ deckId }) {
    const { userId } = auth();
    if (!userId) return { error: 'User not authenticated' };

    const deckRef = doc(db, 'decks', deckId);
    const deckDoc = await getDoc(deckRef);

    if (!deckDoc.exists() || deckDoc.data()?.userId !== userId) {
        return { error: 'Deck not found or access denied' };
    }

    await deleteDoc(deckRef);
    return { success: true };
}

// Add a card to a deck
export async function addCardToDeck(formData) {
    console.log('Adding card to deck:',);
    const { userId } = auth();
    if (!userId) return { error: 'User not authenticated' };



    const { deckId, frontContent, backContent } = formData;

    const deckRef = doc(db, 'decks', deckId);
    const deckDoc = await getDoc(deckRef);

    if (!deckDoc.exists() || deckDoc.data()?.userId !== userId) {
        throw new Error('Deck not found or access denied');
    }

    const cardRef = await addDoc(collection(db, 'decks', deckId, 'cards'), {
        frontContent,
        backContent,
        createdAt: serverTimestamp(),
        lastReviewed: null,
        nextReview: null,
    });

    console.log('Card added:', cardRef.id);
    console.log('Card added:', cardRef);

    return cardRef.id;
}

// Get a deck
export async function createDeck(formData) {
    const { userId } = auth();
    if (!userId) return { error: 'User not authenticated' };

    const { name, description, content } = formData;

    try {
        // Start a new batch
        const batch = writeBatch(db);

        // Create the deck document
        const deckRef = doc(collection(db, 'decks'));
        batch.set(deckRef, {
            userId,
            name,
            description,
            createdAt: serverTimestamp(),
            lastModified: serverTimestamp(),
        });

        // Generate flashcards
        if (content) {
            const flashcards = await generateFlashcards(content)

            if (flashcards) {
                // Add flashcards to the deck if they were generated
                for (const flashcard of flashcards) {
                    const cardRef = doc(collection(db, 'decks', deckRef.id, 'cards'));
                    batch.set(cardRef, {
                        frontContent: flashcard.front,
                        backContent: flashcard.back,
                        createdAt: serverTimestamp(),
                        lastReviewed: null,
                        nextReview: null,
                    });
                }
            }
        }

        // Commit the batch
        await batch.commit();

        return {
            deckId: deckRef.id,
            message: `Deck created with ${flashcard.length} flashcards}`
        };
    } catch (error) {
        console.error('Error creating deck:', error);
        return { error: 'Failed to create deck and flashcards' };
    }

}



// Delete a card from a deck
export async function deleteCard(formData) {
    const { userId } = auth();
    if (!userId) return { error: 'User not authenticated' };

    console.log('Deleting card:', formData);

    const { deckId, cardId } = formData;

    if (!deckId || !cardId) {
        throw new Error('DeckId and CardId are required');
    }

    try {
        const deckRef = doc(db, 'decks', deckId);
        const deckDoc = await getDoc(deckRef);

        if (!deckDoc.exists() || deckDoc.data()?.userId !== userId) {
            return { error: 'Deck not found or access denied' };
        }

        const cardRef = doc(db, 'decks', deckId, 'cards', cardId);
        await deleteDoc(cardRef);

        return { success: true };
    } catch (error) {
        console.error('Error deleting card:', error);
        return { error: 'Failed to delete card' };
    }

}

// Update a card in a deck
export async function updateCard(formData) {
    const { userId } = auth();
    if (!userId) return { error: 'User not authenticated' };
    console.log('Updating card:', formData);
    const { deckId, cardId, frontContent, backContent } = formData;

    try {
        if (!deckId || !cardId) {
            return { error: 'DeckId and CardId are required' };
        }

        const deckRef = doc(db, 'decks', deckId);
        const deckDoc = await getDoc(deckRef);

        if (!deckDoc.exists() || deckDoc.data()?.userId !== userId) {
            return { error: 'Deck not found or access denied' };
        }

        const cardRef = doc(db, 'decks', deckId, 'cards', cardId);
        const cardDoc = await getDoc(cardRef);
        if (!cardDoc.exists()) {
            return { error: 'Card not found' };
        }

        const updates = {
            frontContent,
            backContent,
        };


        await updateDoc(cardRef, updates);
        return { success: true };
    } catch (error) {
        console.error('Error updating card:', error);
        return { success: false, error: error.message };
    }
}

async function generateFlashcards(text) {
    try {

        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text }),
        });

        if (!response.ok) throw new Error('Failed to generate flashcards');

        const data = await response.json();
        const flashcards = JSON.parse(data.response).flashcards;
        return flashcards;
    } catch (error) {
        return;
    }
}