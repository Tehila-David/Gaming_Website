document.addEventListener('DOMContentLoaded', () => {
    // Logic specific to the MoveGame.html page
    if (window.location.pathname.includes('games_html/MoveGame.html')) {
        let userManager;

        // Attempt to initialize UserManager
        try {
            userManager = new UserManager();
        } catch (error) {
            console.error('UserManager is not defined or already declared:', error);
            return; // Stop further execution if UserManager fails to initialize
        }

        // Retrieve the current user and update their displayed username
        const user = userManager.getCurrentUser();
        const usernameDisplay = document.getElementById('username-display');
        if (usernameDisplay) {
            usernameDisplay.textContent = user.username; // Display the current username on the page
        }

        // Initialize variables for medals and user status
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let medals = 0; // Default medal count
        let status = 'מתחיל'; // Default status (Beginner)

        // Retrieve the list of game users from localStorage
        const users = JSON.parse(localStorage.getItem('gameUsers')) || [];

        // Find the index of the current user in the users list
        const userIndex = users.findIndex(user => user.username === currentUser.username);
        if (userIndex !== -1) {
            medals = users[userIndex].stars; // Get the user's current medal count
            status = users[userIndex].userLevel; // Get the user's current status
            
            // Update currentUser object with latest medal count and status
            currentUser.stars = medals;
            currentUser.userLevel = status;
            localStorage.setItem('currentUser', JSON.stringify(currentUser)); // Save updated currentUser to localStorage
        }

        // Display the user's medal count on the page
        const medalselement = document.getElementById('user-medal');
        if (medalselement) {
            medalselement.textContent = medals;
        }

        // Display the user's status on the page
        const stautselement = document.getElementById('user-rank');
        if (stautselement) {
            stautselement.textContent = status;
        }

        // Initialize the BubbleGame and handle errors during initialization
        try {
            const game = new BubbleGame('game-board');
            game.init(); // Start the game
        } catch (error) {
            console.error('Error initializing BubbleGame:', error);
        }

        // Add event listener to the element with class 'best-score-Users'
        // Redirects to the leaderboard page when clicked
        document.querySelector('.best-score-Users').addEventListener('click', function () {
            window.location.href = 'leaderboard_moveGame.html'; // Navigate to the leaderboard page
        });

        // Attempt to set up the logout button functionality
        try {
            const logoutButton = document.getElementById('logout');
            if (logoutButton) {
                logoutButton.addEventListener('click', () => {
                    ToastManager.show('מבוצעת יציאה', 'success'); // Show logout success message
                    setTimeout(() => {
                        // Redirect to the main game board after a short delay
                        window.location.href = '../../Main/main_html/game_board.html';
                    }, 1000);
                });
            }
        } catch (error) {
            // Display error message if there is an issue with the logout functionality
            ToastManager.show(error.message, 'error');
        }
    }
});
