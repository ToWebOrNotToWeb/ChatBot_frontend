if (!localStorage.getItem('token')) {
    window.location.href = 'auth.html';
}
const token = localStorage.getItem('token');
const port = 8003;
const allDiscution = document.getElementById('allDiscution');
const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('input');


getThreads()

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
}

function getThreads() {
    console.log('getting threads');

    fetch('http://localhost:'+ port +'/getThreads', {
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
    fetch('http://localhost:'+ port +'/deleteThread', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
        body: JSON.stringify({ chatId: Id })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            getThreads();
        });
}

function createThread() {
    let newName = document.getElementById('threadName');
    newName = newName.value;
    undo();
    fetch('http://localhost:'+ port +'/newThread', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
        body: JSON.stringify({ chatName: newName })
    }).then(response => response.json())
        .then(data => {
            console.log(data);
            getThreads();
        });

}

function getMessages(Id) {
    fetch('http://localhost:'+ port +'/getMessages', {
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
                    div.innerHTML = element.content;
                    div.classList.add(element.role);
                    chatContainer.appendChild(div);
                } 
            })
            chatContainer.scrollTop = chatContainer.scrollHeight;
        });
}

function sendMessage() {
    let userMessage = userInput.value;
    userInput.value = '';
    let div = document.createElement('div');
    div.innerHTML = userMessage;
    div.classList.add('user');
    chatContainer.appendChild(div);
    chatContainer.appendChild(loader());
    chatContainer.scrollTop = chatContainer.scrollHeight;
    let chatId = document.querySelector('.active').id;

    fetch('http://localhost:'+ port +'/newMessage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
        body: JSON.stringify({ chatId: chatId, message: userMessage })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.id)
            getMessages(data.id);
        });
}



userInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});