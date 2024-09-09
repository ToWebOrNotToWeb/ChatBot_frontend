const inputs = document.querySelectorAll('.fields input');

inputs.forEach(input => {
    const label = input.previousElementSibling;
    input.addEventListener('focus', () => {
        input.style.borderBottom = '2px solid var(--primary)';
        label.style.top = '0';
        label.style.fontSize = '1.2rem';
    });
    input.addEventListener('blur', () => {
        if (input.value === '') {
            input.style.borderBottom = '2px solid var(--accent)';  
            label.style.top = '40%';
            label.style.fontSize = '1.8rem';
        };
    });
});
