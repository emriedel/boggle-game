// Die distributions taken from "Classic" at: https://www.bananagrammer.com/2013/10/the-boggle-cube-redesign-and-its-effect.html
const BOGGLE_DICE = [
  "AACIOT", // Die 1
  "ABILTY", // Die 2
  "ABJMOQ", // Die 3
  "ACDEMP", // Die 4
  "ACELRS", // Die 5
  "ADENVZ", // Die 6
  "AHMORS", // Die 7
  "BIFORX", // Die 8
  "DENOSW", // Die 9
  "DKNOTU", // Die 10
  "EEFHIY", // Die 11
  "EGKLUY", // Die 12
  "EGINTV", // Die 13
  "EHINPS", // Die 14
  "ELPSTU", // Die 15
  "GILRUW", // Die 16
];

const shuffleArray = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const generateGrid = (size: number = 4): string[][] => {
  const selectedLetters: string[] = BOGGLE_DICE.map(
    (die) => die[Math.floor(Math.random() * die.length)] // Randomly pick a letter from each die
  );

  // Replace "Q" with "Qu"
  const processedLetters = selectedLetters.map((letter) =>
    letter === "Q" ? "Qu" : letter
  );

  const shuffledLetters = shuffleArray(processedLetters); // Shuffle the letters for a random layout

  const grid: string[][] = [];
  let index = 0;

  for (let i = 0; i < size; i++) {
    const row: string[] = [];
    for (let j = 0; j < size; j++) {
      row.push(shuffledLetters[index++]);
    }
    grid.push(row);
  }

  return grid;
};
