// ========================================================================================================
// Clear the local storage to do sure user is logged out
localStorage.removeItem('token');

// ========================================================================================================
// Declare useful variables
const loginForm = document.querySelector('#login');
const registerForm = document.querySelector('#register');

// ========================================================================================================
// Check if the user is on the local or online version of the website
let url = '';
if (window.location.href.includes('local') || window.location.href.includes('127')) {
    url = 'http://localhost:8003';
    console.log('local');
    console.log(url);
} else {
    url = 'unknown';
    console.log('Online');
    console.log(url);
};


// ========================================================================================================
// Show the password and animate the input fields
function Showpswd() {
    // togle input type
    let pwsds = document.querySelectorAll('.pswds');
    pwsds.forEach(pwsd => {
        if (pwsd.type === 'password') {
            pwsd.type = 'text';
        } else {
            pwsd.type = 'password';
        }
    });
}

function Waves() {
    // animate the input fields on focus
    const waves = document.querySelectorAll(".wave");
    waves.forEach((wave) => {
        for (let i = 0; i < wave.children.length; i++)
        wave.children[i].style.transitionDelay = `${i * 0.1}s`;
    });
}
Waves();

// ========================================================================================================
// Toggle between the login and register forms
function showLogin() {
    loginForm.style.display = 'flex';
    registerForm.style.display = 'none';
}

function showRegister() {
    loginForm.style.display = 'none';
    registerForm.style.display = 'flex';
}

// ========================================================================================================
// Login a user
function login(event) {
    // prevetn the page from reloading
    event.preventDefault();
    //console.log('playing');
    let email = loginForm.querySelector('#email');
    let password = loginForm.querySelector('#pswd');

    let data = {
        email: email.value,
        password: password.value
    };

    //console.log(data);
    //localStorage.setItem('one', data);
    fetch(url + '/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => res.json())
    .then(data => {
        //console.log(data);
        //localStorage.setItem('two', data);
        // console.log(data.token);
        // console.log(data.error);
        let token = data.token;
        if(data.error) {
            alert('Invalid credentials');
        } else {
            // set the token in the local storage & redirect to the index page
            localStorage.setItem('token', token);
            window.location.href = 'index.html';
        }
    });
}

// ========================================================================================================
// Register a new user 
function register() {
    // console.log('registering');
    // console.log(url);
    // console.log('registering');
    // console.log(url + '/register');

    const register = document.querySelector('#register');
    let name = register.querySelector('#name');
    let email = register.querySelector('#Remail');
    let password = register.querySelector('#Rpswd');
    let passwordC = register.querySelector('#RpswdC');

    // check if the passwords match
    if (password.value != passwordC.value) {
        alert('Passwords do not match');
        return;
    }

    let data = {
        name: name.value,
        email: email.value,
        password: password.value
    };

    fetch(url + '/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => res.json())
    .then(data => {
        // console.log(data);
        // console.log(data.token);
        // console.log(data.error);
        let token = data.token;
        if(data.error) {
            alert('User already exists');
        } else {
            // set the token in the local storage & redirect to the index page
            localStorage.setItem('token', token);
            window.location.href = 'index.html';
        }
    });
}


