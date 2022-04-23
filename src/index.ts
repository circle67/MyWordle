// Different file types & resources
import './styles.css';

// JS & Modules
import { WORD_LIST } from "./wordList";
import { VALID_GUESSES } from "./validGuesses";
var alphabetArr = require('alphabet');

interface WordleGame {
    row: number;
    col: number;
    secretWord: string;
    wordLength: number;
    maxTries: number;
    currentInput: string;
    win: boolean;
    stateHistory: string[];
}

enum MessagePriority {
    Normal,
    Warning,
    Danger,
    Success,
}

var game: WordleGame = {
    row: 0,
    col: 0,
    secretWord: generateSecretWord(), //faffs (test word)
    wordLength: 5,
    maxTries: 6,
    currentInput: '',
    win: false,
    stateHistory: []
};
var alphabet: string = alphabetArr.join('');

document.addEventListener('keyup', (e) => {
    console.log(e.key);
    if (alphabet.search(e.key) !== -1) {
        input(e.key.toUpperCase());
    } else if (e.key === 'Enter' && game.col === 5) {
        submit();
    } else if (e.key === 'Backspace') {
        backspace();
    }
});

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
            win();
        } else {
            nextRow(state);
        }
    } else {
        showMessage('Invalid input!', MessagePriority.Danger);
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

function win() {
    console.log('You have won.');
    game.win = true;
    console.log(game);
    end();
}

function end() {
    console.log('Ending...');
    reset();
    showMessage(game.stateHistory.join('\n'), MessagePriority.Normal);
}

function reset() {
    console.log('Resetting...');
}

function generateSecretWord(): string {
    var random: number = Math.floor(Math.random() * WORD_LIST.length);
    return WORD_LIST[random];
}

function showMessage(message: string, priority: MessagePriority) {
    var i: number = 0;
    var speed: number = 50; // Higher is slower
    
    document.getElementById('message').textContent = '';
    typeWriter();

    // https://www.w3schools.com/howto/howto_js_typewriter.asp
    function typeWriter() {
        if (i < message.length) {
            document.getElementById('message').textContent += message.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
        }
    }
}

console.log(game);