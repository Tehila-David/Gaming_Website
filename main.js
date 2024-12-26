class UserManager {
    constructor() {
        // בדיקה והתחלה של מערך המשתמשים
        if (!localStorage.getItem('gameUsers')) {
            localStorage.setItem('gameUsers', JSON.stringify([{
                username: 'test',
                password: 'test123',
                email: 'test@test.com',
                scores: { game1: [], game2: [] },
                lastLogin: new Date().toISOString()
            }]));
        }
    }

    getUsers() {
        return JSON.parse(localStorage.getItem('gameUsers') || '[]');
    }

    saveUsers(users) {
        localStorage.setItem('gameUsers', JSON.stringify(users));
    }

    validatePassword(password) {
        // בדיקת תקינות הסיסמה
        if (password.length < 6) {
            throw new Error('הסיסמה חייבת להכיל לפחות 6 תווים');
        }
    }

    validateEmail(email) {
        // בדיקת תקינות האימייל
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('כתובת האימייל אינה תקינה');
        }
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

        // עדכון זמן התחברות אחרון
        user.lastLogin = new Date().toISOString();
        this.saveUsers(users);

        // שמירת המשתמש המחובר
        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
    }

    register(username, password, email) {
        if (!username || !password || !email) {
            throw new Error('כל השדות הם חובה');
        }

        const users = this.getUsers();
        
        // בדיקות תקינות
        if (username.length < 3) {
            throw new Error('שם המשתמש חייב להכיל לפחות 3 תווים');
        }

        this.validatePassword(password);
        this.validateEmail(email);

        // בדיקה אם המשתמש כבר קיים
        if (users.some(u => u.username === username)) {
            throw new Error('שם משתמש כבר קיים במערכת');
        }

        if (users.some(u => u.email === email)) {
            throw new Error('כתובת האימייל כבר רשומה במערכת');
        }

        // יצירת משתמש חדש
        const newUser = {
            username,
            password,
            email,
            scores: {
                game1: [],
                game2: []
            },
            registrationDate: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        };

        users.push(newUser);
        this.saveUsers(users);
        
        // שמירת המשתמש המחובר
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        return newUser;
    }

    logout() {
        localStorage.removeItem('currentUser');
    }

    isLoggedIn() {
        return localStorage.getItem('currentUser') !== null;
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('currentUser'));
    }
}

// ניהול הודעות Toast
class ToastManager {
    static show(message, type = 'success', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type} show`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const userManager = new UserManager();

    // טיפול בטופס התחברות
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
                    window.location.href = 'games.html';
                }, 1000);
            } catch (error) {
                ToastManager.show(error.message, 'error');
            }
        });
    }

    // טיפול בטופס הרשמה
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
                
                // הפניה לדף המשחקים לאחר הרשמה מוצלחת
                setTimeout(() => {
                    window.location.href = 'games.html';
                }, 1000);
            } catch (error) {
                ToastManager.show(error.message, 'error');
            }
        });
    }

    // בדיקת התחברות בדף המשחקים
    if (window.location.pathname.includes('games.html')) {
        if (!userManager.isLoggedIn()) {
            window.location.href = 'index.html';
        } else {
            const user = userManager.getCurrentUser();
            if (document.getElementById('username-display')) {
                document.getElementById('username-display').textContent = user.username;
            }
        }
    }
});