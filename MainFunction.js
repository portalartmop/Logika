let cells = [];
let buttons = [];
let row = 0;
let col = 0;
let gameOver = false;
let secretWord = "";
let words = [];
let keyStates = {};

document.getElementById('restart-btn').addEventListener('click', () => {
  location.reload(); // Найпростіший спосіб скинути гру — перезавантажити сторінку
});
// Load words from JSON and initialize game
fetch('./Words.json')
  .then(response => response.json())
  .then(data => {
    words = data;
    initGame();
  })
  .catch(error => {
    console.error('Error loading words:', error);
    // Fallback words if JSON fails to load
    words = ["весна","осінь","зірка","книга","стіна"];
    initGame();
  });

function initGame() {
  cells = document.querySelectorAll(".cell");
  buttons = document.querySelectorAll(".keyboard button");
  
  keyStates = {};
  buttons.forEach(btn => {
    btn.classList.remove('wrong', 'present', 'correct');
  });
  
  if (words.length === 0) {
    console.error("No words available!");
    return;
  }
  
  secretWord = words[Math.floor(Math.random() * words.length)].toUpperCase();
  console.log("Game initialized. Secret word:", secretWord);
  
  setupKeyboardListeners();
}

function setupKeyboardListeners() {
  // Physical keyboard input
  document.addEventListener("keydown", (e) => {
    if (gameOver) return;

    const key = e.key.toUpperCase();

    if (key === "ENTER") checkRow();
    else if (key === "BACKSPACE") deleteLetter();
    else if (key.length === 1 && key !== " ") {
      console.log("Key pressed:", key);
      addLetter(key);
    }
  });

  // Virtual keyboard buttons
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      if (gameOver) return;

      const key = btn.textContent;
      console.log("Button clicked:", key);

      if (key === "Enter") checkRow();
      else if (key === "←") deleteLetter();
      else addLetter(key.toUpperCase());
    });
  });
}

/* ===== FUNCTIONS ===== */dali maks

function addLetter(letter) {
  if (col >= 5) return;



  const index = row * 5 + col;
  cells[index].textContent = letter;
  col++;
}

function updateButtonClass(letter) {
  const btn = Array.from(buttons).find(b => b.textContent === letter);
  if (btn) {
    btn.classList.remove('wrong', 'present', 'correct');
    if (keyStates[letter]) {
      btn.classList.add(keyStates[letter]);
    }
  }
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

  guess = guess.toUpperCase();

  // Build counts for letters in secretWord that are not yet matched as correct
  const secretCounts = {};
  for (let i = 0; i < 5; i++) {
    if (guess[i] !== secretWord[i]) {
      secretCounts[secretWord[i]] = (secretCounts[secretWord[i]] || 0) + 1;
    }
  }

  // First pass: mark correct letters
  const result = new Array(5).fill("absent");
  for (let i = 0; i < 5; i++) {
    if (guess[i] === secretWord[i]) {
      result[i] = "correct";
    }
  }

  // Second pass: mark present letters using remaining counts
  for (let i = 0; i < 5; i++) {
    if (result[i] !== "correct") {
      const letter = guess[i];
      if (secretCounts[letter] > 0) {
        result[i] = "present";
        secretCounts[letter] -= 1;
      }
    }
  }

  // Update keyStates based on result
  for (let i = 0; i < 5; i++) {
    const letter = guess[i];
    if (result[i] === "correct") {
      keyStates[letter] = "correct";
    } else if (result[i] === "present") {
      keyStates[letter] = "present";
    } else {
      keyStates[letter] = "wrong";
    }
  }
  const uniqueLetters = new Set(guess);
  uniqueLetters.forEach(letter => updateButtonClass(letter));


  // Apply classes
  for (let i = 0; i < 5; i++) {
    const cell = cells[row * 5 + i];
    cell.classList.add(result[i]);
  }

  if (guess === secretWord) {
    gameOver = true;
    setTimeout(() => {
      alert("🎉 Перемога!");
    }, 1000);
    return;
  }

  row++;
  col = 0;

  if (row === 6) {
    gameOver = true;
    setTimeout(() => {
      alert("😢 Гру завершено! Слово було: " + secretWord);
    }, 1000);

  }
}
