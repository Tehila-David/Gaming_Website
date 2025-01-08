document.addEventListener('DOMContentLoaded', () => {
    // Games Page Logic
    if (window.location.pathname.includes('games_html/MoveGame.html')) {
        let userManager;
        try {
            userManager = new UserManager();
        } catch (error) {
            console.error('UserManager is not defined or already declared:', error);
            return;
        }

        const user = userManager.getCurrentUser();
        const usernameDisplay = document.getElementById('username-display');
        if (usernameDisplay) {
            usernameDisplay.textContent = user.username;
        }
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let medals = 0;
        let status = 0;
        const users = JSON.parse(localStorage.getItem('gameUsers')) || [];
        const userIndex = users.findIndex(user => user.username === currentUser.username);
        if (userIndex !== -1) {
            medals = users[userIndex].stars;
            status = users[userIndex].userLevel;
            currentUser.stars = medals;
            currentUser.userLevel = status;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }

        const medalselement = document.getElementById('user-medal');
        if (medalselement) {
            medalselement.textContent = medals;
        }
        const stautselement = document.getElementById('user-rank');
        if (stautselement) {
            stautselement.textContent = medals;
        }

        try {
            const game = new BubbleGame('game-board');
            game.init();
        } catch (error) {
            console.error('Error initializing BubbleGame:', error);
        }

        try {
            // Logout Button
            const logoutButton = document.getElementById('logout');
            if (logoutButton) {
                logoutButton.addEventListener('click', () => {
                    ToastManager.show('מבוצעת יציאה', 'success');
                    setTimeout(() => {
                        window.location.href = '../../Main/main_html/game_board.html';
                    }, 1000);
                });
            }
        } catch (error) {
            ToastManager.show(error.message, 'error');
        }
    }
});