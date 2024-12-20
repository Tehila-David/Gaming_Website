// game2.js - משחק לוגי בסיסי
class LogicGame {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.sequence = [];
        this.playerSequence = [];
        this.score = 0;
        this.isPlaying = false;
    }

    init() {
        this.container.innerHTML = `
            <div class="grid grid-cols-2 gap-4 p-4">
                <div id="red" class="game-button bg-red-500"></div>
                <div id="green" class="game-button bg-green-500"></div>
                <div id="blue" class="game-button bg-blue-500"></div>
                <div id="yellow" class="game-button bg-yellow-500"></div>
            </div>
            <div id="score" class="mt-4">Score: 0</div>
            <button id="start-game" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded">התחל משחק</button>
        `;

        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('start-game').addEventListener('click', () => {
            this.startGame();
        });

        const buttons = document.querySelectorAll('.game-button');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                if (this.isPlaying) {
                    this.handlePlayerInput(button.id);
                }
            });
        });
    }

    startGame() {
        this.sequence = [];
        this.playerSequence = [];
        this.score = 0;
        this.addToSequence();
        this.playSequence();
    }

    addToSequence() {
        const colors = ['red', 'green', 'blue', 'yellow'];
        this.sequence.push(colors[Math.floor(Math.random() * colors.length)]);
    }

    playSequence() {
        // הצגת הרצף למשתמש
    }

    handlePlayerInput(color) {
        // בדיקת קלט המשתמש והתקדמות במשחק
    }
}
