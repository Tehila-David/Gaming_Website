// main.js
document.addEventListener('DOMContentLoaded', () => {
    const userManager = new UserManager();

    // טופס התחברות
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const user = userManager.login(username, password);
                window.location.href = 'games.html';
            } catch (error) {
                alert(error.message);
            }
        });
    }

    // טופס הרשמה
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('reg-username').value;
            const password = document.getElementById('reg-password').value;
            const email = document.getElementById('reg-email').value;

            try {
                userManager.registerUser(username, password, email);
                alert('ההרשמה בוצעה בהצלחה!');
                window.location.href = 'login.html';
            } catch (error) {
                alert(error.message);
            }
        });
    }

    // אתחול המשחקים בדף המשחקים
    const gameContainer1 = document.getElementById('game-container-1');
    const gameContainer2 = document.getElementById('game-container-2');

    if (gameContainer1 && gameContainer2) {
        const motionGame = new MotionGame('game-container-1');
        const logicGame = new LogicGame('game-container-2');
        
        motionGame.init();
        logicGame.init();
    }
});