
class BubbleGame {
    
    constructor(containerId) {
        this.gameBoard = document.getElementById(containerId);
        this.score = 0;
        this.bestScore = 0;
        this.isPlaying = false;
        this.level = 1;
        this.bubbles = [];
        this.gameLoop = null;
        this.maxBubbles = 5;
        this.bubbleSpeed = 2;
        this.missedBubbles = 0; // ספירת בועות שלא פוצצו
        this.maxMissedBubbles = 5; // מספר פסילות מותר
    }
    

    init() {
        this.loadBestScore();
        this.updateScore();
        this.updateLevel();
        this.setupEventListeners();
        this.updateStatus('לחץ על התחל כדי להתחיל במשחק');
    }

    loadBestScore() {
        const saved = localStorage.getItem('bubbleGameBestScore');
        this.bestScore = saved ? parseInt(saved) : 0;
        const bestScoreElement = document.getElementById('best-score');
        if (bestScoreElement) {
            bestScoreElement.textContent = this.bestScore;
        }
    }

    saveBestScore() {
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('bubbleGameBestScore', this.score);
            const bestScoreElement = document.getElementById('best-score');
            if (bestScoreElement) {
                bestScoreElement.textContent = this.bestScore;
            }
        }
    }

    updateScore() {
        const scoreElement = document.getElementById('score');
        if (scoreElement) {
            scoreElement.textContent = this.score;
        }
    }

    updateLevel() {
        const levelElement = document.getElementById('level');
        if (levelElement) {
            levelElement.textContent = this.level;
        }
    }

    updateStatus(message) {
        const statusElement = document.getElementById('status-message');
        if (statusElement) {
            statusElement.textContent = message;
        }
    }

    getRandomIcon() {
        const icons = [
            'fas fa-music',     // תו מוזיקלי כללי
            'fas fa-guitar',    // גיטרה
            'fas fa-drum',      // תוף
            'fas fa-microphone',// מיקרופון
            'fas fa-headphones',// אוזניות
            'fas fa-record-vinyl' // תקליט ויניל
        ];
        return icons[Math.floor(Math.random() * icons.length)];
    }

    setupEventListeners() {
        const startButton = document.getElementById('start-game');
        if (startButton) {
            startButton.addEventListener('click', () => {
                // להפוך את הכפתור ללא זמין
                startButton.disabled = true;
    
                // לשנות את סגנון הכפתור (אם יש צורך בהתאמות ויזואליות נוספות)
                //startButton.classList.add('disabled');
    
                // להתחיל את המשחק
                this.startGame();
            });
        }
    }

    createBubble() {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        
        // הגדרת צבע רנדומלי לבועה
        const randomColor = this.getRandomColor();
        bubble.style.background = `radial-gradient(circle, ${randomColor}, #000)`;
    
        // המשך קוד יצירת הבועה
        const size = 50;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
    
        const startX = Math.random() * (this.gameBoard.offsetWidth - size);
        bubble.style.left = `${startX}px`;
        bubble.style.top = `${this.gameBoard.offsetHeight}px`;
    
        const icon = document.createElement('i');
        icon.className = this.getRandomIcon();
        bubble.appendChild(icon);
    
        this.gameBoard.appendChild(bubble);
    
        const bubbleObj = {
            element: bubble,
            speed: this.bubbleSpeed * (Math.random() * 0.5 + 0.75),
            points: Math.floor((60 - size) / 2) + 10
        };
    
        bubble.addEventListener('click', () => {
            if (this.isPlaying) {
                this.popBubble(bubbleObj);
            }
        });
    
        this.bubbles.push(bubbleObj);
    }

    getRandomColor() {
        const colors = [
            '#FF5733', // אדום-כתום
            '#33FF57', // ירוק-בהיר
            '#3357FF', // כחול
            '#FFC300', // צהוב
            '#FF33A1', // ורוד
            '#8E44AD', // סגול כהה
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    

    updateBubbles() {
        for (let i = this.bubbles.length - 1; i >= 0; i--) {
            const bubble = this.bubbles[i];
            const currentTop = parseFloat(bubble.element.style.top) || this.gameBoard.offsetHeight;
            const newTop = currentTop - bubble.speed;
            bubble.element.style.top = `${newTop}px`;
    
            if (newTop < -100) { // אם הבועה עברה את המסך
                if (bubble.element.parentNode) {
                    bubble.element.parentNode.removeChild(bubble.element);
                }
                this.bubbles.splice(i, 1);
                this.missedBubbles++; // עדכון כמות הבועות שלא פוצצו
                this.checkGameOver(); // בדיקה אם נגמר המשחק
            }
        }
    }
    
    checkGameOver() {
        if (this.bubbles.length >= this.maxBubbles || this.missedBubbles >= this.maxMissedBubbles) {
            this.gameOver();
        }
    }

    startGame() {
        clearInterval(this.gameLoop); // עצור לולאות קודמות
        this.gameBoard.innerHTML = '';
        this.bubbles = [];
        
        this.score = 0;
        this.level = 1;
        this.isPlaying = true;
        this.maxBubbles = 5; // מספר התחלתי קטן של בועות
        this.bubbleSpeed = 2;
        this.missedBubbles = 0; // איפוס פסילות
        
        this.updateStatus('המשחק התחיל! לחץ על הבועות');
        this.updateScore();
        this.updateLevel();
        
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
        }
        
        // הגדלת תדירות יצירת הבועות
        this.gameLoop = setInterval(() => {
            if (this.isPlaying) {
                this.updateBubbles();
                // הגדלת הסיכוי ליצירת בועה
                if (Math.random() < 0.2 && this.bubbles.length < this.maxBubbles) {
                    this.createBubble();
                }
            }
        }, 50);
    }
    

    popBubble(bubble) {
        if (!bubble.element.classList.contains('popped')) {
            bubble.element.classList.add('popped');
            bubble.element.style.animation = 'explode 0.5s ease-out'; // אפקט פיצוץ
            this.score += bubble.points * this.level;
            this.updateScore();
            this.saveBestScore();

            setTimeout(() => {
                if (bubble.element.parentNode) {
                    bubble.element.parentNode.removeChild(bubble.element);
                }
                const index = this.bubbles.indexOf(bubble);
                if (index > -1) {
                    this.bubbles.splice(index, 1);
                }
            }, 300);

            if (this.score >= this.level * 100) {
                this.levelUp();
            }
        }
    }

    
    levelUp() {
        this.level++;
        this.updateLevel();
        this.maxBubbles = Math.min(this.maxBubbles + 2, 15);
        this.bubbleSpeed += 0.5;
        this.updateStatus(`כל הכבוד! עלית לרמה ${this.level}!`);
    }

    checkGameOver() {
        if (this.bubbles.length >= this.maxBubbles || this.missedBubbles >= this.maxMissedBubbles) {
            this.gameOver();
        }
    }
    

    gameOver() {
        this.isPlaying = false;
        clearInterval(this.gameLoop);
        this.updateStatus('המשחק נגמר! לחץ על התחל כדי לשחק שוב');
        this.saveBestScore();

        const startGameButton = document.getElementById('start-game');
        if (startGameButton) {
            startGameButton.disabled = false;
        }
    }
}