// --- server.js ---
// Arquivo principal da API com login simulado para desenvolvimento.

// 1. Importação de Módulos
const express = require('express');
const cors = require('cors');
// const mysql = require('mysql2'); // Comentado por enquanto

// 2. Inicialização da Aplicação
const app = express();
const PORT = 3001;

// 3. Configuração de Middlewares
app.use(cors());
app.use(express.json());

/*
// --- CÓDIGO DE CONEXÃO COM O BANCO DE DADOS (PARA O FUTURO) ---
// 4. Configuração da Conexão com o Banco de Dados
// Deixarei este trecho pronto para quando o banco estiver disponível.
const dbConnection = mysql.createConnection({
  host: 'localhost',      // Trocar pelo IP da máquina do BD ou URL do serviço em nuvem
  user: 'root',           // Usuário do banco
  password: 'sua_senha',  // Senha do banco
  database: 'cbmpe_db'    // Nome do banco
});

dbConnection.connect(error => {
  if (error) {
    console.error('Erro ao conectar com o banco de dados:', error);
    return;
  }
  console.log('Conexão com o banco de dados MySQL estabelecida com sucesso!');
});
*/

// 5. Definição de Rotas (Endpoints)

// Rota de teste
app.get('/', (req, res) => {
  res.send('API do SIOB CBMPE está funcionando!');
});

// ============= ROTA DE LOGIN SIMULADA ==================
// Esta rota não consulta o banco de dados, facilitando o desenvolvimento do PWA. Esperando wslany e marcela terminarem
app.post('/login', (req, res) => {
  const { matricula, password } = req.body;
  console.log('Recebida tentativa de login com:', { matricula, password });

  // Lógica de simulação: aceita qualquer matrícula que comece com '2024'
  if (matricula && password && matricula.startsWith('2024')) {
    res.status(200).json({ 
      message: 'Login bem-sucedido (simulado)!', 
      user: { nome: 'Usuário de Teste', matricula: matricula } 
    });
  } else if (!matricula || !password) {
    res.status(400).json({ message: 'Matrícula e senha são obrigatórios.' });
  } else {
    res.status(401).json({ message: 'Credenciais inválidas (simulado).' });
  }
});

// 6. Inicialização do Servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}.`);
});

