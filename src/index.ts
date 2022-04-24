// TODO: FIX WORD LISTS, THEY DO NOT ALIGN

// Different file types & resources
import './styles.css';

// JS & Modules
import { WORD_LIST } from "./wordList";
import { VALID_GUESSES } from "./validGuesses";
import Typed from 'typed.js';
var alphabetArr = require('alphabet');

const alphabet: string = alphabetArr.join('');

interface WordleGame {
    row: number;
    col: number;
    secretWord: string;
    wordLength: number;
    maxTries: number;
    currentInput: string;
    win: boolean;
    end: boolean;
    stateHistory: string[];
    playHistory: number[];
}

var game: WordleGame = {
    row: 0,
    col: 0,
    secretWord: generateSecretWord(), //faffs (test word)
    wordLength: 5,
    maxTries: 6,
    currentInput: '',
    win: false,
    end: false,
    stateHistory: [],
    playHistory: getPlayHistory(),
};

document.addEventListener('keyup', (e) => {
    if (alphabet.search(e.key) !== -1) {
        input(e.key.toUpperCase());
    } else if (e.key === 'Enter' && game.col === 5) {
        submit();
    } else if (e.key === 'Backspace') {
        backspace();
    }
});

document.getElementById('resetButton').addEventListener('click', () => {
    if (game.end) {
        reset();
    }
});

document.getElementById('shareButton').addEventListener('click', () => {
    if (game.end) {
        share();
    }
})

function input(letter: string) {
    let board: HTMLElement = document.getElementById('board');
    if (game.col < game.wordLength) {
        board.childNodes.item(game.row).childNodes.item(game.col).firstChild.textContent = letter;

        game.col++;
        game.currentInput += letter.toLowerCase();
    } else {
        console.log('Max word length reached!');
    }
}

function backspace() {
    let board: HTMLElement = document.getElementById('board');
    if (game.col > 0) {
        board.childNodes.item(game.row).childNodes.item(game.col - 1).firstChild.textContent = '';

        game.col--;
        game.currentInput = game.currentInput.substring(0, game.currentInput.length - 1);
    }
}

function submit() {
    console.log('Submitting', game.currentInput);
    var valid: boolean = false;
    var state: string = ''; // 0: match full; 1: match partial; 2: match none

    if (VALID_GUESSES.includes(game.currentInput)) {
        valid = true;
        console.log('Valid input', game.currentInput);
        
        for (var i = 0; i < game.currentInput.length; i++) {
            if (game.currentInput[i] === game.secretWord[i]) {
                state += '0';
            } else if (game.secretWord.search(game.currentInput[i]) !== -1) {
                state += '1';
            } else {
                state += '2';
            }
        }

        game.stateHistory.push(state);

        if (state === '00000') {
            flip(state);
            game.win = true;
            end();
        } else {
            nextRow(state);
        }
    } else {
        showMessage('That is not an accepted word.');
    }

    console.log('State:', state);
}

function flip(state: string) {
    let board: HTMLElement = document.getElementById('board');
    console.log('State:', state);

    for (var i = 0; i < state.length; i++) {
        if (state[i] === '0') {
            // @ts-expect-error
            board.childNodes.item(game.row).childNodes.item(i).classList.add('state-0');
        } else if (state[i] === '1') {
            // @ts-expect-error
            board.childNodes.item(game.row).childNodes.item(i).classList.add('state-1');
        } else {
            // @ts-expect-error
            board.childNodes.item(game.row).childNodes.item(i).classList.add('state-2');
        }
    }
}

function nextRow(state: string) {
    flip(state);
    game.row++;
    game.col = 0;
    game.currentInput = '';
    if (game.row >= game.maxTries) {
        end();
    } else {
        console.log(game);
    }
}

function end() {
    game.end = true;
    console.log(game);
    showMessage(game.stateHistory.join('\n'));

    if (game.win) {
        game.playHistory.push(game.stateHistory.length);
    } else {
        game.playHistory.push(-1);
    }
}

function reset() {
    let board: HTMLElement = document.getElementById('board');
    console.log('Resetting...');

    var newSecretWord: string = generateSecretWord();
    checkNewSecretWord();
    game.secretWord = newSecretWord;

    game.row = 0;
    game.col = 0;
    game.currentInput = '';
    game.win = false;
    game.end = false;
    game.stateHistory = [];

    function checkNewSecretWord() {
        if (newSecretWord === game.secretWord) {
            newSecretWord = generateSecretWord();
            checkNewSecretWord();
        }
    }

    // x, y: indexes (as in "var i" for a loop that does not have another loop)
    for (var x = 0; x < board.childNodes.length; x++) {
        let row = board.childNodes.item(x);
        for (var y = 0; y < row.childNodes.length; y++) {
            var col = row.childNodes.item(y)
            col.firstChild.textContent = '';
            // @ts-expect-error
            col.className = 'input';
        }
    }
}

function share() {

}

function getPlayHistory(): number[] {
    return [];
}

function generateSecretWord(): string {
    var random: number = Math.floor(Math.random() * WORD_LIST.length);
    return WORD_LIST[random];
}

function showMessage(message: string) {
    var speed: number = 50;
    var typewriter: Typed = new Typed(document.getElementById('message'), {
        strings: [message],
        typeSpeed: speed,
    });
    typewriter.start();
}

console.log(game);