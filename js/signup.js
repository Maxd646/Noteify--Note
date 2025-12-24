
// CONFIGURATION


const SIGNUP_CONFIG = {
    STORAGE_KEYS: {
        USERS: 'users'
    },
    PASSWORD_REQUIREMENTS: {
        MIN_LENGTH: 8
    },
    USERNAME_MIN_LENGTH: 2,
    USERNAME_MAX_LENGTH: 50
};


// UTILITY FUNCTIONS

function showError(message) {
    alert(message);
}

function showSuccess(message) {
    alert(message);
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Simple password hash ( demo only)
function hashPassword(password) {
    return btoa(password); // NOT secure, demo only
}


// VALIDATION


function validatePassword(password) {
    const errors = [];

    if (password.length < SIGNUP_CONFIG.PASSWORD_REQUIREMENTS.MIN_LENGTH) {
        errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) errors.push('Must include an uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('Must include a lowercase letter');
    if (!/\d/.test(password)) errors.push('Must include a number');
    if (!/[!@#$%^&*]/.test(password)) errors.push('Must include a special character');

    return {
        isValid: errors.length === 0,
        errors,
        strength: calculatePasswordStrength(password)
    };
}

function calculatePasswordStrength(password) {
    if (!password) return 0;

    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/\d/.test(password)) strength += 20;
    if (/[!@#$%^&*]/.test(password)) strength += 15;

    return Math.min(strength, 100);
}

function validateName(name) {
    const trimmed = name.trim();

    if (trimmed.length < SIGNUP_CONFIG.USERNAME_MIN_LENGTH)
        return { isValid: false, error: 'Name is too short' };

    if (trimmed.length > SIGNUP_CONFIG.USERNAME_MAX_LENGTH)
        return { isValid: false, error: 'Name is too long' };

    if (!/^[a-zA-Z\s'-]+$/.test(trimmed))
        return { isValid: false, error: 'Invalid characters in name' };

    return { isValid: true };
}


// FORM HANDLING


function handleSignup({ name, email, password }) {
    try {
        let users = JSON.parse(localStorage.getItem(SIGNUP_CONFIG.STORAGE_KEYS.USERS)) || [];

        // Email uniqueness (case-insensitive)
        const exists = users.some(
            u => u.email.toLowerCase() === email.toLowerCase()
        );

        if (exists) {
            showError('An account with this email already exists');
            return;
        }

        const newUser = {
            id: generateUserId(),
            name,
            email: email.toLowerCase(),
            password: hashPassword(password),
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem(SIGNUP_CONFIG.STORAGE_KEYS.USERS, JSON.stringify(users));

        showSuccess('Signup successful! You can now login.');
        window.location.href = 'login.html';

    } catch (err) {
        console.error(err);
        showError('Registration failed. Try again.');
    }
}

function generateUserId() {
    return 'user_' + Date.now();
}

// FIELD VALIDATION HELPERS


function showFieldError(input, message) {
    input.style.borderColor = 'red';
    input.title = message;
}

function clearFieldError(input) {
    input.style.borderColor = '';
    input.title = '';
}

function updatePasswordStrengthIndicator(strength) {
    console.log(`Password strength: ${strength}%`);
}


// INITIALIZATION


function initializeSignupForm() {
    const form = document.getElementById('signupForm');
    if (!form) return;

    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirm = document.getElementById('confirm-password');

    form.addEventListener('submit', e => {
        e.preventDefault();

        const nameValid = validateName(name.value);
        const emailValid = validateEmail(email.value);
        const passValid = validatePassword(password.value);
        const confirmValid = password.value === confirm.value;

        if (!nameValid.isValid) return showFieldError(name, nameValid.error);
        if (!emailValid) return showFieldError(email, 'Invalid email');
        if (!passValid.isValid) return showFieldError(password, passValid.errors[0]);
        if (!confirmValid) return showFieldError(confirm, 'Passwords do not match');

        clearFieldError(name);
        clearFieldError(email);
        clearFieldError(password);
        clearFieldError(confirm);

        handleSignup({
            name: name.value.trim(),
            email: email.value.trim(),
            password: password.value
        });
    });

    password.addEventListener('input', () => {
        const strength = calculatePasswordStrength(password.value);
        updatePasswordStrengthIndicator(strength);
    });
}

document.addEventListener('DOMContentLoaded', initializeSignupForm);
