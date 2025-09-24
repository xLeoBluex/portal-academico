// receiver-ui.js (versão atualizada)

// Criar partículas animadas
function createParticles() {
  const particlesContainer = document.getElementById('particles');
  const particleCount = 35;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const size = Math.random() * 12 + 4;
    const positionX = Math.random() * window.innerWidth;
    const positionY = Math.random() * window.innerHeight;
    const animationDelay = Math.random() * 12;
    
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = positionX + 'px';
    particle.style.top = positionY + 'px';
    particle.style.animationDelay = animationDelay + 's';
    
    particlesContainer.appendChild(particle);
  }
}

// Funções utilitárias
function formatTime(timestamp) {
  return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit'
  }).format(timestamp);
}

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// Mostrar notificação toast
function showNotification(message = 'Novo comunicado recebido!') {
  const toast = document.getElementById('notificationToast');
  if (!toast) return;
  const textElement = toast.querySelector('.notification-text');
  
  textElement.textContent = message;
  toast.classList.add('show');
  
  playNotificationSound();
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

function playNotificationSound() {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (e) {
    console.log('Não foi possível tocar o som de notificação');
  }
}

// --- Segurança: escapar HTML antes de inserir ---
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[&<>"']/g, function (m) {
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m];
  });
}

// Transformar URLs em <a>, aceitando http(s):// e www.
function linkify(text) {
  if (!text) return '';
  const escaped = escapeHtml(text);

  // Captura https://..., http://... e www...
  const urlRegex = /(\b(?:https?:\/\/|www\.)[^\s<>()]+[^\s<>()\.,;:!?])/gi;

  return escaped.replace(urlRegex, function (match) {
    let url = match;
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url; // adiciona protocolo para links "www..."
    }
    // aria-label para acessibilidade
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" aria-label="Abrir ${match} em nova aba">${match}</a>`;
  });
}

// Adicionar comunicado à lista
function addComunicadoToList(comunicado) {
  const lista = document.getElementById('listaComunicados');
  if (!lista) return;
  const emptyState = document.getElementById('emptyState');
  
  if (emptyState) {
    emptyState.remove();
  }
  
  const li = document.createElement('li');
  li.className = 'comunicado-item new';
  li.dataset.id = comunicado.id || generateId();
  
  const currentTime = formatTime(new Date());
  // Aplica linkify e preserva quebras de linha
  const mensagemHtml = linkify(comunicado.mensagem || 'Mensagem do comunicado').replace(/\n/g, '<br>');
  
  li.innerHTML = `
    <div class="new-badge">NOVO</div>
    <div class="comunicado-header">
      <h3 class="comunicado-title">${escapeHtml(comunicado.titulo || 'Comunicado')}</h3>
      <span class="comunicado-time">${currentTime}</span>
    </div>
    <div class="comunicado-message">${mensagemHtml}</div>
    <div class="comunicado-footer">
      <div class="comunicado-actions">
        <button class="action-btn mark-read" onclick="markAsRead('${li.dataset.id}')">
          ✓ Marcar como lido
        </button>
        <button class="action-btn delete" onclick="deleteComunicado('${li.dataset.id}')">
          🗑️ Excluir
        </button>
      </div>
    </div>
  `;
  
  lista.insertBefore(li, lista.firstChild);

  setTimeout(() => {
    const badge = li.querySelector('.new-badge');
    if (badge) {
      badge.style.animation = 'fadeOut 0.5s ease-out';
      setTimeout(() => badge.remove(), 500);
    }
    li.classList.remove('new');
  }, 10000);

  showNotification(`Novo comunicado: ${comunicado.titulo || 'Sem título'}`);
}

// Marcar como lido
function markAsRead(id) {
  const item = document.querySelector(`[data-id="${id}"]`);
  if (item) {
    item.style.opacity = '0.7';
    item.style.background = '#f8f9fa';
    
    const markBtn = item.querySelector('.mark-read');
    if (markBtn) {
      markBtn.innerHTML = '✓ Lido';
      markBtn.disabled = true;
      markBtn.style.opacity = '0.5';
      markBtn.style.cursor = 'default';
    }
  }
}

// Excluir comunicado
function deleteComunicado(id) {
  const item = document.querySelector(`[data-id="${id}"]`);
  if (item && confirm('Tem certeza que deseja excluir este comunicado?')) {
    item.style.animation = 'fadeOut 0.5s ease-out';
    item.style.transform = 'translateX(-100%)';
    
    setTimeout(() => {
      item.remove();
      
      const lista = document.getElementById('listaComunicados');
      // se não houver mais <li>, mostrar estado vazio
      if (lista && lista.querySelectorAll('li').length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.id = 'emptyState';
        emptyState.innerHTML = `
          <div class="icon">📬</div>
          <h3>Nenhum comunicado</h3>
          <p>Todos os comunicados foram removidos.</p>
        `;
        lista.appendChild(emptyState);
      }
    }, 500);
  }
}

// Inicializar página
window.addEventListener('load', () => {
  createParticles();
});

// Recriar partículas ao redimensionar
window.addEventListener('resize', () => {
  const particles = document.getElementById('particles');
  if (particles) particles.innerHTML = '';
  createParticles();
});

// Expor funções globalmente
window.addComunicadoToList = addComunicadoToList;
window.markAsRead = markAsRead;
window.deleteComunicado = deleteComunicado;
