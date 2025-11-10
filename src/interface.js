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
let keisan;

// Setup a new session with the requested operation
function setupSession(operation) {
  // Get a new keisan object for the operation
  keisan = new Keisan(operation)
  // Set all the starting DOM elements
  document.documentElement.className = keisan.operation;
  front.textContent = keisan.calculations[0].calculation;
  back.textContent = keisan.calculations[0].answer;
  counter.textContent = `${keisan.count}/${keisan.max}`
  flip.style.visibility = 'hidden';
  flip.classList.remove('flip');
  cardFace.style.visibility = 'visible';

  // Depending on the operation, set textcontent differently
  switch (keisan.operation) { 
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
  if (keisan.isAnimating || keisan.finished) return;
  keisan.startAnimating();
  // If the card is not already flipped
  if (!keisan.flipped) {
    // Set the current card value
    keisan.setCurrent();
    // If we still have cards left
    if (keisan.calculations.length > 0) {
      // Set the next card value
      keisan.setNext();
    }
    // Flip the card
    card.classList.add('flip');
    // After the transition, prepare next card
    card.addEventListener('transitionend', () => {
      flip.textContent = keisan.current.answer;
      flip.style.visibility = 'visible';
      cardFace.style.visibility = 'hidden';
      front.textContent = keisan.next.calculation;
      cardFace.style.transition = 'none';
      card.classList.remove('flip');
      void cardFace.offsetWidth;
      cardFace.style.transition = 'transform 0.5s';
      keisan.stopAnimating();
    }, { once: true });
    keisan.flip();
  } else {
    // If there are still cards left
    if (keisan.calculations.length > 0) {
      // Show the new card and update counters
      cardFace.style.visibility = 'visible';
      keisan.addCount();
      counter.textContent = `${keisan.count}/${keisan.max}`;
    } else {
      // Finish the session
      keisan.finish();
    }
    // Flip the card
    flip.classList.add('flip');
    flip.addEventListener('transitionend', () => {
      // Set first to show the answer and return the flip
      first.textContent = keisan.current.answer;
      flip.style.visibility = 'hidden';
      flip.classList.remove('flip');
      keisan.stopAnimating();
    }, { once: true });
    // Set the back to the next answer
    back.textContent = keisan.next.answer;
    keisan.unflip();
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