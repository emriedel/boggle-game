export const loadWords = async (): Promise<Set<string>> => {
    const response = await fetch("../../public/data/words.txt");
    const text = await response.text();

    console.log("Parsed word list:", text);

    const words = text
      .split("\n") // Split by new lines
      .map((word) => word.trim().toUpperCase()) // Trim and convert to uppercase
      .filter((word) => word.length > 0); // Remove empty lines

    return new Set(words); // Convert to a Set for fast lookups
  };