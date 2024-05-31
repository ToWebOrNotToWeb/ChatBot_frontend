// ========================================================================================================
// Check if user is logged in before allowing access to the page
if (!localStorage.getItem('token')) {
    window.location.href = 'auth.html';
}

// ========================================================================================================
// Declare useful variables
const token = localStorage.getItem('token');
const allDiscution = document.getElementById('allDiscution');
const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('input');

// ========================================================================================================
// Check if the user is on the local or online version of the website
let url = '';
if (window.location.href.includes('local') || window.location.href.includes('127')) {
    url = 'http://localhost:8003';
    console.log('local');
    console.log(url);
} else {
    url = 'https://chatbot-backend-o6is.onrender.com';
    console.log('Online');
    console.log(url);
};

// ========================================================================================================
// Get the user's profile informations
getProfile();

// ========================================================================================================
// uncategorized functions

function goHome() {
    window.location.href = 'index.html';
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'auth.html';
}


// ========================================================================================================
// Get the user's profile informations
function getProfile(){
    //console.log('getProfile');

    fetch(url + '/user/profile', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    .then(response => {
        if (response.status === 401 || response.status === 403) {
            window.location.href = 'auth.html';
        }
        return response.json();
    })
    .then(data => {
        //console.log(data);
        // clear eveything in the profile
        let name = document.getElementById('name');
        let email = document.getElementById('email');
        let password = document.getElementById('password');

        name.value = '';
        email.value = '';
        password.value = '';

        // set the profile informations
        name.placeholder = data.name;
        email.placeholder = data.email;
    })
}

// ========================================================================================================
// Update user's profile informations
function updateProfile() {
    let name = document.getElementById('name');
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    // send the data to the server (all the check are done on the server side)
    let data = {
        name: name.value,
        email: email.value,
        password: password.value
    }

    fetch(url + '/user/profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        //console.log(data);
        if (data.status === 'success') {
            alert('Profile updated');
            // refresh the profile informations
            getProfile();
        } else {
            alert('Profile not updated');
        }
    })
}

// ========================================================================================================
// Update user's profile picture
function updatePicture() {
    let picture = document.getElementById('picture');

    // check containt only one . in the file name
    if (picture.value.split('.').length !== 2) {
        alert('Invalid  file name');
        picture.value = '';
        return;
    }
    // check theire is only one file 
    if (picture.files.length !== 1) {
        alert('To many files selected');
        picture.value = '';
        return;
    }
    let extention = picture.value.split('.').pop();
        let data = {
            picture: picture,
            extention: extention
        }
        fetch(url + '/user/picture', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            //console.log(data);
            picture.value = '';
            if (data.status === 'success') {
                alert('Picture updated');
                getProfile();
            } else {
                alert('Picture not updated');
            }
        })
}

// ========================================================================================================
// Delete User's account
function deleteProfile() {
    let confirm = document.getElementById('confirm');

    fetch(url + '/user/deleteProfile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ confirm: confirm.value })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.status === 'success') {
            alert('Profile deleted');
            // log out the user
            logout();
        } else {
            alert('Profile not deleted');
        }
    })
}
