document.addEventListener("DOMContentLoaded", async () => {
  const rankingList = document.getElementById("ranking-list");

  const preencherRanking = (data) => {
    rankingList.innerHTML = "";

    const rankingOrdenado = data.sort(
      (a, b) => b.total_acertos - a.total_acertos
    );

    const top5 = rankingOrdenado.slice(0, 5);

    top5.forEach((usuario, index) => {
      const li = document.createElement("li");
      li.classList.add("ranking-item");

      const pontuacaoFinal = usuario.total_acertos * 10;

      const nomeSpan = document.createElement("span");
      nomeSpan.classList.add("nome-container");
      nomeSpan.textContent = `${index + 1}º - ${usuario.nome}`;

      const pontuacaoSpan = document.createElement("span");
      pontuacaoSpan.classList.add("pontuacao-container");
      pontuacaoSpan.textContent = "Pontuação Final:";

      const pontosSpan = document.createElement("span");
      pontosSpan.classList.add("pontos");
      pontosSpan.textContent = ` ${pontuacaoFinal}`;

      pontuacaoSpan.appendChild(pontosSpan);

      li.appendChild(nomeSpan);
      li.appendChild(pontuacaoSpan);

      rankingList.appendChild(li);
    });
  };

  async function carregarAcertos() {
    try {
      const response = await fetch("http://localhost:3000/acertos", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        preencherRanking(data);
      } else {
        throw new Error("Ranking vazio ou inválido");
      }
    } catch (error) {
      console.error("Erro ao carregar acertos:", error);
      rankingList.innerHTML = "<li>Erro ao carregar ranking</li>";
    }
  }

  carregarAcertos();
});
