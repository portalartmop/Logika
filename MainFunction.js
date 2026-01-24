Max
export const LetterState = {
  correct: "correct", 
  present: "present", 
  absent: "absent",   
};

export function isValidWord(word, length = 5) {
  if (!word) return false;
  if (word.length !== length) return false;
  return /^[a-zA-Z]+$/.test(word);
}

export function evaluateGuess(guess, secret) {
  guess = guess.toLowerCase();
  secret = secret.toLowerCase();

  const result = Array(guess.length).fill(LetterState.absent);

  const secretCount = {};

  for (let i = 0; i < secret.length; i++) {
    const s = secret[i];
    secretCount[s] = (secretCount[s] || 0) + 1;
  }

  
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === secret[i]) {
      result[i] = LetterState.correct;
      secretCount[guess[i]]--;
    }
  }

  for (let i = 0; i < guess.length; i++) {
    if (result[i] === LetterState.correct) continue;

    const ch = guess[i];
    if (secretCount[ch] > 0) {
      result[i] = LetterState.present;
      secretCount[ch]--;
    }
  }

  return result;
}


export function buildTiles(guess, secret) {
  const states = evaluateGuess(guess, secret);
  return guess.split("").map((letter, i) => ({
    letter: letter.toUpperCase(),
    state: states[i],
  }));
}

export function updateKeyboardState(keyboardState, guess, secret) {

  const tiles = buildTiles(guess, secret);

  const priority = {
    absent: 0,
    present: 1,
    correct: 2,
  };

  const newState = { ...keyboardState };

  for (const t of tiles) {
    const key = t.letter.toUpperCase();
    const current = newState[key];

    if (!current || priority[t.state] > priority[current]) {
      newState[key] = t.state;
    }
  }

  return newState;
}


export function isLetterKey(key) {
  return /^[a-zA-Z]$/.test(key);
}


export function handleKeyInput(currentGuess, key, wordLength = 5) {
  if (key === "Backspace") {
    return currentGuess.slice(0, -1);
  }

  if (key === "Enter") {
    return currentGuess; 
  }

  if (isLetterKey(key) && currentGuess.length < wordLength) {
    return currentGuess + key.toUpperCase();
  }

  return currentGuess;
}

export function isWin(guess, secret) {
  return guess.toLowerCase() === secret.toLowerCase();
}


export function createEmptyGrid(rows = 6, cols = 5) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ letter: "", state: "" }))
  );
}


export function placeGuessInGrid(grid, rowIndex, guess, secret) {
  const tiles = buildTiles(guess, secret);
  const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));

  for (let i = 0; i < tiles.length; i++) {
    newGrid[rowIndex][i] = tiles[i];
  }

  return newGrid;
}
import {
  createEmptyGrid,
  placeGuessInGrid,
  updateKeyboardState,
  isWin
} from "./wordle.js";

let secret = "apple";
let grid = createEmptyGrid();
let keyboard = {};
let row = 0;

let guess = "ALLEY";

grid = placeGuessInGrid(grid, row, guess, secret);
keyboard = updateKeyboardState(keyboard, guess, secret);

console.log(grid[row]);
console.log(keyboard);

if (isWin(guess, secret)) {
  console.log("YOU WIN!");
}
