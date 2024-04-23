if (!localStorage.getItem('token')) {
    window.location.href = 'auth.html';
}
const token = localStorage.getItem('token');
const allDiscution = document.getElementById('allDiscution');
const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('input');
//const port = 8003;
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

getProfile();

function goHome() {
    window.location.href = 'index.html';
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'auth.html';
}

function getProfile(){
    //console.log('getProfile');

    fetch(`${url}/profile`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'token': token 
        }
    })
    .then(response => response.json())
    .then(data => {
        //console.log(data);
        let name = document.getElementById('name');
        let email = document.getElementById('email');
        let password = document.getElementById('password');

        name.value = '';
        email.value = '';
        password.value = '';

        name.placeholder = data.name;
        email.placeholder = data.email;
    })
}

function updateProfile() {
    let name = document.getElementById('name');
    let email = document.getElementById('email');
    let password = document.getElementById('password');

    let data = {
        name: name.value,
        email: email.value,
        password: password.value
    }

    fetch(`${url}/updateProfile`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': token 
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.status === 'success') {
            alert('Profile updated');
            getProfile();
        } else {
            alert('Profile not updated');
        }
    })
}

function deleteProfile() {
    let confirm = document.getElementById('confirm');

    fetch(`${url}/deleteProfile`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': token 
        },
        body: JSON.stringify({ confirm: confirm.value })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.status === 'success') {
            alert('Profile deleted');
            logout();
        } else {
            alert('Profile not deleted');
        }
    })
}
