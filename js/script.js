// ========================================================================================================
// Check if user is logged in before allowing access to the page
if (!localStorage.getItem('token')) {
    window.location.href = 'auth.html';
}
checkToken();

// ========================================================================================================
// Declare usefull variables
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
    url = 'unknown';
    console.log('Online');
    console.log(url);
};

// ========================================================================================================
// retrieve the user's profile picture and his discutions
getPicture()
getThreads()

// ========================================================================================================
// uncategorized functions
function checkToken() {
    fetch('http://localhost:8003/verifyToken', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': localStorage.getItem('token')
        }
    }).then(response => {
        if (response.status === 403) {
            logout();
        }
    });
}

function getPicture() {
    fetch(url+'/getPicture', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        }
    })
        .then(response => response.json())
        .then(data => {
            //console.log(data.result);
            // Store the picture and its extention in the local storage
            localStorage.setItem('picture', data.result);
            localStorage.setItem('extention', data.extention);
        });
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'auth.html';
}

function loader() {
    // Create and return the loader element (the three dot that appears when the bot is typing)
    let loader = document.createElement('div');
    loader.classList.add('loader');
    let i = 0;
    for (i = 0; i < 3; i++) {
        let div = document.createElement('div');
        div.classList.add('line');
        loader.appendChild(div);
    }
    return loader;
}

function profile() {
    window.location.href = 'profile.html';
}

function formatResponse(text) {
    // To format the response from the bot
    const lines = text.split('\n');
    let formattedText = '';

    lines.forEach(line => {
        if (line.match(/^\d+\./)) { // Checks if the line starts with a number followed by a dot
            formattedText += `<li>${line}</li>`;
        } else {
            formattedText += `<p>${line}</p>`;
        }
    });

    return `<ul>${formattedText}</ul>`;
}

// ========================================================================================================
// Get user's thread
function getThreads() {
    //console.log('getting threads');

    fetch(url+'/getThreads', {
        method: 'GET', 
        headers: {
            'Content-Type': 'application/json',
            'token': token 
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        //console.log(data);
        //console.log(data.chats);
        let oldLi = document.querySelectorAll('.discution');
        let newDiscution = document.getElementById('newDiscution');

        // Remove all the previous discutions
        oldLi.forEach(element => element.remove());

        // Add the new discutions
        data.chats.forEach(element => {
            let li = document.createElement('li');
            let btn = document.createElement('button');
            btn.innerHTML = 'Delete';
            li.innerHTML = element.chatName;
            li.id = element._id;
            li.classList.add('discution');
            li.appendChild(btn);

            // Add event listener to the delete button of each discution
            btn.addEventListener('click', function() {
                console.log(li.id);
                deleteThread(li.id);
            });

            // Add event listener to each discution to move the active class to the clicked discution
            li.addEventListener('click', function() {
                let discution = document.querySelectorAll('.discution');
                discution.forEach(el => el.classList.remove('active'));
                li.classList.add('active');
                getMessages(li.id);
            });
            allDiscution.insertBefore(li, newDiscution);
        })

        // get the active discution and display its messages
        let discution = document.querySelectorAll('.discution');
        discution[discution.length - 1].classList.add('active');
        getMessages(data.chats[data.chats.length - 1]._id);

    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
}

// ========================================================================================================
// Create new thread
function showPrompt() {
    // show the popup window to create a new discution
    let prompt = document.querySelector('.prompt');
    prompt.classList.add('show');
}

function undo() {
    // hide the popup window to create a new discution
    let prompt = document.querySelector('.prompt');
    prompt.classList.remove('show');
    let name = document.getElementById('threadName');
    name.value = '';
    document.getElementById('threadName').classList.remove('error');
}

function createThread() {
    let newName = document.getElementById('threadName');
    newName = newName.value;

    // verify the input isn't empty
    if (newName === '') {
        document.getElementById('threadName').classList.add('error');
        return;
    }

    // close the popup window
    undo();

    fetch(url+'/newThread', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
        body: JSON.stringify({ chatName: newName })
    }).then(response => response.json())
        .then(data => {
            //console.log(data);
            document.getElementById('threadName').classList.remove('error');

            // refresh the discutions
            getThreads();
        });

}

// ========================================================================================================
// Delete thread
function deleteThread(Id) {
    fetch(url+'/deleteThread', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
        body: JSON.stringify({ chatId: Id })
    })
        .then(response => response.json())
        .then(data => {
            //console.log(data);

            // remove all the messages from the chat container
            let chatContainer = document.getElementById('chat-container');
            chatContainer.innerHTML = '';

            // refresh the discutions
            getThreads();
        });
}

// ========================================================================================================
// send and get messages
function getMessages(Id) {
    fetch(url+'/getMessages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
        body: JSON.stringify({ chatId: Id })
    })
        .then(response => response.json())
        .then(messages => {
            chatContainer.innerHTML = '';
            messages.messages.content.forEach(element => {
                // we ignore the system messages
                if (element.role != 'system') {
                    let div = document.createElement('div');
                    let cl = 'chat-format';
                    let section = document.createElement('section');
                    let img = null;
                    let name = document.createElement('p');
                    let p = document.createElement('p');
                    div.id = 'chat-response';
                    div.classList.add(element.role);
                    div.classList.add(cl);
                    let profile = localStorage.getItem('picture');
                    let extention = localStorage.getItem('extention');

                    // check if the message is from the user or the bot and display the appropriate profile picture
                    // profile is either a base64 string or a the name of the user
                    // we check the lenght of the profile to determine witch one to display and how
                    if (element.role === 'user' && profile.length < 100) {
                        img = document.createElement('div');
                        img.innerHTML = profile.charAt(0);
                        name.innerHTML = 'You :';
                    } else if (element.role === 'user' && profile.length > 100) {
                        img = document.createElement('img');
                        img.src = `data:image/${extention};base64,${profile}`;
                        name.innerHTML = 'You :';
                    } else {
                        img = document.createElement('img');
                        img.src = 'img/logo.png';
                        name.innerHTML = 'ChatBot :';
                    }
                    img.classList.add('img');
                    p.innerHTML = formatResponse(element.content);
                    p.classList.add('textual');
                    section.appendChild(img);
                    section.appendChild(name);
                    div.appendChild(section);
                    div.appendChild(p);
                    chatContainer.appendChild(div);
                } 
            })
            // scroll to the bottom of the chat container
            chatContainer.scrollTop = chatContainer.scrollHeight;
        });
}

function sendMessage() {
    // check if the user is in a discution
    if (document.querySelector('.active') === null) {
        alert('You must first create a discution');
        return;
    }

    // show user message
    let userMessage = userInput.value;
    userInput.value = '';
    let div = document.createElement('div');
    let cl = 'chat-format';
    let section = document.createElement('section');
    let img = null;
    let name = document.createElement('p');
    let p = document.createElement('p');
    div.id = 'chat-response';
    div.classList.add('user');
    div.classList.add(cl);
    let profile = localStorage.getItem('picture');
    let extention = localStorage.getItem('extention');

    // check the lenght of the profile to determine witch one to display and how
    if (profile.length < 100) {
        img = document.createElement('div');
        img.innerHTML = profile.charAt(0);
        name.innerHTML = 'You :';
    } else {
        img = document.createElement('img');
        img.src = `data:image/${extention};base64,${profile}`;
        name.innerHTML = 'You :';
    }

    img.classList.add('img');
    p.innerHTML = userMessage;
    p.classList.add('textual');
    section.appendChild(img);
    section.appendChild(name);
    div.appendChild(section);
    div.appendChild(p);
    chatContainer.appendChild(div);

    // show the loader
    chatContainer.appendChild(loader());

    // scroll to the bottom of the chat container
    chatContainer.scrollTop = chatContainer.scrollHeight;
    let chatId = document.querySelector('.active').id;

    fetch(url+ '/newMessage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
        body: JSON.stringify({ chatId: chatId, message: userMessage })
    })
        .then(response => response.json())
        .then(data => {
            //console.log(data.id)
            // refresh the messages to display bot response
            getMessages(data.id);
        });
}

// listen for the enter key to send the message
userInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});