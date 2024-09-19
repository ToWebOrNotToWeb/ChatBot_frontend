// ========================================================================================================
// Check if user is logged in before allowing access to the page

if (!localStorage.getItem('token-TWONTW')) {
    console.log('No token found');
    window.location.href = 'login.html';
} 
const token = localStorage.getItem('token-TWONTW');

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
// Dsplay all informastions
getProfile(url, token);
getProfilePicture(url, token);

// ========================================================================================================
// Display profile informations

function getProfile(url, token) {
    fetch(`${url}/user/profile`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then(response => {
        if (response.status === 200) { // OK
            response.json().then(data => {
                document.getElementById('name').placeholder = data.name;
                document.getElementById('email').placeholder = data.email;
                document.getElementById('name').value = '';
                document.getElementById('email').value = '';
                if ( !!data.token ) {
                    localStorage.setItem('token-TWONTW', data.token);
                }
            });
        } else if (response.status === 401) { // Token expired
            response.json().then(data => {
                alert('Session expired, please log in again');
                console.log(data.error);
                window.location.href = 'login.html';
            });
        } else if (response.status === 403) { // Token invalid or not provided
            response.json().then(data => {
                alert('An error occured, please log in again');
                console.log(data.error);
                window.location.href = 'login.html';
            });
        } else {
            response.json().then(data => { // Unexpected error
                console.error(data.error);
                window.location.href = 'login.html';
            });
        };
    });
};

// ========================================================================================================
// Display profile picture

function getProfilePicture(url, token) {
    fetch(`${url}/user/picture`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then(response => {
        if (response.status === 200) { // OK
            response.json().then(data => {
                console.log(data);
                document.getElementById('PP').src = `data:image/${data.extention};base64,` + data.result;
            });
        } else if (response.status === 401) { // Token expired
            response.json().then(data => {
                alert('Session expired, please log in again');
                console.log(data.error);
                window.location.href = 'login.html';
            });
        } else if (response.status === 403) { // Token invalid or not provided
            response.json().then(data => {
                alert('An error occured, please log in again');
                console.log(data.error);
                window.location.href = 'login.html';
            });
        } else {
            response.json().then(data => { // Unexpected error
                console.error(data.error);
                window.location.href = 'login.html';
            });
        };
    });
}

// ========================================================================================================
// Update profile picture

function openPopUp() {
    let form = document.getElementById('form');
    let overlay = document.getElementById('overlay');

    form.style.display = 'flex';
    overlay.style.display = 'block';

    overlay.addEventListener('click', () => {
        form.style.display = 'none';
        overlay.style.display = 'none';
    });
};

function updatePicture() {
    

    let file = document.getElementById('picture').files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        let data = {
            imgBase64: reader.result.split(',')[1],
            extention: file.type.split('/')[1]
        };
        //console.log(data);
        let form = document.getElementById('form');
        let overlay = document.getElementById('overlay');
        form.style.display = 'none';
        overlay.style.display = 'none';
        fetch(`${url}/user/picture`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.status === 200) { // OK
                response.json().then(data => {
                    alert('Profile picture updated');
                    getProfilePicture(url, token);
                });
            } else if (response.status === 401) { // Token expired
                response.json().then(data => {
                    alert('Session expired, please log in again');
                    window.location.href = 'login.html';
                });
            } else if (response.status === 403) { // Token invalid or not provided
                response.json().then(data => {
                    alert('An error occured, please log in again');
                    window.location.href = 'login.html';
                });
            } else {
                response.json().then(data => { // Unexpected error
                    console.error(data.error);
                    window.location.href = 'login.html';
                });
            };
        });
    };
};

// ========================================================================================================
// Delete profile picture

function deletePicture() {
    //console.log('delete');
    fetch(`${url}/user/deletePicture`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then(response => {
        if (response.status === 200) { // OK
            response.json().then(data => {
                alert('Profile picture deleted');
                getProfilePicture(url, token);
            });
        } else if (response.status === 401) { // Token expired
            response.json().then(data => {
                alert('Session expired, please log in again');
                window.location.href = 'login.html';
            });
        } else if (response.status === 403) { // Token invalid or not provided
            response.json().then(data => {
                alert('An error occured, please log in again');
                window.location.href = 'login.html';
            });
        } else {
            response.json().then(data => { // Unexpected error
                console.error(data.error);
                window.location.href = 'login.html';
            });
        };
    });
};

// ========================================================================================================
// Upadate profile informations

function updateProfile() {
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let data = {
        name: name,
        email: email,
        password: password
    };
    fetch(`${url}/user/profile`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    }).then(response => {
        if (response.status === 200) { // OK
            response.json().then(data => {
                alert('Profile updated');
                getProfile(url, token);
            });
        } else if (response.status === 401) { // Token expired
            response.json().then(data => {
                alert('Session expired, please log in again');
                window.location.href = 'login.html';
            });
        } else if (response.status === 403) { // Token invalid or not provided
            response.json().then(data => {
                alert('An error occured, please log in again');
                window.location.href = 'login.html';
            });
        } else if (response.status === 406) { //some information is invalid
            response.json().then(data => {
                alert(data.error);
            });
        } else if (response.status === 409) { //user already exists
            response.json().then(data => {
                alert(data.error);
            });
        } else {
            response.json().then(data => { // Unexpected error
                console.error(data.error);
                //window.location.href = 'login.html';
            });
        };
    });
};

// ========================================================================================================
// Delete profile

function deleteProfile() {
    let validation = document.getElementById('validation').value; 

    if (validation === 'DELETE') {
        fetch(`${url}/user/deleteProfile`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            if (response.status === 200) { // OK
                response.json().then(data => {
                    alert('Profile deleted');
                    localStorage.removeItem('token-TWONTW');
                    window.location.href = 'login.html';
                });
            } else if (response.status === 401) { // Token expired
                response.json().then(data => {
                    alert('Session expired, please log in again');
                    window.location.href = 'login.html';
                });
            } else if (response.status === 403) { // Token invalid or not provided
                response.json().then(data => {
                    alert('An error occured, please log in again');
                    window.location.href = 'login.html';
                });
            } else {
                response.json().then(data => { // Unexpected error
                    console.error(data.error);
                    window.location.href = 'login.html';
                });
            };
        });
    };
};