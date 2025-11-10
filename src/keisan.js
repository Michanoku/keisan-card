class Keisan {
  constructor(operation) {
    this.calculations = this.#getCalculations(operation);
    this.operation = operation;
    this.flipped = false;
    this.isAnimating = false;
    this.finished = false;
    this.current;
    this.next;
    this.max = this.calculations.length;
    this.count = 1;
  }

  // Begin animation
  startAnimating() {
    this.isAnimating = true;
  }

  // Stop animation
  stopAnimating() {
    this.isAnimating = false;
  }

  // Flip the card
  flip() {
    this.flipped = true;
  }

  // Unflip the card
  unflip() {
    this.flipped = false;
  }

  // Add one to the counter
  addCount() {
    this.count++;
  }

  // Finish this session
  finish() {
    this.finished = true;
  }

  // Set the current card
  setCurrent() {
    this.current = this.calculations.shift();
  }

  // Set the next card
  setNext() {
    this.next = this.calculations[0];
  }

  // Get all calculations for the operation
  #getCalculations(operation) {
    // Get a new array and set start values and min value
    const calculations = new Array();
    let starti = 9;
    let startj = 9;
    let min = 0;
    // The valid upper range for all answers
    const invalid = {
      'tashi-lower': 10,
      'tashi-upper': 20,
      'hiki': 10,
      'kake': 81,
      'wari': 9,
    }
    // If we do hiki or tashizan, we need different values
    if (operation === 'hiki' || operation === 'tashi-upper') {
      starti++;
      startj++;
    }
    if (operation === 'tashi-upper') {
      min = 11;
    }
    // Do all calculations and add them if they check out
    for (let i = starti; i > 0; i--) {
      for (let j = startj; j > 0; j--) {
        const result = this.#calculate(operation, i, j);
        if (result.answer <= invalid[operation] && result.answer >= min) {
          calculations.push(result);
        }
      }
    }
    // Shuffle the array
    this.#shuffle(calculations);
    return calculations;
  }

  // Calculate one result and arrange the answers
  #calculate(operation, a, b) {
    let result = {};
    // Depending on the operation we need different ways to get the results
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

  // Shuffle the array
  #shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}

export { Keisan }