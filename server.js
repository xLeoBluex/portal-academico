import express from "express";
import bodyParser from "body-parser";
import pkg from "pg";

const { Pool } = pkg;
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static("public")); // serve arquivos HTML, CSS, JS da pasta public

// Configuração do banco
const pool = new Pool({
  user: "postgres",      // 👈 troque pelo seu usuário
  host: "localhost",
  database: "cadastro",  // 👈 troque pelo nome do seu banco
  password: "1234",  // 👈 troque pela sua senha
  port: 5432,
});

// Rota de cadastro
app.post("/register", async (req, res) => {
  const { ra, nome, serie, email, senha, turno } = req.body;

  try {
    await pool.query(
      "INSERT INTO cadastro (ra, nome, serie, email, senha, turno) VALUES ($1, $2, $3, $4, $5, $6)",
      [ra, nome, serie, email, senha, turno]
    );
    res.status(201).send("Cadastro realizado com sucesso!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao cadastrar.");
  }
});

// Rota de login
app.post("/login", async (req, res) => {
  const { ra, senha } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM cadastro WHERE ra = $1 AND senha = $2",
      [ra, senha]
    );

    if (result.rows.length > 0) {
      res.status(200).send("Login bem-sucedido!");
    } else {
      res.status(401).send("Credenciais inválidas.");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao fazer login.");
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
