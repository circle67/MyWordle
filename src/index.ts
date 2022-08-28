import { WORD_LIST } from './wordList';
import { VALID_GUESSES } from './validGuesses';
import { check } from './wordle';
import alphabet from 'alphabet';

// Styles import
import './styles.css';

// The main state container for the game
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

interface Stats {
	played: number;
	winPercent: number;
	inThreePercent: number;
}

const game: WordleGame = {
	row: 0,
	col: 0,
	secretWord: generateSecretWord(),
	wordLength: 5,
	maxTries: 6,
	currentInput: '',
	win: false,
	end: false,
	stateHistory: [],
	playHistory: getPlayHistory(),
};

document.addEventListener('keyup', (e) => {
	if (alphabet.includes(e.key)) {
		input(e.key.toUpperCase());
	} else if (e.key === 'Enter' && game.col === 5) {
		submit();
	} else if (e.key === 'Backspace') {
		backspace();
	}
});

window.onbeforeunload = () => {
	syncPlayHistory();
};

document.getElementById('resetButton').addEventListener('click', () => {
	const board = document.getElementById('board');
	const keyboard = document.getElementById('keyboard');

	game.row = 0;
	game.col = 0;
	game.currentInput = '';
	game.secretWord = generateSecretWord();
	game.win = false;
	game.end = false;
	game.stateHistory = [];

	// x, y: indexes (as in "let i" for a loop that does not have another loop)
	for (let x = 0; x < board.childNodes.length; x++) {
		const row = board.childNodes.item(x);
		for (let y = 0; y < row.childNodes.length; y++) {
			const col = row.childNodes.item(y);
			col.firstChild.textContent = '';
			// @ts-expect-error className property does not exist according to typescript
			col.className = 'input';
		}
	}

	keyboard.querySelectorAll('.key').forEach((key) => {
		if (key.classList.contains('state-0') || key.classList.contains('state-1') || key.classList.contains('state-2')) {
			key.className = 'key';
		}
	});
});

document.getElementById('shareButton').addEventListener('click', () => {
	if (game.end && game.win) {
		let shareString = `MyWordle ${game.stateHistory.length}/${game.maxTries}\n`;
		// x, y: indexes (as in "let i" for a loop that does not have another loop)
		for (let x = 0; x < game.stateHistory.length; x++) {
			const state: string = game.stateHistory[x];
			for (let y = 0; y < game.stateHistory[x].length; y++) {
				const char: string = state[y];
				if (char === '0') {
					shareString += '🟩';
				} else if (char === '1') {
					shareString += '🟨';
				} else {
					shareString += '⬛';
				}
			}
			if (x < game.stateHistory.length - 1) {
				shareString += '\n';
			}
		}
		navigator.clipboard.writeText(shareString);
		showMessage('Record copied to clipboard!');
	} else {
		showMessage('You must win before you can share your results.');
	}
});

document.getElementById('statsButton').addEventListener('click', () => {
	const played: number = game.playHistory.length;
	let winNumber = 0;
	let inThreeNumber = 0;
	game.playHistory.forEach((play) => {
		if (play !== -1) {
			winNumber++;
		}
		if (play <= 3 && play !== -1) {
			inThreeNumber++;
		}
	});
	const stats: Stats = {
		played: played,
		winPercent: played === 0 ? 0 : Math.round((winNumber / played) * 100),
		inThreePercent: played === 0 ? 0 : Math.round((inThreeNumber / played) * 100),
	};

	showMessage(`${stats.played} played\t${stats.winPercent}% won\t${stats.inThreePercent}% in three`);
	document.body.focus();
});

document.getElementById('keyboard').childNodes.forEach((row) => {
	row.childNodes.forEach((key) => {
		key.addEventListener('click', (e) => {
			// @ts-expect-error .getAttribute will not work with typescript checking
			const virtKey: string = e.target.getAttribute('key');
			if (virtKey !== 'Enter' && virtKey !== 'Backspace') {
				input(virtKey);
			} else if (virtKey === 'Enter' && game.col === 5) {
				submit();
			} else if (virtKey === 'Backspace') {
				backspace();
			}
		});
	});
});

function input(letter: string) {
	const board = document.getElementById('board');
	if (game.col < game.wordLength) {
		board.childNodes.item(game.row).childNodes.item(game.col).firstChild.textContent = letter;

		game.col++;
		game.currentInput += letter.toLowerCase();
	}
}

function backspace() {
	const board = document.getElementById('board');
	if (game.col > 0) {
		board.childNodes.item(game.row).childNodes.item(game.col - 1).firstChild.textContent = '';

		game.col--;
		game.currentInput = game.currentInput.substring(0, game.currentInput.length - 1);
	}
}

function submit() {
	let state = ''; // 0: match full; 1: match partial; 2: match none

	if (VALID_GUESSES.includes(game.currentInput)) {
		state = check(game.currentInput, game.secretWord).join('');

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
}

function flip(state: string) {
	const board = document.getElementById('board');
	const keyboard = document.getElementById('keyboard');

	for (let i = 0; i < state.length; i++) {
		if (state[i] === '0') {
			// @ts-expect-error classList property does not exist according to typescript
			board.childNodes.item(game.row).childNodes.item(i).classList.add('state-0');
			keyboard.querySelector(`[key="${game.currentInput[i].toUpperCase()}"]`).className = 'key state-0';
		} else if (state[i] === '1') {
			// @ts-expect-error classList property does not exist according to typescript
			board.childNodes.item(game.row).childNodes.item(i).classList.add('state-1');
			keyboard.querySelector(`[key="${game.currentInput[i].toUpperCase()}"]`).className = 'key state-1';
		} else {
			// @ts-expect-error classList property does not exist according to typescript
			board.childNodes.item(game.row).childNodes.item(i).classList.add('state-2');
			keyboard.querySelector(`[key="${game.currentInput[i].toUpperCase()}"]`).className = 'key state-2';
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
	}
}

function end() {
	game.end = true;
	if (game.win) {
		game.playHistory.push(game.stateHistory.length);
		showMessage(`Good job, you got it in ${game.stateHistory.length}!`);
	} else {
		game.playHistory.push(-1);
		showMessage(`The word was ${game.secretWord}`);
	}
	syncPlayHistory();
}

function getPlayHistory(): number[] {
	return JSON.parse(window.localStorage.getItem('playHistory')) || [];
}

function syncPlayHistory() {
	window.localStorage.setItem('playHistory', JSON.stringify(game.playHistory));
}

function generateSecretWord(): string {
	const random: number = Math.floor(Math.random() * WORD_LIST.length);
	return WORD_LIST[random];
}

function showMessage(message: string) {
	document.getElementById('message').firstChild.textContent = message;
	// @ts-expect-error className property does not exist according to typescript
	document.getElementById('message').firstChild.className = 'showing';
	document.getElementById('message').classList.remove('hidden');
	document.getElementById('message').classList.add('showing');
	setTimeout(() => {
		// @ts-expect-error className property does not exist according to typescript
		document.getElementById('message').firstChild.className = 'hidden';
		document.getElementById('message').classList.remove('showing');
		document.getElementById('message').classList.add('hidden');
	}, message.length * 150);
}
