'use client';

import React, { useState, useEffect } from 'react';

type FlashcardData = {
  question: string;
  answer: string;
};

const themes = [
  {
    name: "Soft Sunrise",
    background: "#FFFAF0",
    accent: "#FAD6A5",
    text: "#6C757D",
    highlight: "#FFC1CC",
  },
  {
    name: "Mint Cream Bliss",
    background: "#E8F6EF",
    accent: "#A7D2CB",
    text: "#495057",
    highlight: "#FFB4A2",
  },
  {
    name: "Lavender Dreams",
    background: "#F4F1FB",
    accent: "#C8A2C8",
    text: "#514F59",
    highlight: "#F8BBD0",
  },
  {
    name: "Peachy Paradise",
    background: "#FFF4E6",
    accent: "#FFD6A5",
    text: "#6C757D",
    highlight: "#FFE8E8",
  },
  {
    name: "Sage Serenity",
    background: "#EDF7F6",
    accent: "#B2DFDB",
    text: "#4E4E4E",
    highlight: "#FFB4B4",
  },
  {
    name: "Powder Blue Harmony",
    background: "#E3F2FD",
    accent: "#BBDEFB",
    text: "#37474F",
    highlight: "#FFCCBC",
  },
  {
    name: "Creamy Pastel Garden",
    background: "#FAF3E0",
    accent: "#B7E4C7",
    text: "#525252",
    highlight: "#FAD4D4",
  },
  {
    name: "Cotton Candy Vibes",
    background: "#FFF0F5",
    accent: "#FFDEE9",
    text: "#4A4A4A",
    highlight: "#D7FFFE",
  },
  {
    name: "Warm Breeze",
    background: "#FFF8E1",
    accent: "#FFABAB",
    text: "#616161",
    highlight: "#FFCECE",
  },
  {
    name: "Gentle Meadow",
    background: "#F3FFE3",
    accent: "#D1E8E2",
    text: "#546E7A",
    highlight: "#FFE8D6",
  },
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
      setCards(data.flashcards || []);
      setCurrentCard(data.flashcards?.[0] || null);
      setIsSubmitted(true);
      setLoading(false);

      // Randomly select a theme
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

  const handleForgot = () => {
    setShowAnswer(true);
  };

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
    if (topic.trim()) {
      fetchFlashcards(topic.trim());
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ backgroundColor: theme.background, color: theme.text }}
    >
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter a topic..."
            className="w-full border rounded-lg p-2"
            style={{ borderColor: theme.accent }}
          />
          <button
            type="submit"
            className="w-full py-2 rounded-lg"
            style={{
              backgroundColor: theme.accent,
              color: theme.text,
              borderColor: theme.highlight,
            }}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Submit'}
          </button>
        </form>
      ) : (
        <div className="w-full max-w-md">
          {currentCard ? (
            <div
              className="max-w-sm mx-auto rounded-lg shadow-md border p-4"
              style={{
                backgroundColor: theme.highlight,
                borderColor: theme.accent,
              }}
            >
              <h2 className="text-xl font-semibold text-center mb-2">
                {currentCard.question}
              </h2>
              {showAnswer && (
                <p className="text-sm text-center mt-4">{currentCard.answer}</p>
              )}
              <div className="flex justify-between mt-4">
                {!showAnswer ? (
                  <>
                    <button
                      onClick={handleForgot}
                      className="flex-1 py-2 px-4 rounded-lg mr-2"
                      style={{ backgroundColor: theme.accent }}
                    >
                      😕 Forgot
                    </button>
                    <button
                      onClick={handleKnow}
                      className="flex-1 py-2 px-4 rounded-lg ml-2"
                      style={{ backgroundColor: theme.accent, color: theme.text }}
                    >
                      😊 Know
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleNext}
                    className="w-full py-2 px-4 rounded-lg"
                    style={{ backgroundColor: theme.accent, color: theme.text }}
                  >
                    Next Question
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p>You've mastered all the flashcards!</p>
            </div>
          )}
          <button
            onClick={reset}
            className="mt-4 w-full py-2 rounded-lg"
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
