import React from "react";

type FlashcardProps = {
  word: string;
  description: string;
  imageSrc: string;
  type: string; // e.g., "noun", "verb"
  onKnow: () => void;
  onForgot: () => void;
};

const Flashcard: React.FC<FlashcardProps> = ({ word, description, imageSrc, type, onKnow, onForgot }) => {
  return (
    <div className="max-w-sm mx-auto bg-white rounded-lg shadow-md border border-gray-200 p-4">
      {/* Header with word type */}
      <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full capitalize">{type}</span>
        <button className="text-blue-500 hover:underline text-xs">Edit Card</button>
      </div>

      {/* Image */}
      <div className="flex justify-center mb-4">
        <img src={imageSrc} alt={word} className="w-16 h-16" />
      </div>

      {/* Word */}
      <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">{word}</h2>

      {/* Sentence */}
      <p className="text-sm text-gray-600 text-center">{description}</p>

      {/* Buttons */}
      <div className="flex justify-between mt-4">
        <button
          onClick={onForgot}
          className="flex-1 bg-gray-100 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-200 mr-2"
        >
          <span role="img" aria-label="Forgot">😕</span> Forgot
        </button>
        <button
          onClick={onKnow}
          className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 ml-2"
        >
          <span role="img" aria-label="Know">😊</span> Know
        </button>
      </div>
    </div>
  );
};

export default Flashcard;
