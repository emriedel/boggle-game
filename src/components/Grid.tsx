import React, { useState } from "react";
import { generateGrid } from "../utils/generateGrid";
import { WORD_LIST } from "../data/words";

const Grid: React.FC = () => {
  const [grid, setGrid] = useState<string[][]>(generateGrid());
  const [selectedCells, setSelectedCells] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // State for feedback message
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleMouseDown = (rowIndex: number, colIndex: number) => {
    const cellKey = `${rowIndex}-${colIndex}`;
    setSelectedCells([cellKey]); // Start a new selection
    setFeedbackMessage(null); // Clear feedback on new selection
    setIsDragging(true);
  };

  const handleMouseEnter = (rowIndex: number, colIndex: number) => {
    if (!isDragging) return;

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
      if (WORD_LIST.has(word)) {
        setFeedbackMessage(`Valid word: "${word}"`);
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
                className={`flex items-center justify-center w-16 h-16 text-2xl font-bold rounded-lg cursor-pointer ${
                  isSelected
                    ? "bg-green-500 text-white"
                    : "bg-blue-500 text-white"
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
