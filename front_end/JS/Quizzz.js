document.addEventListener("DOMContentLoaded", loadQuestion);

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
let contadorQuestoes = 0;
const limiteQuestoes = 10;
let questoesAnteriores = [];
let questaoAtualGlobal = null;
let idUser = localStorage.getItem("id_user") || 0;
let respostasUsuario = [];

// histórico de questões
let historicoQuestoes = [];
let indiceAtual = -1;

function naoRepetirQuestoes(questaoAtual, questoesAnteriores) {
  return !questoesAnteriores.includes(questaoAtual.id_quest);
}

async function loadQuestion(avancar = true) {
  if (contadorQuestoes >= limiteQuestoes && avancar) {
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
      voltar.style.display = "none";
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

    if (avancar) {
      const resposta = await fetch("http://localhost:3000/perguntas");
      const questaoAtual = await resposta.json();

      let questoesValidas = questaoAtual.filter((q) =>
        naoRepetirQuestoes(q, questoesAnteriores)
      );

      const questoes =
        questoesValidas[Math.floor(Math.random() * questoesValidas.length)];

      questaoAtualGlobal = questoes;

      questoesAnteriores.push(questoes.id_quest);

      historicoQuestoes.push({ questao: questoes, resposta: null });
      indiceAtual++;

      contadorQuestoes++;
    } else {
      if (indiceAtual > 0) {
        indiceAtual--;
        questaoAtualGlobal = historicoQuestoes[indiceAtual].questao;
        contadorQuestoes--;
      }
    }

    questao.innerText = questaoAtualGlobal.enunciado;
    contador.innerText = `Questão ${contadorQuestoes} de ${limiteQuestoes}`;

    opcoes.innerHTML = `
      <label><input type="radio" name="resposta" value="alt_a">A) ${questaoAtualGlobal.alt_a}</label><br>
      <label><input type="radio" name="resposta" value="alt_b">B) ${questaoAtualGlobal.alt_b}</label><br>
      <label><input type="radio" name="resposta" value="alt_c">C) ${questaoAtualGlobal.alt_c}</label><br>
      <label><input type="radio" name="resposta" value="alt_d">D) ${questaoAtualGlobal.alt_d}</label><br>
      <label><input type="radio" name="resposta" value="alt_e">E) ${questaoAtualGlobal.alt_e}</label><br>
    `;

    const respostaSalva = historicoQuestoes[indiceAtual].resposta;
    if (respostaSalva) {
      const input = document.querySelector(
        `input[name="resposta"][value="${respostaSalva}"]`
      );
      if (input) input.checked = true;
    }

    mensagem.innerHTML = "";
    voltar.style.display = indiceAtual > 0 ? "block" : "none";
  } catch (error) {
    console.error("Erro ao carregar a questão:", error);
    questao.innerText = "Erro ao carregar a questão.";
  }
}

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

  historicoQuestoes[indiceAtual].resposta = opcoesMarcadas.value;

  respostasUsuario.push({
    id_quest: questaoAtualGlobal.id_quest,
    resposta: respostaSelecionada,
  });

  return true;
}

proxima.addEventListener("click", async (event) => {
  event.preventDefault();
  const Respondida = verificarResposta();
  if (!Respondida) {
    return;
  }
  loadQuestion(true);
});

voltar.addEventListener("click", (event) => {
  event.preventDefault();
  loadQuestion(false);
});

reiniciar.addEventListener("click", (event) => {
  window.location.reload();
  event.preventDefault();
  acertos = 0;
  contadorQuestoes = 0;
  questoesAnteriores = [];
  respostasUsuario = [];
  historicoQuestoes = [];
  indiceAtual = -1;
});
