import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getFirestore, collection, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { firebaseConfig } from "./config.js";

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Onde vamos listar os comunicados
const lista = document.getElementById("listaComunicados");

// Query ordenada por data
const comunicadosRef = query(collection(db, "comunicados"), orderBy("criadoEm", "desc"));

// Escuta em tempo real
onSnapshot(comunicadosRef, (snapshot) => {
  lista.innerHTML = "";
  snapshot.forEach((doc) => {
    const dados = doc.data();
    const li = document.createElement("li");
    li.textContent = `${dados.titulo}: ${dados.mensagem}`;
    lista.appendChild(li);
  });
});
