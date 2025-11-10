# keisan-card
Practice for CSS Animations

## Overview

This is a calculation card application made to practice the basics of CSS animation. In Japan, elementary school children use the cards to practice and memorize calculations. They start with the lower addition (up to 10), then subtraction and higher addition (up to 20). Later they do multiplication tables and cards, as well as division. 

I have a daughter who is currently in a Japanese elementary school, so I made this mostly for her but also so anyone can use it. It's in Japanese for that reason. The buttons are: Addition to 10, Addition to 20, subtraction, multiplication and division. 

Each button press starts a new session with randomized calculation and answer pairs. You can see the progress on to top right. Clicking anywhere on or near the cards will show the answer, and then flip to the next card. 

The design is purposefully made to resemble the actual cards kids would use in school. They have holes and
are on a ring. For simplicity I chose to flip the card over instead of relying on the ring to flip to the answer. This way, it still works nicely when using portrait mode on mobile, though you can't see the flipped old card anymore. Since that is just a visual bonus for landscape mode, it does not matter though.

## Modules 

### index.js

A simple index module that imports the CSS and initialSession function from interface.js, then calls it immediately to get the initial session set up.

### interface.js

This module handles the DOM interactions and updates, and also gets the Keisan object and tells it what to do after the user has taken an action. 

**Key Functions:**

- `setupSession(operation)`: Takes an operation and starts a new session based on the operation. It creates a new Keisan object and saves it to the keisan variable, to be used during the session. It also initializes all the needed DOM objects for the new session. 

- `flipCard()`: Either flips the current card around or removes the current answer to show the next card.
Sets the values for the new card and asks Keisan to handle the data changes required. Once an animation starts or the session is finished, the function returns nothing, until the animation is finished or the user starts a new session.

- `initialSession()`: calls setupSession with lower addition as the operation to set up an initial state on page load.

### keisan.js

This module handles the Keisan object, which in turn handles the calculations and card order.

#### Classes

##### Keisan

This class contains the calculations and keeps track of the session state and other variables such as count and card amounts.

**Constructor:**

```js
constructor(operation) {
  this.calculations = this.#getCalculations(operation);
  this.operation = operation;
  this.current;
  this.next;
  this.max = this.calculations.length;
  this.count = 1;
}
```
 
**Properties:**

  - `calculations`: Use a class method to store an array of all calculations in the session.
  - `operation`:  The operation with which the object was set up.
  - `current`: The current card.
  - `next`: The next card.
  - `max`: The maximum number of calculations in the deck.
  - `count`: A running counter of calculations finished.

**Key Methods:**

- `addCount()`: Adds 1 to the counter of finished calculations.
- `setCards()`: Shifts the first card off the array and sets it as the current card. If there are still cards after this, set the next card to the new array start.
- `#getCalculations(operation)`: Calculates and creates an array of objects of all calculations for the requested operation. Then shuffles and returns the array. 

## Notes

This was a fun little exercise to make something useful that I have already and will probably use in the future with my children. Animations are rudementary but were fun to implement. This started out as practice, so I did not use the best practices while coding it. I think I have mostly cleaned it up but maybe this will still serve as a lesson to keep using the practices even when doing something minor, to avoid work in the future. 