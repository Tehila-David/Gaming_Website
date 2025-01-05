document.addEventListener('DOMContentLoaded', () => {

    // Games Page Logic
    if (window.location.pathname.includes('games_html/LogicGame_1.html')) {
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
        try {
            const game = new PianoGame('game-board');
            game.init();
        } catch (error) {
            console.error('Error initializing LogicGame:', error);
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
