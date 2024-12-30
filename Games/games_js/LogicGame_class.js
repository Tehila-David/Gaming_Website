// // game2.js - משחק לוגי בסיסי
// class LogicGame {
//     constructor(containerId) {
//         this.container = document.getElementById(containerId);
//         this.sequence = [];
//         this.playerSequence = [];
//         this.score = 0;
//         this.isPlaying = false;
//     }

//     init() {
//         this.container.innerHTML = `
//             <div class="grid grid-cols-2 gap-4 p-4">
//                 <div id="red" class="game-button bg-red-500"></div>
//                 <div id="green" class="game-button bg-green-500"></div>
//                 <div id="blue" class="game-button bg-blue-500"></div>
//                 <div id="yellow" class="game-button bg-yellow-500"></div>
//             </div>
//             <div id="score" class="mt-4">Score: 0</div>
//             <button id="start-game" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded">התחל משחק</button>
//         `;

//         this.setupEventListeners();
//     }

//     setupEventListeners() {
//         document.getElementById('start-game').addEventListener('click', () => {
//             this.startGame();
//         });

//         const buttons = document.querySelectorAll('.game-button');
//         buttons.forEach(button => {
//             button.addEventListener('click', () => {
//                 if (this.isPlaying) {
//                     this.handlePlayerInput(button.id);
//                 }
//             });
//         });
//     }

//     startGame() {
//         this.sequence = [];
//         this.playerSequence = [];
//         this.score = 0;
//         this.addToSequence();
//         this.playSequence();
//     }

//     addToSequence() {
//         const colors = ['red', 'green', 'blue', 'yellow'];
//         this.sequence.push(colors[Math.floor(Math.random() * colors.length)]);
//     }

//     playSequence() {
//         // הצגת הרצף למשתמש
//     }

//     handlePlayerInput(color) {
//         // בדיקת קלט המשתמש והתקדמות במשחק
//     }
// }

//game2.js - משחק לוגי מודרני
// class LogicGame {
//     constructor(containerId) {
//         this.container = document.getElementById(containerId);
//         this.sequence = [];
//         this.playerSequence = [];
//         this.score = 0;
//         this.bestScore = 0;
//         this.isPlaying = false;
//         this.level = 1;
//         this.sounds = {};
//         this.initSounds();
//     }

//     initSounds() {
//         const notes = ['do', 're', 'mi', 'fa'];
//         const colors = ['red', 'green', 'blue', 'yellow'];
        
//         colors.forEach((color, index) => {
//             const audio = new Audio();
//             audio.src = `sounds/note-${notes[index]}.mp3`;
//             this.sounds[color] = audio;
//         });
//     }

//     init() {
//         this.loadBestScore();
//         this.updateScore();
//         this.updateLevel();
//         this.setupEventListeners();
//     }

//     loadBestScore() {
//         const saved = localStorage.getItem('logicGameBestScore');
//         this.bestScore = saved ? parseInt(saved) : 0;
//         document.getElementById('best-score').textContent = this.bestScore;
//     }

//     saveBestScore() {
//         if (this.score > this.bestScore) {
//             this.bestScore = this.score;
//             localStorage.setItem('logicGameBestScore', this.score);
//             document.getElementById('best-score').textContent = this.bestScore;
//         }
//     }

//     setupEventListeners() {
//         document.getElementById('start-game').addEventListener('click', () => {
//             this.startGame();
//         });

//         const buttons = document.querySelectorAll('.game-button');
//         buttons.forEach(button => {
//             button.addEventListener('click', () => {
//                 if (this.isPlaying) {
//                     this.handlePlayerInput(button.id);
//                 }
//             });
//         });
//     }

//     startGame() {
//         this.sequence = [];
//         this.playerSequence = [];
//         this.score = 0;
//         this.level = 1;
//         this.isPlaying = true;
//         this.updateStatus('המשחק מתחיל...');
//         this.updateScore();
//         this.updateLevel();
//         this.addToSequence();
//         setTimeout(() => this.playSequence(), 1000);
//     }

//     addToSequence() {
//         const colors = ['red', 'green', 'blue', 'yellow'];
//         this.sequence.push(colors[Math.floor(Math.random() * colors.length)]);
//     }

//     async playSequence() {
//         this.isPlaying = false;
//         this.updateStatus('שים לב לרצף...');
        
//         for (let i = 0; i < this.sequence.length; i++) {
//             await this.highlightButton(this.sequence[i]);
//             await this.wait(300);
//         }
        
//         this.isPlaying = true;
//         this.updateStatus('תורך! חזור על הרצף');
//         this.playerSequence = [];
//     }

//     async highlightButton(color) {
//         const button = document.getElementById(color);
//         button.classList.add('active');
//         this.playSound(color);
//         await this.wait(500);
//         button.classList.remove('active');
//     }

//     playSound(color) {
//         if (this.sounds[color]) {
//             this.sounds[color].currentTime = 0;
//             this.sounds[color].play();
//         }
//     }

//     handlePlayerInput(color) {
//         this.playerSequence.push(color);
//         this.highlightButton(color);

//         const currentIndex = this.playerSequence.length - 1;
        
//         if (this.playerSequence[currentIndex] !== this.sequence[currentIndex]) {
//             this.gameOver();
//             return;
//         }

//         if (this.playerSequence.length === this.sequence.length) {
//             this.score += 10 * this.level;
//             this.updateScore();
//             this.saveBestScore();
            
//             if (this.playerSequence.length % 4 === 0) {
//                 this.level++;
//                 this.updateLevel();
//             }
            
//             this.playerSequence = [];
//             this.addToSequence();
//             setTimeout(() => this.playSequence(), 1000);
//         }
//     }

//     gameOver() {
//         this.isPlaying = false;
//         this.updateStatus('המשחק נגמר! לחץ על התחל כדי לשחק שוב');
//         this.saveBestScore();
//     }

//     updateScore() {
//         document.getElementById('score').textContent = this.score;
//     }

//     updateLevel() {
//         document.getElementById('level').textContent = this.level;
//     }

//     updateStatus(message) {
//         document.getElementById('status-message').textContent = message;
//     }

//     wait(ms) {
//         return new Promise(resolve => setTimeout(resolve, ms));
//     }
// }


// class LogicGame {
//     constructor(containerId) {
//         this.container = document.getElementById(containerId);
//         this.pattern = [];
//         this.userInput = [];
//         this.level = 1;
//         this.patternLength = 3; // Number of shapes in the pattern
//         this.shapes = ["circle", "square", "triangle", "star"]; // Possible shapes
//         this.isPlaying = false;
//     }

//     init() {
//         this.container.innerHTML = `
          
//             <div class="grid grid-cols-2 gap-4 p-4">
//                 <div id="circle" class="game-button">⭕</div>
//                 <div id="square" class="game-button">⬛</div>
//                 <div id="triangle" class="game-button">🔺</div>
//                 <div id="star" class="game-button">⭐</div>
//             </div>
           
//         `;

//         this.setupEventListeners();
//     }

//     setupEventListeners() {
//         document.getElementById('start-game').addEventListener('click', () => {
//             this.startGame();
//         });

//         const buttons = document.querySelectorAll('.game-button');
//         buttons.forEach(button => {
//             button.addEventListener('click', () => {
//                 if (this.isPlaying) {
//                     this.handleUserInput(button.id);
//                 }
//             });
//         });
//     }

//     startGame() {
//         this.level = 1;
//         this.patternLength = 3;
//         this.pattern = [];
//         this.userInput = [];
//         this.updateStatus("המשחק מתחיל...");
//         this.generatePattern();
//         this.isPlaying = true;
//         this.updateScore();
//         this.updateLevel();
//     }

//     generatePattern() {
//         this.pattern = Array.from({ length: this.patternLength }, () =>
//             this.shapes[Math.floor(Math.random() * this.shapes.length)]
//         );
//         console.log("Pattern:", this.pattern.join(" - "));
//         this.displayPattern();
//     }

//     displayPattern() {
//         this.updateStatus("שים לב לרצף...");
//         let index = 0;
//         const interval = setInterval(() => {
//             const shape = this.pattern[index];
//             this.highlightButton(shape);
//             index++;
//             if (index === this.pattern.length) {
//                 clearInterval(interval);
//                 this.updateStatus("תורך! חזור על הרצף");
//             }
//         }, 1000);
//     }

//     highlightButton(shape) {
//         const button = document.getElementById(shape);
//         button.classList.add('active');
//         setTimeout(() => {
//             button.classList.remove('active');
//         }, 500);
//     }

//     handleUserInput(shape) {
//         this.userInput.push(shape);
//         this.highlightButton(shape);

//         if (!this.isCorrectSoFar()) {
//             this.updateStatus("לא נכון! התחל מחדש.");
//             this.resetUserInput();
//         } else if (this.userInput.length === this.pattern.length) {
//             this.updateStatus("הרצף נכון! עוברים לשלב הבא.");
//             this.levelUp();
//         }
//     }

//     isCorrectSoFar() {
//         return this.userInput.every((shape, index) => shape === this.pattern[index]);
//     }

//     resetUserInput() {
//         this.userInput = [];
//         this.generatePattern();
//     }

//     levelUp() {
//         this.level++;
//         this.patternLength++;
//         this.userInput = [];
//         this.generatePattern();
//         this.updateLevel();
//         this.updateScore();
//     }

//     updateScore() {
//         document.getElementById('score').textContent = this.level * 10; // Example score calculation
//     }

//     updateLevel() {
//         document.getElementById('level').textContent = this.level;
//     }

//     updateStatus(message) {
//         document.getElementById('status-message').textContent = message;
//     }
// }


// // Example usage:

class LogicGame {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.sequence = [];
        this.playerSequence = [];
        this.score = 0;
        this.bestScore = 0;
        this.isPlaying = false;
        this.level = 1;
        this.sounds = {};
        this.initSounds();
    }

    initSounds() {
        // מגדירים את הצלילים עבור כל רשת חברתית
        const networks = ['facebook', 'twitter', 'instagram', 'youtube', 'linkedin', 'snapchat', 'whatsapp', 'pinterest', 'tiktok'];
        
        networks.forEach((network) => {
            const audio = new Audio();
            audio.src = `sounds/${network}.mp3`; // נניח ששם הקובץ הוא שם הרשת החברתית
            this.sounds[network] = audio;
        });
    }

    init() {
        this.loadBestScore();
        this.updateScore();
        this.updateLevel();
        this.setupEventListeners();
    }

    loadBestScore() {
        const saved = localStorage.getItem('logicGameBestScore');
        this.bestScore = saved ? parseInt(saved) : 0;
        document.getElementById('best-score').textContent = this.bestScore;
    }

    saveBestScore() {
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('logicGameBestScore', this.score);
            document.getElementById('best-score').textContent = this.bestScore;
        }
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
        this.level = 1;
        this.isPlaying = true;
        this.updateStatus('המשחק מתחיל...');
        this.updateScore();
        this.updateLevel();
        this.addToSequence();
        setTimeout(() => this.playSequence(), 1000);
    }

    addToSequence() {
        const networks = ['facebook', 'twitter', 'instagram', 'youtube', 'linkedin', 'snapchat', 'whatsapp', 'pinterest', 'tiktok'];
        this.sequence.push(networks[Math.floor(Math.random() * networks.length)]);
    }

    async playSequence() {
        this.isPlaying = false;
        this.updateStatus('שים לב לרצף...');
        
        for (let i = 0; i < this.sequence.length; i++) {
            await this.highlightButton(this.sequence[i]);
            await this.wait(300);
        }
        
        this.isPlaying = true;
        this.updateStatus('תורך! חזור על הרצף');
        this.playerSequence = [];
    }

    async highlightButton(network) {
        const button = document.getElementById(network);
        button.classList.add('active');
        this.playSound(network);
        await this.wait(500);
        button.classList.remove('active');
    }

    playSound(network) {
        if (this.sounds[network]) {
            this.sounds[network].currentTime = 0;
            this.sounds[network].play();
        }
    }

    handlePlayerInput(network) {
        this.playerSequence.push(network);
        this.highlightButton(network);

        const currentIndex = this.playerSequence.length - 1;
        
        if (this.playerSequence[currentIndex] !== this.sequence[currentIndex]) {
            this.gameOver();
            return;
        }

        if (this.playerSequence.length === this.sequence.length) {
            this.score += 10 * this.level;
            this.updateScore();
            this.saveBestScore();
            
            if (this.playerSequence.length % 4 === 0) {
                this.level++;
                this.updateLevel();
            }
            
            this.playerSequence = [];
            this.addToSequence();
            setTimeout(() => this.playSequence(), 1500);
        }
    }

    gameOver() {
        this.isPlaying = false;
        this.updateStatus('המשחק נגמר! לחץ על התחל כדי לשחק שוב');
        this.saveBestScore();
    }

    updateScore() {
        document.getElementById('score').textContent = this.score;
    }

    updateLevel() {
        document.getElementById('level').textContent = this.level;
    }

    updateStatus(message) {
        document.getElementById('status-message').textContent = message;
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}


