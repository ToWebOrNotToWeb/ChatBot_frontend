// ========================================================================================================
// Check if user is logged in before allowing access to the page

if (!localStorage.getItem('token-TWONTW')) {
    console.log('No token found');
    window.location.href = 'login.html';
} 
const token = localStorage.getItem('token-TWONTW');

// ========================================================================================================
// Check if the user is on the local or online version of the website
console.log(document.querySelector('.stroumf') !== null)
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

getChats();
getProfilePicture(url, token);
// ========================================================================================================
// Manage the burger menu
const burgerBtn = document.querySelector('#burger');
const closeBtn = document.querySelector('#close');
const aside = document.querySelector('aside');

//let chatIdOverwatch = null;
//OVERWATCH();
burgerBtn.addEventListener('click', () => {
    aside.style.display = 'grid';
    burgerBtn.style.display = 'none';
    closeBtn.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    aside.style.display = 'none';
    burgerBtn.style.display = 'block';
    closeBtn.style.display = 'none';
});

// ========================================================================================================
// Fix this fucking Bug
// function OVERWATCH() {
//     let body = document.querySelector('body');
//     body.addEventListener('click', () => {
//         console.log('Overwatch is trying')
//         try {
//             console.log('overwathc say:');
//             chatIdOverwatch = document.querySelector('.active').getAttribute('data-chat-id');
            
//             console.log(chatIdOverwatch)
//             OVERWATCH();
//         } catch {
//             chatIdOverwatch = null;

//         }
//     });
// }

// ========================================================================================================
// get profile picture 

async function getProfilePicture(url, token) {
    fetch(`${url}/user/picture`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then(response => {
        if (response.status === 200) { // OK
            response.json().then(data => {
                //console.log(data);
                localStorage.setItem('extention-TWONTW', data.extention);
                localStorage.setItem('picture-TWONTW', data.result);
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
// Get all discussions
function getChats(exeption = false) {
    console.log('getChats');
    fetch(`${url}/api/discution/get`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then(response => {
        if (response.status === 200) { // OK
            response.json().then(data => {
                //console.log(data);
                if (exeption) {
                    console.log('exeption');
                    displayChats(data.chats, exeption);
                } else {
                    displayChats(data.chats);
                }
                //displayChats(data.chats);
                
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

function displayChats(chats, exeption = false) {
    let chatsList = document.querySelector('#chatsList');
    chatsList.innerHTML = '';
    let i = 0;
    let lenght = chats.length;
    chats.forEach(chat => {
        i++
        let li = document.createElement('li');
        let input = document.createElement('input');
        let span = document.createElement('span');
        let binSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 20 20"><path fill="#000C5A" d="M11.299 7.75a1.5 1.5 0 0 0-2.598 0l-.452.782a.5.5 0 1 0 .866.5l.452-.782a.5.5 0 0 1 .866 0l.451.782a.5.5 0 0 0 .867-.5zm.866 3.5l-.108-.186a.5.5 0 0 1 .867-.5l.107.186A1.5 1.5 0 0 1 11.732 13H11a.5.5 0 0 1 0-1h.732a.5.5 0 0 0 .433-.75M9 12a.5.5 0 0 1 0 1h-.732a1.5 1.5 0 0 1-1.3-2.25l.108-.186a.5.5 0 0 1 .866.5l-.107.186a.5.5 0 0 0 .433.75zm6.914-9.414A2 2 0 0 1 16.5 4v.56l-1.33 11.67a2 2 0 0 1-2 1.77H6.85a2 2 0 0 1-2-1.77L3.5 4.56V4a2 2 0 0 1 2-2h9a2 2 0 0 1 1.414.586M14.5 3h-9a1 1 0 0 0-1 1h11a1 1 0 0 0-1-1m-.67 13.747a1 1 0 0 0 .33-.637L15.44 5H4.56l1.28 11.11a1 1 0 0 0 1 .89h6.32a1 1 0 0 0 .67-.253"/></svg>`; 
        input.value = chat.chatName;

        li.setAttribute('data-chat-id', chat._id);
        li.setAttribute('class', 'chat');
        
        // si c'est le dernier chat, ajouter la classe .active
        if (i === lenght && exeption) {
            li.classList.add('active');
        }

        span.setAttribute('onclick', `deleteChat('${chat._id}')`);
        input.setAttribute('onblur', `updateChat('${chat._id}')`);
        

        span.innerHTML = binSvg;
        li.appendChild(input);
        li.append(span);
        chatsList.appendChild(li);
    });
    manageActiveChat();
};

// ========================================================================================================
// Manage active chat
function manageActiveChat() {
    let chats = document.querySelectorAll('.chat');
    chats.forEach(chat => {
        chat.addEventListener('mouseover' || 'click', () => {
            chats.forEach(c => c.classList.remove('active'));
            chat.classList.add('active');
            getMessages(chat.getAttribute('data-chat-id'));
        });
    });
};

// ========================================================================================================
// manage opening 
let openings = document.querySelectorAll('.opening');
openings.forEach(opening => {
    opening.addEventListener('click', () => {
        let content = opening.querySelector('p').innerText;
        //console.log(content);
        let input = document.querySelector('#inputBar input');
        input.value = content;
        let starter = document.querySelector('#starter');
        starter.style.display = 'none';
        sendMessage();
    });
});

// ========================================================================================================
// Update a discussion name
function updateChat(id) {
    //console.log('update chat');
    fetch(`${url}/api/discution/update`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            chatId: id,
            chatName: document.querySelector(`li[data-chat-id="${id}"] input`).value
        })
    }).then(response => {
        if (response.status === 200) { // OK
            response.json().then(data => {
                getChats();
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
// Create a new discussion

async function newChat(){

    let name = 'New chat';

    fetch(`${url}/api/discution/new`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            chatName: name
        })
    }).then(response => {
        if (response.status === 200) { // OK
            response.json().then(data => {
                let window = document.querySelector('#windows');
                window.innerHTML = '';
                let starter = document.querySelector('#starter');
                starter.style.display = 'flex';
                console.log('New chat created:', data);
                let chatId = data.chatId;
                getChats(true);
                
                return chatId;
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
// Delete a discussion
function deleteChat(id) {
    fetch(`${url}/api/discution/delete`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            chatId: id
        })
    }).then(response => {
        if (response.status === 200) { // OK
            response.json().then(data => {
                getChats();
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
// Send a message 
async function sendMessage() {
    // ===================================================
    // Step one
    let message = document.querySelector('#inputBar input').value;
    let chatId = null;

    if (message === '') {
        return;
    };

        document.querySelector('#inputBar input').value = '';
        let starter = document.querySelector('#starter');
        starter.style.display = 'none';

        let window = document.querySelector('#windows');
        let div = document.createElement('div');
        let img = document.createElement('img');
        let p = document.createElement('p');

        div.setAttribute('class', 'user');
        div.classList.add('message');
        img.setAttribute('src', `data:image/${localStorage.getItem('extention-TWONTW')};base64,` + localStorage.getItem('picture-TWONTW'));
        p.innerHTML = message;

        div.appendChild(img);
        div.appendChild(p);
        window.appendChild(div);

        window.scrollTo(0, window.scrollHeight);

        console.log('Gamma') 
        console.log(chatId)
        console.log(document.querySelector('.active'))
        let id = document.querySelector('.active') || null;
        if (id !== null) {
            id = id.getAttribute('data-chat-id');
        } else {
            id = null;
        }
        fetch(`${url}/api/message/pipeline`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ chatId: id, message: message })
        }).then(response => {

            if (response.status === 200) { // OK
                if (!response.body) {
                    throw new Error("No response body from server");
                }
                console.log(response);
                console.log(response.body);
                const reader = response.body.getReader();
                const decoder = new TextDecoder('utf-8');
                let buffer = '';
                let fullResponse = '';

                let div = document.createElement('div');
                let img = document.createElement('img');
                let p = document.createElement('p');
            
                div.setAttribute('class', 'bot');
                div.classList.add('message');
                img.setAttribute('src', 'img/logo.png');

                div.appendChild(img);
                div.appendChild(p);
                window.appendChild(div);

                window.scrollTo(0, window.scrollHeight);

                const readChunk = () => {
                    reader.read().then(({ done, value }) => {
                        
        
                        // Decode the chunk and append to the buffer
                        buffer += decoder.decode(value, { stream: true });
        
                        // Process the buffer line by line
                        const lines = buffer.split('\n');
                        buffer = lines.pop(); // Keep the last line (which might be incomplete) in the buffer
                        if (done) {
                            console.log('End of stream');
                            console.log(done);
                            console.log("Received ChatId: ", buffer);
                                const data = [message, fullResponse];
                                fetch(url+ '/api/message/fix', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': 'Bearer ' + token
                                    },
                                    body: JSON.stringify({ chatId: buffer, message: data })
                                }).then(response => {
                                    let exeption = true;
                                    getMessages(buffer);
                                    getChats(exeption);

                                })
                            return;

                        };
        
                        for (const line of lines) {
                            if (line.startsWith('data: ')) {
                                const jsonString = line.slice(6); // Remove 'data: ' prefix
                                try {
                                    const jsonObject = JSON.parse(jsonString);
                                    if (jsonObject.choices[0].delta.content != undefined) {
                                        p.innerHTML += jsonObject.choices[0].delta.content;
                                        fullResponse += jsonObject.choices[0].delta.content;
                                        window.scrollTop = window.scrollHeight;
                                    }
                                } catch (e) {
                                    console.error('Error parsing JSON:', e);
                                }
                            }
                        }
        
                        // Continue reading the next chunk
                        readChunk();
                    }).catch(error => {
                        console.error('Error reading stream:', error);
                    });
                };
        
                // Start reading the first chunk
                readChunk();
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
// Get all messages
function getMessages(id) {
    fetch(`${url}/api/message/get`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ chatId: id })
    }).then(response => {
        if (response.status === 200) { // OK
            response.json().then(data => {
                console.log(data);
                let window = document.querySelector('#windows');
                window.innerHTML = '';
                try {
                    let starter = document.querySelector('#starter');
                    starter.style.display = 'none';
                } catch (error) {
                    console.log('No message yet');
                }
                displayMessages(data.messages.content);
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
// Format all messages
function escapeHTML(str) {
    return str.replace(/[&<>"']/g, function (match) {
        const escapeMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return escapeMap[match];
    });
};

function formatBoldAndUppercase(text) {
    return text.replace(/\*\*(.*?)\*\*/g, function(match, p1) {
        return `<u>${p1.toUpperCase()}</u>`;
    });
};

function formatResponse(text) {
    const lines = text.split('\n');
    let formattedText = '';

    lines.forEach(line => {
        // Trim the line to remove any leading/trailing whitespace
        line = line.trim();
        
        // Escape any HTML characters
        line = escapeHTML(line);

        // Apply bold and uppercase formatting
        line = formatBoldAndUppercase(line);

        // Check if the line starts with a number followed by a dot
        if (line.match(/^\d+\./)) {
            formattedText += `<li>${line}</li>`;
        } else if (line.length > 0) {
            // Only add non-empty lines
            formattedText += `<p>${line}</p>`;
        }
    });

    return `<ul>${formattedText}</ul>`;
};

// ========================================================================================================
// Display all messages
function displayMessages(messages) {
    let window = document.querySelector('#windows');
    window.innerHTML = '';
    //console.log(messages);
    messages.forEach(message => {
        //console.log(message);
        if (message.role !== 'system') {
            let div = document.createElement('div');
            let img = document.createElement('img');
            let p = document.createElement('p');

            div.setAttribute('class', message.role);
            div.classList.add('message');
            if (message.role === 'user') {
                img.setAttribute('src', `data:image/${localStorage.getItem('extention-TWONTW')};base64,` + localStorage.getItem('picture-TWONTW'));
            } else {
                img.setAttribute('src', 'img/logo.png');
            }
            p.innerHTML = formatResponse(message.content);

            div.appendChild(img);
            div.appendChild(p);
            window.appendChild(div);

            window.scrollTo(0, window.scrollHeight);
        }
        
    });
};

// ========================================================================================================
// case enter key press

document.querySelector('#inputBar input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});