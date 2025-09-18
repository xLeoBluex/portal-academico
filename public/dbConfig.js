// dbConfig.js ou database.js
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'cadastro', // Remova o espaço no final aqui: 'cadastro ' -> 'cadastro'
    password: '1234',
    port: 5432,
});

module.exports = pool; // Exporta APENAS a instância do pool