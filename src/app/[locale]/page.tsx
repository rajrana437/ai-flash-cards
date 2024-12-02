'use client';

import React, { useState, useEffect } from 'react';

type FlashcardData = {
  question: string;
  answer: string;
};

const themes = [
  {
    name: "Peachy Paradise",
    background: "#FFF8F0", // Warmer peach
    accent: "#FFA07A", // Softer, muted orange
    text: "#3F444E", // Neutral dark gray
    highlight: "#FFD1BA", // Muted cream-pink highlight
  },
  {
    name: "Warm Breeze",
    background: "#FFF9E5", // Soft beige
    accent: "#FFC78A", // Light amber
    text: "#5D5A55", // Subtle earthy gray
    highlight: "#FFD9B3", // Warm peach-beige highlight
  },
  {
    name: "Vibrant Sunset",
    background: "#FFE6B3", // Warm, golden tones
    accent: "#FF8C42", // Sunset orange
    text: "#4D3B3B", // Deep brown for text contrast
    highlight: "#FFD580", // Golden yellow highlight
  },
  {
    name: "Ocean Breeze",
    background: "#E6F7FF", // Calming light blue
    accent: "#4A90E2", // Crisp ocean blue
    text: "#243B53", // Dark navy for legibility
    highlight: "#A3D9FF", // Sky blue highlight
  },
  {
    name: "Forest Green",
    background: "#E9F5E8", // Soft, muted forest green
    accent: "#5E8A68", // Earthy, deep green
    text: "#1C241B", // Dark forest for good contrast
    highlight: "#A3CFA3", // Subtle green highlight
  }
];

const FlashcardPage: React.FC = () => {
  const [cards, setCards] = useState<FlashcardData[]>([]);
  const [currentCard, setCurrentCard] = useState<FlashcardData | null>(null);
  const [masteredCards, setMasteredCards] = useState<FlashcardData[]>([]);
  const [topic, setTopic] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [theme, setTheme] = useState(themes[0]);

  useEffect(() => {
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    setTheme(randomTheme);
  }, [])
  

  const fetchFlashcards = async (topic: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/cards/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: topic }),
      });
      const data = await response.json();
      setCards(data.flashcards || []);
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
    setShowAnswer(true);

  };

  const handleNext = () => {
    if (currentCard) {
      // If the current card is not mastered, move it to the end of the deck
      if (!masteredCards.includes(currentCard)) {
        setCards((prevCards) => [...prevCards.slice(1), currentCard]);
      } else {
        // If the current card is mastered, remove it from the deck
        setCards((prevCards) => prevCards.slice(1));
      }
    }
  
    // If only one unmastered card is left, keep repeating it
    if (cards.length === 1 && !masteredCards.includes(currentCard!)) {
      setCurrentCard(currentCard); // Repeat the same card
    } else if (cards.length > 1) {
      setCurrentCard(cards[1]); // Move to the next card
    } else {
      setCurrentCard(null); // End if no cards are left
    }
  
    setShowAnswer(false);
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
    if (topic.trim()) fetchFlashcards(topic.trim());
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 transition-all"
      style={{ backgroundColor: theme.background, color: theme.text }}
    >
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter a topic..."
            className="w-full border rounded-lg p-4 text-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{ borderColor: theme.accent, color: theme.text }}
          />
          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105"
            style={{
              backgroundColor: theme.accent,
              color: theme.text,
              border: `2px solid ${theme.highlight}`,
            }}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Submit'}
          </button>
        </form>
      ) : (
        <div className="w-full max-w-lg space-y-6">
          {currentCard ? (
            <div
            className="min-h-screen flex flex-col items-center justify-center p-6"
            style={{ backgroundColor: theme.background, color: theme.text }}
              >
                {currentCard ? (
                  <div
                    className="rounded-3xl shadow-2xl p-8 flex flex-col items-center text-center transition-transform relative"
                    style={{
                      backgroundColor: theme.highlight,
                      borderWidth: '2px', // Replace 'border: 2px solid'
                      borderStyle: 'solid',
                      borderColor: theme.accent, // Use borderColor explicitly
                      maxWidth: '400px',
                      width: '100%',
                    }}
                  >
                    {/* Header */}
                    <div className="absolute top-4 left-4 text-sm px-3 py-1 rounded-full bg-white shadow-md font-semibold">
                    ThinkStack
                    </div>
                    <button
                      className="absolute top-4 right-4 text-sm text-blue-500 font-semibold"
                      onClick={() => {
                        const randomTheme = themes[Math.floor(Math.random() * themes.length)];
                        setTheme(randomTheme);
                      }}
                    >
                      shuffle theme
                    </button>

                    {/* Icon */}
                    <div className="w-16 h-16 mb-6">
                      <img
                        src="/pngegg.png" // Replace with your own icon/image
                        alt="Orange"
                        className="w-full h-full object-contain"
                      />
                </div>
          
                {/* Word */}
                <h2 className="text-2xl font-extrabold mb-4">{currentCard.question}</h2>
          
                {/* Example Sentence */}
                {showAnswer ? (
                  <p
                    className="text-sm bg-white p-4 rounded-lg shadow-md"
                    style={{
                      width: '90%',
                      color: theme.text,
                    }}
                  >
                    {currentCard.answer}
                  </p>
                ) : (
                  <p className="text-sm italic text-gray-500">
                    Tap "Forgot" or "Know" to reveal the answer
                  </p>
                )}
          
                {/* Buttons */}
                <div className="flex justify-between w-full mt-8 space-x-4">
                  {!showAnswer ? (
                    <>
                      <button
                        onClick={handleForgot}
                        className="flex-1 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-all"
                        style={{
                          backgroundColor: '#f0f0f0',
                          color: theme.text,
                          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        😕 Forgot
                      </button>
                      <button
                        onClick={handleKnow}
                        className="flex-1 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-all"
                        style={{
                          backgroundColor: theme.accent,
                          color: theme.text,
                          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                        }}
                      >
                        😊 Know
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="w-full py-3 rounded-lg font-bold hover:scale-105 transition-transform"
                      style={{
                        backgroundColor: theme.accent,
                        color: theme.text,
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                      }}
                    >
                      Next Question
                    </button>
                  )}
                </div>
              </div>
              ) : (
                <div className="text-center space-y-6">
                  <p className="text-lg">You've mastered all the flashcards!</p>
                  <button
                    onClick={reset}
                    className="w-full max-w-md py-3 rounded-lg font-semibold text-lg hover:scale-105 transition-transform"
                    style={{ backgroundColor: theme.accent, color: theme.text }}
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>

          ) : (
            <div className="text-center space-y-6">
              <p className="text-lg">You've mastered all the flashcards!</p>
              <button
                onClick={reset}
                className="w-full max-w-md py-3 rounded-lg font-semibold text-lg hover:scale-105 transition-transform"
                style={{ backgroundColor: theme.accent, color: theme.text }}
              >
                Reset
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default FlashcardPage;