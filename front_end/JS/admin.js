document.addEventListener("DOMContentLoaded", loadQuestions);

const botao = document.querySelector("#cadastrar");
botao.addEventListener("click", async function (event) {
  event.preventDefault();

  const enunciado = document.querySelector("#enunciado").value.trim();
  const alternativa_a = document.querySelector("#alternativa_a").value.trim();
  const alternativa_b = document.querySelector("#alternativa_b").value.trim();
  const alternativa_c = document.querySelector("#alternativa_c").value.trim();
  const alternativa_d = document.querySelector("#alternativa_d").value.trim();
  const alternativa_e = document.querySelector("#alternativa_e").value.trim();
  const correta = document.querySelector("#Correta").value.trim().toLowerCase();

  // Verifica se todos os campos estão preenchidos
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



  try {
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
        imagem: null,
      }),
    });

    const data = await res.json();

    if (res.status === 201) {
      alert("Questão adicionada com sucesso");
      await loadQuestions();
      document.querySelector("form").reset();
    } else if (res.status === 409) {
      alert(data || "A questão já existe");
      await loadQuestions();
    } else if (res.status === 400) {
      alert(data || "Dados incompletos");
    } else if (res.status === 500) {
      alert(data || "Erro inesperado");
    } else {
      alert("Erro desconhecido: " + res.status);
      console.error("Erro ao cadastrar:", res.status, data);
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
    alert("Erro na comunicação com o servidor");
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
  if (questoes.correta === "a") textoCorreto = questoes.alt_a;
  else if (questoes.correta === "b") textoCorreto = questoes.alt_b;
  else if (questoes.correta === "c") textoCorreto = questoes.alt_c;
  else if (questoes.correta === "d") textoCorreto = questoes.alt_d;
  else if (questoes.correta === "e") textoCorreto = questoes.alt_e;
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
document.getElementById("salvar-edicao").addEventListener("click", async (event) => {
  const id_quest = event.target.getAttribute("data-id");

  const atualizacao = {
    newEnunciado: document.getElementById("edit-enunciado").value.trim(),
    alt_a: document.getElementById("edit-a").value.trim(),
    alt_b: document.getElementById("edit-b").value.trim(),
    alt_c: document.getElementById("edit-c").value.trim(),
    alt_d: document.getElementById("edit-d").value.trim(),
    alt_e: document.getElementById("edit-e").value.trim(),
    correta: document.getElementById("edit-correta").value.trim().toLowerCase(),
  };

  console.log(atualizacao)

  try {
    const response = await fetch(
      `http://localhost:3000/perguntas/${id_quest}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(atualizacao),
      }
    );

    if (response.status === 204) {
      alert("Editado com sucesso!");
      loadQuestions();
    } else if (response.status === 409) {
      alert("Já existe uma pergunta com esse enunciado ou valor da alternativa incorreta.");
    } else if (response.status === 400) {
      alert("Todos os campos são obrigatórios.");
    } else {
      alert("Erro ao editar.");
    }
  } catch (error) {
    console.log("Erro ao Editar", error);
    alert("Erro na comunicação com o servidor.");
  }

  document.getElementById("modal-editar").close();
});
