document.addEventListener("DOMContentLoaded", loadQuestions);

const botao = document.querySelector('#cadastrar');
botao.addEventListener('click', async function (event) {
  event.preventDefault();

  const enunciado = document.querySelector('#enunciado').value
  const alternativa_a = document.querySelector('#alternativa_a').value
  const alternativa_b = document.querySelector('#alternativa_b').value
  const alternativa_c = document.querySelector('#alternativa_c').value
  const alternativa_d = document.querySelector('#alternativa_d').value
  const correta = document.querySelector('#Correta').value

  //* Verificação de campo
  if (!enunciado || !alternativa_a || !alternativa_b || !alternativa_c || !alternativa_d || !correta) {
    alert('Todos os campos são obrigatórios');
    return;
  }

  const res = await fetch('http://localhost:3000/perguntas', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      enunciado: enunciado,
      alternativa_a: alternativa_a,
      alternativa_b: alternativa_b,
      alternativa_c: alternativa_c,
      alternativa_d: alternativa_d,
      correta: correta
    })
  });

  if (res.status === 201) {
    alert('Questão adicionada com sucesso');
    loadQuestions();
    document.querySelector('form').reset();
  }
  else if (res.status === 409) {
    alert('A questão já existe')
    loadQuestions();
  }
  else if (res.status === 500) {
    alert('Erro inesperado')
  }
  else {
    console.error();
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
  hiddenIdInput.value = questoes.id_pergunta;
  hiddenIdInput.classList.add("question-id");

  const questionTitle = document.createElement("h3");
  questionTitle.classList.add("card-title");
  questionTitle.innerText = `Pergunta: ${questoes.enunciado}`;

  const alternatives = document.createElement("ul");
  alternatives.classList.add("card-alternatives");
  alternatives.innerText = `A: ${questoes.alternativa_a}
B: ${questoes.alternativa_b}
C: ${questoes.alternativa_c}
D: ${questoes.alternativa_d}`;

  let textoCorreto = "";
  if (questoes.correta === "alternativa_a") textoCorreto = questoes.alternativa_a;
  else if (questoes.correta === "alternativa_b") textoCorreto = questoes.alternativa_b;
  else if (questoes.correta === "alternativa_c") textoCorreto = questoes.alternativa_c;
  else if (questoes.correta === "alternativa_d") textoCorreto = questoes.alternativa_d;
  else textoCorreto = "Alternativa inválida";
  //* Questão correta
  const correctAnswer = document.createElement("p");
  correctAnswer.classList.add("card-correct-answer");
  correctAnswer.innerText = `Resposta correta: ${textoCorreto}`;

  //*Botao de delete
  const deleteButton = document.createElement("button");
  deleteButton.innerText = "Excluir";
  deleteButton.classList.add("delete-button");
  deleteButton.addEventListener("click", async () => {
    try {
      const response = await fetch(`http://localhost:3000/perguntas/${questoes.id_pergunta}`, {
        method: "DELETE",
      });
      if (response.ok) {
        alert('Pergunta excluída');
        card.remove();
      } else {
        alert("Erro ao deletar a pergunta.");
      }
    } catch (error) {
      console.error("Erro na exclusão:", error);
    }
  });

  //* Botão de editar
  const editbutton = document.createElement("button");
  editbutton.innerText = "Editar";
  editbutton.classList.add("edit-button");

  editbutton.addEventListener("click", () => {
    const modal = document.getElementById("modal-editar");

    document.getElementById("edit-enunciado").value = questoes.enunciado;
    document.getElementById("edit-a").value = questoes.alternativa_a;
    document.getElementById("edit-b").value = questoes.alternativa_b;
    document.getElementById("edit-c").value = questoes.alternativa_c;
    document.getElementById("edit-d").value = questoes.alternativa_d;
    document.getElementById("edit-correta").value = questoes.correta;

    document.getElementById("salvar-edicao").setAttribute("data-id", questoes.id_pergunta);

    modal.showModal();
  });
  //* Mostrar Cards
  card.append(questionTitle, hiddenIdInput, alternatives, correctAnswer, deleteButton, editbutton);
  questionList.appendChild(card);
}
//* Modal
document.getElementById("salvar-edicao").addEventListener("click", async (event) => {
  const id_pergunta = event.target.getAttribute("data-id");

  const atualizado = {
    newEnunciado: document.getElementById("edit-enunciado").value.trim(),
    alternativa_a: document.getElementById("edit-a").value.trim(),
    alternativa_b: document.getElementById("edit-b").value.trim(),
    alternativa_c: document.getElementById("edit-c").value.trim(),
    alternativa_d: document.getElementById("edit-d").value.trim(),
    correta: document.getElementById("edit-correta").value
  };
try{
  const response = await fetch(`http://localhost:3000/perguntas/${id_pergunta}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(atualizado)
  });
 if(response.ok ){
      alert("Editado com sucesso!")
      loadQuestions()
      
  }
  else{
    alert('Erro')
  }
}
catch(error){
  console.log('Erro ao Editar', error)
}
  document.getElementById("modal-editar").close();
  loadQuestions();
});

document.querySelector(".close-modal").addEventListener("click", () => {
  document.getElementById("modal-editar").close();
});