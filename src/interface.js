import { Keisan } from './keisan.js';

// Needed nodes
const card = document.querySelector('#card');
const cardContainer = document.querySelector('#card-container');
const cardFace = document.querySelector('#card-face');
const flip = document.querySelector('#flip');
const first = document.querySelector('#first');
const front = document.querySelector('#front');
const back = document.querySelector('#back');
const operations = document.querySelectorAll('.operation');
const counter = document.querySelector('#counter');

// Stores calculations to set to the DOM
const state = {
  keisan: {},
  flipped: false,
  finished: false,
  isAnimating: false,
}

// Setup a new session with the requested operation
function setupSession(operation) {
  // Get a new keisan object for the operation
  state.keisan = new Keisan(operation)
  state.flipped = false;
  state.finished = false;
  state.isAnimating = false;

  // Set all the starting DOM elements
  document.documentElement.className = state.keisan.operation;
  front.textContent = state.keisan.calculations[0].calculation;
  back.textContent = state.keisan.calculations[0].answer;
  counter.textContent = `${state.keisan.count}/${state.keisan.max}`
  flip.style.visibility = 'hidden';
  flip.classList.remove('flip');
  cardFace.style.visibility = 'visible';
  
  // Depending on the operation, set textcontent differently
  switch (state.keisan.operation) { 
    case 'tashi-lower': first.textContent = '+'; break;
    case 'tashi-upper': first.textContent = '+'; break;
    case 'hiki': first.textContent = '−'; break;
    case 'kake': first.textContent = '×'; break;
    case 'wari': first.textContent = '÷'; break;
  }
}

// Flip a card or put it away
function flipCard() {
  // If we are still animating or are finished, do nothing
  if (state.isAnimating || state.finished) return;
    state.isAnimating = true;
  // If the card is not already flipped
  if (!state.flipped) {
    // Set the current and next card value
    state.keisan.setCards();
    // Flip the card
    card.classList.add('flip');
    // After the transition, prepare next card
    card.addEventListener('transitionend', () => {
      flip.textContent = state.keisan.current.answer;
      flip.style.visibility = 'visible';
      cardFace.style.visibility = 'hidden';
      front.textContent = state.keisan.next.calculation;
      cardFace.style.transition = 'none';
      card.classList.remove('flip');
      void cardFace.offsetWidth;
      cardFace.style.transition = 'transform 0.5s';
      state.isAnimating = false;
    }, { once: true });
    state.flipped = true;
  } else {
    // If there are still cards left
    if (state.keisan.calculations.length > 0) {
      // Show the new card and update counters
      cardFace.style.visibility = 'visible';
      state.keisan.addCount();
      counter.textContent = `${state.keisan.count}/${state.keisan.max}`;
    } else {
      // Finish the session
      state.finished = true;
    }
    // Flip the card
    flip.classList.add('flip');
    flip.addEventListener('transitionend', () => {
      // Set first to show the answer and return the flip
      first.textContent = state.keisan.current.answer;
      flip.style.visibility = 'hidden';
      flip.classList.remove('flip');
      state.isAnimating = false;
    }, { once: true });
    // Set the back to the next answer
    back.textContent = state.keisan.next.answer;
    state.flipped = false;
  }
}

// Each operations button can start a new session
operations.forEach(button => {
  button.addEventListener('click', () => {
    setupSession(button.dataset.operation);
  });
});

// Any click or touch in the container will flip the card
cardContainer.addEventListener('pointerdown', flipCard);

// Set the initial session to addition below 10
function initialSession() {
  return setupSession('tashi-lower');
}

export { initialSession }