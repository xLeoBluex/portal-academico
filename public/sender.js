import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { firebaseConfig } from "./config.js";

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Captura o formulário
const form = document.getElementById("comunicadoForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value;
  const mensagem = document.getElementById("mensagem").value;

  try {
    await addDoc(collection(db, "comunicados"), {
      titulo,
      mensagem,
      criadoEm: serverTimestamp()
    });

    alert("Comunicado enviado com sucesso!");
    form.reset();
  } catch (error) {
    console.error("Erro ao enviar comunicado: ", error);
    alert("Erro ao enviar comunicado.");
  }
});
