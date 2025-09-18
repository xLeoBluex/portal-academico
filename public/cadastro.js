document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const mensagem = document.createElement("p");
  form.insertAdjacentElement("afterend", mensagem);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const dados = Object.fromEntries(new FormData(form).entries());

    try {
      const resposta = await fetch("/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
      });

      const resultado = await resposta.json();

      mensagem.textContent = resultado.message;
      mensagem.style.color = resultado.success ? "green" : "red";

      if (resultado.success) form.reset();

    } catch (err) {
      mensagem.textContent = "Erro ao conectar com o servidor.";
      mensagem.style.color = "red";
    }
  });
});
  