

/**
 * UserManager Class
 * 
 * This class is responsible for managing users, handling registration, login, and logout processes.
 * It uses the browser's localStorage for storing user data and cookies for managing login attempts and user blocking.
 * 
 * The class includes methods for:
 * - Validating user credentials
 * - Managing user sessions
 * - Storing and retrieving user data
 * - Handling login security features such as blocking after multiple failed attempts
 */

class UserManager {
    constructor() {
        // Check and initialize the user array
        if (!localStorage.getItem('gameUsers')) {
            localStorage.setItem('gameUsers', JSON.stringify([{
                username: 'test',
                password: 'test123',
                email: 'test@test.com',
                bestScores: {
                    MoveGame: 0,
                    LogicGame: 0
                },
                stars: 0,
                userLevel: 'מתחיל', // User's level in the game
                lastLogin: new Date().toISOString() // Last login time
            }]));
        }
    }

    // Get all users from local storage
    getUsers() {
        return JSON.parse(localStorage.getItem('gameUsers') || '[]');
    }

    // Save updated users array to local storage
    saveUsers(users) {
        localStorage.setItem('gameUsers', JSON.stringify(users));
    }

    // Validate password length (minimum 6 characters)
    validatePassword(password) {
        if (password.length < 6) {
            throw new Error('הסיסמה חייבת להכיל לפחות 6 תווים'); // Error in Hebrew
        }
    }

    // Validate email format using regex
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('כתובת האימייל אינה תקינה'); // Error in Hebrew
        }
    }

    // Login a user by verifying username and password
    login(username, password) {
        const users = this.getUsers();
        const user = users.find(u => u.username === username);

        // Check block status from cookies (only if the user exists)
        if (user) {
            const blockCookie = getCookie(`${username}_blocked`);
            if (blockCookie) {
                throw new Error('נחסמת עקב מספר ניסיונות כושלים. נסה שוב בעוד 10 דקות.'); // Error in Hebrew
            }
        }

        // If the user does not exist
        if (!user) {
            throw new Error('שם משתמש לא קיים'); // Error in Hebrew
        }

        // Check failed login attempts from cookies
        let attempts = parseInt(getCookie(`${username}_attempts`) || '0', 10);

        if (user.password !== password) {
            // Increment failed attempts in cookies
            attempts += 1;
            setCookie(`${username}_attempts`, attempts, 10); // Cookie valid for 10 minutes

            // Block the user after 4 failed attempts
            if (attempts >= 4) {
                setCookie(`${username}_blocked`, 'true', 10); // Block cookie for 10 minutes
                throw new Error('נחסמת עקב מספר ניסיונות כושלים. נסה שוב בעוד 10 דקות.'); // Error in Hebrew
            }

            // Notify user about the last allowed attempt
            if (attempts === 3) {
                throw new Error('בוצעו מספר ניסיונות כניסה כושלים, נסיון אחרון ברשותך'); // Error in Hebrew
            }

            throw new Error('סיסמה שגויה'); // Error in Hebrew
        }

        // Successful login - reset cookies for attempts and block status
        deleteCookie(`${username}_attempts`);
        deleteCookie(`${username}_blocked`);

        // Update last login time for the user
        user.lastLogin = new Date().toLocaleString();
        this.saveUsers(users);

        // Save the logged-in user to local storage
        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
    }

    // Register a new user with validations
    register(username, password, email) {
        if (!username || !password || !email) {
            throw new Error('כל השדות הם חובה'); // Error in Hebrew
        }

        const users = this.getUsers();

        // Validate username length (minimum 3 characters)
        if (username.length < 3) {
            throw new Error('שם המשתמש חייב להכיל לפחות 3 תווים'); // Error in Hebrew
        }

        this.validatePassword(password);
        this.validateEmail(email);

        // Check if the username already exists
        if (users.some(u => u.username === username)) {
            throw new Error('שם משתמש כבר קיים במערכת'); // Error in Hebrew
        }

        // Check if the email is already registered
        if (users.some(u => u.email === email)) {
            throw new Error('כתובת האימייל כבר רשומה במערכת'); // Error in Hebrew
        }

        // Create a new user object
        const newUser = {
            username,
            password,
            email,
            bestScores: {
                MoveGame: 0,
                LogicGame: 0
            },
            stars: 0,
            userLevel: 'מתחיל', // Initial user level
            registrationDate: new Date().toISOString(), // Registration date
            lastLogin: new Date().toISOString() // Last login time
        };

        // Add the new user to the array and save
        users.push(newUser);
        this.saveUsers(users);

        // Save the logged-in user
        localStorage.setItem('currentUser', JSON.stringify(newUser));

        return newUser;
    }

    // Logout the current user by removing their data from local storage
    logout() {
        localStorage.removeItem('currentUser');
    }

    // Check if a user is currently logged in
    isLoggedIn() {
        return localStorage.getItem('currentUser') !== null;
    }

    // Get the details of the currently logged-in user
    getCurrentUser() {
        return JSON.parse(localStorage.getItem('currentUser'));
    }
}

// Set a cookie with a name, value, and expiration time in minutes
function setCookie(name, value, minutes) {
    const expires = new Date(Date.now() + minutes * 60 * 1000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

// Retrieve a cookie value by its name
function getCookie(name) {
    const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
        const [key, val] = cookie.split('=');
        acc[key] = val;
        return acc;
    }, {});
    return cookies[name] || null;
}

// Delete a cookie by its name
function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}


/**
 * ToastManager Class
 * 
 * Responsible for displaying toast notifications to the user.
 * Notifications can be styled as success or error messages and are automatically dismissed after a given duration.
 */
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