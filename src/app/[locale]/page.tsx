'use client'

import React from "react";
import Flashcard from "../components/Flashcard";
import { useFlashcards } from "../hooks/useFlashcards";

const initialFlashcards = [
  {
    word: "la naranja",
    description: "El jugo de naranja es mi bebida preferida por la mañana.",
    imageSrc: "/public/naranja.png",
    type: "noun",
  },
];

const FlashcardPage: React.FC = () => {
  const { currentCard, handleKnow, handleForgot } = useFlashcards(initialFlashcards);

  if (!currentCard) {
    return <p className="text-center text-gray-500">You've gone through all the flashcards!</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Flashcard
        word={currentCard.word}
        description={currentCard.description}
        imageSrc={currentCard.imageSrc}
        type={currentCard.type}
        onKnow={handleKnow}
        onForgot={handleForgot}
      />
    </div>
  );
};

export default FlashcardPage;
