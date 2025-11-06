import "./styles.css";

const card = document.querySelector('#card');
const flip = document.querySelector('#flip');
let flipped = false;


card.addEventListener('pointerdown', () => {
  if (!flipped) {
    card.classList.add('flip');
    flipped = true;
  } else {
    flip.style.display = 'flex';
  }

});

document.addEventListener('pointerdown', () => {
  console.log('User tapped or clicked anywhere!');
});