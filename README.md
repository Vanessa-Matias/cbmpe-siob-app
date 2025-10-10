## 📌 Sobre o Projeto

O **SIOB (Sistema Integrado de Ocorrências de Bombeiros)** é uma solução digital completa desenvolvida para **modernizar e otimizar o processo de coleta e gestão de dados de ocorrências em campo** para o **Corpo de Bombeiros Militar de Pernambuco (CBMPE)**.

A plataforma substitui o preenchimento manual de formulários em papel por um sistema **digital eficiente e responsivo**, que funciona **tanto online quanto offline**, garantindo a integridade e agilidade das informações.

O sistema é composto por duas frentes principais:

### 📱 Aplicativo de Campo (PWA / Mobile)
Ferramenta robusta para os militares em atendimento, permitindo o **registro padronizado de ocorrências em tempo real**, com captura de mídias (fotos, vídeos), **geolocalização e assinaturas digitais**.

### 💻 Painel Administrativo (Web)
Plataforma central para o comando e analistas, oferecendo **dashboards, relatórios, gestão de usuários e visão geral das operações registradas**.

> Este projeto está sendo desenvolvido pela equipe de alunas do **3º período do curso de Análise e Desenvolvimento de Sistemas (2025.2)** da **Faculdade Senac Pernambuco**.

---

## ✨ Funcionalidades Principais

### 💻 Painel Administrativo (Web)
- 🔑 **Autenticação e Perfis:** múltiplos níveis de acesso (admin, analista, chefe).  
- 🔎 **Listagem e Filtro de Ocorrências:** busca por período, tipo, região e status.  
- 📄 **Visualização de Detalhes:** acesso completo às informações e mídias da ocorrência.  
- 📊 **Relatórios e Exportação:** relatórios em CSV e PDF.  
- 👤 **Gestão de Usuários:** CRUD, redefinição de senha e controle de perfis.  
- 🛡️ **Auditoria e Logs:** rastreabilidade de ações críticas.  
- 📈 **Dashboard Operacional:** KPIs e gráficos dinâmicos sobre as ocorrências.  

### 📱 Aplicativo de Campo (Mobile)
- 🔒 **Autenticação Segura:** login com credenciais institucionais.  
- 📝 **Registro de Ocorrência:** formulários padronizados (Básico, Incêndio, APH, etc.).  
- 📴 **Modo Offline:** registro de dados sem conexão, com sincronização posterior.  
- 📍 **Captura de GPS:** localização automática da ocorrência.  
- 📸 **Captura de Fotos:** anexos diretamente da câmera.  
- ✍️ **Assinatura Digital:** coleta de assinaturas de testemunhas/vítimas.  
- 🔄 **Edição Offline:** ajustes antes da sincronização.  

---

## 🛠️ Ferramentas e Tecnologias

| Categoria | Ferramenta / Tecnologia |
|------------|--------------------------|
| **Frontend** | React.js, TypeScript, React Router |
| **Estilização** | CSS com Variáveis Globais (Temas) |
| **Backend** | Node.js com Express *(sugerido)* |
| **Banco de Dados** | MongoDB ou PostgreSQL *(sugerido)* |
| **Mobile** | React Native *(planejado para próxima fase)* |
| **Controle de Versão** | Git & GitHub |

---

## 🚀 Como Executar o Projeto

```bash
# 1. Clone o repositório
git clone https://github.com/Vanessa-Matias/cbmpe-siob-app

# 2. Acesse a pasta do projeto
cd cbmpe-app

# 3. Instale as dependências
npm install

# 4. Execute a aplicação
npm start

| Membro             | Responsabilidade(s)                               | LinkedIn   |
| ------------------ | ------------------------------------------------- | ---------- |
| **Vanessa Matias** | Desenvolvimento Frontend & Backend                | [Perfil]() |
| **Wedja Souza**    | Gestão de Projetos, Documentação & UX/UI Designer | [Perfil]() |
| **Marcela Negrão** | UX/UI Designer & Banco de Dados                   | [Perfil]() |
| **Wslany Amorim**  | Banco de Dados                                    | [Perfil]() |
| **Sophia Santos**  | UX/UI Designer                                    | [Perfil]() |
| **Agnes Soares**   | Documentação                                      | [Perfil]() |

<p align="center">
  Projeto desenvolvido sob a orientação dos professores
  <b><a href="https://www.linkedin.com/in/geraldogomes/" target="_blank">Geraldo Gomes</a></b>,
  <b><a href="https://www.linkedin.com/in/dansoaresfarias/" target="_blank">Danilo Farias</a></b>,
  <b><a href="https://www.linkedin.com/in/marcos-tenorio/" target="_blank">Marcos Roberto</a></b> e
  <b><a href="https://www.linkedin.com/in/weltondionisio/" target="_blank">Welton Dionísio</a></b>.<br>
  <b>Faculdade SENAC Pernambuco</b> — Disciplina de Projeto Integrador.
</p>
