'use client'
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { collection, doc, getDocs } from 'firebase/firestore';
import db from '../../firebase';; // Adjust the import path as needed
import { useSearchParams } from 'next/navigation';

export default function FlashcardSet() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const searchParams = useSearchParams();
  const search = searchParams.get('id');

  useEffect(() => {
    async function getFlashcard() {
      if (!search || !user) return;

      const colRef = collection(doc(collection(db, 'users'), user.id), search);
      const docs = await getDocs(colRef);
      const flashcardsData = [];
      docs.forEach((doc) => {
        flashcardsData.push({ id: doc.id, ...doc.data() });
      });
      setFlashcards(flashcardsData);
    }
    getFlashcard();
  }, [search, user]);

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {flashcards.map((flashcard) => (
          <div
            key={flashcard.id}
            className="relative perspective"
            onClick={() => handleCardClick(flashcard.id)}
          >
            <div
              className={`relative w-full h-64 bg-white shadow-lg rounded-lg transition-transform duration-500 ${flipped[flashcard.id] ? 'rotate-y-180' : ''}`}
            >
              <div className="absolute inset-0 backface-hidden flex items-center justify-center p-4">
                <h2 className="text-xl font-semibold">{flashcard.front}</h2>
              </div>
              <div className={`absolute inset-0 backface-hidden flex items-center justify-center p-4 bg-gray-200 rounded-lg rotate-y-180`}>
                <h2 className="text-xl font-semibold">{flashcard.back}</h2>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
