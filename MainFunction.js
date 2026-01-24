import {
  createEmptyGrid,
  placeGuessInGrid,
  isWin,
  handleKeyInput,
  isValidWord
} from "./wordle.js";

let secret = "";
let grid = createEmptyGrid();
let row = 0;
let currentGuess = "";

const gridEl = document.getElementById("grid");
const cells = gridEl.querySelectorAll(".cell");

async function loadWord() {
  const res = await fetch("./wordle.json");
  const data = await res.json();
  const words = data.words.filter(w => w.length === 5);
  secret = words[Math.floor(Math.random() * words.length)];
  console.log("SECRET:", secret);
}

function renderGrid() {
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 5; c++) {
      const idx = r * 5 + c;
      const tile = cells[idx];
      tile.textContent = grid[r][c].letter;
      tile.className = `cell tile ${grid[r][c].state}`;
    }
  }
}

window.addEventListener("keydown", (e) => {
  if (row >= 6) return;

  currentGuess = handleKeyInput(currentGuess, e.key);

  if (e.key === "Enter") {
    if (!isValidWord(currentGuess)) return;

    grid = placeGuessInGrid(grid, row, currentGuess, secret);
    renderGrid();

    if (isWin(currentGuess, secret)) {
      setTimeout(() => alert("🎉 YOU WIN!"), 100);
      row = 6;
      return;
    }

    row++;
    currentGuess = "";
  }

  renderGrid();
});

// старт гри
await loadWord();
renderGrid();
