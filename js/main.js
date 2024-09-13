const burgerBtn = document.querySelector('#burger');
const closeBtn = document.querySelector('#close');
const aside = document.querySelector('aside');

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