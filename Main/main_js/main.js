// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    let userManager;

    // Initialize UserManager and handle errors if it fails
    try {
        userManager = new UserManager();
    } catch (error) {
        console.error('UserManager is not defined or already declared:', error);
        return;
    }

    
    /**
     * Handle Login Form submission.
     * Retrieves user input (username and password), attempts to log in using UserManager,
     * displays a success or error message, and redirects to the game board upon success.
     */
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            try {
                // Retrieve username and password inputs
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;

                // Attempt login using UserManager
                const user = userManager.login(username, password);

                // Show success toast with the last login date
                ToastManager.show(`התחברת בהצלחה!<br>התחברת לאחרונה: ${user["lastLogin"]}`, 'success');

                // Redirect to the game board after a short delay
                setTimeout(() => {
                    window.location.href = '../main_html/game_board.html';
                }, 1000);
            } catch (error) {
                // Show error toast in case of login failure
                ToastManager.show(error.message, 'error');
            }
        });
    }

    /**
     * Handle Register Form submission.
     * Retrieves user input (username, password, and email), attempts to register using UserManager,
     * displays a success or error message, and redirects to the game board upon success.
     */
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            try {
                // Retrieve registration inputs
                const username = document.getElementById('reg-username').value;
                const password = document.getElementById('reg-password').value;
                const email = document.getElementById('reg-email').value;

                // Attempt registration using UserManager
                const user = userManager.register(username, password, email);

                // Show success toast
                ToastManager.show('ההרשמה בוצעה בהצלחה!', 'success');

                // Redirect to the game board after a short delay
                setTimeout(() => {
                    window.location.href = 'game_board.html';
                }, 1000);
            } catch (error) {
                // Show error toast in case of registration failure
                ToastManager.show(error.message, 'error');
            }
        });
    }

      /**
     * Game Board Logic:
     *  - Redirects unauthorized users to the login page.
     *  - Displays the current user's details (username, medals, and status).
     *  - Adds event listeners to game cards for redirection to individual games.
     *  - Handles logout functionality.
     */
    if (window.location.pathname.includes('main_html/game_board.html')) {
        // Redirect to login page if the user is not logged in
        if (!userManager.isLoggedIn()) {
            window.location.href = 'index.html';
        } else {
            // Retrieve and display the logged-in user's information
            const user = userManager.getCurrentUser();
            const usernameDisplay = document.getElementById('username-display');
            if (usernameDisplay) {
                usernameDisplay.textContent = user.username;
            }

            // Retrieve medals and status for the current user
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            let medals = 0;
            let status = 'מתחיל'; // Default status
            const users = JSON.parse(localStorage.getItem('gameUsers')) || [];
            const userIndex = users.findIndex(user => user.username === currentUser.username);
            if (userIndex !== -1) {
                medals = users[userIndex].stars; // Retrieve stars count
                status = users[userIndex].userLevel; // Retrieve user level
                currentUser.stars = medals;
                currentUser.userLevel = status;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }

            // Update medal and status displays on the UI
            const medalselement = document.getElementById('user-medal');
            if (medalselement) {
                medalselement.textContent = medals;
            }
            const stautselement = document.getElementById('user-rank');
            if (stautselement) {
                stautselement.textContent = status;
            }

              /**
             * Add event listeners to game cards.
             * Redirects to the respective game pages when the "Play Now" button is clicked.
             */
            const moveGameCard = document.querySelector('.game-card.move');
            if (moveGameCard) {
                const playButton = moveGameCard.querySelector('.btn-play');
                if (playButton) {
                    playButton.addEventListener('click', () => {
                        console.log('Button clicked for Move Game, redirecting...');
                        window.location.href = '../../Games/games_html/MoveGame.html'; // Redirect to Move Game
                    });
                } else {
                    console.error('Play button not found in Move Game Card.');
                }
            }

            // Handle game selection for Logic Game
            const logicGameCard = document.querySelector('.game-card.logic');
            if (logicGameCard) {
                const playButton = logicGameCard.querySelector('.btn-play');
                if (playButton) {
                    playButton.addEventListener('click', () => {
                        console.log('Button clicked for Logic Game, redirecting...');
                        window.location.href = '../../Games/games_html/LogicGame_1.html'; // Redirect to Logic Game
                    });
                } else {
                    console.error('Play button not found in Logic Game Card.');
                }
            }

              /**
             * Handle Logout functionality.
             * Logs out the user, displays a toast message, and redirects to the login page.
             */
            const logoutButton = document.getElementById('logout');
            if (logoutButton) {
                logoutButton.addEventListener('click', () => {
                    // Show logout toast message
                    ToastManager.show('התנתקות מהחשבון', 'success');

                    // Log the user out and redirect to the login page
                    userManager.logout();
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1000);
                });
            }
        }
    }
});
