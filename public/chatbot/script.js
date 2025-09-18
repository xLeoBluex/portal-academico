    const body = document.querySelector("body"),
      sidebar = body.querySelector(".sidebar"),
      toggle = body.querySelector(".toggle"),
      searchBtn = body.querySelector(".search-box"),
      modeSwitch = body.querySelector(".toggle-switch"),
      modeText = body.querySelector(".mode-text"),
      chatBot = document.querySelector(".icon-background1"),
      bemVindo = document.querySelector(".bemvindo"),
      caixaMensage = document.querySelector(".caixa-mensagens"),
      chatContainer = document.querySelector('.chat-container'),
      msg = document.querySelector(".msg");

      toggle.addEventListener("click", () => {
        sidebar.classList.toggle("close");
        chatBot.classList.toggle("close");
        bemVindo.classList.toggle("close");
        caixaMensage.classList.toggle("close");
        msg.classList.toggle("close");
        chatContainer.classList.toggle("close");
      })

if (window.location.pathname.includes("notification.html")) {
    const seta = document.querySelector(".down"),
          fundo2 = document.querySelector(".fundo2"),
          tudo = document.querySelector(".fundo"),
          linha = document.querySelector(".linha");
            if (seta) { 
                seta.addEventListener("click", () => {
                    fundo2.classList.toggle("ativo")
                    seta.classList.toggle("ativo")
                    linha.classList.toggle("ativo")
                });
            } else {
                console.error("Elemento com id 'seta' não encontrado em notificacao.html.");
            }
        }

if (window.location.pathname.includes("likes.html")) {
    let likeCount = 0;

    document.getElementById('likeButton').addEventListener('click', function() {
        likeCount++;
    document.getElementById('likeCount').textContent = likeCount + " Likes";
});

}

     
modeSwitch.addEventListener("click", () => {
    body.classList.toggle("dark");

    const imgElement = document.querySelector(".img2");
    const imgElemen = document.querySelector(".img1");

        if (body.classList.contains("dark")) {
            modeText.innerText = "Modo Claro";
            // Alterar a imagem para a versão branca
            imgElement.src = "img/pra-cima-branca.png";
            imgElemen.src = "img/anexar-arquivo-branca.png";
        } else {
            modeText.innerText = "Modo Escuro";
            // Alterar a imagem para a versão preta
            imgElement.src = "img/pra-cima-preto.png";
            imgElemen.src = "img/anexar-arquivo-preto.png";
        }
});


// Função para enviar mensagens de texto
function enviarMensagem() {
    const entrada = document.getElementById('entrada').value;
    if (entrada.trim() !== '') {
        addMessageToChat('Você: ' + entrada, 'message');
        document.getElementById('entrada').value = '';
        setTimeout(() => {
            enviarMensagemParaBackend(entrada);
        }, 500);
    }
}

window.onload = function() {
    fetch('http://127.0.0.1:5000/mensagem_inicial')
        .then(response => response.json())
        .then(data => {
            digitarMensagem('ChatBOT: ' + data.response, 'chatbot-message');
        })
        .catch(error => {
            console.error('Erro ao obter a mensagem inicial:', error);
        });
};

function formatBoldText(message) {
    // Usa expressão regular para encontrar palavras entre ** e substitui por <span> com estilo
    return message.split('**').join('<b>').replace('<b>', '</b>');
}

// Função para adicionar mensagens ao chat
function addMessageToChat(mensagem, tipo) {
    const chatContainer = document.querySelector('.chat-container');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message'); 
    messageElement.classList.add(tipo); 
    messageElement.innerHTML = formatBoldText(mensagem);
    messageElement.textContent = mensagem;
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight; 
}

function digitarMensagem(mensagem) {
    const elementoMensagem = document.createElement('div');
    elementoMensagem.classList.add('message', 'chatbot-message'); // Adiciona a classe para estilização
    chatContainer.appendChild(elementoMensagem);
    chatContainer.scrollTop = chatContainer.scrollHeight; 

    let i = 0;

    function digitar() {
        if (i < mensagem.length) {
            elementoMensagem.textContent += mensagem.charAt(i);
            i++;
            setTimeout(digitar, 15); // Intervalo de 100ms entre cada letra
        }
    }
    
    digitar();
}

function enviarMensagemParaBackend(mensagem) {
    fetch('http://127.0.0.1:5000/chatbot', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: mensagem }), 
    })
        .then(response => response.json())
        .then(data => {
            digitarMensagem('ChatBOT: ' + data.response, 'chatbot-message');
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

function handleEnter(event) {
    if (event.key === 'Enter') {
        enviarMensagem();
    }
}

document.getElementById('file-input').addEventListener('change', function (event) {
    const file = event.target.files[0];

    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const chatContainer = document.querySelector('.caixa-mensagens');
            const imgElement = document.createElement('img');
            imgElement.src = e.target.result;
            imgElement.style.width = '50px'
            imgElement.style.height = '40px'
            imgElement.style.borderRadius = '10px';
            imgElement.style.marginLeft = '-400px'
            imgElement.style.marginTop = '30px'
            imgElement.style.transform = 'translateY(-40px)'
            imgElement.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

            chatContainer.appendChild(imgElement);

            const sendButton = document.querySelector('.caixa-mensagens .img2');
            sendButton.style.marginTop = '40px';
            sendButton.style.marginLeft = '184px'

            chatContainer.classList.add('image-active');

            chatContainer.scrollTop = chatContainer.scrollHeight;

            historicoMensagens.push(`Você enviou uma imagem: ${file.name}`);
        };
        reader.readAsDataURL(file); 
    } else {
        alert('Por favor, selecione um arquivo de imagem.');
    }

    function carregarHistorico() {
        const chatContainer = document.getElementById('historico');
        historicoMensagens.forEach(mensagem => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            messageElement.textContent = mensagem;
            chatContainer.appendChild(messageElement);
        });
        chatContainer.scrollTop = chatContainer.scrollHeight; 
    }

    window.onload = carregarHistorico;
});

document.getElementById("messageForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const messageInput = document.querySelector(".entrada");
    const messageText = messageInput.value.trim();
    
    if (messageText) {
        addMessage(messageText, "sent");
        messageInput.value = "";
    }
});

function addMessage(text, type) {
    const chatBox = document.getElementById("chatBox");
    const messageElement = document.createElement("div");
    
    messageElement.classList.add("message", type);
    messageElement.textContent = text;
    
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

document.getElementById("messageForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const messageInput = document.querySelector(".entrada");
    const messageText = messageInput.value.trim();
    
    if (messageText) {
        addMessage(messageText, "sent");
        messageInput.value = "";
    }
});

function addMessage(text, type) {
    const chatBox = document.getElementById("chatBox");
    const messageElement = document.createElement("div");
    
    messageElement.classList.add("message", type);
    messageElement.textContent = text;
    
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

document.addEventListener("keydown", (event) => {
    // Verifica se a tecla pressionada é a desejada (por exemplo, "A")
    if (event.key.toLowerCase() === "1") { // 'a' para maiúscula ou minúscula
        // Simula o clique no botão de áudio
        audioButton.click();
    }
});

// Verifique se o Annyang está disponível
const audioButton = document.getElementById("audioButton");
const messageInput = document.querySelector(".entrada");

let isRecording = false; // Variável para acompanhar o estado de gravação

if (annyang) {
    // Defina o idioma para português
    annyang.setLanguage("pt-BR");

    // Comando para capturar o que o usuário diz
    const commands = {
        

        '*text': function(text) {
            messageInput.value = text;
            addMessage(text, "sent");
        }
    };

    // Adicione os comandos ao Annyang
    annyang.addCommands(commands);

    // Ao clicar no botão, alterna entre iniciar e parar o reconhecimento de voz
    audioButton.addEventListener("click", () => {
        if (isRecording) {
            // Parar o reconhecimento
            annyang.abort();
            audioButton.innerHTML = '<i class="bx bxs-microphone"></i>';
            isRecording = false;
        } else {
            // Iniciar o reconhecimento
            annyang.start();
            // Substituir pelo loader
            audioButton.innerHTML = `
            <div class="loader">
                <div class="circle"><div class="dot"></div><div class="outline"></div></div>
                <div class="circle"><div class="dot"></div><div class="outline"></div></div>
                <div class="circle"><div class="dot"></div><div class="outline"></div></div>
                <div class="circle"><div class="dot"></div><div class="outline"></div></div>
            </div>
            `;
            isRecording = true;
        }
    });

    // Quando o reconhecimento de voz termina automaticamente, muda a cor do botão
    annyang.addCallback('end', function() {
        audioButton.style.backgroundColor = "var(--black-color)"; // Retorna ao estado de não gravação
        isRecording = false;
    });
} else {
    alert("Reconhecimento de voz não suportado neste navegador. Tente usar o Google Chrome.");
}

