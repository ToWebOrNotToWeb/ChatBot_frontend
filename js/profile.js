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

function convertFileToBase64(inputElement, callback) {
    // Ensure a file has been selected
    if (inputElement.files.length === 0) {
        console.error("No file selected.");
        return;
    }

    var file = inputElement.files[0];
    var reader = new FileReader();

    // Setup onload event for reader
    reader.onload = function() {
        // Get the Base64 string
        var base64String = reader.result;
        
        // Remove the data URL prefix (if necessary) and return the raw base64 string
        var base64 = base64String.split(',')[1];
        
        // Call the callback function with the Base64 string
        callback(base64);
    };

    // Read the file as a Data URL (Base64)
    reader.readAsDataURL(file);
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

function updatePicture() {
    let picture = document.getElementById('picture');
    if (picture.files && picture.files[0]) {
        // Access the first file in the input file list
        let file = picture.files[0];

        // Check if the file size is greater than 5 KB
        if (file.size > 5120) { // 5 KB = 5120 bytes
            alert('The file size should be 5KB or less.');
            // Clear the input if the file is too large
            picture.value = '';
        } 
    }
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
    convertFileToBase64(picture, (base64) => {
        let data = {
            picture: base64,
            extention: extention
        }
        fetch(`${url}/updatePicture`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': token 
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
