import "./styles.css";

const card = document.querySelector('#card');
const cardContainer = document.querySelector('#card-container');
const cardFace = document.querySelector('#card-face');
const flip = document.querySelector('#flip');
const first = document.querySelector('#first');
const front = document.querySelector('#front');
const back = document.querySelector('#back');
const operations = document.querySelectorAll('.operation');
const counter = document.querySelector('#counter');

let flipped = false;
let isAnimating = false;
let finished = false;
let calculations = new Array();
let current;
let next;
let max;
let count;

function calculate(operation, a, b) {
  let result = {};
  switch (operation) { 
    case 'tashi-lower': result = {calculation: `${a} + ${b}`, answer: a + b}; break;
    case 'tashi-upper': {
      const calculation = (a === 10 && b === 10) ? `${a}+${b}` : `${a} + ${b}`;
      result = {calculation: calculation, answer: a + b}; 
      break;
    }
    case 'hiki': result = {calculation: `${a} − ${b}`, answer: a - b}; break;
    case 'kake': result = {calculation: `${a} × ${b}`, answer: a * b}; break;
    case 'wari': {
      const answer = a * b; 
      result = {calculation: `${answer} ÷ ${b}`, answer: a}
      break;
    }
  }
  return result;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
    [array[i], array[j]] = [array[j], array[i]];   // swap elements
  }
  return array;
}

function startSession(operation) {
  document.documentElement.className = operation;

  calculations = new Array();
  let starti = 9;
  let startj = 9;
  let min = 0;
  const invalid = {
    'tashi-lower': 10,
    'tashi-upper': 20,
    'hiki': 10,
    'kake': 81,
    'wari': 9,
  }
  // Tashi Lower = 1-9 = <= 10 
  // Tashi Upper = 1-10 = <= 20
  // Hiki = 1-10
  // Kake = 1-9 
  // Wari = 1-9 results of multiplication -> result / second = first 
  if (operation === 'hiki' || operation === 'tashi-upper') {
    starti++;
    startj++;
  }
  if (operation === 'tashi-upper') {
    min = 11;
  }
  for (let i = starti; i > 0; i--) {
    for (let j = startj; j > 0; j--) {
      const result = calculate(operation, i, j);
      if (result.answer <= invalid[operation] && result.answer >= min) {
        calculations.push(result);
      }
    }
  }
  count = 1;
  max = calculations.length;
  counter.textContent = `${count}/${max}`
  shuffle(calculations);
  front.textContent = calculations[0].calculation;
  back.textContent = calculations[0].answer;
  flip.style.visibility = 'hidden';
  flip.classList.remove('flip');
  cardFace.style.visibility = 'visible';
  flipped = false;
  switch (operation) { 
    case 'tashi-lower': first.textContent = '+'; break;
    case 'tashi-upper': first.textContent = '+'; break;
    case 'hiki': first.textContent = '−'; break;
    case 'kake': first.textContent = '×'; break;
    case 'wari': first.textContent = '÷'; break;
  }
  finished = false;
}


operations.forEach(button => {
  button.addEventListener('click', () => {
    startSession(button.dataset.operation);
  });
});

function flipCard() {
  if (isAnimating || finished) return;
  isAnimating = true;
  if (!flipped) {
    current = calculations.shift();
    if (calculations.length > 0) {
      next = calculations[0];
    }
    card.classList.add('flip');
    card.addEventListener('transitionend', () => {
      flip.textContent = current.answer;
      flip.style.visibility = 'visible';
      cardFace.style.visibility = 'hidden';
      front.textContent = next.calculation;
      cardFace.style.transition = 'none';
      card.classList.remove('flip');
      void cardFace.offsetWidth;
      cardFace.style.transition = 'transform 0.5s';
      isAnimating = false;
    }, { once: true });
    flipped = true;
  } else {
    if (calculations.length > 0) {
      cardFace.style.visibility = 'visible';
      count++;
      counter.textContent = `${count}/${max}`;
    } else {
      finished = true;
    }
    flip.classList.add('flip');
    flip.addEventListener('transitionend', () => {
      first.textContent = current.answer;
      flip.style.visibility = 'hidden';
      flip.classList.remove('flip');
      isAnimating = false;
    }, { once: true });
    back.textContent = next.answer;
    flipped = false;
  }
}

window.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    flipCard();
  }
});

cardContainer.addEventListener('pointerdown', () => {
  flipCard();
});

startSession('tashi-lower');

