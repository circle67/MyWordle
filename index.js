var wordLists = generateWordLists();
var game = {
    row: 0,
    col: 0,
    secretWord: '',
    wordLength: 5,
    maxTries: 6,
    currentInput: '',
    win: false
};
var alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

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

function input(letter) {
    let board = document.getElementById('board');
    if (game.col < game.wordLength) {
        board.childNodes.item(game.row).childNodes.item(game.col).firstChild.textContent = letter;

        game.col++;
        game.currentInput += letter.toLowerCase();
    }
}

function backspace() {
    let board = document.getElementById('board');
    if (game.col > 0) {
        board.childNodes.item(game.row).childNodes.item(game.col - 1).firstChild.textContent = '';

        game.col--;
        game.currentInput = game.currentInput.substring(0, game.currentInput.length - 1);
    }
}

function submit() {
    console.log('Submitting.');
    let board = document.getElementById('board');
    var valid = false;
    var state = ''; // 0: match full; 1: match partial; 2: match none

    if (wordLists.valid.includes(game.currentInput)) {
        valid = true;
        
        for (var i = 0; i < input.length; i++) {
            if (input[i] === secretWord[i]) {
                state += '0';
            } else if (secretWord.search(input[i] !== -1)) {
                state += '1';
            } else {
                state += '2';
            }
        }
    }

    if (state === '00000') {
        game.win = true;
        win();
    }

    console.log(state);
}

function win() {

}

function generateSecretWord() {
    var random = Math.floor(Math.random() * wordLists.bank.length)
    return wordLists.bank[random];
}

function showMessage(message, priority) {
    var i = 0;
    var speed = 80;
    
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

function generateWordLists() {
    var WordLists = {};

    fetch('https://raw.githubusercontent.com/circle67/wordle-words/main/valid-words.csv')
        .then(response => response.text())
        .then(data => data.split(','))
        .then(data => WordLists.valid = data);
    fetch('https://raw.githubusercontent.com/circle67/wordle-words/main/word-bank.csv')
        .then(response => response.text())
        .then(data => data.split(','))
        .then(data => WordLists.bank = data);
    
    return WordLists;
}