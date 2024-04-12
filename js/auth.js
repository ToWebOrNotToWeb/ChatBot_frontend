// Initialize
localStorage.removeItem('token');
const loginForm = document.querySelector('#login');
const registerForm = document.querySelector('#register');
const port = 8003;


/*=========================================Form===========================================*/
function Showpswd() {
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
    const waves = document.querySelectorAll(".wave");
    waves.forEach((wave) => {
        for (let i = 0; i < wave.children.length; i++)
        wave.children[i].style.transitionDelay = `${i * 0.1}s`;
    });
}


Waves();





/*=========================================Login===========================================*/
function showLogin() {
    loginForm.style.display = 'flex';
    registerForm.style.display = 'none';
}

function login(event) {
    event.preventDefault();
    console.log('playing');
    let email = loginForm.querySelector('#email');
    let password = loginForm.querySelector('#pswd');
    let data = {
        email: email.value,
        password: password.value
    };
    console.log(data);
    localStorage.setItem('one', data);
    fetch('http://localhost:'+ port +'/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => res.json())
    .then(data => {
        //console.log(data);
        localStorage.setItem('two', data);
        // console.log(data.token);
        // console.log(data.error);
        let token = data.token;
        if(data.error) {
            alert('Invalid credentials');
        } else {
            localStorage.setItem('token', token);
            window.location.href = 'index.html';
        }
    });
}


/*=========================================Register===========================================*/

function showRegister() {
    loginForm.style.display = 'none';
    registerForm.style.display = 'flex';
}

function register() {
    const register = document.querySelector('#register');
    let name = register.querySelector('#name');
    let email = register.querySelector('#Remail');
    let password = register.querySelector('#Rpswd');
    let passwordC = register.querySelector('#RpswdC');
    if (password.value != passwordC.value) {
        alert('Passwords do not match');
        return;
    }
    let data = {
        name: name.value,
        email: email.value,
        password: password.value
    };
    fetch('http://localhost:'+ port +'/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => res.json())
    .then(data => {
        console.log(data);
        console.log(data.token);
        console.log(data.error);
        let token = data.token;
        if(data.error) {
            alert('User already exists');
        } else {
            localStorage.setItem('token', token);
            window.location.href = 'index.html';
        }
    });
}


