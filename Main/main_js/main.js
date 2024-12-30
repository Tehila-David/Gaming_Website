

// ניהול הודעות Toast
// class ToastManager {
//     static show(message, type = 'success', duration = 3000) {
//         const toast = document.createElement('div');
//         toast.className = `toast ${type} show`;
//         toast.innerHTML = `
//             <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
//             <span>${message}</span>
//         `;
        
//         document.body.appendChild(toast);
        
//         setTimeout(() => {
//             toast.classList.remove('show');
//             setTimeout(() => toast.remove(), 300);
//         }, duration);
//     }
// }



// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    let userManager;

    try {
        userManager = new UserManager();
    } catch (error) {
        console.error('UserManager is not defined or already declared:', error);
        return;
    }

    // Handle Login Form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            try {
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;

                const user = userManager.login(username, password);
                ToastManager.show('התחברת בהצלחה!', 'success');

                setTimeout(() => {
                    window.location.href = '../main_html/game_board.html';
                }, 1000);
            } catch (error) {
                ToastManager.show(error.message, 'error');
            }
        });
    }

    // Handle Register Form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            try {
                const username = document.getElementById('reg-username').value;
                const password = document.getElementById('reg-password').value;
                const email = document.getElementById('reg-email').value;

                const user = userManager.register(username, password, email);
                ToastManager.show('ההרשמה בוצעה בהצלחה!', 'success');

                setTimeout(() => {
                    window.location.href = 'game_board.html';
                }, 1000);
            } catch (error) {
                ToastManager.show(error.message, 'error');
            }
        });
    }

    // Games Page Logic
    if (window.location.pathname.includes('main_html/game_board.html')) {
        if (!userManager.isLoggedIn()) {
            window.location.href = 'index.html';
        } else {
            const user = userManager.getCurrentUser();
            const usernameDisplay = document.getElementById('username-display');
            if (usernameDisplay) {
                usernameDisplay.textContent = user.username;
            }

            // const activeGameCard = document.querySelector('.game-card.active');
            // if (activeGameCard) {
            //     const playButton = activeGameCard.querySelector('.btn-play');
            //     if (playButton) {
            //         playButton.addEventListener('click', () => {
            //             console.log('Button clicked, redirecting to game2.html');
            //             window.location.href = 'game2.html';
            //         });
            //     } else {
            //         console.error('Play button not found in active game card.');
            //     }
            // } else {
            //     console.error('Active game card not found.');
            // }


            // בחירת כרטיסי המשחק
            const moveGameCard = document.querySelector('.game-card.move');
            const logicGameCard = document.querySelector('.game-card.logic');
            
            // מאזין לכפתור "שחק עכשיו" במשחק תנועה
            if (moveGameCard) {
                const playButton = moveGameCard.querySelector('.btn-play');
                if (playButton) {
                    playButton.addEventListener('click', () => {
                        console.log('Button clicked for Move Game, redirecting...');
                        window.location.href = '../../Games/games_html/MoveGame.html'; // הפנייה למשחק תנועה
                    });
                } else {
                    console.error('Play button not found in Move Game Card.');
                }
            }
            
            // מאזין לכפתור "שחק עכשיו" במשחק לוגי
            if (logicGameCard) {
                const playButton = logicGameCard.querySelector('.btn-play');
                if (playButton) {
                    playButton.addEventListener('click', () => {
                        console.log('Button clicked for Logic Game, redirecting...');
                        window.location.href = '../../Games/games_html/LogicGame.html'; // הפנייה למשחק לוגי
                    });
                } else {
                    console.error('Play button not found in Logic Game Card.');
                }
            }

            // Logout Button
            const logoutButton = document.getElementById('logout');
            if (logoutButton) {
                logoutButton.addEventListener('click', () => {
                ToastManager.show('התנתקות מהחשבון', 'success');
                userManager.logout();
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);

                // logoutButton.addEventListener('click', () => {
                //     userManager.logout();
                //     window.location.href = 'index.html';
                // });
            });}
        }
    }

    // // Game2 Page Logic
    // if (window.location.pathname.includes('Games/games_html/LogicGame.html')) {
    //     if (!userManager.isLoggedIn()) {
    //         window.location.href = 'Main/main_html/index.html';
    //     } else {
    //         try {
    //             const game = new LogicGame('game-board');
    //             game.init();
    //         } catch (error) {
    //             console.error('Error initializing LogicGame:', error);
    //         }
    //     }
    // }
});
