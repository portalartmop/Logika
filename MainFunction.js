import {
  createEmptyGrid,
  placeGuessInGrid,
  isWin
} from "./wordle.js";

const ROWS = 6;
const COLS = 5;

let secret = "";
let grid = createEmptyGrid();
let row = 0;

const gridEl = document.getElementById("grid");
const cells = [...gridEl.querySelectorAll(".cell")];

// завантаження слова
async function loadWord() {
  const res = await fetch("./wordle.json");
  const data = await res.json();
  const words = data.words.filter(w => w.length === 5);

  secret = words[Math.floor(Math.random() * words.length)];
  console.log("SECRET:", secret);
}

// отримати клітинку по row/col
function getCell(r, c) {
  return cells[r * COLS + c];
}

// перейти фокусом на клітинку
function focusCell(r, c) {
  const cell = getCell(r, c);
  cell.focus();
}

// заблокувати всі клітинки крім поточного рядка
function lockRows() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = getCell(r, c);
      cell.contentEditable = (r === row) ? "true" : "false";
    }
  }
}

// взяти слово з поточного рядка
function getRowWord(r) {
  let word = "";
  for (let c = 0; c < COLS; c++) {
    word += getCell(r, c).textContent.trim().toUpperCase();
  }
  return word;
}

// очистити зайве (щоб в клітинці була тільки 1 буква)
function normalizeCell(cell) {
  let text = cell.textContent.toUpperCase().replace(/[^A-Z]/g, "");
  cell.textContent = text.slice(0, 1);
}

// перевірка рядка по Enter
function submitRow() {
  const guess = getRowWord(row);

  if (guess.length !== 5) {
    alert("Введи 5 букв!");
    return;
  }

  grid = placeGuessInGrid(grid, row, guess, secret);

  // малюємо результат в клітинках
  for (let c = 0; c < COLS; c++) {
    const tile = grid[row][c];
    const cell = getCell(row, c);
    cell.textContent = tile.letter;
    cell.className = `cell ${tile.state}`;
  }

  if (isWin(guess, secret)) {
    setTimeout(() => alert("🎉 YOU WIN!"), 100);
    row = ROWS;
    lockRows();
    return;
  }

  row++;

  if (row >= ROWS) {
    setTimeout(() => alert("😢 YOU LOSE! Слово було: " + secret.toUpperCase()), 100);
    lockRows();
    return;
  }

  lockRows();
  focusCell(row, 0);
}

// події на клітинки
cells.forEach((cell, index) => {
  cell.addEventListener("input", () => {
    normalizeCell(cell);

    // автоперехід вправо
    const r = Math.floor(index / COLS);
    const c = index % COLS;

    if (r !== row) return;

    if (cell.textContent.length === 1 && c < COLS - 1) {
      focusCell(row, c + 1);
    }
  });

  cell.addEventListener("keydown", (e) => {
    const r = Math.floor(index / COLS);
    const c = index % COLS;

    if (r !== row) {
      e.preventDefault();
      return;
    }

    // Enter = перевірка
    if (e.key === "Enter") {
      e.preventDefault();
      submitRow();
      return;
    }

    // Backspace = повернутись назад якщо порожньо
    if (e.key === "Backspace") {
      if (cell.textContent.trim() === "" && c > 0) {
        e.preventDefault();
        focusCell(row, c - 1);
        getCell(row, c - 1).textContent = "";
      }
    }
  });
});

// старт гри
await loadWord();
lockRows();
focusCell(0, 0);
