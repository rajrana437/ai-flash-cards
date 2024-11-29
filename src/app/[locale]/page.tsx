'use client';

import React, { useState } from 'react';

type FlashcardData = {
  question: string;
  answer: string;
};

const FlashcardPage: React.FC = () => {
  const [cards, setCards] = useState<FlashcardData[]>([]);
  const [currentCard, setCurrentCard] = useState<FlashcardData | null>(null);
  const [masteredCards, setMasteredCards] = useState<FlashcardData[]>([]);
  const [topic, setTopic] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  // Fetch flashcards
  const fetchFlashcards = async (topic: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/cards/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: topic }),
      });
      const data = await response.json();
      setCards(data.flashcards || []); // Ensure flashcards is an array
      setCurrentCard(data.flashcards?.[0] || null);
      setIsSubmitted(true);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
      setLoading(false);
    }
  };

  const handleKnow = () => {
    if (currentCard) {
      setMasteredCards((prevMastered) => [...prevMastered, currentCard]);
      setShowAnswer(true);
    }
  };

  const handleForgot = () => {
    setShowAnswer(true); // Show the answer before reshuffling
  };

  const handleNext = () => {
    if (currentCard) {
      if (!masteredCards.includes(currentCard)) {
        setCards((prevCards) => [...prevCards.slice(1), currentCard]); // Re-add forgotten card
      } else {
        setCards((prevCards) => prevCards.slice(1)); // Remove mastered card
      }
    }

    if (cards.length > 1) {
      setCurrentCard(cards[1]); // Move to the next card
    } else {
      setCurrentCard(null); // All cards mastered
    }

    setShowAnswer(false); // Hide the answer for the next card
  };

  const reset = () => {
    setCards([]);
    setMasteredCards([]);
    setCurrentCard(null);
    setTopic('');
    setIsSubmitted(false);
    setShowAnswer(false);
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
              {showAnswer && (
                <p className="text-sm text-gray-600 text-center mt-4">
                  {currentCard.answer}
                </p>
              )}
              <div className="flex justify-between mt-4">
                {!showAnswer ? (
                  <>
                    <button
                      onClick={handleForgot}
                      className="flex-1 bg-gray-100 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-200 mr-2"
                    >
                      😕 Forgot
                    </button>
                    <button
                      onClick={handleKnow}
                      className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 ml-2"
                    >
                      😊 Know
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleNext}
                    className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
                  >
                    Next Question
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-500">
                {cards.length === 0 ? "You've mastered all the flashcards!" : "Loading..."}
              </p>
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
