import React, { useState, useEffect } from "react";
import { generateGrid } from "../utils/generateGrid";
import { loadWords } from "../utils/loadWords";

const Grid: React.FC = () => {
  const [grid, setGrid] = useState<string[][]>(generateGrid());
  const [selectedCells, setSelectedCells] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // States
  const [wordList, setWordList] = useState<Set<string>>(new Set());
  const [enteredWords, setEnteredWords] = useState<Set<string>>(new Set());
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(60); // Timer starts at 60 seconds
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  // Load the word list on component mount
  useEffect(() => {
    const fetchWords = async () => {
      const words = await loadWords();
      setWordList(words);
    };
    fetchWords();
  }, []);

  // Start the timer when the game begins
  useEffect(() => {
    if (timeRemaining <= 0) {
      setIsGameOver(true); // End the game when the timer runs out
      setFeedbackMessage("Time's up! Game over.");
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer); // Clean up the timer on component unmount
  }, [timeRemaining]);

  const handleMouseDown = (rowIndex: number, colIndex: number) => {
    if (isGameOver) return; // Prevent new word selection after the game ends

    const cellKey = `${rowIndex}-${colIndex}`;
    setSelectedCells([cellKey]); // Start a new selection
    setFeedbackMessage(null); // Clear feedback on new selection
    setIsDragging(true);
  };

  const handleMouseEnter = (rowIndex: number, colIndex: number) => {
if (isGameOver) return;

    if (!isDragging || isGameOver) return;

    const cellKey = `${rowIndex}-${colIndex}`;
    setSelectedCells((prev) => {
      const lastCell = prev[prev.length - 1];

      if (prev.includes(cellKey)) {
        // If dragging backward, remove the current cell
        return prev.slice(0, prev.indexOf(cellKey) + 1);
      } else if (isAdjacent(lastCell, rowIndex, colIndex)) {
        // If dragging forward, add the current cell
        return [...prev, cellKey];
      }

      return prev;
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);

    // Check if the word is valid
    const word = currentWord();
    if (word.length >= 3) {
      if (enteredWords.has(word)) {
        setFeedbackMessage(`You already entered "${word}"`);
        setSelectedCells([]); // Clear the selection
      } else if (wordList.has(word)) {
        setFeedbackMessage(`Valid word: "${word}"`);
        setEnteredWords((prev) => new Set(prev).add(word)); // Add word to entered words
      } else {
        setFeedbackMessage(`Invalid word: "${word}"`);
        setSelectedCells([]); // Clear the selection
      }
    } else {
      setFeedbackMessage("Words must be at least 3 letters");
      setSelectedCells([]); // Clear the selection
    }
  };

  // Function to check adjacency
  const isAdjacent = (prevCell: string, nextRow: number, nextCol: number) => {
    const [prevRow, prevCol] = prevCell.split("-").map(Number);
    const rowDiff = Math.abs(prevRow - nextRow);
    const colDiff = Math.abs(prevCol - nextCol);
    return rowDiff <= 1 && colDiff <= 1; // Must be adjacent
  };

  // Get the current word based on the selected cells
  const currentWord = (): string => {
    return selectedCells
      .map((cellKey) => {
        const [row, col] = cellKey.split("-").map(Number);
        return grid[row][col];
      })
      .join("");
  };

  return (
    <div className="flex flex-col items-center">
      {/* Display the timer */}
      <div className="mb-4 text-3xl font-bold text-gray-700">
        Time Remaining: {timeRemaining}s
      </div>
      
      {/* Display feedback message */}
      <div
        className={`mb-4 text-2xl font-bold ${
          feedbackMessage?.includes("Valid")
            ? "text-green-500"
            : "text-red-500"
        }`}
      >
        {feedbackMessage || "Start selecting letters"}
      </div>

      {/* Display entered words */}
      <div className="mb-4 text-lg text-gray-700">
        <strong>Entered Words:</strong> {Array.from(enteredWords).join(", ")}
      </div>

      {/* Grid */}
      <div
        className="grid grid-cols-4 gap-2 p-4 bg-gray-200 rounded-lg select-none"
        onMouseLeave={handleMouseUp} // Stop dragging if the mouse leaves the grid
      >
        {grid.map((row, rowIndex) =>
          row.map((letter, colIndex) => {
            const cellKey = `${rowIndex}-${colIndex}`;
            const isSelected = selectedCells.includes(cellKey);

            return (
              <div
                key={cellKey}
                onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                onMouseUp={handleMouseUp}
                className={`flex items-center justify-center w-16 h-16 text-2xl font-bold rounded-full cursor-pointer transition-transform hover:scale-105 ${
                  isSelected ? "bg-green-500 text-white" : "bg-blue-500 text-white"
                }`}
              >
                {letter}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Grid;
