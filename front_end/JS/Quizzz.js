document.addEventListener("DOMContentLoaded", () => {
  carregarQuestoesDoServidor();
});

const questao = document.querySelector("#questao");
const opcoes = document.querySelector("#opcoes");
const proxima = document.querySelector("#proximo");
const voltar = document.querySelector("#voltar");
const mensagem = document.querySelector("#mensagem");
const contador = document.querySelector("#contador");
const acertosSpan = document.querySelector("#acertos");
const reiniciar = document.querySelector("#reiniciar");
const ranking = document.querySelector(".ranking");

let acertos = 0;
let idUser = localStorage.getItem("id_user") || 0;
let respostasUsuario = [];

let questaoAtual = [];
let indiceAtual = 0;
let questaoAtualGlobal = null;
const limiteQuestoes = 10;

// exibir questão
function loadQuestion() {
  if (questaoAtual.length === 0) {
    questao.innerText = "Nenhuma questão disponível.";
    return;
  }

  questaoAtualGlobal = questaoAtual[indiceAtual];

  questao.innerText = questaoAtualGlobal.enunciado;
  contador.innerText = `Questão ${indiceAtual + 1} de ${limiteQuestoes}`;

  opcoes.innerHTML = `
    <label><input type="radio" name="resposta" value="alt_a">A) ${questaoAtualGlobal.alt_a}</label><br>
    <label><input type="radio" name="resposta" value="alt_b">B) ${questaoAtualGlobal.alt_b}</label><br>
    <label><input type="radio" name="resposta" value="alt_c">C) ${questaoAtualGlobal.alt_c}</label><br>
    <label><input type="radio" name="resposta" value="alt_d">D) ${questaoAtualGlobal.alt_d}</label><br>
    <label><input type="radio" name="resposta" value="alt_e">E) ${questaoAtualGlobal.alt_e}</label><br>
  `;

  // restaura resposta
  const respostaSalva = respostasUsuario.find(
    (r) => r.id_quest === questaoAtualGlobal.id_quest
  );
  if (respostaSalva) {
    const input = document.querySelector(
      `input[name="resposta"][value="alt_${respostaSalva.resposta}"]`
    );
    if (input) input.checked = true;
  }

  mensagem.innerHTML = "";
  voltar.style.display = indiceAtual > 0 ? "block" : "none";

  // botão próximo deve aparecer em todas as 10 questões
  proxima.style.display = "block";
}

// carregar questões
async function carregarQuestoesDoServidor() {
  try {
    const resposta = await fetch("http://localhost:3000/perguntas");
    let todasQuestoes = await resposta.json();

    // limitar para 10 questões aleatórias
    while (todasQuestoes.length > limiteQuestoes) {
      todasQuestoes.splice(Math.floor(Math.random() * todasQuestoes.length), 1);
    }

    questaoAtual = todasQuestoes;
    indiceAtual = 0;
    reiniciar.style.display = "none"; // botão reiniciar escondido até o final
    loadQuestion();
  } catch (error) {
    console.error("Erro ao carregar questões do servidor:", error);
    questao.innerText = "Erro ao carregar questões.";
  }
}

// verificar resposta
function verificarResposta() {
  const opcoesMarcadas = document.querySelector(
    'input[name="resposta"]:checked'
  );

  if (!opcoesMarcadas) {
    mensagem.innerHTML =
      '<span style="color: red;">Selecione uma opção antes de continuar.</span>';
    return false;
  }

  const respostaSelecionada = opcoesMarcadas.value.split("_")[1];

  const idx = respostasUsuario.findIndex(
    (r) => r.id_quest === questaoAtualGlobal.id_quest
  );
  if (idx >= 0) {
    respostasUsuario[idx].resposta = respostaSelecionada;
  } else {
    respostasUsuario.push({
      id_quest: questaoAtualGlobal.id_quest,
      resposta: respostaSelecionada,
    });
  }

  return true;
}

// finalizar quiz
async function finalizarQuiz() {
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

    proxima.disabled = true;
    proxima.style.display = "none";
    voltar.style.display = "none";
    opcoes.style.display = "none";
    contador.style.display = "none";
    questao.style.display = "none";

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

    // Exibir botão reiniciar igual código antigo
    reiniciar.disabled = false;
    reiniciar.style.display = "block";
    ranking.style.display = "flex";
  } catch (error) {
    console.error("Erro ao enviar respostas finais:", error);
    mensagem.innerHTML =
      "<p style='color:red;'>Erro ao enviar respostas para o servidor.</p>";
  }
}

// próximo
proxima.addEventListener("click", async (event) => {
  event.preventDefault();
  const Respondida = verificarResposta();
  if (!Respondida) return;

  if (indiceAtual < limiteQuestoes - 1) {
    indiceAtual++;
    loadQuestion();
  } else {
    finalizarQuiz();
  }
});

// voltar
voltar.addEventListener("click", (event) => {
  event.preventDefault();
  if (indiceAtual > 0) {
    indiceAtual--;
    loadQuestion();
  }
});

// reiniciar igual código antigo
reiniciar.addEventListener("click", (event) => {
  window.location.reload();
  event.preventDefault();
  acertos = 0;
  respostasUsuario = [];
  questaoAtual = [];
  indiceAtual = 0;
});
