document.addEventListener('DOMContentLoaded', () => {

    // Games Page Logic - leaderboard
    if (window.location.pathname.includes('games_html/leaderboard_logicGame.html')) {

        let userManager;
        try {
            // Initialize UserManager instance to manage user data
            userManager = new UserManager();
        } catch (error) {
            // Handle error if UserManager is not defined or already declared
            console.error('UserManager is not defined or already declared:', error);
            return;
        }

        const user = userManager.getCurrentUser(); // Get the current logged-in user
        const usernameDisplay = document.getElementById('username-display');
        if (usernameDisplay) {
            // Display the username of the current user
            usernameDisplay.textContent = user.username;
        }

        const currentUser = JSON.parse(localStorage.getItem('currentUser')); // Get the current user from localStorage
        const users = JSON.parse(localStorage.getItem('gameUsers')) || []; // Retrieve all game users from localStorage or an empty array if not found
        // Initialize variables for medals and user status
      
        let medals = 0; // Default medal count
        let status = 'מתחיל'; // Default status (Beginner)

    
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
        
        // Sort users by their LogicGame best score in descending order
        const sortedUsers = users
            .filter(user => user.bestScores && user.bestScores.LogicGame) // Filter users with valid bestScores.LogicGame
            .sort((a, b) => (b.bestScores.LogicGame || 0) - (a.bestScores.LogicGame || 0)); // Sort by score in descending order

        // Find the current user's rank in the leaderboard
        const currentUserRank = sortedUsers.findIndex(user => user.username === currentUser.username) + 1;

        // Update the text content to show the current user's rank
        const currentUserRankElement = document.getElementById('current-user-rank');
        if (currentUserRank > 0) {
            currentUserRankElement.textContent = `המיקום שלך: ${currentUserRank}`; // Display rank if found
        } else {
            currentUserRankElement.textContent = 'טרם השגת ניקוד במשחק זה'; // If no score found for the current user
        }

        // Display the leaderboard in a table
        const rankingsBody = document.getElementById('rankings-body');

        sortedUsers.forEach((user, index) => {
            const row = document.createElement('tr'); // Create a new table row for each user
            if (user.username === currentUser.username) {
                row.classList.add('current-user-row'); // Add special styling for the current user row
            }

            // Create and populate the rank cell with medal icons for the top 3 users
            const rankCell = document.createElement('td');
            if (index === 0) {
                rankCell.innerHTML = '<i class="fas fa-medal medal gold"></i>' + (index + 1); // Gold medal for 1st place
            } else if (index === 1) {
                rankCell.innerHTML = '<i class="fas fa-medal medal silver"></i>' + (index + 1); // Silver medal for 2nd place
            } else if (index === 2) {
                rankCell.innerHTML = '<i class="fas fa-medal medal bronze"></i>' + (index + 1); // Bronze medal for 3rd place
            } else {
                rankCell.textContent = index + 1; // For other ranks, just display the rank number
            }

            // Create and populate the username cell with the user's username
            const usernameCell = document.createElement('td');
            usernameCell.textContent = user.username;

            // Create and populate the score cell with the user's best score in LogicGame
            const scoreCell = document.createElement('td');
            scoreCell.textContent = user.bestScores.LogicGame;

            // Append the cells to the row and the row to the rankings body
            row.appendChild(rankCell);
            row.appendChild(usernameCell);
            row.appendChild(scoreCell);
            rankingsBody.appendChild(row);
        });

        try {
            // Logout Button
            const logoutButton = document.getElementById('logout');
            if (logoutButton) {
                logoutButton.addEventListener('click', () => {
                    // Show success toast when logout is initiated
                    ToastManager.show('Logging out', 'success');
                    setTimeout(() => {
                        // Redirect to the main game board page after 1 second
                        window.location.href = '../../Main/main_html/game_board.html';
                    }, 1000);
                });
            }

        } catch (error) {
            // Show error toast if any error occurs during the logout setup
            ToastManager.show(error.message, 'error');
        }

    }

});
