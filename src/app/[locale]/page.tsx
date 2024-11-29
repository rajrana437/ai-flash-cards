'use client';

import React, { useState } from 'react';

type FlashcardData = {
  question: string;
  answer: string;
};

const FlashcardPage: React.FC = () => {
  const [cards, setCards] = useState<FlashcardData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [topic, setTopic] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get the current card only if it exists
  const currentCard = cards.length > 0 ? cards[currentIndex] : null;

  const fetchFlashcards = async (topic: string) => {
    try {
      setLoading(true);

      const response = await fetch('/api/cards/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: topic }),
      });

      const data = await response.json();
      console.log('API Response:', data); // Debug log for the API response

      setCards(data.flashcards || []); // Ensure cards is always an array
      setCurrentIndex(0);
      setIsSubmitted(true);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
      setLoading(false);
    }
  };

  const handleKnow = () => {
    console.log('You know:', currentCard?.question);
    moveToNext();
  };

  const handleForgot = () => {
    console.log('You forgot:', currentCard?.question);
    moveToNext();
  };

  const moveToNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else {
      console.log('No more cards');
    }
  };

  const reset = () => {
    setCards([]);
    setCurrentIndex(0);
    setTopic('');
    setIsSubmitted(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      fetchFlashcards(topic.trim());
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter a topic..."
            className="w-full border border-gray-300 rounded-lg p-2"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Submit'}
          </button>
        </form>
      ) : (
        <div className="w-full max-w-md">
          {currentCard ? (
            <div className="max-w-sm mx-auto bg-white rounded-lg shadow-md border border-gray-200 p-4">
              <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">
                {currentCard.question}
              </h2>
              <p className="text-sm text-gray-600 text-center">
                {currentCard.answer}
              </p>
              <div className="flex justify-between mt-4">
                <button
                  onClick={handleForgot}
                  className="flex-1 bg-gray-100 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-200 mr-2"
                >
                  <span role="img" aria-label="Forgot">😕</span> Forgot
                </button>
                <button
                  onClick={handleKnow}
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 ml-2"
                >
                  <span role="img" aria-label="Know">😊</span> Know
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-500">You've mastered all the flashcards!</p>
            </div>
          )}
          <button
            onClick={reset}
            className="mt-4 w-full bg-gray-100 text-gray-800 py-2 rounded-lg hover:bg-gray-200"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
};

export default FlashcardPage;
