document.addEventListener("DOMContentLoaded", () => {
  loadQuestions();

  const botao = document.querySelector("#cadastrar");
  botao.addEventListener("click", async function (event) {
    event.preventDefault();

    const enunciado = document.querySelector("#enunciado").value.trim();
    const alternativas = [
      document.querySelector("#a").value.trim(),
      document.querySelector("#b").value.trim(),
      document.querySelector("#c").value.trim(),
      document.querySelector("#d").value.trim(),
      document.querySelector("#e").value.trim(),
    ];

    const correta = document
      .querySelector("#Correta")
      .value.trim()
      .slice(-1)
      .toLowerCase();
    // "A" => "a", "B" => "b", etc.

    // Verifica se todos os campos estão preenchidos
    if (!enunciado || alternativas.some((a) => a === "") || !correta) {
      alert("Todos os campos são obrigatórios");
      return;
    }

    try {
      // Aqui enviamos alternativas como string única separada por ";"
      const res = await fetch("http://localhost:3000/perguntas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enunciado,
          alternativas: alternativas.join(";"), // "altA;altB;altC;altD;altE"
          correta, // só a letra "a", "b", etc
          imagem: null,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 201) {
        alert("Questão adicionada com sucesso");
        await loadQuestions();
        document.querySelector("form").reset();
      } else if (res.status === 409) {
        alert(data.message || "A questão já existe");
        await loadQuestions();
      } else if (res.status === 400) {
        alert(data.message || "Dados incompletos");
      } else {
        alert("Erro desconhecido: " + res.status);
        console.error("Erro ao cadastrar:", res.status, data);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro na comunicação com o servidor");
    }
  });
});

// Carregar questões
async function loadQuestions() {
  const questionList = document.getElementById("questionList");
  questionList.innerHTML = "";

  try {
    const response = await fetch("http://localhost:3000/perguntas");
    const questions = await response.json();

    questions.forEach((questao) => {
      addQuestionToPage(questao);
    });
  } catch (error) {
    console.error("Erro ao carregar perguntas:", error);
  }
}

// Renderizar Cards
function addQuestionToPage(questao) {
  const questionList = document.getElementById("questionList");

  const card = document.createElement("div");
  card.classList.add("card");

  const questionTitle = document.createElement("h3");
  questionTitle.classList.add("card-title");
  questionTitle.innerText = `Pergunta: ${questao.enunciado}`;

  // Separar alternativas usando split
  const alternativas = questao.alternativas.split(";");
  const alternativesList = document.createElement("ul");
  alternativesList.classList.add("card-alternatives");
  alternativesList.innerHTML = `
    <li>A: ${alternativas[0]}</li>
    <li>B: ${alternativas[1]}</li>
    <li>C: ${alternativas[2]}</li>
    <li>D: ${alternativas[3]}</li>
    <li>E: ${alternativas[4]}</li>
  `;

  const textoCorreto =
    alternativas[{ a: 0, b: 1, c: 2, d: 3, e: 4 }[questao.correta]];

  const correctAnswer = document.createElement("p");
  correctAnswer.classList.add("card-correct-answer");
  correctAnswer.innerText = `Resposta correta: ${textoCorreto}`;

  const deleteButton = document.createElement("button");
  deleteButton.innerText = "Excluir";
  deleteButton.classList.add("delete-button");
  deleteButton.addEventListener("click", async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/perguntas/${questao.id_quest}`,
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

  const editButton = document.createElement("button");
  editButton.innerText = "Editar";
  editButton.classList.add("edit-button");
  editButton.addEventListener("click", () => {
    const modal = document.getElementById("modal-editar");

    const editAlt = alternativas; // usar split também no modal
    document.getElementById("edit-enunciado").value = questao.enunciado;
    document.getElementById("edit-a").value = editAlt[0];
    document.getElementById("edit-b").value = editAlt[1];
    document.getElementById("edit-c").value = editAlt[2];
    document.getElementById("edit-d").value = editAlt[3];
    document.getElementById("edit-e").value = editAlt[4];
    document.getElementById("edit-correta").value = questao.correta;

    document
      .getElementById("salvar-edicao")
      .setAttribute("data-id", questao.id_quest);
    modal.showModal();
  });

  card.append(
    questionTitle,
    alternativesList,
    correctAnswer,
    deleteButton,
    editButton
  );
  questionList.appendChild(card);
}
