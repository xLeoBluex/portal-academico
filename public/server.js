import express from "express";
import bodyParser from "body-parser";
import pkg from "pg";

const { Pool } = pkg;

const app = express();
const port = 3000;

// conexão com o PostgreSQL
const pool = new Pool({
  user: "postgres",       // seu usuário do banco
  host: "localhost",
  database: "cadastro",  // nome do banco
  password: "1234",  // senha do postgres
  port: 5432,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(".")); // serve o HTML no navegador

// rota para processar o formulário
app.post("/cadastro", async (req, res) => {
  const { ra, nome, serie, email, senha, turno } = req.body;

  try {
    await pool.query(
      "INSERT INTO alunos (ra, nome, serie, email, senha, turno) VALUES ($1, $2, $3, $4, $5, $6)",
      [ra, nome, serie, email, senha, turno]
    );
    res.send("<h2>Aluno cadastrado com sucesso!</h2><a href='/cadastro.html'>Voltar</a>");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao cadastrar aluno.");
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
