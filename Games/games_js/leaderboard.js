document.addEventListener('DOMContentLoaded', () => {

    // Games Page Logic - leaderbord
    if (window.location.pathname.includes('games_html/leaderboard_logicGame.html')) {
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
    const users = JSON.parse(localStorage.getItem('gameUsers')) || [];
    
    // מיון המשתמשים לפי הניקוד
    const sortedUsers = users
        .filter(user => user.bestScores && user.bestScores.LogicGame)
        .sort((a, b) => (b.bestScores.LogicGame || 0) - (a.bestScores.LogicGame || 0));

    // מציאת המיקום של המשתמש הנוכחי
    const currentUserRank = sortedUsers.findIndex(user => user.username === currentUser.username) + 1;

    // עדכון הכיתוב של המיקום הנוכחי
    const currentUserRankElement = document.getElementById('current-user-rank');
    if (currentUserRank > 0) {
        currentUserRankElement.textContent = `המיקום שלך: ${currentUserRank}`;
    } else {
        currentUserRankElement.textContent = 'טרם השגת ניקוד במשחק זה';
    }

    // הצגת הדירוג בטבלה
    const rankingsBody = document.getElementById('rankings-body');
    
    sortedUsers.forEach((user, index) => {
        const row = document.createElement('tr');
        if (user.username === currentUser.username) {
            row.classList.add('current-user-row');
        }

        // עמודת דירוג עם מדליות
        const rankCell = document.createElement('td');
        if (index === 0) {
            rankCell.innerHTML = '<i class="fas fa-medal medal gold"></i>' + (index + 1);
        } else if (index === 1) {
            rankCell.innerHTML = '<i class="fas fa-medal medal silver"></i>' + (index + 1);
        } else if (index === 2) {
            rankCell.innerHTML = '<i class="fas fa-medal medal bronze"></i>' + (index + 1);
        } else {
            rankCell.textContent = index + 1;
        }

        const usernameCell = document.createElement('td');
        usernameCell.textContent = user.username;

        const scoreCell = document.createElement('td');
        scoreCell.textContent = user.bestScores.LogicGame;

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