document.addEventListener("DOMContentLoaded", loadQuestions())
const botao = document.querySelector('#cadastrar')
botao.addEventListener('click', async function(event){
    event.preventDefault(); // Impede o envio do formulário
  
  const enunciado = document.querySelector('#enunciado').value;
  const alternativa_a = document.querySelector('#alternativa_a').value;
  const alternativa_b = document.querySelector('#alternativa_b').value;
  const alternativa_c = document.querySelector('#alternativa_c').value;
  const alternativa_d = document.querySelector('#alternativa_d').value;
  const correta = document.querySelector('#correta').value;
  

  const res = await fetch('http://192.168.1.9:3000/Cperguntas',{
      method: "POST",
      headers: {
          "Content-Type": "application/json" // Adiciona o cabeçalho correto
      },
      body: JSON.stringify({
          enunciado: enunciado,
          alternativa_a: alternativa_a,
          alternativa_b: alternativa_b,
          alternativa_c: alternativa_c,
          alternativa_d: alternativa_d,
          correta: correta,
               
      })
  });
  
  if(res.status == 200){
    alert('Questões adicionadas com sucesso')
  }
  else if(res.status == 500){
    alert('Ops...houve um erro ao adicionar')
  } 
  
  })


  async function loadQuestions() {
    const questionList = document.getElementById("questionList");
    questionList.innerHTML = ""; // Limpa a lista antes de carregar

    try {
        const response = await fetch("http://192.168.1.9:3000/Bperguntas");
        const questions = await response.json();

        // console.log(questions); // Apenas para garantir que estamos recebendo as perguntas

        // Adiciona cada pergunta à lista
        // questions.map((questao) => addQuestionToPage(questao));
        questions.forEach((questao, index) => {
          // console.log(`Processando pergunta ${index + 1}:`, questao); // Log para depuração
          addQuestionToPage(questao);
      });
    } catch (error) {
        return(error)
    }
}

    async function addQuestionToPage(questao) {
    const questionList = document.getElementById("questionList");

    // Cria o card
    const card = document.createElement("div");
    card.inputMode =
    card.classList.add("card");


    const hiddenIdInput = document.createElement("input");
    hiddenIdInput.type = "hidden";
    hiddenIdInput.value = questao.id;
    hiddenIdInput.classList.add("question-id");
  

    // Título da pergunta
    const questionTitle = document.createElement("h3");
    questionTitle.classList.add("card-title");
    questionTitle.innerText = `Pergunta: ${questao.enunciado}`;

    // Alternativas
    const alternatives = document.createElement("ul");
    alternatives.classList.add("card-alternatives");

    ["a", "b", "c", "d"].forEach((key) => {
      const alternative = document.createElement("li");
      alternative.innerText = `${key.toUpperCase()}: ${questao[key]}`;
      alternatives.appendChild(alternative);
    });

    // Resposta correta
    const correctAnswer = document.createElement("p");
    correctAnswer.classList.add("card-correct-answer");
    correctAnswer.innerText = `Resposta correta: ${questao.correta}`;


    //* Botão de deletar
  const deleteButton = document.createElement("button");
deleteButton.innerText = "Excluir";
deleteButton.classList.add("delete-button");
deleteButton.addEventListener("click", async () => {
  try {
    const response = await fetch(`http://192.168.1.9:3000/Delete/${questao.id}`, {
      method: "DELETE",
  
    });
    if (response.ok) {
      alert('Pergunta excluida')
      card.remove(); // Remove o card da tela
    } else {
      alert("Erro ao deletar a pergunta.");
    }
  } catch (error) {
    console.error("Erro na exclusão:", error);
  }
});

// !MODAL!
const editButton = document.createElement("button");
editButton.innerText = "Editar";
editButton.classList.add("edit-button");

// Adiciona o evento de clique ao botão de editar
editButton.addEventListener("click", async () => {
  try {
    const response = await fetch(`http://192.168.1.9:3000/editar/${questao.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        newEnunciado : "newEnunciado",
        alternativa_a : "alternativa_a",
        alternativa_c : "alternativa_c",
        alternativa_d : "alternativa_d",
        correta: "correta"
      })
    });

    if (response.ok) {
      console.log("Questão editada com sucesso!");
    } else {
      console.error("Erro ao editar a questão.");
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
  }
});

// adiciona eventos para abrir modais
const openButtons = document.querySelectorAll(".open-modal");

openButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modalId = button.getAttribute("data-modal");
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.showModal();
    }
  });
});

// Monta o card
card.append(questionTitle,  hiddenIdInput,  alternatives, correctAnswer, deleteButton, editButton, openButtons);

    // Adiciona o card ao contêiner de perguntas
    questionList.appendChild(card);
  }
