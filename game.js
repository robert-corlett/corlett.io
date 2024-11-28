import { words, nonwords } from './wordLists.js';

document.addEventListener('DOMContentLoaded', () => {

const tileDisplay = document.querySelector('.tile-container');
const keyBoard = document.querySelector('.key-container');
const messageDisplay = document.querySelector('.message-container');

let wordle;
let currentRow = 0;
let currentTile = 0;
let isGameOver = false;

const getWordle = () => {
    wordle = words[Math.floor(Math.random() * words.length)].toUpperCase();
};
getWordle();

const keys = [
    'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
    'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'ENTER',
    'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<<'
];

const guessRows = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', '']
];

guessRows.forEach((guessRow, guessRowIndex) => {
    const rowElem = document.createElement('div');
    rowElem.setAttribute('id', 'guessRow-' + guessRowIndex);
    guessRow.forEach((guess, guessIndex) => {
        const tileElem = document.createElement('div');
        tileElem.setAttribute('id', 'guessRow-' + guessRowIndex + '-tile-' + guessIndex);
        tileElem.classList.add('tile');
        rowElem.append(tileElem);
    });
    tileDisplay.append(rowElem);
});

keys.forEach(key => {
    const buttonElem = document.createElement('button');
    buttonElem.textContent = key;
    buttonElem.setAttribute('id', key);
    buttonElem.addEventListener('click', () => handleClick(key));
    keyBoard.append(buttonElem);
});

const handleClick = (key) => {
    if (!isGameOver) {
        if (key === '<<') {
            deleteLetter();
            return;
        }
        if (key === 'ENTER') {
            checkRow();
            return;
        }
        addLetter(key);
    }
};

const addLetter = (letter) => {
    if (currentTile < 5 && currentRow < 6) {
        const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile);
        tile.textContent = letter;
        guessRows[currentRow][currentTile] = letter;
        tile.setAttribute('data', letter);
        currentTile++;
    }
};

const deleteLetter = () => {
    if (currentTile > 0) {
        currentTile--;
        const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile);
        tile.textContent = '';
        guessRows[currentRow][currentTile] = '';
        tile.setAttribute('data', '');
    }
};

const checkRow = () => {
    const guess = guessRows[currentRow].join('');
    if (currentTile > 4) {
        if (!words.includes(guess.toLowerCase())) {
            showMessage("Word doesn't exist");
            return;
        }
        flipTile();
        if (guess === wordle) {
            showMessage('Magnificent!');
            isGameOver = true;
            return;
        }
        if (currentRow >= 5) {
            isGameOver = true;
            showMessage(`Game Over! The word is ${wordle}`);
            return;
        }
        currentRow++;
        currentTile = 0;
    }
};

const showMessage = (message) => {
    const messageElem = document.createElement('p');
    messageElem.textContent = message;
    messageDisplay.append(messageElem);
    setTimeout(() => messageDisplay.removeChild(messageElem), 2000);
};

const addColorToKey = (keyLetter, color) => {
    const key = document.getElementById(keyLetter);
    key.classList.add(color);
};

const flipTile = () => {
    const rowTiles = document.querySelector('#guessRow-' + currentRow).childNodes;
    let checkWordle = wordle;
    const guess = [];

    rowTiles.forEach(tile => {
        guess.push({ letter: tile.getAttribute('data'), color: 'grey' });
    });

    guess.forEach((guess, index) => {
        if (guess.letter === wordle[index]) {
            guess.color = 'green';
            checkWordle = checkWordle.replace(guess.letter, '');
        }
    });

    guess.forEach(guess => {
        if (checkWordle.includes(guess.letter)) {
            guess.color = 'yellow';
            checkWordle = checkWordle.replace(guess.letter, '');
        }
    });

    rowTiles.forEach((tile, index) => {
        setTimeout(() => {
            tile.classList.add('flip');
            tile.classList.add(guess[index].color);
            addColorToKey(guess[index].letter, guess[index].color);
        }, 500 * index);
    });
};
});
