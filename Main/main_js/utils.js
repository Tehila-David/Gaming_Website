
class UserManager {
    constructor() {
        // בדיקה והתחלה של מערך המשתמשים
        if (!localStorage.getItem('gameUsers')) {
            localStorage.setItem('gameUsers', JSON.stringify([{
                username: 'test',
                password: 'test123',
                email: 'test@test.com',
                bestScores: {
                    MoveGame: 0,
                    LogicGame: 0
                },
                stars:0,
                userLevel: 'מתחיל',
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

    // login(username, password) {
    //     const users = this.getUsers();
    //     const user = users.find(u => u.username === username);

    //     if (!user) {
    //         throw new Error('שם משתמש לא קיים');
    //     }

    //     if (user.password !== password) {
    //         throw new Error('סיסמה שגויה');
    //     }

    //     // עדכון זמן התחברות אחרון
    //     user.lastLogin = new Date().toLocaleString();
    //     this.saveUsers(users);

    //     // שמירת המשתמש המחובר
    //     localStorage.setItem('currentUser', JSON.stringify(user));
    //     return user;
    // }

    login(username, password) {
        const users = this.getUsers();
        const user = users.find(u => u.username === username);
    
        // בדיקת מצב חסימה מה-Cookie (רק אם המשתמש קיים)
        if (user) {
            const blockCookie = getCookie(`${username}_blocked`);
            if (blockCookie) {
                throw new Error('נחסמת עקב מספר ניסיונות כושלים. נסה שוב בעוד 10 דקות.');
            }
        }
    
        // אם המשתמש לא קיים
        if (!user) {
            throw new Error('שם משתמש לא קיים');
        }
    
        // בדיקת מספר ניסיונות כושלים מה-Cookie (רק אם המשתמש קיים)
        let attempts = parseInt(getCookie(`${username}_attempts`) || '0', 10);
    
        if (user.password !== password) {
            // עדכון מספר הניסיונות ב-Cookie
            attempts += 1;
            setCookie(`${username}_attempts`, attempts, 10); // Cookie בתוקף ל-10 דקות
    
            // חסימת המשתמש לאחר 4 ניסיונות כושלים
            if (attempts >= 4) {
                setCookie(`${username}_blocked`, 'true', 10); // Cookie חסימה למשך 10 דקות
                throw new Error('נחסמת עקב מספר ניסיונות כושלים. נסה שוב בעוד 10 דקות.');
            }
    
            // הודעה על ניסיון אחרון אם זה הניסיון השלישי
            if (attempts === 3) {
                throw new Error('בוצעו מספר ניסיונות כניסה כושלים, נסיון אחרון ברשותך');
            }
    
            throw new Error('סיסמה שגויה');
        }
    
        // כניסה מוצלחת - איפוס Cookies
        deleteCookie(`${username}_attempts`);
        deleteCookie(`${username}_blocked`);
    
        // עדכון זמן התחברות אחרון
        user.lastLogin = new Date().toLocaleString();
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
            bestScores: {
                MoveGame :0,
                LogicGame:0
            },
            stars:0,
            userLevel: 'מתחיל',
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

function setCookie(name, value, minutes) {
    const expires = new Date(Date.now() + minutes * 60 * 1000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

function getCookie(name) {
    const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
        const [key, val] = cookie.split('=');
        acc[key] = val;
        return acc;
    }, {});
    return cookies[name] || null;
}

function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
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
            setTimeout(() => toast.remove(), 600);
        }, duration);
    }
}