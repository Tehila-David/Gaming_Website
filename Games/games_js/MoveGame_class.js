
class BubbleGame {

    constructor(containerId) {
        // Initialize game variables
        this.gameBoard = document.getElementById(containerId); // Game board container
        this.score = 0; // Player's current score
        this.bestScore = 0; // Player's best score
        this.isPlaying = false; // Game state
        this.level = 1; // Current game level
        this.bubbles = []; // Active bubbles on the screen
        this.gameLoop = null; // Main game loop
        this.maxBubbles = 6; // Maximum bubbles allowed on the screen
        this.bubbleSpeed = 4; // Speed of bubble movement
        this.missedBubbles = 0; // Count of missed bubbles
        this.maxMissedBubbles = 8; // Allowed number of missed bubbles before game over
        this.flag = 'True'; //update the user's medal based on their stars - only once!!
        this.sounds = {
            pop: new Audio('../../Games/sounds/bubbles/Pop Bubble Sound Effect 2022.mp3'),
        };
    }

    init() {
        // Initialize game state and UI elements
        this.loadBestScore(); // Load the player's best score from local storage
        this.updateScore(); // Update the score display
        this.updateLevel(); // Update the level display
        this.setupEventListeners(); // Setup event listeners for UI elements
        this.updateStatus('לחץ על התחל כדי להתחיל במשחק'); // Update game status message
        this.updateGlobalBestScore(); // Update the global best score display
    }


    playSound(soundType) {
        const sound = this.sounds[soundType];
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(err => console.log('Error playing sound:', err));
        }
    }

    saveBestScore() {
        // Save the player's best score to localStorage and update global records
        const currentUser = JSON.parse(localStorage.getItem('currentUser')); // Get the current user from localStorage
        if (currentUser && this.score > this.bestScore) {
            this.bestScore = this.score; // Update best score for the player

            // Update best score for the current user in localStorage
            currentUser.bestScores = currentUser.bestScores || {};
            currentUser.bestScores['MoveGame'] = this.bestScore;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            // Update global user records in localStorage
            const users = JSON.parse(localStorage.getItem('gameUsers')) || [];
            const userIndex = users.findIndex(user => user.username === currentUser.username);
            if (userIndex !== -1) {
                users[userIndex].bestScores = users[userIndex].bestScores || {};
                users[userIndex].bestScores['MoveGame'] = this.bestScore;
                localStorage.setItem('gameUsers', JSON.stringify(users));
            }

            this.updateDisplay(); // Update the best score display
            this.updateGlobalBestScore(); // Update the global best score
        }
    }

    loadBestScore() {
        // Load the player's best score from localStorage
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            currentUser.bestScores = currentUser.bestScores || {};
            this.bestScore = currentUser.bestScores['MoveGame'] || 0;

            // If best score is missing, check the global user records
            if (this.bestScore === 0) {
                const users = JSON.parse(localStorage.getItem('gameUsers')) || [];
                const user = users.find(u => u.email === currentUser.email);
                if (user && user.bestScores && user.bestScores['MoveGame']) {
                    this.bestScore = user.bestScores['MoveGame'];
                    currentUser.bestScores['MoveGame'] = this.bestScore;
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                }
            }

            this.updateDisplay(); // Update the best score display in the UI
        }
    }

    updateDisplay() {
        // Update the UI element displaying the best score
        const bestScoreElement = document.getElementById('best-score');
        if (bestScoreElement) {
            bestScoreElement.textContent = this.bestScore;
        }
    }

    updateGlobalBestScore() {
        // Update the global best score display
        const users = JSON.parse(localStorage.getItem('gameUsers')) || [];
        const globalBestScore = users.reduce((maxScore, user) => {
            const score = user.bestScores?.MoveGame || 0;
            return score > maxScore ? score : maxScore;
        }, 0);

        let lastBestScoreGlobal = localStorage.getItem('bubbleGameBestScoreGlobal');
        if (lastBestScoreGlobal < this.bestScore) {
            this.updateMedal(this.flag); // Award medals if new global best score achieved
        }
        localStorage.setItem('bubbleGameBestScoreGlobal', globalBestScore);

        const globalScoreElement = document.getElementById('best-score-Users');
        if (globalScoreElement) {
            globalScoreElement.textContent = globalBestScore;
        }
    }

    updateScore() {
        // Update the player's score display
        const scoreElement = document.getElementById('score');
        if (scoreElement) {
            scoreElement.textContent = this.score;
        }
    }

    updateLevel() {
        // Update the current game level display
        const levelElement = document.getElementById('level');
        if (levelElement) {
            levelElement.textContent = this.level;
        }
    }

    updateStatus(message) {
        // Update the game status message
        const statusElement = document.getElementById('status-message');
        if (statusElement) {
            statusElement.textContent = message;
        }
    }

    getRandomIcon() {
        // Generate a random icon for bubbles
        const randomNumber = Math.floor(Math.random() * 8) + 1; // Random number between 1 and 8
        return `../../Games/pictures/music (${randomNumber}).png`; // Path to the random image
    }

    setupEventListeners() {
        // Setup event listeners for UI elements
        const startButton = document.getElementById('start-game');
        if (startButton) {
            startButton.addEventListener('click', () => {
                startButton.disabled = true; // Disable the button during gameplay
                this.startGame(); // Start the game
            });
        }
    }

    createBubble() {
        // Create a new bubble and add it to the game board
        const bubble = document.createElement('div');
        bubble.className = 'bubble';

        const randomColor = this.getRandomColor(); // Random color for the bubble
        bubble.style.background = `radial-gradient(circle, ${randomColor}, #000)`;

        const size = 75; // Set bubble size
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;

        const startX = Math.random() * (this.gameBoard.offsetWidth - size); // Random start position
        bubble.style.left = `${startX}px`;
        bubble.style.top = `${this.gameBoard.offsetHeight}px`;

        const icon = document.createElement('img'); // Add random icon
        icon.src = this.getRandomIcon();
        bubble.appendChild(icon);

        this.gameBoard.appendChild(bubble);

        const bubbleObj = {
            element: bubble,
            speed: this.bubbleSpeed * (Math.random() * 0.5 + 0.9), // Random speed variation
            points: 1 // Points for popping this bubble
        };

        bubble.addEventListener('click', () => {
            if (this.isPlaying) {
                this.popBubble(bubbleObj); // Handle bubble pop
            }
        });

        this.bubbles.push(bubbleObj); // Add the bubble to the active bubbles list
    }

    getRandomColor() {
        // Get a random color for bubbles
        const colors = [
            'rgba(147, 51, 234,0.9)',  // Light purple
            'rgba(168, 85, 247,0.9)',  // Bright magenta
            'rgba(139, 92, 246,0.9)',  // Vibrant lavender
            'rgba(124, 58, 237,0.9)',  // Deep purple
            'rgba(167, 139, 250,0.9)', // Pastel purple
            'rgba(192, 132, 252,0.9)'  // Light pink-purple
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    updateBubbles() {
        // Update bubble positions and handle off-screen bubbles
        for (let i = this.bubbles.length - 1; i >= 0; i--) {
            const bubble = this.bubbles[i];
            const currentTop = parseFloat(bubble.element.style.top) || this.gameBoard.offsetHeight;
            const newTop = currentTop - bubble.speed;
            bubble.element.style.top = `${newTop}px`;

            if (newTop < -100) { // Bubble went off-screen
                if (bubble.element.parentNode) {
                    bubble.element.parentNode.removeChild(bubble.element);
                }
                this.bubbles.splice(i, 1);
                this.missedBubbles++; // Increment missed bubble count
                this.checkGameOver(); // Check if game over
            }
        }
    }

    checkGameOver() {
        // Check if the game is over based on conditions
        if (this.bubbles.length >= this.maxBubbles || this.missedBubbles >= this.maxMissedBubbles) {
            this.gameOver(); // End the game
        }
    }

    startGame() {
        // Start the game
        clearInterval(this.gameLoop); // Stop previous game loops
        this.bubbles.forEach(bubble => {
            if (bubble.element.parentNode) {
                bubble.element.parentNode.removeChild(bubble.element); // Remove existing bubbles
            }
        });
        this.bubbles = []; // Clear bubble list
        this.score = 0; // Reset score
        this.level = 1; // Reset level
        this.isPlaying = true; // Set game state
        this.maxBubbles = 5; // Reset max bubbles
        this.bubbleSpeed = 2; // Reset bubble speed
        this.missedBubbles = 0; // Reset missed bubble count

        this.updateStatus('המשחק התחיל! לחץ על הבועות'); // Update status message
        this.updateScore(); // Update score display
        this.updateLevel(); // Update level display

        if (this.gameLoop) {
            clearInterval(this.gameLoop); // Clear any existing loops
        }

        // Main game loop
        this.gameLoop = setInterval(() => {
            if (this.isPlaying) {
                this.updateBubbles(); // Update bubble positions
                if (Math.random() < 0.2 && this.bubbles.length < this.maxBubbles) {
                    this.createBubble(); // Create new bubbles
                }
            }
        }, 50);
    }

    popBubble(bubble) {
        // Handle popping a bubble
        if (!bubble.element.classList.contains('popped')) {
            bubble.element.classList.add('popped');
            bubble.element.style.animation = 'explode 0.5s ease-out'; // Add pop animation
            this.score += bubble.points; // Add points
            this.updateScore(); // Update score display
            this.saveBestScore(); // Save the best score

            this.playSound('pop');

            setTimeout(() => {
                if (bubble.element.parentNode) {
                    bubble.element.parentNode.removeChild(bubble.element); // Remove bubble element
                }
                const index = this.bubbles.indexOf(bubble);
                if (index > -1) {
                    this.bubbles.splice(index, 1); // Remove bubble from active list
                }
            }, 300);

            if (this.score >= this.level * 10) {
                this.levelUp(); // Level up if score threshold reached
            }
        }
    }

    levelUp() {
        // Handle leveling up
        this.level++; // Increment level
        this.updateLevel(); // Update level display
        this.maxBubbles = Math.min(this.maxBubbles + 2, 15); // Increase max bubbles
        this.bubbleSpeed += 0.5; // Increase bubble speed
        this.updateStatus(`כל הכבוד! עלית לרמה ${this.level}!`); // Update status message
    }


    gameOver() {
        this.isPlaying = false; // Stop the game
        clearInterval(this.gameLoop); // Clear the game loop interval
        this.updateStatus('המשחק נגמר! לחץ על התחל כדי לשחק שוב'); // Display game over message in Hebrew
        this.saveBestScore(); // Save the best score to local storage
        this.updateGlobalBestScore(); // Update the global best score display

        const startGameButton = document.getElementById('start-game'); // Get the start game button element
        if (startGameButton) {
            startGameButton.disabled = false; // Enable the start game button for a new game
        }
    }

    // Function to update the user's medal based on their stars - only once
    updateMedal(flag) {

        if (flag === 'True') {

            this.flag='False';
            const currentUser = JSON.parse(localStorage.getItem('currentUser')); // Retrieve the current user's data from local storage
            let medals = 0; // Initialize the medals count

            const users = JSON.parse(localStorage.getItem('gameUsers')) || []; // Retrieve the list of users from local storage
            const userIndex = users.findIndex(user => user.username === currentUser.username); // Find the current user in the users list
            if (userIndex !== -1) {
                medals = users[userIndex].stars + 1; // Increase the medal count by 1

                currentUser.stars = medals; // Update the current user's medal count
                users[userIndex].stars = medals; // Update the medal count in the users list
                localStorage.setItem('gameUsers', JSON.stringify(users)); // Save the updated users list to local storage
                localStorage.setItem('currentUser', JSON.stringify(currentUser)); // Save the updated current user to local storage
            }

            const medalselement = document.getElementById('user-medal'); // Get the medal display element
            if (medalselement) {
                medalselement.textContent = medals; // Update the displayed medal count
            }

            // Update the user's status based on the number of medals
            if (medals === 3) {
                this.updateStatusUser('מיומן'); // Set status to "מיומן" (Skilled) in Hebrew
            }
            if (medals === 6) {
                this.updateStatusUser('מומחה'); // Set status to "מומחה" (Expert) in Hebrew
            }
            if (medals === 9) {
                this.updateStatusUser('אלוף'); // Set status to "אלוף" (Champion) in Hebrew
            }
        }


    }

    // Function to update the user's status
    updateStatusUser(status_) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser')); // Retrieve the current user's data from local storage
        let status = status_; // Set the new status
        const users = JSON.parse(localStorage.getItem('gameUsers')) || []; // Retrieve the list of users from local storage
        const userIndex = users.findIndex(user => user.username === currentUser.username); // Find the current user in the users list
        if (userIndex !== -1) {
            currentUser.userLevel = status; // Update the current user's level
            users[userIndex].userLevel = status; // Update the user's level in the users list
            localStorage.setItem('gameUsers', JSON.stringify(users)); // Save the updated users list to local storage
            localStorage.setItem('currentUser', JSON.stringify(currentUser)); // Save the updated current user to local storage
        }

        const stautselement = document.getElementById('user-rank'); // Get the rank display element
        if (stautselement) {
            stautselement.textContent = status; // Update the displayed user rank
        }
    }

}