const container = document.querySelector('.container');
const registerbtn = document.querySelector('.register-btn');
const loginbtn = document.querySelector('.login-btn');

registerbtn.addEventListener('click', ()=>{
    container.classList.add('active');
});

loginbtn.addEventListener('click', ()=>{
    container.classList.remove('active');
});

function abrirPopup() {
    const overlay = document.getElementById('overlay');
    const popup = document.getElementById('popup');

    // Mostrar overlay e popup com animação
    overlay.style.display = 'block';
    popup.style.display = 'block';
    
    // Adicionar animação de opacidade
    setTimeout(() => {
        overlay.style.opacity = '1';
        popup.style.opacity = '1';
    }, 10);
}

function fecharPopup() {
    const overlay = document.getElementById('overlay');
    const popup = document.getElementById('popup');

    // Ocultar com animação de opacidade
    overlay.style.opacity = '0';
    popup.style.opacity = '0';

    // Aguardar a animação para ocultar completamente
    setTimeout(() => {
        overlay.style.display = 'none';
        popup.style.display = 'none';
    }, 500);
}
