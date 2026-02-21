import anime from 'animejs';
import words from 'Words.json'
import random
const secretWord = Math.random(words);
const cells = document.querySelectorAll(".cell");
const buttons = document.querySelectorAll(".keyboard button");

let row = 0;
let col = 0;
let gameOver = false;

/* ===== INPUT FROM KEYBOARD ===== */
document.addEventListener("keydown", (e) => {
  if (gameOver) return;

  const key = e.key.toUpperCase();

  if (key === "ENTER") checkRow();
  else if (key === "BACKSPACE") deleteLetter();
  else if (/^[A-Z]$/.test(key)) addLetter(key);
});

/* ===== INPUT FROM VIRTUAL KEYBOARD ===== */
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    if (gameOver) return;

    const key = btn.textContent;

    if (key === "Enter") checkRow();
    else if (key === "←") deleteLetter();
    else addLetter(key);
  });
});

/* ===== FUNCTIONS ===== */
function addLetter(letter) {
  if (col >= 5) return;

  const index = row * 5 + col;
  cells[index].textContent = letter;
  col++;
}

function deleteLetter() {
  if (col === 0) return;

  col--;
  cells[row * 5 + col].textContent = "";
}

function checkRow() {
  if (col < 5) return;

  let guess = "";
  for (let i = 0; i < 5; i++) {
    guess += cells[row * 5 + i].textContent;
  }

  for (let i = 0; i < 5; i++) {
    const cell = cells[row * 5 + i];
    const letter = guess[i];

    if (letter === secretWord[i]) cell.classList.add("correct");
    else if (secretWord.includes(letter)) cell.classList.add("present");
    else cell.classList.add("absent");
  }

  if (guess === secretWord) {
    alert("🎉 Перемога!");
    gameOver = true;
    return;
  }

  row++;
  col = 0;

  if (row === 6) {
    alert("😢 Гру завершено! Слово було: " + secretWord);
    gameOver = true;
  }
}
