

class PianoGame {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.sequence = [];
        this.playerSequence = [];
        this.currentStep = 1;
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
            'Twinkle': {
                notes: ['C4', 'C4', 'G4', 'G4', 'A4', 'A4', 'G4'],
                difficulty: 1
            },
            'Mary': {
                notes: ['E4', 'D4', 'C4', 'D4', 'E4', 'E4', 'E4'],
                difficulty: 2
            },
            'Happy': {
                notes: ['G4', 'G4', 'A4', 'G4', 'C5', 'B4', 'G4', 'G4', 'A4', 'G4', 'D5', 'C5'],
                difficulty: 3
            }
        };
    }

    initSounds() {
        const notes = ['C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4'];
        notes.forEach(note => {
            const encodedNote = note.replace('#', '%23');
            const audio = new Audio(`../sounds/piano/${encodedNote}.wav`);
            this.sounds[note] = audio;
        });
    }

    init() {
        this.loadBestScore();
        this.updateScore();
        this.updateLevel();
        this.setupEventListeners();
        this.updateGlobalBestScore();
    }

    saveBestScore() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && this.score > this.bestScore) {
            this.bestScore = this.score;
            // עדכון ה-bestScore במשתמש הנוכחי
            currentUser.bestScores = currentUser.bestScores || {};
            currentUser.bestScores['LogicGame'] = this.bestScore;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            // עדכון ה-bestScore בטבלת המשתמשים
            const users = JSON.parse(localStorage.getItem('gameUsers')) || [];
            const userIndex = users.findIndex(user => user.username === currentUser.username);
            if (userIndex !== -1) {
                users[userIndex].bestScores = users[userIndex].bestScores || {};
                users[userIndex].bestScores['LogicGame'] = this.bestScore;
                localStorage.setItem('gameUsers', JSON.stringify(users));
            }

            this.updateDisplay();
            this.updateGlobalBestScore()
        }
    }

    loadBestScore() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            // ניסיון לטעון את התוצאה מה-bestScores של המשתמש
            currentUser.bestScores = currentUser.bestScores || {};
            this.bestScore = currentUser.bestScores['LogicGame'] || 0;

            // אם אין תוצאה, מנסה לטעון מטבלת המשתמשים
            if (this.bestScore === 0) {
                const users = JSON.parse(localStorage.getItem('gameUsers')) || [];
                const user = users.find(u => u.email === currentUser.email);
                if (user && user.bestScores && user.bestScores['LogicGame']) {
                    this.bestScore = user.bestScores['LogicGame'];
                    // עדכון ה-bestScore במשתמש הנוכחי
                    currentUser.bestScores['LogicGame'] = this.bestScore;
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                }
            }

            this.updateDisplay();
        }
    }

    updateDisplay() {
        const bestScoreElement = document.getElementById('best-score');
        if (bestScoreElement) {
            bestScoreElement.textContent = this.bestScore;
        }
    }

    updateGlobalBestScore() {
        const users = JSON.parse(localStorage.getItem('gameUsers')) || [];
        const globalBestScore = users.reduce((maxScore, user) => {
            const score = user.bestScores?.LogicGame || 0;
            return score > maxScore ? score : maxScore;
        }, 0);
        let lastBestScoreGlobal= localStorage.getItem('pianoGameBestScoreGlobal');

        if(lastBestScoreGlobal < this.bestScore ){
            this.updateMedal();
        }
        localStorage.setItem('pianoGameBestScoreGlobal', globalBestScore);
        const globalScoreElement = document.getElementById('best-score-Users');
        if (globalScoreElement) {
            globalScoreElement.textContent = globalBestScore;
        }
        
    }

    setupEventListeners() {
        const startGameButton = document.getElementById('start-game');

        startGameButton.addEventListener('click', () => {
            this.startGame();
            startGameButton.disabled = true;
        });

        const keys = document.querySelectorAll('.key');
        keys.forEach(key => {
            key.addEventListener('click', () => {
                if (this.isPlaying) {
                    const note = key.dataset.note;
                    this.playSound(note);
                    this.handlePlayerInput(note);
                    this.animateKey(key);
                }
            });
        });

        // document.addEventListener('keydown', (e) => {
        //     if (this.isPlaying) {
        //         const note = this.getNodeFromKeyboard(e.key);
        //         if (note) {
        //             const key = document.querySelector(`[data-note="${note}"]`);
        //             if (key) {
        //                 this.handlePlayerInput(note);
        //                 this.animateKey(key);
        //             }
        //         }
        //     }
        // });
    }

    startGame() {
        this.sequence = [];
        this.playerSequence = [];
        this.currentStep = 1;
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

        if (this.playerSequence[currentIndex] !== this.sequence[currentIndex]) {
            this.gameOver();
            return;
        }

        if (this.playerSequence.length === this.currentStep) {
            this.score += 10 * this.level;
            this.updateScore();
            this.saveBestScore();

            this.currentStep++;

            if (this.currentStep > this.sequence.length) {
                this.level++;
                this.updateLevel();
                this.selectSong();
                this.currentStep = 1;
            }

            setTimeout(() => this.playSequence(), 1500);
        }
    }

    gameOver() {
        this.isPlaying = false;
        this.updateStatus('המשחק נגמר! לחץ על התחל כדי לשחק שוב');
        this.saveBestScore();
        this.updateGlobalBestScore();

        const startGameButton = document.getElementById('start-game');
        startGameButton.disabled = false;
    }

    updateMedal() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let medals = 0;
       
        const users = JSON.parse(localStorage.getItem('gameUsers')) || [];
        const userIndex = users.findIndex(user => user.username === currentUser.username);
        if (userIndex !== -1) {
            medals = users[userIndex].stars + 1;
            
            currentUser.stars = medals;
            
            users[userIndex].stars =  medals;
            localStorage.setItem('gameUsers', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
          
        }
        const medalselement = document.getElementById('user-medal');
        if (medalselement) {
            medalselement.textContent = medals;
        }

        if (medals === 3 ) {
            this.updateStatus('מיומן');
        }
        if (medals === 6 ) {
            this.updateStatus('מומחה');
        }
        if (medals === 9 ) {
            this.updateStatus('אלוף');
        }
    }

    updateStatus(status_) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let status = status_;
        const users = JSON.parse(localStorage.getItem('gameUsers')) || [];
        const userIndex = users.findIndex(user => user.username === currentUser.username);
        if (userIndex !== -1) {
           
            currentUser.userLevel = status;
            users[userIndex].userLevel = status;
            localStorage.setItem('gameUsers', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
        const stautselement = document.getElementById('user-rank');
        if (stautselement) {
            stautselement.textContent = status;
        }
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
