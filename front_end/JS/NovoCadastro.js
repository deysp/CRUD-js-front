    // Código para a transição de telas
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const main = document.getElementById('main');


      signUpButton.addEventListener('click',() => {
       main.classList.add("right-panel-active");
      })

      signInButton.addEventListener('click',() => {
       main.classList.remove("right-panel-active");
      })
    

// login de usuario
document.querySelector("#botaologin").addEventListener("click", async (event) => {
    event.preventDefault() // impede o envio do formulário

    const email = document.querySelector("#email").value;
    const senha = document.querySelector("#senha").value;
    

    // if (email === '' && senha === '') {
    //      alert('Preencha todos os campos!', 'warning');
    //      return;
    // }
    //  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ // Entre 3 e 15 caracteres, letras, números ou "_"
    // const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{3,9}$/; // Entre 6 e 8 caracteres, 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial

   
    // if (!senhaRegex.test(senha)) {
    //     alert("A senha  deve ter entre 3 e 8 caracteres");
    //     return;
    // }

    // if (!emailRegex.test(email)) {
    //     alert("O email Deve ter entre 3 e 15 caracteres");
    //     return;
    // } 
    
    
    
        try {
            const response = await fetch(`http://localhost:3000/login`,{
                method: "POST",
                headers: {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({
                    email : email,
                    senha : senha
                })
            });
            const data = await response.json();
console.log(data)
            if (response.status == 200) {

                console.log(data)


                  if (data === 'professor') {
            
                    // Redireciona para a página do administrador
                    alert('Bem-vindo, professor!');
                    window.location.replace('../HTML/Admin.html');
                } else {
                    // Redireciona para a página do aluno
                    alert('Bem-vindo, aluno!');
                    window.location.replace('../HTML/Quizzz.html');
                }
            } 
    else if (response.status === 401) {
        const errorData = await response.json();
        alert(`Erro: ${errorData.mensagem}`);
     } else if (response.status === 401) {
        const errorData = await response.json();
        alert(`Erro: ${errorData.mensagem}`);
    } else if (response.status === 400 || response.status === 409) {
        const errorData = await response.json();
        alert(`Erro: ${errorData.mensagem}`);
    } else {
        alert('Erro inesperado. Tente novamente mais tarde.');
    }
          
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            alert('Erro ao tentar fazer login. Tente novamente mais tarde.', 'danger');
        }
    
});





// cadastro
document.querySelector("#cadastrar").addEventListener("click", async (event) => {
    event.preventDefault();

    const email = document.querySelector("#usuario1").value.trim();
    const senha = document.querySelector("#senha1").value.trim();
    const senhaConfirmacao = document.querySelector("#senhaConfirmacao").value.trim();

    // Validação dos campos
    if (!email || !senha || !senhaConfirmacao) {
        alert("Preencha todos os campos!");
        return;
    }

    if (senha !== senhaConfirmacao) {
        alert("As senhas não coincidem.");
        return;
    }

    if (senha.length > 8 || senhaConfirmacao.length > 8) {
        alert("As senhas devem ter no máximo 8 caracteres");
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/usuario', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, senha })
        });

        if (response.ok) {
            alert("Cadastro realizado com sucesso!");
        } else {
            const data = await response.json();
            alert(data.error || "Erro ao realizar cadastro.");
        }
    } catch (error) {
        console.error(error);
        alert("Erro ao tentar cadastrar. Tente novamente mais tarde.");
    }
});
