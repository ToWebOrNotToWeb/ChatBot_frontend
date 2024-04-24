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

getThreads()

function userMessage() {

}

function assistantMessage() {
    
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'auth.html';
}

function loader() {
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

function showPrompt() {
    let prompt = document.querySelector('.prompt');
    prompt.classList.add('show');
}

function undo() {
    let prompt = document.querySelector('.prompt');
    prompt.classList.remove('show');
    let name = document.getElementById('threadName');
    name.value = '';
    document.getElementById('threadName').classList.remove('error');
}

function formatResponse(text) {
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

function getThreads() {
    console.log('getting threads');

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
        console.log(data);
        console.log(data.chats);
        let oldLi = document.querySelectorAll('.discution');
        let newDiscution = document.getElementById('newDiscution');
        oldLi.forEach(element => element.remove());
        data.chats.forEach(element => {
            let li = document.createElement('li');
            let btn = document.createElement('button');
            btn.innerHTML = 'Delete';
            li.innerHTML = element.chatName;
            li.id = element._id;
            li.classList.add('discution');
            li.appendChild(btn);
            btn.addEventListener('click', function() {
                console.log(li.id);
                deleteThread(li.id);
            });
            li.addEventListener('click', function() {
                let discution = document.querySelectorAll('.discution');
                discution.forEach(el => el.classList.remove('active'));
                li.classList.add('active');
                getMessages(li.id);
            });
            allDiscution.insertBefore(li, newDiscution);
        })
        let discution = document.querySelectorAll('.discution');
        discution[discution.length - 1].classList.add('active');
        getMessages(data.chats[data.chats.length - 1]._id);

    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
}

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
            let chatContainer = document.getElementById('chat-container');
            chatContainer.innerHTML = '';
            getThreads();
        });
}

function createThread() {
    let newName = document.getElementById('threadName');
    newName = newName.value;
    if (newName === '') {
        document.getElementById('threadName').classList.add('error');
        return;
    }
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
            getThreads();
        });

}

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
                if (element.role != 'system') {
                    let div = document.createElement('div');
                    let cl = 'chat-format';
                    let section = document.createElement('section');
                    let img = document.createElement('img');
                    let name = document.createElement('p');
                    let p = document.createElement('p');
                    div.id = 'chat-response';
                    div.classList.add(element.role);
                    div.classList.add(cl);
                    if (element.role === 'user') {
                        img.src = 'img/merlin2.jpg';
                        name.innerHTML = 'You :';
                    } else {
                        img.src = 'img/logo.png';
                        name.innerHTML = 'ChatBot :';
                    }
                    p.innerHTML = formatResponse(element.content);
                    p.classList.add('textual');
                    section.appendChild(img);
                    section.appendChild(name);
                    div.appendChild(section);
                    div.appendChild(p);
                    chatContainer.appendChild(div);
                } 
            })
            chatContainer.scrollTop = chatContainer.scrollHeight;
        });
}

function sendMessage() {
    if (document.querySelector('.active') === null) {
        alert('You must first create a discution');
        return;
    }
    let userMessage = userInput.value;
    userInput.value = '';
    let div = document.createElement('div');
    let cl = 'chat-format';
    let section = document.createElement('section');
    let img = document.createElement('img');
    let name = document.createElement('p');
    let p = document.createElement('p');
    div.id = 'chat-response';
    div.classList.add('user');
    div.classList.add(cl);
    img.src = 'img/merlin2.jpg';
    name.innerHTML = 'You :';
    p.innerHTML = userMessage;
    p.classList.add('textual');
    section.appendChild(img);
    section.appendChild(name);
    div.appendChild(section);
    div.appendChild(p);
    chatContainer.appendChild(div);

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
            getMessages(data.id);
        });
}



userInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});