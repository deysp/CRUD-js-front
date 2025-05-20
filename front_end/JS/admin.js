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
  

  const res = await fetch('http://localhost:3000/perguntas',{

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
  
     if (
            !enunciado || enunciado === "" ||
            !alternativa_a || alternativa_a === "" ||
            !alternativa_b || alternativa_b === "" ||
            !alternativa_c || alternativa_c === "" ||
            !alternativa_d || alternativa_d === "" ||
            !correta || correta === ""
        ) {
            return res.status(400).json('Todos os campos são obrigatórios')
        }
  
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
        const response = await fetch("http://localhost:3000/perguntas");
        const questions = await response.json();

        console.log(questions); // Apenas para garantir que estamos recebendo as perguntas

        // Adiciona cada pergunta à lista
        // questions.map((questao) => addQuestionToPage(questao));
        questions.forEach((questoes, index) => {
          // console.log(`Processando pergunta ${index + 1}:`, questions); // Log para depuração
          console.log(questoes)
          addQuestionToPage(questoes);
      });
    } catch (error) {
        return(error)
    }
}

   async function addQuestionToPage(questoes) {
    const questionList = document.getElementById("questionList");

    //* Cria o card
    const card = document.createElement("div");
    card.inputMode =
    card.classList.add("card");


    const hiddenIdInput = document.createElement("input");
    hiddenIdInput.type = "hidden";
    hiddenIdInput.value = questao.id_pergunta;
    hiddenIdInput.classList.add("question-id");
  

    //* Título da pergunta
    const questionTitle = document.createElement("h3");
    questionTitle.classList.add("card-title");
    questionTitle.innerText = `Pergunta: ${questao.enunciado}`;

    //! Alternativas!
    const alternatives = document.createElement("ul");
    alternatives.classList.add("card-alternatives");
    alternatives.innerText =` ${questoes.alternativa_a}, 
                              ${questoes.alternativa_b}, 
                              ${questoes.alternativa_c},
                              ${questoes.alternativa_d}`;
  
 
    
    
    

    
  

    //* Resposta correta
    const correctAnswer = document.createElement("p");
    correctAnswer.classList.add("card-correct-answer");
    correctAnswer.innerText = `Resposta correta: ${questao.correta}`;


    //* Botão de deletar
  const deleteButton = document.createElement("button");
  deleteButton.innerText = "Excluir";
  deleteButton.classList.add("delete-button");
  deleteButton.addEventListener("click", async () => {
  try {
    const response = await fetch(`http://localhost:3000/perguntas/${questao.id_pergunta}`, {
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

// 
// !MODAL!

const editbutton = document.createElement("button");
editbutton.innerText = "Editar";
editbutton.classList.add("edit-button");
editbutton.addEventListener("click", async () => {})
  

  try {
    const response = await fetch(`http://localhost:3000/perguntas/${questao.id_pergunta}`,{
      method: "PUT",})
    

const openButtons = document.querySelectorAll('.open-modal');
openButtons.forEach((button) => { //pega qual dos botões foram selecionados da class .open-modal

  button.addEventListener("click", () => { //arrow function pegar algo - no caso clique do botão
    const modalId = button.getAttribute("data-modal"); //especificar qual ATRIBUTO - data-modal foi pego 
    const modal = document.getElementById(modalId); //especificar qual elemento por ID foi pego 
    modal.showModal(); //show ou showModal

  });
});
  }

catch(error){
console.log("ocorre um erro..", error)
}


// Monta o card
card.append(questionTitle,  hiddenIdInput,  alternatives, correctAnswer, deleteButton, editbutton);

    // Adiciona o card ao contêiner de perguntas
    questionList.appendChild(card);
   
  }
