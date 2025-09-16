document.addEventListener("DOMContentLoaded", loadQuestions);

const botao = document.querySelector("#cadastrar");
botao.addEventListener("click", async function (event) {
  event.preventDefault();

  const enunciado = document.querySelector("#enunciado").value;
  const alternativa_a = document.querySelector("#alternativa_a").value;
  const alternativa_b = document.querySelector("#alternativa_b").value;
  const alternativa_c = document.querySelector("#alternativa_c").value;
  const alternativa_d = document.querySelector("#alternativa_d").value;
  const alternativa_e = document.querySelector("#alternativa_e").value;
  const correta = document.querySelector("#Correta").value;

  if (
    !enunciado ||
    !alternativa_a ||
    !alternativa_b ||
    !alternativa_c ||
    !alternativa_d ||
    !alternativa_e ||
    !correta
  ) {
    alert("Todos os campos são obrigatórios");
    return;
  }

  const res = await fetch("http://localhost:3000/perguntas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      enunciado,
      alt_a: alternativa_a,
      alt_b: alternativa_b,
      alt_c: alternativa_c,
      alt_d: alternativa_d,
      alt_e: alternativa_e,
      correta,
    }),
  });

  if (res.status === 201) {
    alert("Questão adicionada com sucesso");
    loadQuestions();
    document.querySelector("form").reset();
  } else if (res.status === 409) {
    alert("A questão já existe");
    loadQuestions();
  } else if (res.status === 500) {
    alert("Erro inesperado");
  } else {
    console.error("Erro ao cadastrar:", res.status);
  }
});

//*Carregar questões
async function loadQuestions() {
  const questionList = document.getElementById("questionList");
  questionList.innerHTML = "";

  try {
    const response = await fetch("http://localhost:3000/perguntas");
    const questions = await response.json();

    questions.forEach((questoes) => {
      addQuestionToPage(questoes);
    });
  } catch (error) {
    console.error("Erro ao carregar perguntas:", error);
  }
}

//* Cards
async function addQuestionToPage(questoes) {
  const questionList = document.getElementById("questionList");

  const card = document.createElement("div");
  card.classList.add("card");

  const hiddenIdInput = document.createElement("input");
  hiddenIdInput.type = "hidden";
  hiddenIdInput.value = questoes.id_quest;
  hiddenIdInput.classList.add("question-id");

  const questionTitle = document.createElement("h3");
  questionTitle.classList.add("card-title");
  questionTitle.innerText = `Pergunta: ${questoes.enunciado}`;

  const alternatives = document.createElement("ul");
  alternatives.classList.add("card-alternatives");
  alternatives.innerHTML = `
    <li>A: ${questoes.alt_a}</li>
    <li>B: ${questoes.alt_b}</li>
    <li>C: ${questoes.alt_c}</li>
    <li>D: ${questoes.alt_d}</li>
    <li>E: ${questoes.alt_e}</li>
  `;

  let textoCorreto = "";
  if (questoes.correta === "alternativa_a") textoCorreto = questoes.alt_a;
  else if (questoes.correta === "alternativa_b") textoCorreto = questoes.alt_b;
  else if (questoes.correta === "alternativa_c") textoCorreto = questoes.alt_c;
  else if (questoes.correta === "alternativa_d") textoCorreto = questoes.alt_d;
  else if (questoes.correta === "alternativa_e") textoCorreto = questoes.alt_e;
  else textoCorreto = "Alternativa inválida";

  const correctAnswer = document.createElement("p");
  correctAnswer.classList.add("card-correct-answer");
  correctAnswer.innerText = `Resposta correta: ${textoCorreto}`;

  const deleteButton = document.createElement("button");
  deleteButton.innerText = "Excluir";
  deleteButton.classList.add("delete-button");
  deleteButton.addEventListener("click", async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/perguntas/${questoes.id_quest}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        alert("Pergunta excluída");
        card.remove();
      } else {
        alert("Erro ao deletar a pergunta.");
      }
    } catch (error) {
      console.error("Erro na exclusão:", error);
    }
  });

  const editbutton = document.createElement("button");
  editbutton.innerText = "Editar";
  editbutton.classList.add("edit-button");

  editbutton.addEventListener("click", () => {
    const modal = document.getElementById("modal-editar");

    document.getElementById("edit-enunciado").value = questoes.enunciado;
    document.getElementById("edit-a").value = questoes.alt_a;
    document.getElementById("edit-b").value = questoes.alt_b;
    document.getElementById("edit-c").value = questoes.alt_c;
    document.getElementById("edit-d").value = questoes.alt_d;
    document.getElementById("edit-e").value = questoes.alt_e;
    document.getElementById("edit-correta").value = questoes.correta;

    document
      .getElementById("salvar-edicao")
      .setAttribute("data-id", questoes.id_quest);

    modal.showModal();
  });

  card.append(
    questionTitle,
    hiddenIdInput,
    alternatives,
    correctAnswer,
    deleteButton,
    editbutton
  );
  questionList.appendChild(card);
}

//* Modal
document
  .getElementById("salvar-edicao")
  .addEventListener("click", async (event) => {
    const id_quest = event.target.getAttribute("data-id");

    const atualizado = {
      enunciado: document.getElementById("edit-enunciado").value.trim(),
      alt_a: document.getElementById("edit-a").value.trim(),
      alt_b: document.getElementById("edit-b").value.trim(),
      alt_c: document.getElementById("edit-c").value.trim(),
      alt_d: document.getElementById("edit-d").value.trim(),
      alt_e: document.getElementById("edit-e").value.trim(),
      correta: document.getElementById("edit-correta").value,
    };

    try {
      const response = await fetch(
        `http://localhost:3000/perguntas/${id_quest}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(atualizado),
        }
      );
      if (response.ok) {
        alert("Editado com sucesso!");
        loadQuestions();
      } else {
        alert("Erro ao editar");
      }
    } catch (error) {
      console.log("Erro ao Editar", error);
    }

    document.getElementById("modal-editar").close();
  });

document.querySelector(".close-modal").addEventListener("click", () => {
  document.getElementById("modal-editar").close();
});
