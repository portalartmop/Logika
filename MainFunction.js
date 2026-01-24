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

async function loadWord() {
  const res = await fetch("./wordle.json");
  const data = await res.json();
  const words = data.words;
  secret = words[Math.floor(Math.random() * words.length)];
  console.log("SECRET:", secret);
}

/* ---------- RENDER GRID ---------- */
function renderGrid() {
  gridEl.innerHTML = "";

  grid.forEach(row => {
    const rowEl = document.createElement("div");
    rowEl.className = "row";

    row.forEach(cell => {
      const tile = document.createElement("div");
      tile.className = `tile ${cell.state}`;
      tile.textContent = cell.letter;
      rowEl.appendChild(tile);
    });

    gridEl.appendChild(rowEl);
  });
}

/* ---------- KEYBOARD INPUT ---------- */
window.addEventListener("keydown", (e) => {
  currentGuess = handleKeyInput(currentGuess, e.key);

  if (e.key === "Enter") {
    if (!isValidWord(currentGuess)) return;

    grid = placeGuessInGrid(grid, row, currentGuess, secret);
    row++;
    currentGuess = "";
    renderGrid();

    if (isWin(grid[row - 1].map(t => t.letter).join(""), secret)) {
      alert("🎉 YOU WIN!");
    }
  }
});

/* ---------- START ---------- */
await loadWord();
renderGrid();

