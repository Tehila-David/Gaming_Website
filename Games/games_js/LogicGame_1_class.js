// class PianoGame {
//     constructor(containerId) {
//         this.container = document.getElementById(containerId);
//         this.sequence = [];
//         this.playerSequence = [];
//         this.score = 0;
//         this.bestScore = 0;
//         this.isPlaying = false;
//         this.level = 1;
//         this.songs = this.initializeSongs();
//         this.currentSong = null;
//         this.sounds = {};
//         this.initSounds();
//     }

//     initializeSongs() {
//         return {
//             'אצא לי השוקה': {
//                 notes: [
//                     'C4', 'C4', 'D4', 'E4', 'F4', 'E4', 'C4', 'C4', // "יונתן הקטן"
//                     'C4', 'D4', 'E4', 'F4', 'E4', 'D4', 'C4', 'C4', // "יושב לו על ענף"
//                     'E4', 'F4', 'E4', 'C4', 'D4', 'E4', 'F4', 'G4', // "והוא לא מפריע"
//                     'G4', 'A4', 'B4', 'C5', 'A4', 'G4', 'F4', 'E4', // "לכל העולם"
//                     'C4', 'D4', 'E4', 'F4', 'C4', 'G4', 'F4', 'C4', // "החיים שלו הם חיים"
//                     'D4', 'F4', 'E4', 'G4', 'A4', 'C5', 'C4', 'B4', // "רק הוא זורם"
//                     'E4', 'C4', 'G4', 'C4', 'F4', 'G4', 'A4', 'B4', // "הילד יונתן"
//                     'A4', 'C5', 'G4', 'C4', 'F4', 'E4', 'C4', 'D4', // "החיים שלו הם חיים"
//                     'F4', 'G4', 'A4', 'C4', 'B4', 'C5', 'E4', 'D4', // "רק הוא זורם"
//                 ],
//                 difficulty: 1
//             },
//             'הבה נגילה': {
//                 notes: ['D4', 'F4', 'A4', 'D4', 'F4', 'A4', 'D4', 'A4', 'F4'],
//                 difficulty: 2
//             },
//             'דוד מלך ישראל': {
//                 notes: ['C4', 'E4', 'G4', 'C4', 'G4', 'E4', 'C4', 'E4', 'G4', 'C4'],
//                 difficulty: 3
//             }
//         };
//     }

//     initSounds() {
//         const notes = ['C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4'];
//         notes.forEach(note => {
//             const audio = new Audio(`../sounds/piano/${note}.wav`);
//             this.sounds[note] = audio;
//         });
//     }

//     init() {
//         this.loadBestScore();
//         this.updateScore();
//         this.updateLevel();
//         this.setupEventListeners();
//     }

//     loadBestScore() {
//         const saved = localStorage.getItem('pianoGameBestScore');
//         this.bestScore = saved ? parseInt(saved) : 0;
//         document.getElementById('best-score').textContent = this.bestScore;
//     }

//     saveBestScore() {
//         if (this.score > this.bestScore) {
//             this.bestScore = this.score;
//             localStorage.setItem('pianoGameBestScore', this.score);
//             document.getElementById('best-score').textContent = this.bestScore;
//         }
//     }

//     setupEventListeners() {
//         document.getElementById('start-game').addEventListener('click', () => {
//             this.startGame();
//         });

//         const keys = document.querySelectorAll('.key');
//         keys.forEach(key => {
//             key.addEventListener('click', () => {
//                 if (this.isPlaying) {
//                     const note = key.dataset.note;
//                     this.handlePlayerInput(note);
//                     this.animateKey(key);
//                 }
//             });
//         });

//         document.addEventListener('keydown', (e) => {
//             if (this.isPlaying) {
//                 const note = this.getNodeFromKeyboard(e.key);
//                 if (note) {
//                     const key = document.querySelector(`[data-note="${note}"]`);
//                     if (key) {
//                         this.handlePlayerInput(note);
//                         this.animateKey(key);
//                     }
//                 }
//             }
//         });
//     }

//     getNodeFromKeyboard(key) {
//         const keyMap = {
//             'a': 'C4', 'w': 'C#4',
//             's': 'D4', 'e': 'D#4',
//             'd': 'E4',
//             'f': 'F4', 't': 'F#4',
//             'g': 'G4', 'y': 'G#4',
//             'h': 'A4', 'u': 'A#4',
//             'j': 'B4'
//         };
//         return keyMap[key.toLowerCase()];
//     }

//     startGame() {
//         this.sequence = [];
//         this.playerSequence = [];
//         this.score = 0;
//         this.level = 1;
//         this.isPlaying = true;
//         this.selectSong();
//         this.updateStatus('המשחק מתחיל...');
//         this.updateScore();
//         this.updateLevel();
//         setTimeout(() => this.playSequence(), 1000);
//     }

//     selectSong() {
//         const availableSongs = Object.entries(this.songs)
//             .filter(([_, song]) => song.difficulty === this.level);
        
//         if (availableSongs.length > 0) {
//             const randomIndex = Math.floor(Math.random() * availableSongs.length);
//             const [songName, song] = availableSongs[randomIndex];
//             this.currentSong = { name: songName, ...song };
//             this.sequence = [...song.notes];
//             document.getElementById('current-song').textContent = `שיר: ${songName}`;
//         } else {
//             const allSongs = Object.entries(this.songs);
//             const [songName, song] = allSongs[Math.floor(Math.random() * allSongs.length)];
//             this.currentSong = { name: songName, ...song };
//             this.sequence = [...song.notes];
//             document.getElementById('current-song').textContent = `שיר: ${songName}`;
//         }
//     }

//     async playSequence() {
//         this.isPlaying = false;
//         this.updateStatus('הקשב לשיר...');
        
//         for (let i = 0; i < this.sequence.length; i++) {
//             const note = this.sequence[i];
//             const key = document.querySelector(`[data-note="${note}"]`);
//             await this.playNote(note, key);
//             await this.wait(300);
//         }
        
//         this.isPlaying = true;
//         this.updateStatus('תורך! נגן את השיר');
//         this.playerSequence = [];
//     }

//     async playNote(note, key) {
//         key.classList.add('active');
//         this.playSound(note);
//         await this.wait(500);
//         key.classList.remove('active');
//     }

//     animateKey(key) {
//         key.classList.add('pressed');
//         setTimeout(() => key.classList.remove('pressed'), 100);
//     }

//     playSound(note) {
//         if (this.sounds[note]) {
//             this.sounds[note].currentTime = 0;
//             this.sounds[note].play();
//         }
//     }

//     handlePlayerInput(note) {
//         this.playerSequence.push(note);
//         const currentIndex = this.playerSequence.length - 1;
        
//         if (this.playerSequence[currentIndex] !== this.sequence[currentIndex]) {
//             this.gameOver();
//             return;
//         }

//         if (this.playerSequence.length === this.sequence.length) {
//             this.score += 10 * this.level;
//             this.updateScore();
//             this.saveBestScore();
            
//             this.level++;
//             this.updateLevel();
            
//             this.playerSequence = [];
//             this.selectSong();
//             setTimeout(() => this.playSequence(), 1500);
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
//         document.getElementById('status').textContent = message;
//     }

//     wait(ms) {
//         return new Promise(resolve => setTimeout(resolve, ms));
//     }
// }

class PianoGame {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.sequence = [];
        this.playerSequence = [];
        this.currentStep = 1; // מספר התווים לשלב הנוכחי
        this.score = 0;
        this.bestScore = 0;
        this.isPlaying = false;
        this.level = 1;
        this.songs = this.initializeSongs();
        this.currentSong = null;
        this.sounds = {};
        this.initSounds();
    }

    initializeSongs() {
        return {
            'אצא לי השוקה': {
                notes: ['C4', 'E4', 'G4', 'C4', 'E4', 'G4', 'C4'],
                difficulty: 1
            },
            'הבה נגילה': {
                notes: ['D4', 'F4', 'A4', 'D4', 'F4', 'A4', 'D4', 'A4', 'F4'],
                difficulty: 2
            },
            'דוד מלך ישראל': {
                notes: ['C4', 'E4', 'G4', 'C4', 'G4', 'E4', 'C4', 'E4', 'G4', 'C4'],
                difficulty: 3
            }
        };
    }

    initSounds() {
        const notes = ['C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4'];
        notes.forEach(note => {
            const encodedNote = note.replace('#', '%23');
            const audio = new Audio(`../sounds/piano/${ encodedNote}.wav`);
            this.sounds[note] = audio;
        });
    }

    init() {
        this.loadBestScore();
        this.updateScore();
        this.updateLevel();
        this.setupEventListeners();
    }

    loadBestScore() {
        const saved = localStorage.getItem('pianoGameBestScore');
        this.bestScore = saved ? parseInt(saved) : 0;
        document.getElementById('best-score').textContent = this.bestScore;
    }

    saveBestScore() {
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('pianoGameBestScore', this.score);
            document.getElementById('best-score').textContent = this.bestScore;
        }
    }

    setupEventListeners() {
        document.getElementById('start-game').addEventListener('click', () => {
            this.startGame();
        });

        const keys = document.querySelectorAll('.key');
        keys.forEach(key => {
            key.addEventListener('click', () => {
                if (this.isPlaying) {
                    const note = key.dataset.note;
                    this.handlePlayerInput(note);
                    this.animateKey(key);
                }
            });
        });

        document.addEventListener('keydown', (e) => {
            if (this.isPlaying) {
                const note = this.getNodeFromKeyboard(e.key);
                if (note) {
                    const key = document.querySelector(`[data-note="${note}"]`);
                    if (key) {
                        this.handlePlayerInput(note);
                        this.animateKey(key);
                    }
                }
            }
        });
    }

    getNodeFromKeyboard(key) {
        const keyMap = {
            'a': 'C4', 'w': 'C#4',
            's': 'D4', 'e': 'D#4',
            'd': 'E4',
            'f': 'F4', 't': 'F#4',
            'g': 'G4', 'y': 'G#4',
            'h': 'A4', 'u': 'A#4',
            'j': 'B4'
        };
        return keyMap[key.toLowerCase()];
    }

    startGame() {
        this.sequence = [];
        this.playerSequence = [];
        this.currentStep = 1; // אתחול לשלב הראשון
        this.score = 0;
        this.level = 1;
        this.isPlaying = true;
        this.selectSong();
        this.updateStatus('המשחק מתחיל...');
        this.updateScore();
        this.updateLevel();
        setTimeout(() => this.playSequence(), 1000);
    }

    selectSong() {
        const availableSongs = Object.entries(this.songs)
            .filter(([_, song]) => song.difficulty === this.level);
        
        if (availableSongs.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableSongs.length);
            const [songName, song] = availableSongs[randomIndex];
            this.currentSong = { name: songName, ...song };
            this.sequence = [...song.notes];
            document.getElementById('current-song').textContent = `שיר: ${songName}`;
        } else {
            const allSongs = Object.entries(this.songs);
            const [songName, song] = allSongs[Math.floor(Math.random() * allSongs.length)];
            this.currentSong = { name: songName, ...song };
            this.sequence = [...song.notes];
            document.getElementById('current-song').textContent = `שיר: ${songName}`;
        }
    }

    async playSequence() {
        this.isPlaying = false;
        this.updateStatus('הקשב לשיר...');
        
        // לנגן רק את חלק הרצף המתאים לשלב הנוכחי
        for (let i = 0; i < this.currentStep && i < this.sequence.length; i++) {
            const note = this.sequence[i];
            const key = document.querySelector(`[data-note="${note}"]`);
            await this.playNote(note, key);
            await this.wait(300);
        }
        
        this.isPlaying = true;
        this.updateStatus('תורך! נגן את השיר');
        this.playerSequence = [];
    }

    async playNote(note, key) {
        key.classList.add('active');
        this.playSound(note);
        await this.wait(500);
        key.classList.remove('active');
    }

    animateKey(key) {
        key.classList.add('pressed');
        setTimeout(() => key.classList.remove('pressed'), 100);
    }

    playSound(note) {
        if (this.sounds[note]) {
            this.sounds[note].currentTime = 0;
            this.sounds[note].play();
        }
    }

    handlePlayerInput(note) {
        this.playerSequence.push(note);
        const currentIndex = this.playerSequence.length - 1;

        // להשוות את קלט המשתמש רק לתווים בשלב הנוכחי
        if (this.playerSequence[currentIndex] !== this.sequence[currentIndex]) {
            this.gameOver();
            return;
        }

        // אם המשתמש השלים את השלב הנוכחי בהצלחה
        if (this.playerSequence.length === this.currentStep) {
            this.score += 10 * this.level;
            this.updateScore();
            this.saveBestScore();
            
            // מעבר לשלב הבא
            this.currentStep++;
            
            if (this.currentStep > this.sequence.length) {
                this.level++;
                this.updateLevel();
                this.selectSong();
                this.currentStep = 1; // לאתחל את השלב
            }
            
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
        document.getElementById('status').textContent = message;
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
