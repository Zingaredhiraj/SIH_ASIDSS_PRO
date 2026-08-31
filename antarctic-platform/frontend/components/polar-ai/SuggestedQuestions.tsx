import React from 'react'

const SUGGESTIONS = [
  "What is the SOP for a generator failure?",
  "Summarize current station health.",
  "Are there any upcoming transport windows?",
  "What is the medical evacuation protocol?"
];

export function SuggestedQuestions({ onSelect }: { onSelect: (text: string) => void }) {
  return (
    <div className="flex space-x-2 overflow-x-auto pb-2 hide-scrollbar">
      {SUGGESTIONS.map((q, i) => (
        <button
          key={i}
          onClick={() => onSelect(q)}
          className="whitespace-nowrap px-3 py-1 bg-navy-800 border border-polar-border hover:border-ice-500 rounded-full text-xs text-gray-300 transition-colors"
        >
          {q}
        </button>
      ))}
    </div>
  )
}
