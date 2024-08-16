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

// Create a new deck
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
        const flashcards = await generateFlashcards(content);


        // Add flashcards to the deck
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

        // Commit the batch
        await batch.commit();

        return {
            deckId: deckRef.id,
            message: `Deck created with ${10} flashcards`
        };
    } catch (error) {
        console.error('Error creating deck:', error);
        return { error: 'Failed to create deck and flashcards' };
    }

}

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
    const { userId } = auth();
    if (!userId) return { error: 'User not authenticated' };

    const deckId = formData.get('deckId');
    const frontContent = formData.get('frontContent');
    const backContent = formData.get('backContent');
    const image = formData.get('image');

    const deckRef = doc(db, 'decks', deckId);
    const deckDoc = await getDoc(deckRef);

    if (!deckDoc.exists() || deckDoc.data()?.userId !== userId) {
        return { error: 'Deck not found or access denied' };
    }

    let imageUrl = null;
    if (image) {
        const imageRef = ref(storage, `cards/${Date.now()}.jpg`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
    }

    const cardRef = await addDoc(collection(db, 'decks', deckId, 'cards'), {
        frontContent,
        backContent,
        image: imageUrl,
        createdAt: serverTimestamp(),
        lastReviewed: null,
        nextReview: null,
    });

    return cardRef.id;
}

// Get a deck
export async function getDeck(deckId) {
    const { userId } = auth();
    if (!userId) return { error: 'User not authenticated' };

    if (!deckId) return { error: 'Deck ID is required to get cards' };

    try {
        const deckRef = doc(db, 'decks', deckId);
        const deckDoc = await getDoc(deckRef);

        if (!deckDoc.exists()) {
            return { error: 'Deck not found' };
        }

        const deckData = deckDoc.data();
        if (deckData.userId !== userId) {
            return { error: 'Access denied' };
        }

        const cardsQuery = query(collection(deckRef, 'cards'));
        const cardsSnapshot = await getDocs(cardsQuery);
        const serializedDeckData = {
            id: deckDoc.id,
            ...deckData,
            createdAt: deckData.createdAt.toDate().toISOString(),
            lastModified: deckData.lastModified.toDate().toISOString(),
            cards: cardsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt.toDate().toISOString(),
                lastReviewed: doc.data().lastReviewed?.toDate().toISOString(),
                nextReview: doc.data().nextReview?.toDate().toISOString(),
            })),
        };

        return serializedDeckData;

    } catch (error) {
        console.error('Error fetching deck data:', error);
        return { error: 'Failed to fetch deck data' };
    };
}

// Delete a card from a deck
export async function deleteCard(formData) {
    const { userId } = auth();
    if (!userId) return { error: 'User not authenticated' };

    const { deckId, cardId } = formData;

    const deckRef = doc(db, 'decks', deckId);
    const deckDoc = await getDoc(deckRef);

    if (!deckDoc.exists() || deckDoc.data()?.userId !== userId) {
        return { error: 'Deck not found or access denied' };
    }

    await deleteDoc(doc(db, 'decks', deckId, 'cards', cardId));
    return { success: true };
}

// Update a card in a deck
export async function updateCard(formData) {
    const { userId } = auth();
    if (!userId) return { error: 'User not authenticated' };

    const deckId = formData.get("deckId");
    const cardId = formData.get("cardId");

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

        const currentCardData = cardDoc.data();
        const updates = {
            frontContent: formData.get("frontContent"),
            backContent: formData.get("backContent"),
            lastReviewed: formData.get("lastReviewed") ? new Date(formData.get("lastReviewed")) : currentCardData.lastReviewed,
            nextReview: formData.get("nextReview") ? new Date(formData.get("nextReview")) : currentCardData.nextReview,
        };

        const newImage = formData.get('image');
        if (newImage && newImage.size) {
            if (currentCardData.image) {
                const oldImageRef = ref(storage, currentCardData.image);
                await deleteObject(oldImageRef);
            }
            const imageRef = ref(storage, `cards/${Date.now()}.jpg`);
            await uploadBytes(imageRef, newImage);
            const imageUrl = await getDownloadURL(imageRef);
            updates.image = imageUrl;
        } else {
            updates.image = currentCardData.image;
        }

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

        if (!response.ok) {
            throw new Error('Failed to generate flashcards');
        }

        const data = await response.json();
        const flashcards = JSON.parse(data.response).flashcards;
        return flashcards;
    } catch (error) {
        console.error('Error generating flashcards:', error);
        throw error;
    }
}