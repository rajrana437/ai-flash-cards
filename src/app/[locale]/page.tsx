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

      const randomTheme = themes[Math.floor(Math.random() * themes.length)];
      setTheme(randomTheme);
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

  const handleForgot = () => 
  {
    setShowAnswer(true);
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    setTheme(randomTheme);

    console.log(randomTheme);
    
  }

  const handleNext = () => {
    if (currentCard) {
      if (!masteredCards.includes(currentCard)) {
        setCards((prevCards) => [...prevCards.slice(1), currentCard]);
      } else {
        setCards((prevCards) => prevCards.slice(1));
      }
    }

    if (cards.length > 1) {
      setCurrentCard(cards[1]);
    } else {
      setCurrentCard(null);
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
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-offset-2"
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
        <div className="w-full max-w-md space-y-6">
          {currentCard ? (
            <div
              className="rounded-3xl shadow-lg p-8 flex flex-col items-center text-center transition-transform"
              style={{
                backgroundColor: theme.highlight,
                borderColor: theme.accent,
                border: '2px solid',
              }}
            >
              <h2 className="text-3xl font-bold mb-6">{currentCard.question}</h2>
              {showAnswer && (
                <p className="text-lg bg-white p-4 rounded-lg shadow-md mb-6">
                  {currentCard.answer}
                </p>
              )}
              <div className="flex justify-between w-full space-x-4">
                {!showAnswer ? (
                  <>
                    <button
                      onClick={handleForgot}
                      className="flex-1 py-3 px-6 rounded-xl font-semibold hover:bg-opacity-90 transition-all"
                      style={{
                        backgroundColor: theme.accent,
                        color: theme.text,
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      😕 Forgot
                    </button>
                    <button
                      onClick={handleKnow}
                      className="flex-1 py-3 px-6 rounded-xl font-semibold hover:bg-opacity-90 transition-all"
                      style={{
                        backgroundColor: theme.accent,
                        color: theme.text,
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      😊 Know
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleNext}
                    className="w-full py-3 px-6 rounded-xl font-semibold hover:scale-105 transition-transform"
                    style={{
                      backgroundColor: theme.accent,
                      color: theme.text,
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    Next Question
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-lg">You've mastered all the flashcards!</p>
            </div>
          )}
          <button
            onClick={reset}
            className="w-full py-3 rounded-lg font-semibold text-lg hover:scale-105 transition-transform"
            style={{ backgroundColor: theme.accent, color: theme.text }}
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
};

export default FlashcardPage;