document.addEventListener("DOMContentLoaded", loadQuestion);

const questao = document.querySelector("#questao");
const opcoes = document.querySelector("#opcoes");
const proxima = document.querySelector("#proximo");
const mensagem = document.querySelector("#mensagem");
const contador = document.querySelector("#contador");
const acertosSpan = document.querySelector("#acertos");
const reiniciar = document.querySelector("#reiniciar");
const ranking = document.querySelector(".ranking");

let acertos = 0;
let contadorQuestoes = 0;
const limiteQuestoes = 10;
let questoesAnteriores = []; // guarda os IDs das questões já usadas
let questaoAtualGlobal = null; // guarda a questão atual exibida
let idUser = localStorage.getItem("id_user") || 0;
let respostasUsuario = []; // armazena todas as respostas até o final

// Função para não repetir questões
function naoRepetirQuestoes(questaoAtual, questoesAnteriores) {
  return !questoesAnteriores.includes(questaoAtual.id_quest);
}

// Função para carregar a próxima questão
async function loadQuestion() {
  if (contadorQuestoes >= limiteQuestoes) {
    try {
      const resposta = await fetch("http://localhost:3000/perguntas/correcao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_user: idUser,
          respostas: respostasUsuario,
        }),
      });

      const resultado = await resposta.json();

      // Esconde partes do quiz
      proxima.disabled = true;
      proxima.style.display = "none";
      opcoes.style.display = "none";
      contador.style.display = "none";
      questao.style.display = "none";

      // Mensagem de finalização
      const comemorar = document.createElement("img");
      comemorar.src = "../../imagens/comemoracao.gif";
      comemorar.alt = "Imagem de comemoração";
      comemorar.style.display = "block";
      comemorar.style.margin = "0 auto";
      comemorar.style.width = "300px";
      comemorar.style.height = "auto";

      mensagem.innerHTML = `
        <div style="text-align: center; margin-bottom: 15px;">
          <strong>Quiz finalizado! Você acertou ${resultado.acertosTentativa} de ${limiteQuestoes}.</strong>
        </div>
      `;
      mensagem.appendChild(comemorar);

      // Exibir botão reiniciar
      reiniciar.disabled = false;
      reiniciar.style.display = "block";
      ranking.style.display = "flex";

      // Exibir ranking dentro do card azul
      const rankingSection = document.getElementById("ranking-section");
      rankingSection.style.display = "block";

      // Chama a função do outro script (ranking.js)
      if (typeof carregarAcertos === "function") {
        carregarAcertos();
      }

      return;
    } catch (error) {
      console.error("Erro ao enviar respostas finais:", error);
      mensagem.innerHTML =
        "<p style='color:red;'>Erro ao enviar respostas para o servidor.</p>";
      return;
    }
  }

  try {
    reiniciar.style.display = "none";

    const resposta = await fetch("http://localhost:3000/perguntas");
    const questaoAtual = await resposta.json();

    // escolher uma questão aleatória que ainda não foi usada
    let questoesValidas = questaoAtual.filter((q) =>
      naoRepetirQuestoes(q, questoesAnteriores)
    );

    // escolhe uma questão aleatória dentre as válidas
    const questoes =
      questoesValidas[Math.floor(Math.random() * questoesValidas.length)];

    // salvar a questão atual globalmente
    questaoAtualGlobal = questoes;

    // salvar o ID da questão já usada
    questoesAnteriores.push(questoes.id_quest);

    questao.innerText = questoes.enunciado;
    contadorQuestoes++;
    contador.innerText = `Questão ${contadorQuestoes} de ${limiteQuestoes}`;

    opcoes.innerHTML = `
      <label><input type="radio" name="resposta" value="alt_a">A) ${questoes.alt_a}</label><br>
      <label><input type="radio" name="resposta" value="alt_b">B) ${questoes.alt_b}</label><br>
      <label><input type="radio" name="resposta" value="alt_c">C) ${questoes.alt_c}</label><br>
      <label><input type="radio" name="resposta" value="alt_d">D) ${questoes.alt_d}</label><br>
      <label><input type="radio" name="resposta" value="alt_e">E) ${questoes.alt_e}</label><br>
    `;

    mensagem.innerHTML = "";
  } catch (error) {
    console.error("Erro ao carregar a questão:", error);
    questao.innerText = "Erro ao carregar a questão.";
  }
}

// Função para verificar a resposta selecionada e armazenar no array
function verificarResposta() {
  const opcoesMarcadas = document.querySelector(
    'input[name="resposta"]:checked'
  );

  if (!opcoesMarcadas) {
    mensagem.innerHTML =
      '<span style="color: red;">Selecione uma opção antes de continuar.</span>';
    return false;
  }

  const respostaSelecionada = opcoesMarcadas.value.split("_")[1]; // extrai apenas a letra da resposta

  // Armazena no array de respostas do usuário
  respostasUsuario.push({
    id_quest: questaoAtualGlobal.id_quest,
    resposta: respostaSelecionada,
  });

  return true;
}

// Botão de próxima questão
proxima.addEventListener("click", async (event) => {
  event.preventDefault();
  const Respondida = verificarResposta();
  if (!Respondida) {
    return;
  }
  loadQuestion();
});

// Botão de reiniciar
reiniciar.addEventListener("click", (event) => {
  window.location.reload();
  event.preventDefault();
  acertos = 0;
  contadorQuestoes = 0;
  questoesAnteriores = [];
  respostasUsuario = [];
});
