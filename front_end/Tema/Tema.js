document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  // 🔹 Sempre aplica o tema salvo, independente da página ter botão ou não
  const temaSalvo = localStorage.getItem("theme");
  if (temaSalvo === "dark") {
    body.classList.add("dark-mode");
  }

  // 🔹 Só adiciona evento se a página tiver botão
  function setupToggleButton(buttonId) {
    const button = document.getElementById(buttonId);
    if (!button) return; // Se não tem botão, não faz nada

    // Ajusta o ícone inicial do botão
    button.innerText = body.classList.contains("dark-mode") ? "☀️" : "🌙";

    button.addEventListener("click", () => {
      body.classList.toggle("dark-mode");

      if (body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
        button.innerText = "☀️";
      } else {
        localStorage.setItem("theme", "light");
        button.innerText = "🌙";
      }
    });
  }

  // Ativa os botões (se existirem na página)
  setupToggleButton("Trocar");
  setupToggleButton("Trocar2");
});
