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
    

    if (usuario === '' && senha === '') {
         alert('Preencha todos os campos!', 'warning');
         return;
    }
     const usuarioRegex = /^[a-zA-Z0-9_]{3,15}$/; // Entre 3 e 15 caracteres, letras, números ou "_"
    const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,8}$/; // Entre 6 e 8 caracteres, 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial

   
    if (!senhaRegex.test(senha)) {
        alert("A senha  deve ter entre 6 e 8 caracteres");
        return;
    }

    if (!usuarioRegex.test(usuario)) {
        alert("O usuário Deve ter entre 3 e 15 caracteres");
        return;
    } 
    
    
    
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

            if (response.status == 200) {

                console.log(data.status)


                  if (data.status === "adimim") {
                  
                    // Redireciona para a página do administrador
                    alert('Bem-vindo, administrador!');
                    window.location.replace('../HTML/Admin.html');
                } else {
                    // Redireciona para a página do aluno
                    alert('Bem-vindo, aluno!');
                    window.location.replace('../HTML/Quizzz.html');
                }
            } 
            else {
                alert('Usuário ou senha incorretos!', 'danger');
            }
          
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            alert('Erro ao tentar fazer login. Tente novamente mais tarde.', 'danger');
        }
    
});





// cadastro
document.querySelector("#cadastrar").addEventListener("click", async (event) => {
    event.preventDefault();

    const usuario = document.querySelector("#usuario1").value.trim();
    const senha = document.querySelector("#senha1").value.trim();
    const senhaConfirmacao = document.querySelector("#senhaConfirmacao").value.trim();

    // Validação dos campos
    if (!usuario || !senha || !senhaConfirmacao) {
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
            body: JSON.stringify({ usuario, senha })
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