'use client'
// Import necessary functions from the Firebase Firestore SDK
import { doc, collection, getDoc, writeBatch, setDoc } from 'firebase/firestore'; // Add setDoc to the imports
import { db } from '../../firebase'; // Adjust this path based on your Firebase setup
import { useUser } from '@clerk/nextjs';
import { useState } from 'react';

export default function Generate() {
  const [text, setText] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [setName, setSetName] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useUser(); // Ensure you're using Clerk for authentication

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert('Please enter some text to generate flashcards.');
      return;
    }

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate flashcards');
      }

      const result = await response.json();
      console.log('Raw API response:', result);

      if (result && result.response) {
        const parsedData = JSON.parse(result.response);

        if (parsedData && Array.isArray(parsedData.flashcards)) {
          setFlashcards(parsedData.flashcards);
          console.log('Parsed flashcards:', parsedData.flashcards);
        } else {
          console.error('Invalid flashcard structure:', parsedData);
          alert('Received invalid flashcard data.');
        }
      } else {
        console.error('Invalid API response structure:', result);
        alert('Received invalid flashcard data.');
      }
    } catch (error) {
      console.error('Error generating flashcards:', error);
      alert('An error occurred while generating flashcards. Please try again.');
    }
  };

  const saveFlashcards = async () => {
    if (!setName.trim()) {
      alert('Please enter a name for your flashcard set.');
      return;
    }

    try {
      const userDocRef = doc(db, 'users', user.id); // Correctly reference user document
      const userDocSnap = await getDoc(userDocRef);

      const batch = writeBatch(db);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const updatedSets = [...(userData.flashcardSets || []), { name: setName }];
        batch.update(userDocRef, { flashcardSets: updatedSets });
      } else {
        batch.set(userDocRef, { flashcardSets: [{ name: setName }] });
      }

      const setDocRef = doc(collection(userDocRef, 'flashcardSets'), setName);
      await setDoc(setDocRef, { flashcards }); // Save the flashcards to the document

      await batch.commit();

      alert('Flashcards saved successfully!');
      handleCloseDialog();
      setSetName('');
    } catch (error) {
      console.error('Error saving flashcards:', error);
      alert('An error occurred while saving flashcards. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-8 p-4">
      <h1 className="text-3xl font-bold mb-6">Generate Flashcards</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text"
        className="w-full p-3 mb-4 border rounded-md"
        rows={6}
      ></textarea>
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 text-white py-2 rounded-md"
      >
        Generate Flashcards
      </button>

      {flashcards.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Generated Flashcards</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {flashcards.map((flashcard, index) => (
              <div
                key={index}
                className="p-4 border rounded-md shadow-sm bg-gray-100"
              >
                <h3 className="font-semibold">Front:</h3>
                <p>{flashcard.front}</p>
                <h3 className="font-semibold mt-2">Back:</h3>
                <p>{flashcard.back}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleOpenDialog}
              className="bg-green-500 text-white py-2 px-4 rounded-md"
            >
              Save Flashcards
            </button>
          </div>
        </div>
      )}

      {dialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md">
            <h3 className="text-xl font-semibold mb-4">Save Flashcard Set</h3>
            <input
              type="text"
              value={setName}
              onChange={(e) => setSetName(e.target.value)}
              placeholder="Set Name"
              className="w-full p-2 border rounded-md mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button onClick={handleCloseDialog} className="px-4 py-2 bg-gray-200 rounded-md">
                Cancel
              </button>
              <button onClick={saveFlashcards} className="px-4 py-2 bg-blue-500 text-white rounded-md">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
