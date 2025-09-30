document.addEventListener("DOMContentLoaded", loadProdutos);

const botao = document.querySelector("#cadastrar");
botao.addEventListener("click", async function (event) {
  event.preventDefault();

  const nome = document.querySelector("#enunciado").value.trim();
  const preco = document.querySelector("#alternativa_a").value.trim();
  const quantidade = document.querySelector("#alternativa_b").value.trim();
  const categoria = document.querySelector("#alternativa_c").value.trim();

  // Verifica se todos os campos estão preenchidos
  if (!nome || !preco || !quantidade || !categoria) {
    alert("Todos os campos são obrigatórios");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/produtos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome,
        preco,
        quantidade,
        categoria,
      }),
    });

    const data = await res.json();

    if (res.status === 201) {
      alert("Produto cadastrado com sucesso!");
      await loadProdutos();
      document.querySelector("form").reset();
    } else if (res.status === 409) {
      alert(data || "Esse produto já existe");
      await loadProdutos();
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

//* Carregar produtos
async function loadProdutos() {
  const lista = document.getElementById("produtoList");
  lista.innerHTML = "";

  try {
    const response = await fetch("http://localhost:3000/produtos");
    const produtos = await response.json();

    produtos.forEach((produto) => {
      addProdutoToPage(produto);
    });
  } catch (error) {
    console.error("Erro ao carregar produtos:", error);
  }
}

//* Criar card do produto
function addProdutoToPage(produto) {
  const lista = document.getElementById("produtoList");

  const card = document.createElement("div");
  card.classList.add("card");

  const hiddenIdInput = document.createElement("input");
  hiddenIdInput.type = "hidden";
  hiddenIdInput.value = produto.id_produtos;
  hiddenIdInput.classList.add("produto-id");

  const title = document.createElement("h3");
  title.classList.add("card-title");
  title.innerText = `Produto: ${produto.nome}`;

  const details = document.createElement("ul");
  details.classList.add("card-details");
  details.innerHTML = `
    <li>Preço: R$ ${produto.preco}</li>
    <li>Quantidade: ${produto.quantidade}</li>
    <li>Categoria: ${produto.categoria}</li>
  `;

  const deleteButton = document.createElement("button");
  deleteButton.innerText = "Excluir";
  deleteButton.classList.add("delete-button");
  deleteButton.addEventListener("click", async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/produtos/${produto.id_produtos}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        alert("Produto excluído");
        card.remove();
      } else {
        alert("Erro ao deletar o produto.");
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

    document.getElementById("edit-nome").value = produto.nome;
    document.getElementById("edit-preco").value = produto.preco;
    document.getElementById("edit-quantidade").value = produto.quantidade;
    document.getElementById("edit-categoria").value = produto.categoria;

    document
      .getElementById("salvar-edicao")
      .setAttribute("data-id", produto.id_produtos);

    modal.showModal();
  });

  card.append(title, hiddenIdInput, details, deleteButton, editbutton);
  lista.appendChild(card);
}

//* Modal edição
document.getElementById("salvar-edicao").addEventListener("click", async (event) => {
  const id_produtos = event.target.getAttribute("data-id");

  const atualizacao = {
    nome: document.getElementById("edit-nome").value.trim(),
    preco: document.getElementById("edit-preco").value.trim(),
    quantidade: document.getElementById("edit-quantidade").value.trim(),
    categoria: document.getElementById("edit-categoria").value.trim(),
  };

  try {
    const response = await fetch(
      `http://localhost:3000/produtos/${id_produtos}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(atualizacao),
      }
    );

   if (response.ok) {
  alert("Produto editado com sucesso!");
  await loadProdutos();
} else if (response.status === 409) {
  alert("Já existe um produto com esse nome.");
} else if (response.status === 400) {
  alert("Todos os campos são obrigatórios.");
} else if (response.status === 404) {
  alert("Produto não encontrado.");
} else {
  alert("Erro ao editar.");
}

  } catch (error) {
    console.log("Erro ao Editar", error);
    alert("Erro na comunicação com o servidor.");
  }

  document.getElementById("modal-editar").close();
});
