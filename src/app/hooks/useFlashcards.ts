import { useState } from "react";

type FlashcardData = {
  word: string;
  description: string;
  imageSrc: string;
  type: string;
};

export const useFlashcards = (initialCards: FlashcardData[]) => {
  const [cards, setCards] = useState(initialCards);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentCard = cards[currentIndex];

  const handleKnow = () => {
    console.log("You know:", currentCard.word);
    moveToNext();
  };

  const handleForgot = () => {
    console.log("You forgot:", currentCard.word);
    moveToNext();
  };

  const moveToNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else {
      console.log("No more cards");
    }
  };

  return { currentCard, handleKnow, handleForgot };
};
