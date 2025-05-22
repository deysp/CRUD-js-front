document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    
    function setupToggleButton(buttonId) {
        const button = document.getElementById(buttonId);
        if (!button) return; // Sai se botão não existir
    
        // Aplica o tema salvo
        const temaSalvo = localStorage.getItem('theme');
        if (temaSalvo === 'dark') {
            body.classList.add('dark-mode');
            button.innerText = '☀️'; // Atualiza o texto do botão
        } else {
            button.innerText = '🌙';
        }
    
        button.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
    
            // Salva a preferência
            if (body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
                button.innerText = '☀️';
            } else {
                localStorage.setItem('theme', 'light');
                button.innerText = '🌙';
            }
        });
    }

    setupToggleButton('Trocar');
    setupToggleButton('Trocar2');
});
