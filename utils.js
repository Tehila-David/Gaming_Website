class UserManager {
    constructor() {
        // יצירת משתמש ראשון לדוגמה אם אין משתמשים במערכת
        const users = localStorage.getItem('gameUsers');
        if (!users) {
            localStorage.setItem('gameUsers', JSON.stringify([{
                username: 'test',
                password: 'test123',
                email: 'test@test.com',
                scores: { game1: [], game2: [] }
            }]));
        }
    }

    getUsers() {
        return JSON.parse(localStorage.getItem('gameUsers') || '[]');
    }

    saveUsers(users) {
        localStorage.setItem('gameUsers', JSON.stringify(users));
    }

    login(username, password) {
        const users = this.getUsers();
        const user = users.find(u => u.username === username);

        if (!user) {
            throw new Error('שם משתמש לא קיים');
        }

        if (user.password !== password) {
            throw new Error('סיסמה שגויה');
        }

        // שמירת המשתמש המחובר
        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
    }

    register(username, password, email) {
        const users = this.getUsers();
        
        // בדיקה אם המשתמש כבר קיים
        if (users.some(u => u.username === username)) {
            throw new Error('שם משתמש כבר קיים במערכת');
        }

        // יצירת משתמש חדש
        const newUser = {
            username,
            password,
            email,
            scores: {
                game1: [],
                game2: []
            }
        };

        users.push(newUser);
        this.saveUsers(users);
        return newUser;
    }
}

// main.js
document.addEventListener('DOMContentLoaded', () => {
    const userManager = new UserManager();

    // טיפול בטופס התחברות
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            try {
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
                
                const user = userManager.login(username, password);
                
                // הצגת הודעת הצלחה
                showToast('התחברת בהצלחה!', 'success');
                
                // הפניה לדף המשחקים
                setTimeout(() => {
                    window.location.href = 'games.html';
                }, 1000);
            } catch (error) {
                showToast(error.message, 'error');
            }
        });
    }

    // טיפול בטופס הרשמה
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            try {
                const username = document.getElementById('reg-username').value;
                const password = document.getElementById('reg-password').value;
                const email = document.getElementById('reg-email').value;
                
                userManager.register(username, password, email);
                
                // הצגת הודעת הצלחה
                showToast('ההרשמה בוצעה בהצלחה!', 'success');
                
                // הפניה לדף ההתחברות
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } catch (error) {
                showToast(error.message, 'error');
            }
        });
    }

    // פונקציה להצגת הודעות toast
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type} show`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // בדיקה אם המשתמש מחובר בדף המשחקים
    if (window.location.pathname.includes('games.html')) {
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) {
            window.location.href = 'index.html';
        } else {
            // עדכון פרטי המשתמש בממשק
            const user = JSON.parse(currentUser);
            if (document.getElementById('username-display')) {
                document.getElementById('username-display').textContent = user.username;
            }
        }
    }
});