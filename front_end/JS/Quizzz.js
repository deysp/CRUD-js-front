document.addEventListener("DOMContentLoaded", loadQuestion);

const questao = document.querySelector("#questao");
const opcoes = document.querySelector("#opcoes");
const proxima = document.querySelector("#proximo");
const mensagem = document.querySelector("#mensagem");
const contador = document.querySelector("#contador");
const acertosSpan = document.querySelector("#acertos");

let respostaCorreta = "";
let acertos = 0;
let contadorQuestoes = 0;
const limiteQuestoes = 10;

async function loadQuestion() {
  if (contadorQuestoes >= limiteQuestoes) {
    proxima.disabled = true;
    proxima.style.display = "none";
    opcoes.style.display = "none";
    contador.style.display = "none";
    questao.style.display = "none";
   const comemorar = document.createElement("img");
comemorar.src = "/projeto_quiz_frontend/imagens/comemoracao.gif"; // Verifique o caminho correto
comemorar.alt = "Imagem de comemoração"; // Adicione um atributo alt por acessibilidade
comemorar.style.display = "block"; // Certifique-se de que a imagem seja exibida
    comemorar.style.margin = "0 auto"; // Centraliza a imagem 
comemorar.style.width = "300px"; // Ajuste o tamanho conforme necessário
    comemorar.style.height = "auto"; // Mantém a proporção da imagem  
mensagem.innerHTML = `<div style="text-align: center;"><strong>Quiz finalizado! Você acertou ${acertos} de ${limiteQuestoes} questões.</strong></div>`;
mensagem.appendChild(comemorar); // Adicione ao body (ou elemento específico)

    return;
  }

  try {
    const resposta = await fetch("http://localhost:3000/perguntas", {});
    const questaoAtual = await resposta.json();
    console.log(questaoAtual);
    const questoes = questaoAtual[0];
    questao.innerText = questoes.enunciado;
    respostaCorreta = questoes.correta;

    contadorQuestoes++;
    contador.innerText = `Questão ${contadorQuestoes} de ${limiteQuestoes}`;

    opcoes.innerHTML = `
            <label><input type="radio" name="resposta" value="alternativa_a"> A) ${questoes.alternativa_a}</label><br>
            <label><input type="radio" name="resposta" value="alternativa_b"> B) ${questoes.alternativa_b}</label><br>
            <label><input type="radio" name="resposta" value="alternativa_c"> C) ${questoes.alternativa_c}</label><br>
            <label><input type="radio" name="resposta" value="alternativa_d"> D) ${questoes.alternativa_d}</label><br>
        `;

    mensagem.innerHTML = "";
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
    mensagem.innerHTML = `<span style="color: red;">Selecione uma opção antes de continuar.</span>`;
    return false;
  }

  const respostaSelecionada = opcoesMarcadas.value;

  if (respostaSelecionada === respostaCorreta) {
    acertos++;
  }
  return true;
}

proxima.addEventListener("click", (event) => {
  event.preventDefault();
  const Respondida = verificarResposta();

  if (!Respondida) {
    return;
  }
  loadQuestion();
});
