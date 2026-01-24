import {
  createEmptyGrid,
  placeGuessInGrid,
  isWin,
  handleKeyInput,
  isValidWord
} from "./wordle.js";

const ROWS = 6;
const COLS = 5;

let secret = "APPLE"; // можеш змінити або зробити рандом
let grid = createEmptyGrid(ROWS, COLS);
let row = 0;
let currentGuess = "";

const gridEl = document.getElementById("grid");
const cells = gridEl.querySelectorAll(".cell");

// 🔁 малюємо все поле + поточний ввід
function renderGrid() {
  // 1) підтверджені рядки (з grid)
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const idx = r * COLS + c;
      cells[idx].textContent = grid[r][c].letter;
      cells[idx].className = `cell ${grid[r][c].state || ""}`;
    }
  }

  // 2) показуємо те що зараз вводимо (currentGuess)
  const start = row * COLS;
  for (let i = 0; i < currentGuess.length; i++) {
    cells[start + i].textContent = currentGuess[i];
  }
}

// ⌨️ клавіатура
window.addEventListener("keydown", (e) => {
  if (row >= ROWS) return;

  // ввод букв / backspace
  currentGuess = handleKeyInput(currentGuess, e.key, COLS);

  // Enter — перевірка
  if (e.key === "Enter") {
    if (!isValidWord(currentGuess, COLS)) {
      alert("Введи слово з 5 букв!");
      return;
    }

    grid = placeGuessInGrid(grid, row, currentGuess, secret);
    renderGrid();

    if (isWin(currentGuess, secret)) {
      setTimeout(() => alert("🎉 YOU WIN!"), 100);
      row = ROWS;
      return;
    }

    row++;
    currentGuess = "";

    if (row >= ROWS) {
      setTimeout(() => alert("😢 YOU LOSE! Слово було: " + secret), 100);
      return;
    }
  }

  renderGrid();
});

// старт
renderGrid();
