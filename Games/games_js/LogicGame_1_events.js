document.addEventListener('DOMContentLoaded', () => {

    // Check if the current page is 'LogicGame_1.html'
    if (window.location.pathname.includes('games_html/LogicGame_1.html')) {
        let userManager;
        try {
            // Create an instance of UserManager class
            userManager = new UserManager();
        } catch (error) {
            // Log an error if UserManager is not defined or already declared
            console.error('UserManager is not defined or already declared:', error);
            return;
        }

        // Retrieve the current user
        const user = userManager.getCurrentUser();
        const usernameDisplay = document.getElementById('username-display');

        // Display the username of the current user
        if (usernameDisplay) {
            usernameDisplay.textContent = user.username;
        }

        // Retrieve current user data from localStorage
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let medals = 0;
        let status = 'מתחיל'; // Default status is 'Beginner'

        // Retrieve all users from localStorage
        const users = JSON.parse(localStorage.getItem('gameUsers')) || [];

        // Find the current user in the users list
        const userIndex = users.findIndex(user => user.username === currentUser.username);
        if (userIndex !== -1) {
            medals = users[userIndex].stars;  // Get user's stars (medals)
            status = users[userIndex].userLevel;  // Get user's level (status)
            currentUser.stars = medals;
            currentUser.userLevel = status;
            localStorage.setItem('currentUser', JSON.stringify(currentUser)); // Save updated user data to localStorage
        }

        // Update the medal display
        const medalselement = document.getElementById('user-medal');
        if (medalselement) {
            medalselement.textContent = medals;
        }

        // Update the user status display
        const stautselement = document.getElementById('user-rank');
        if (stautselement) {
            stautselement.textContent = status;
        }

        try {
            // Initialize the PianoGame instance and set it up
            const game = new PianoGame('game-board');
            game.init();
        } catch (error) {
            // Log an error if the game initialization fails
            console.error('Error initializing LogicGame:', error);
        }

        // Add event listener to 'best-score-Users' to redirect to leaderboard page
        document.querySelector('.best-score-Users').addEventListener('click', function () {
            window.location.href = 'leaderboard_logicGame.html';
        });

        try {
            // Add event listener for logout button
            const logoutButton = document.getElementById('logout');
            if (logoutButton) {
                logoutButton.addEventListener('click', () => {
                    ToastManager.show('מבוצעת יציאה', 'success');  // Show a success toast for logging out
                    setTimeout(() => {
                        window.location.href = '../../Main/main_html/game_board.html'; // Redirect to game board page after 1 second
                    }, 1000);
                });
            }
        } catch (error) {
            // Show an error toast if an issue occurs with the logout functionality
            ToastManager.show(error.message, 'error');
        }

    }

});
