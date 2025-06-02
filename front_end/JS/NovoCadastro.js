// Código para a transição de telas
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const main = document.getElementById('main');

signUpButton.addEventListener('click', () => {
  main.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
  main.classList.remove("right-panel-active");
});

// login de usuário
document.querySelector("#botaologin").addEventListener("click", async (event) => {
  event.preventDefault(); // impede o envio do formulário

  const email = document.querySelector("#email").value;
  const senha = document.querySelector("#senha").value;

  if (email === '' || senha === '') {
    alert('Preencha todos os campos!');
    return;
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{3,9}$/;

  if (!senhaRegex.test(senha)) {
    alert("A senha deve ter entre 3 e 8 caracteres, incluindo letra maiúscula, minúscula, número e símbolo.");
    return;
  }

  if (!emailRegex.test(email)) {
    alert("Digite um email válido.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/login`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, senha })
    });

    const data = await response.json();

    if (response.status === 200) {
      if (data === 'professor') {
        window.location.replace('../HTML/Admin.html');
      } else {
        window.location.replace('../HTML/Quizzz.html');
      }
    } else {
      alert('Usuário ou senha incorretos!');
    }

  } catch (error) {
    console.error('Erro ao fazer login:', error);
    alert('Erro ao tentar fazer login. Tente novamente mais tarde.');
  }
});

// cadastro
document.querySelector("#cadastrar").addEventListener("click", async (event) => {
  event.preventDefault();

  const email = document.querySelector("#usuario1").value.trim();
  const senha = document.querySelector("#senha1").value.trim();
  const senhaConfirmacao = document.querySelector("#senhaConfirmacao").value.trim();

  if (!email || !senha || !senhaConfirmacao) {
    alert("Preencha todos os campos!");
    return;
  }

  if (senha !== senhaConfirmacao) {
    alert("As senhas não coincidem.");
    return;
  }

  if (senha.length > 8) {
    alert("As senhas devem ter no máximo 8 caracteres");
    return;
  }

  try {
    const response = await fetch('http://192.168.1.4:3000/usuario', {
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

// Mostrar/esconder senha login
const toggleSenhaLogin = document.getElementById("toggleSenhaLogin");
const inputSenhaLogin = document.getElementById("senha");
const imgLogin = toggleSenhaLogin.querySelector("img");

toggleSenhaLogin.addEventListener("click", () => {
  const tipo = inputSenhaLogin.type === "password" ? "text" : "password";
  inputSenhaLogin.type = tipo;
  imgLogin.src = tipo === "password" 
    ? "../../imagens/olhof.png" 
    : "../../imagens/246697.png";
});

// Mostrar/esconder senha cadastro
const toggleSenhaCadastro = document.getElementById("toggleSenhaCadastro");
const inputSenhaCadastro = document.getElementById("senha1");
const imgCadastro = toggleSenhaCadastro.querySelector("img");

toggleSenhaCadastro.addEventListener("click", () => {
  const tipo = inputSenhaCadastro.type === "password" ? "text" : "password";
  inputSenhaCadastro.type = tipo;
  imgCadastro.src = tipo === "password" 
    ? "../../imagens/olhof.png" 
    : "../../imagens/246697.png";
});

// Mostrar/esconder senha de confirmação
const toggleSenhaConf = document.getElementById("toggleSenhaConfirmacao");
const inputSenhaConf = document.getElementById("senhaConfirmacao");
const imgConf = toggleSenhaConf.querySelector("img");

toggleSenhaConf.addEventListener("click", () => {
  const tipo = inputSenhaConf.type === "password" ? "text" : "password";
  inputSenhaConf.type = tipo;
  imgConf.src = tipo === "password" 
    ? "../../imagens/olhof.png" 
    : "../../imagens/246697.png";
});
