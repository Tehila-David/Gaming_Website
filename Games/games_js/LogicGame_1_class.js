
// piano game class - logic game
class PianoGame {
    constructor(containerId) {
        // Initialize the game container
        this.container = document.getElementById(containerId);

        // Initialize game properties
        this.sequence = []; // Sequence of notes to play
        this.playerSequence = []; // Sequence input by the player
        this.currentStep = 1; // Current step in the sequence
        this.score = 0; // Player's current score
        this.bestScore = 0; // Player's personal best score
        this.isPlaying = false; // Flag to track if the game is active
        this.level = 1; // Current difficulty level
        this.flag = 'True' //update the user's medal based on their stars - only once!!

        // Load predefined songs
        this.songs = this.initializeSongs();
        this.currentSong = null; // Current song being played

        // Load sounds for the piano keys
        this.sounds = {};
        this.initSounds();
    }

    // Initializes a set of predefined songs with their note sequences and difficulty levels
    initializeSongs() {
        return {
            'Twinkle': {
                notes: ['C4', 'C4', 'G4', 'G4', 'A4', 'A4', 'G4'], // Note sequence
                difficulty: 1 // Difficulty level
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

    // Preloads audio files for all piano notes used in the game
    initSounds() {
        const notes = ['C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4'];
        notes.forEach(note => {
            const encodedNote = note.replace('#', '%23'); // Encode '#' for the URL
            const audio = new Audio(`../sounds/piano/${encodedNote}.wav`);
            this.sounds[note] = audio; // Map each note to its corresponding audio object
        });
    }

    // Initializes the game, loads the best score, and sets up the UI
    init() {
        this.loadBestScore(); // Load player's personal best score
        this.updateScore(); // Update the score display
        this.updateLevel(); // Update the level display
        this.setupEventListeners(); // Set up event listeners for the game
        this.updateGlobalBestScore(); // Update the global best score display
    }

    // Saves the player's best score and updates the user records
    saveBestScore() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser')); // Get the current user from localStorage
        if (currentUser && this.score > this.bestScore) {
            this.bestScore = this.score; // Update the best score

            // Update the best score for the current user in localStorage
            currentUser.bestScores = currentUser.bestScores || {};
            currentUser.bestScores['LogicGame'] = this.bestScore;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            // Update the user records in the global users list
            const users = JSON.parse(localStorage.getItem('gameUsers')) || [];
            const userIndex = users.findIndex(user => user.username === currentUser.username);
            if (userIndex !== -1) {
                users[userIndex].bestScores = users[userIndex].bestScores || {};
                users[userIndex].bestScores['LogicGame'] = this.bestScore;
                localStorage.setItem('gameUsers', JSON.stringify(users));
            }

            this.updateDisplay(); // Update the best score display
            this.updateGlobalBestScore(); // Update the global best score display
        }
    }

    // Loads the player's best score from localStorage
    loadBestScore() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            currentUser.bestScores = currentUser.bestScores || {};
            this.bestScore = currentUser.bestScores['LogicGame'] || 0;

            // If no best score is found, attempt to load it from the global user records
            if (this.bestScore === 0) {
                const users = JSON.parse(localStorage.getItem('gameUsers')) || [];
                const user = users.find(u => u.email === currentUser.email);
                if (user && user.bestScores && user.bestScores['LogicGame']) {
                    this.bestScore = user.bestScores['LogicGame'];
                    currentUser.bestScores['LogicGame'] = this.bestScore;
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                }
            }

            this.updateDisplay(); // Update the best score display
        }
    }

    // Updates the best score display in the UI
    updateDisplay() {
        const bestScoreElement = document.getElementById('best-score');
        if (bestScoreElement) {
            bestScoreElement.textContent = this.bestScore;
        }
    }

    // Updates the global best score display and saves it in localStorage
    updateGlobalBestScore() {
        const users = JSON.parse(localStorage.getItem('gameUsers')) || [];
        const globalBestScore = users.reduce((maxScore, user) => {
            const score = user.bestScores?.LogicGame || 0;
            return score > maxScore ? score : maxScore;
        }, 0);

        // Check if a new global best score is achieved and update medals
        let lastBestScoreGlobal = localStorage.getItem('pianoGameBestScoreGlobal');
        if (lastBestScoreGlobal < this.bestScore) {
            this.updateMedal(this.flag);
        }
        localStorage.setItem('pianoGameBestScoreGlobal', globalBestScore);

        // Update the global best score element in the UI
        const globalScoreElement = document.getElementById('best-score-Users');
        if (globalScoreElement) {
            globalScoreElement.textContent = globalBestScore;
        }
    }



    // Function to setup event listeners for the game controls
    setupEventListeners() {
        const startGameButton = document.getElementById('start-game');

        // When the start button is clicked, start the game
        startGameButton.addEventListener('click', () => {
            this.startGame();
            startGameButton.disabled = true; // Disable the start button after clicking
        });

        // Event listener for each key press in the game
        const keys = document.querySelectorAll('.key');
        keys.forEach(key => {
            key.addEventListener('click', () => {
                if (this.isPlaying) {
                    const note = key.dataset.note;
                    this.playSound(note); // Play the sound for the note
                    this.handlePlayerInput(note); // Handle the player's input
                    this.animateKey(key); // Animate the key press
                }
            });
        });
    }

    // Function to start the game
    startGame() {
        this.sequence = []; // Reset the sequence
        this.playerSequence = []; // Reset the player's sequence
        this.currentStep = 1; // Reset the current step
        this.score = 0; // Reset the score
        this.level = 1; // Start at level 1
        this.isPlaying = true; // Indicate that the game is playing
        this.selectSong(); // Select a song based on the current level
        this.updateStatus('המשחק מתחיל...'); // Update the status
        this.updateScore(); // Update the score display
        this.updateLevel(); // Update the level display
        setTimeout(() => this.playSequence(), 1000); // Start the sequence after a delay
    }

    // Function to select a song based on the current difficulty level
    selectSong() {
        const availableSongs = Object.entries(this.songs)
            .filter(([_, song]) => song.difficulty === this.level);

        if (availableSongs.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableSongs.length); // Pick a random song
            const [songName, song] = availableSongs[randomIndex];
            this.currentSong = { name: songName, ...song };
            this.sequence = [...song.notes]; // Set the sequence of notes for the song
            document.getElementById('current-song').textContent = `שיר: ${songName}`; // Display the song name
        } else {
            const allSongs = Object.entries(this.songs); // If no songs match the difficulty, pick any song
            const [songName, song] = allSongs[Math.floor(Math.random() * allSongs.length)];
            this.currentSong = { name: songName, ...song };
            this.sequence = [...song.notes];
            document.getElementById('current-song').textContent = `שיר: ${songName}`;
        }
    }

    // Function to play the sequence of notes
    async playSequence() {
        this.isPlaying = false; // Disable player input while the sequence is playing
        this.updateStatus('הקשב לשיר...'); // Update status to "Listen to the song"

        for (let i = 0; i < this.currentStep && i < this.sequence.length; i++) {
            const note = this.sequence[i];
            const key = document.querySelector(`[data-note="${note}"]`);
            await this.playNote(note, key); // Play each note in the sequence
            await this.wait(300); // Wait between notes
        }

        this.isPlaying = true; // Enable player input after the sequence is done
        this.updateStatus('תורך! נגן את השיר'); // Update status to "Your turn! Play the song"
        this.playerSequence = []; // Reset the player's sequence
    }

    // Function to play a single note and animate the key
    async playNote(note, key) {
        key.classList.add('active'); // Add the 'active' class to animate the key
        this.playSound(note); // Play the sound for the note
        await this.wait(500); // Wait for the sound to play
        key.classList.remove('active'); // Remove the 'active' class after the animation
    }

    // Function to animate the key when pressed
    animateKey(key) {
        key.classList.add('pressed'); // Add 'pressed' class for the animation
        setTimeout(() => key.classList.remove('pressed'), 100); // Remove the animation after 100ms
    }

    // Function to play a sound for the given note
    playSound(note) {
        if (this.sounds[note]) {
            this.sounds[note].currentTime = 0; // Reset sound to start from the beginning
            this.sounds[note].play(); // Play the note sound
        }
    }

    // Function to handle player's input and compare it with the sequence
    handlePlayerInput(note) {
        this.playerSequence.push(note); // Add the note to the player's sequence
        const currentIndex = this.playerSequence.length - 1;

        // If the player's note does not match the sequence, game over
        if (this.playerSequence[currentIndex] !== this.sequence[currentIndex]) {
            this.gameOver();
            return;
        }

        // If the player completed the sequence, update the score and progress to the next step
        if (this.playerSequence.length === this.currentStep) {
            this.score += 10 * this.level; // Increase score based on the level
            this.updateScore(); // Update score display
            this.saveBestScore(); // Save the best score

            this.currentStep++; // Increase the step for the next sequence

            // If the current step exceeds the sequence length, increase the level and reset the step
            if (this.currentStep > this.sequence.length) {
                this.level++;
                this.updateLevel(); // Update the level display
                this.selectSong(); // Select a new song
                this.currentStep = 1;
            }

            setTimeout(() => this.playSequence(), 1500); // Play the next sequence after a short delay
        }
    }

    // Function to handle the end of the game
    gameOver() {
        this.isPlaying = false; // Disable player input after game over
        this.updateStatus('המשחק נגמר! לחץ על התחל כדי לשחק שוב'); // Display "Game Over" message
        this.saveBestScore(); // Save the best score
        this.updateGlobalBestScore(); // Update the global best score

        const startGameButton = document.getElementById('start-game');
        startGameButton.disabled = false; // Enable the start button to play again
    }

    // Function to update the user's medal based on their stars
    updateMedal(flag) {
        if(flag ==='True'){
            this.flag= 'False';
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            let medals = 0;
    
            const users = JSON.parse(localStorage.getItem('gameUsers')) || [];
            const userIndex = users.findIndex(user => user.username === currentUser.username);
            if (userIndex !== -1) {
                medals = users[userIndex].stars + 1; // Increase medal count by 1
    
                currentUser.stars = medals; // Update the current user's stars
                users[userIndex].stars = medals; // Update the user's stars in the list
                localStorage.setItem('gameUsers', JSON.stringify(users)); // Save the updated users list
                localStorage.setItem('currentUser', JSON.stringify(currentUser)); // Save the updated current user
            }
    
            const medalselement = document.getElementById('user-medal');
            if (medalselement) {
                medalselement.textContent = medals; // Display the medal count
            }
            console.log("MEDALS:"+medals);
            if (medals  >= 9) {
                this.updateStatusUser('אלוף');
            }
            if (medals >= 6) {
                this.updateStatusUser('מומחה');
            }
            // Update the status based on the number of medals
            if (medals >= 3) {
                this.updateStatusUser('מיומן');
            }
            
        }
      
    }

    // Function to update the user's status
    updateStatusUser(status_) {
        console.log("hii i am in  updatstatus")
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let status = status_;
        const users = JSON.parse(localStorage.getItem('gameUsers')) || [];
        const userIndex = users.findIndex(user => user.username === currentUser.username);
        if (userIndex !== -1) {
            currentUser.userLevel = status; // Update the current user's level
            users[userIndex].userLevel = status; // Update the user's level in the list
            localStorage.setItem('gameUsers', JSON.stringify(users)); // Save the updated users list
            localStorage.setItem('currentUser', JSON.stringify(currentUser)); // Save the updated current user
        }

        const stautselement = document.getElementById('user-rank');
        if (stautselement) {
            stautselement.textContent = status; // Display the user's status
        }
    }

    // Function to update the score display
    updateScore() {
        document.getElementById('score').textContent = this.score; // Display the score
    }

    // Function to update the level display
    updateLevel() {
        document.getElementById('level').textContent = this.level; // Display the level
    }

    // Function to update the status display
    updateStatus(message) {
        document.getElementById('status').textContent = message; // Display the status message
    }

    // Function to wait for a specified time (in ms)
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms)); // Return a promise that resolves after a delay
    }

}
