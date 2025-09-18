const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { cadastrarAluno } = require('./cadastro');

const app = express();

// Para interpretar POSTs de formulários e JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Rota de cadastro
app.post('/cadastro', async (req, res) => {
    try {
        const { ra, nome, serie, email, senha, turno } = req.body;

        const raCadastrado = await cadastrarAluno(ra, nome, serie, email, senha, turno);

        res.json({ success: true, message: `Aluno com RA ${raCadastrado} cadastrado com sucesso!` });
    } catch (err) {
        if (err.code === '23505') {
            res.status(400).json({ success: false, message: 'Erro: E-mail já cadastrado.' });
        } else {
            res.status(500).json({ success: false, message: 'Erro ao cadastrar aluno.' });
        }
    }
});

app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));
