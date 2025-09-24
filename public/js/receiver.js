import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getFirestore, collection, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { firebaseConfig } from "./config.js";

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Query ordenada por data
const comunicadosRef = query(collection(db, "comunicados"), orderBy("criadoEm", "desc"));

// Escuta em tempo real
onSnapshot(comunicadosRef, (snapshot) => {
  snapshot.docChanges().forEach((change) => {
    // Apenas reage a novos comunicados adicionados
    if (change.type === "added") {
      const dados = change.doc.data();
      // Adiciona o ID do documento para uso nas funções de UI
      dados.id = change.doc.id;

      // Chama a função global do receiver-ui.js para adicionar o item à lista
      if (window.addComunicadoToList) {
        window.addComunicadoToList(dados);
      }
    }
  });
});
