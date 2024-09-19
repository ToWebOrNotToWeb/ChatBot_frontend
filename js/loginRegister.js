// ========================================================================================================
// Reset Token

localStorage.removeItem('token-TWONTW');

// ========================================================================================================
// Check if the user is on the local or online version of the website

let url = '';
if (window.location.href.includes('local') || window.location.href.includes('127')) {
    url = 'http://localhost:8003';
    // console.log('local');
    // console.log(url);
} else {
    url = 'https://chatbot-backend-o6is.onrender.com';
    // console.log('Online');
    // console.log(url);
};

// ========================================================================================================
// Manage Input focus animations

const inputs = document.querySelectorAll('.fields input');

inputs.forEach(input => {
    const label = input.previousElementSibling;
    input.addEventListener('focus', () => {
        input.style.borderBottom = '2px solid var(--primary)';
        label.style.top = '0';
        label.style.fontSize = '1.2rem';
    });
    input.addEventListener('blur', () => {
        if (input.value === '') {
            input.style.borderBottom = '2px solid var(--accent)';  
            label.style.top = '40%';
            label.style.fontSize = '1.8rem';
        };
    });
});

// ========================================================================================================
// Manage login

function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch(`${url}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    }).then(response => {
        
        if (response.status === 200) { //everything is good
            response.json().then(data => {
                localStorage.setItem('token-TWONTW', data.token);
                //console.log('Token:', data.token);
                window.location.href = 'index.html';
            });
        } else if (response.status === 401) { //wrong password or email
            response.json().then(data => {
                alert(data.error);
            });
        } else { //unexpected error
            //console.error('Error:', response.status);
            alert('An error occured');
        };

    }).catch(error => {
        console.error('Error:', error);
    });
}

// ========================================================================================================
// Manage register

function register() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordCheck = document.getElementById('passwordCheck').value;

    if (password !== passwordCheck) {
        alert('Passwords do not match');
        return;
    };

    fetch(`${url}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            email: email,
            password: password
        })
    }).then(response => {
        
        if (response.status === 200) { //everything is good
            response.json().then(data => {
                localStorage.setItem('token-TWONTW', data.token);
                window.location.href = 'index.html';
            });
        } else if (response.status === 406) { //some information is missing or invalid
            response.json().then(data => {
                alert(data.error);
            });
        } else if (response.status === 409) { //user already exists
            response.json().then(data => {
                alert(data.error);
            });
        } else { //unexpected error
            console.error('Error:', response.status);
            alert('An error occured');
        };

    }).catch(error => {
        console.error('Error:', error);
    });
};