class MotionGame {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.player = null;
        this.obstacles = [];
        this.score = 0;
        this.level = 1;
        this.isGameOver = false;
    }

    init() {
        this.container.innerHTML = `
            <div id="game-area" class="relative h-96 bg-gray-100 overflow-hidden">
                <div id="player" class="absolute w-10 h-10 bg-blue-500"></div>
                <div id="score" class="absolute top-2 right-2">Score: 0</div>
                <div id="level" class="absolute top-2 left-2">Level: 1</div>
            </div>
        `;

        this.player = document.getElementById('player');
        this.setupEventListeners();
        this.startGame();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (this.isGameOver) return;
            
            const pos = this.player.getBoundingClientRect();
            switch(e.key) {
                case 'ArrowUp':
                    if (pos.top > 0) {
                        this.player.style.top = `${pos.top - 10}px`;
                    }
                    break;
                case 'ArrowDown':
                    if (pos.bottom < this.container.clientHeight) {
                        this.player.style.top = `${pos.top + 10}px`;
                    }
                    break;
            }
        });
    }

    startGame() {
        this.gameLoop = setInterval(() => {
            this.update();
        }, 50);
    }

    update() {
        // עדכון מכשולים ובדיקת התנגשויות
        // הוספת ניקוד
        // העלאת רמת קושי
    }
}