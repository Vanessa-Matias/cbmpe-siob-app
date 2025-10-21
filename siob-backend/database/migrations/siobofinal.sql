CREATE DATABASE IF NOT EXISTS appsiob
    DEFAULT CHARACTER SET utf8mb4
    COLLATE utf8mb4_general_ci;
    
    USE appsiob;
    
    SET NAMES utf8mb4;
SET foreign_key_checks = 0;

-- ===================================================================
-- 01 - CATALOGOS E ESTRUTURA GEOGRÁFICA
-- ===================================================================

CREATE TABLE municipio (
    id_municipio INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Município / Cidade',
    nome VARCHAR(150) NOT NULL,
    uf CHAR(2) NOT NULL
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE regiao (
    id_regiao INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Região operacional (OBM)',
    nome VARCHAR(150) NOT NULL COMMENT 'Nome da região',
    descricao TEXT
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE endereco (
    id_endereco INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único do endereço',
    id_municipio INT NOT NULL,
    logradouro VARCHAR(255) COMMENT 'Rua/Avenida',
    numero VARCHAR(50) COMMENT 'Número do endereço',
    complemento VARCHAR(255) COMMENT 'Apto/Sala/Ponto de Referência',
    bairro VARCHAR(255),
    uf CHAR(2) NOT NULL,
    cep VARCHAR(10),
    coordenadas VARCHAR(50) COMMENT '{"lat":..., "lon":...}', -- Usando VARCHAR para flexibilidade do JSON
    referencia TEXT COMMENT 'Ponto de Referência detalhado',
    codigo_local VARCHAR(100) COMMENT 'Código interno de localização',
    FOREIGN KEY (id_municipio) REFERENCES municipio(id_municipio) ON DELETE RESTRICT
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Tabela centralizada para endereços (ocorrência, unidade, vítima)';

CREATE TABLE unidade (
    id_unidade INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Unidade / Quartel (OBM)',
    codigo VARCHAR(50) UNIQUE,
    nome VARCHAR(255) NOT NULL,
    tipo VARCHAR(100),
    id_municipio INT,
    id_endereco INT,
    telefone VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_municipio) REFERENCES municipio(id_municipio) ON DELETE RESTRICT,
    FOREIGN KEY (id_endereco) REFERENCES endereco(id_endereco) ON DELETE RESTRICT
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE local_permanente (
    id_local INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Locais fixos de eventos (ex: estádios)',
    nome VARCHAR(255),
    id_endereco INT NOT NULL,
    capacidade INT,
    observacoes TEXT,
    FOREIGN KEY (id_endereco) REFERENCES endereco(id_endereco) ON DELETE RESTRICT
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ===================================================================
-- 02 - CATALOGOS OPERACIONAIS
-- ===================================================================

CREATE TABLE tipo_ocorrencia (
    id_tipo INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50),
    nome VARCHAR(150) NOT NULL COMMENT 'ex: APH, Incêndio, Salvamento...',
    descricao TEXT
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE natureza_atendimento (
    id_natureza INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50),
    nome VARCHAR(150) NOT NULL COMMENT 'Ex: Edificação, Floresta, Veículo',
    descricao TEXT
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE status_ocorrencia (
    id_status INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL COMMENT 'pendente, em andamento, concluída',
    descricao TEXT,
    cor VARCHAR(7)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE prioridade (
    id_prioridade INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(20) NOT NULL COMMENT 'alta, media, baixa'
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE forma_acionamento (
    id_forma INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    descricao TEXT
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ===================================================================
-- 03 - AUTENTICAÇÃO E USUÁRIOS
-- ===================================================================

CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Usuário do sistema',
    matricula VARCHAR(50) UNIQUE,
    nome_completo VARCHAR(255) NOT NULL,
    nome_guerra VARCHAR(100),
    email VARCHAR(255) NOT NULL UNIQUE,
    cpf VARCHAR(20),
    telefone VARCHAR(50),
    posto_gradacao VARCHAR(100),
    id_unidade INT,
    ativo TINYINT(1) DEFAULT 1,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_unidade) REFERENCES unidade(id_unidade) ON DELETE RESTRICT
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Cadastro de usuários';

CREATE TABLE conta_segura (
    id_conta INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    senha_hash VARCHAR(512) NOT NULL,
    duas_fatores TINYINT(1) DEFAULT 0,
    secret_2fa VARCHAR(255),
    alterado_em DATETIME,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Dados de autenticação';

CREATE TABLE papel (
    id_papel INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE usuario_papel (
    id_usuario INT NOT NULL,
    id_papel INT NOT NULL,
    atribuido_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_usuario, id_papel),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_papel) REFERENCES papel(id_papel) ON DELETE RESTRICT
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ===================================================================
-- 04 - OCORRÊNCIA PRINCIPAL
-- ===================================================================

CREATE TABLE ocorrencia (
    id_ocorrencia INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Registro principal da ocorrência',
    numero_aviso VARCHAR(100) UNIQUE COMMENT 'Nº de aviso/dispatcher',
    titulo VARCHAR(255),
    descricao TEXT,
    id_tipo INT NOT NULL,
    id_natureza INT,
    id_status INT NOT NULL,
    id_prioridade INT,
    id_forma_acionamento INT,
    id_unidade_responsavel INT,
    id_endereco INT NOT NULL COMMENT 'Endereço do local da ocorrência',
    area_obm TINYINT(1),
    data_aviso DATETIME,
    hora_recebimento TIME,
    data_hora_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_hora_fechamento DATETIME NULL,
    id_criado_por INT,
    id_atualizado_por INT,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_tipo) REFERENCES tipo_ocorrencia(id_tipo) ON DELETE RESTRICT,
    FOREIGN KEY (id_natureza) REFERENCES natureza_atendimento(id_natureza) ON DELETE RESTRICT,
    FOREIGN KEY (id_status) REFERENCES status_ocorrencia(id_status) ON DELETE RESTRICT,
    FOREIGN KEY (id_prioridade) REFERENCES prioridade(id_prioridade) ON DELETE RESTRICT,
    FOREIGN KEY (id_forma_acionamento) REFERENCES forma_acionamento(id_forma) ON DELETE RESTRICT,
    FOREIGN KEY (id_unidade_responsavel) REFERENCES unidade(id_unidade) ON DELETE RESTRICT,
    FOREIGN KEY (id_endereco) REFERENCES endereco(id_endereco) ON DELETE RESTRICT,
    FOREIGN KEY (id_criado_por) REFERENCES usuario(id_usuario) ON DELETE SET NULL,
    FOREIGN KEY (id_atualizado_por) REFERENCES usuario(id_usuario) ON DELETE SET NULL
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE solicitante (
    id_solicitante INT AUTO_INCREMENT PRIMARY KEY,
    id_ocorrencia INT NOT NULL,
    nome VARCHAR(255),
    cpf_rg VARCHAR(50),
    idade INT,
    sexo VARCHAR(20),
    telefone VARCHAR(50),
    relacionamento VARCHAR(100),
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_ocorrencia) REFERENCES ocorrencia(id_ocorrencia) ON DELETE CASCADE
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE chamada_dispatch (
    id_chamada INT AUTO_INCREMENT PRIMARY KEY,
    id_ocorrencia INT,
    origem VARCHAR(150),
    canal VARCHAR(100),
    dados_brutos TEXT,
    hora_chamada DATETIME,
    id_registrador INT COMMENT 'usuário que registrou',
    FOREIGN KEY (id_ocorrencia) REFERENCES ocorrencia(id_ocorrencia) ON DELETE SET NULL,
    FOREIGN KEY (id_registrador) REFERENCES usuario(id_usuario) ON DELETE SET NULL
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ===================================================================
-- 05 - LOGÍSTICA E RECURSOS
-- ===================================================================

CREATE TABLE tipo_vtr (
    id_tipo_vtr INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    descricao TEXT
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE viatura (
    id_vtr INT AUTO_INCREMENT PRIMARY KEY,
    prefixo VARCHAR(50) UNIQUE,
    placa VARCHAR(20) UNIQUE,
    id_tipo_vtr INT,
    modelo VARCHAR(255),
    ano YEAR,
    id_unidade INT,
    status VARCHAR(50),
    hodometro_atual INT,
    ultima_manutencao DATE,
    ativo TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_tipo_vtr) REFERENCES tipo_vtr(id_tipo_vtr) ON DELETE RESTRICT,
    FOREIGN KEY (id_unidade) REFERENCES unidade(id_unidade) ON DELETE RESTRICT
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE deslocamento (
    id_deslocamento INT AUTO_INCREMENT PRIMARY KEY,
    id_ocorrencia INT NOT NULL,
    id_vtr INT,
    chamado_em DATETIME,
    hora_saida DATETIME,
    hora_chegada_local DATETIME,
    hora_saida_local DATETIME,
    hora_chegada_destino DATETIME,
    hora_retorno_quartel DATETIME,
    hodometro_saida INT,
    hodometro_local INT,
    distancia_km DECIMAL(9,2),
    observacoes TEXT,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_ocorrencia) REFERENCES ocorrencia(id_ocorrencia) ON DELETE CASCADE,
    FOREIGN KEY (id_vtr) REFERENCES viatura(id_vtr) ON DELETE SET NULL
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE guarnicao (
    id_guarnicao INT AUTO_INCREMENT PRIMARY KEY,
    id_ocorrencia INT,
    id_vtr INT,
    id_usuario INT,
    funcao VARCHAR(100),
    matricula VARCHAR(50),
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_ocorrencia) REFERENCES ocorrencia(id_ocorrencia) ON DELETE CASCADE,
    FOREIGN KEY (id_vtr) REFERENCES viatura(id_vtr) ON DELETE SET NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE SET NULL
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE categoria_equipamento (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    descricao TEXT
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE equipamento (
    id_equipamento INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(100) UNIQUE,
    nome VARCHAR(255),
    id_categoria INT,
    descricao TEXT,
    quantidade INT DEFAULT 0,
    localizacao VARCHAR(255),
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_categoria) REFERENCES categoria_equipamento(id_categoria) ON DELETE RESTRICT
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE inventario_equipamento (
    id_inventario INT AUTO_INCREMENT PRIMARY KEY,
    id_equipamento INT NOT NULL,
    id_vtr INT,
    quantidade INT,
    ultima_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_equipamento) REFERENCES equipamento(id_equipamento) ON DELETE RESTRICT,
    FOREIGN KEY (id_vtr) REFERENCES viatura(id_vtr) ON DELETE SET NULL
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ===================================================================
-- 06 - ATENDIMENTO PRÉ-HOSPITALAR (APH)
-- ===================================================================

CREATE TABLE vitima (
    id_vitima INT AUTO_INCREMENT PRIMARY KEY,
    id_ocorrencia INT NOT NULL,
    nome VARCHAR(255),
    cpf_rg VARCHAR(50),
    idade INT,
    idade_unidade ENUM('anos','meses') DEFAULT 'anos',
    sexo ENUM('F','M','Outro'),
    telefone VARCHAR(50),
    id_endereco INT NULL COMMENT 'Endereço de residência ou destino (hospital, etc.)',
    estado_consciencia VARCHAR(100),
    observacoes TEXT,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_ocorrencia) REFERENCES ocorrencia(id_ocorrencia) ON DELETE CASCADE,
    FOREIGN KEY (id_endereco) REFERENCES endereco(id_endereco) ON DELETE SET NULL
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE lesao (
    id_lesao INT AUTO_INCREMENT PRIMARY KEY,
    id_vitima INT NOT NULL,
    tipo_lesao VARCHAR(150),
    regiao_corporal VARCHAR(150),
    gravidade VARCHAR(50),
    descricao TEXT,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_vitima) REFERENCES vitima(id_vitima) ON DELETE CASCADE
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE sinal_vital (
    id_vital INT AUTO_INCREMENT PRIMARY KEY,
    id_vitima INT NOT NULL,
    registrado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    pa VARCHAR(50),
    fc INT,
    fr INT,
    sao2 INT,
    glicemia DECIMAL(6,2),
    temperatura DECIMAL(5,2),
    observacoes TEXT,
    FOREIGN KEY (id_vitima) REFERENCES vitima(id_vitima) ON DELETE CASCADE
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE queimadura (
    id_queimadura INT AUTO_INCREMENT PRIMARY KEY,
    id_vitima INT NOT NULL,
    local_corpo VARCHAR(150),
    grau VARCHAR(50),
    area_afetada VARCHAR(50),
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_vitima) REFERENCES vitima(id_vitima) ON DELETE CASCADE
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE material_base (
    id_material INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255),
    descricao TEXT,
    unidade_medida VARCHAR(50)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Catálogo de materiais APH';

CREATE TABLE material_aph_utilizado (
    id_ocorr_material INT AUTO_INCREMENT PRIMARY KEY,
    id_ocorrencia INT NOT NULL,
    id_material INT NOT NULL,
    quantidade_utilizada INT,
    FOREIGN KEY (id_ocorrencia) REFERENCES ocorrencia(id_ocorrencia) ON DELETE CASCADE,
    FOREIGN KEY (id_material) REFERENCES material_base(id_material) ON DELETE RESTRICT
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Materiais utilizados em cada ocorrência';

CREATE TABLE aph_atendimento (
    id_aph INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Formulário APH',
    id_ocorrencia INT NOT NULL,
    id_vitima INT,
    numero_aviso VARCHAR(100),
    data_atendimento DATE,
    sinais_iniciais JSON,
    acoes_realizadas JSON,
    destino VARCHAR(255),
    observacoes TEXT,
    id_preenchido_por INT,
    preenchido_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_ocorrencia) REFERENCES ocorrencia(id_ocorrencia) ON DELETE CASCADE,
    FOREIGN KEY (id_vitima) REFERENCES vitima(id_vitima) ON DELETE SET NULL,
    FOREIGN KEY (id_preenchido_por) REFERENCES usuario(id_usuario) ON DELETE SET NULL
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ===================================================================
-- 07 - FORM. SECUNDÁRIO: INCÊNDIO
-- ===================================================================

CREATE TABLE ocorrencia_incendio (
    id_incendio INT AUTO_INCREMENT PRIMARY KEY,
    id_ocorrencia INT NOT NULL,
    tipo_local VARCHAR(150),
    causa_presumida VARCHAR(255),
    tempo_extincao_minutes INT,
    tempo_rescaldo_minutes INT,
    consumo_agua_litros DECIMAL(12,2),
    area_atingida_m2 DECIMAL(12,2),
    materiais_envolvidos TEXT,
    bens_atingidos TEXT,
    bens_salvos TEXT,
    comandante_matricula VARCHAR(50),
    observacoes TEXT,
    id_preenchido_por INT,
    preenchido_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_ocorrencia) REFERENCES ocorrencia(id_ocorrencia) ON DELETE CASCADE,
    FOREIGN KEY (id_preenchido_por) REFERENCES usuario(id_usuario) ON DELETE SET NULL
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='dados específicos de incêndio';

-- ===================================================================
-- 08 - FORM. SECUNDÁRIO: SALVAMENTO
-- ===================================================================

CREATE TABLE ocorrencia_salvamento (
    id_salvamento INT AUTO_INCREMENT PRIMARY KEY,
    id_ocorrencia INT NOT NULL,
    tipo_operacao VARCHAR(150),
    local_operacao VARCHAR(150),
    numero_vitimas INT,
    comandante_matricula VARCHAR(50),
    observacoes TEXT,
    id_preenchido_por INT,
    preenchido_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_ocorrencia) REFERENCES ocorrencia(id_ocorrencia) ON DELETE CASCADE,
    FOREIGN KEY (id_preenchido_por) REFERENCES usuario(id_usuario) ON DELETE SET NULL
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE mergulhador_operacao (
    id_mergulhador INT AUTO_INCREMENT PRIMARY KEY,
    id_salvamento INT NOT NULL,
    matricula VARCHAR(50),
    nome_guerra VARCHAR(255),
    profundidade_m DECIMAL(7,2),
    tempo_fundo_seconds INT,
    tempo_total_seconds INT,
    cilindro_bar_inicial INT,
    cilindro_bar_final INT,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_salvamento) REFERENCES ocorrencia_salvamento(id_salvamento) ON DELETE CASCADE
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ===================================================================
-- 09 - FORM. SECUNDÁRIO: PRODUTOS PERIGOSOS
-- ===================================================================

CREATE TABLE ocorr_produto_perigoso (
    id_produto_perigoso INT AUTO_INCREMENT PRIMARY KEY,
    id_ocorrencia INT NOT NULL,
    grupo VARCHAR(150),
    codigo_classificacao VARCHAR(100),
    nome_produto VARCHAR(255),
    numero_onu VARCHAR(50),
    classe_risco VARCHAR(100),
    tipo_recipiente VARCHAR(100),
    volume DECIMAL(12,3),
    unidade_volume VARCHAR(10),
    estado_fisico ENUM('Solido','Liquido','Gasoso','Desconhecido') DEFAULT 'Desconhecido',
    area_afetada JSON,
    id_preenchido_por INT,
    preenchido_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_ocorrencia) REFERENCES ocorrencia(id_ocorrencia) ON DELETE CASCADE,
    FOREIGN KEY (id_preenchido_por) REFERENCES usuario(id_usuario) ON DELETE SET NULL
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE pp_acao_adotada (
    id_produto_perigoso INT NOT NULL,
    acao_nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    PRIMARY KEY (id_produto_perigoso, acao_nome),
    FOREIGN KEY (id_produto_perigoso) REFERENCES ocorr_produto_perigoso(id_produto_perigoso) ON DELETE CASCADE
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Ações como Isolamento, Contenção, etc.';

-- ===================================================================
-- 10 - FORM. SECUNDÁRIO: PREVENÇÃO (FORMULÁRIO DETALHADO)
-- ===================================================================

CREATE TABLE ocorrencia_prevencao (
    id_prevencao INT AUTO_INCREMENT PRIMARY KEY,
    id_ocorrencia INT NOT NULL,
    id_local_evento INT NULL, -- FK para local_permanente
    nome_evento VARCHAR(255),
    hora_chegada DATETIME,
    hora_inicio DATETIME,
    hora_saida DATETIME,
    evento_regularizado TINYINT(1) DEFAULT 0,
    ar_av_ae_status ENUM('valido','vencido','nao_localizado','nao_se_aplica') DEFAULT 'nao_se_aplica',
    publico_presente INT,
    comandante_matricula VARCHAR(50),
    observacoes TEXT,
    id_preenchido_por INT,
    preenchido_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_ocorrencia) REFERENCES ocorrencia(id_ocorrencia) ON DELETE CASCADE,
    FOREIGN KEY (id_local_evento) REFERENCES local_permanente(id_local) ON DELETE SET NULL,
    FOREIGN KEY (id_preenchido_por) REFERENCES usuario(id_usuario) ON DELETE SET NULL
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabelas de relacionamento N:N para desmembrar o formulário
CREATE TABLE prevencao_tipo_evento (
    id_prevencao INT NOT NULL,
    tipo_evento VARCHAR(100) NOT NULL,
    PRIMARY KEY (id_prevencao, tipo_evento),
    FOREIGN KEY (id_prevencao) REFERENCES ocorrencia_prevencao(id_prevencao) ON DELETE CASCADE
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Tipo de evento: Carnavalesco, Junino, etc.';

CREATE TABLE prevencao_estrutura (
    id_prevencao INT NOT NULL,
    estrutura_nome VARCHAR(100) NOT NULL,
    montada TINYINT(1) DEFAULT 0,
    PRIMARY KEY (id_prevencao, estrutura_nome),
    FOREIGN KEY (id_prevencao) REFERENCES ocorrencia_prevencao(id_prevencao) ON DELETE CASCADE
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Estrutura de apoio: PC, Rádio HT, Ambulância';

-- ===================================================================
-- 11 - FORM. SECUNDÁRIO: ATITUDE COMUNITÁRIA (FORMULÁRIO DETALHADO)
-- ===================================================================

CREATE TABLE ocorrencia_atitude_com (
    id_atitude INT AUTO_INCREMENT PRIMARY KEY,
    id_ocorrencia INT NOT NULL,
    tipo_atividade VARCHAR(150),
    publico_alvo VARCHAR(150),
    participantes INT,
    resultado TEXT,
    id_preenchido_por INT,
    preenchido_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_ocorrencia) REFERENCES ocorrencia(id_ocorrencia) ON DELETE CASCADE,
    FOREIGN KEY (id_preenchido_por) REFERENCES usuario(id_usuario) ON DELETE SET NULL
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabelas de relacionamento N:N para desmembrar o formulário
CREATE TABLE ac_interacao_social (
    id_atitude INT NOT NULL,
    acao_nome VARCHAR(100) NOT NULL,
    PRIMARY KEY (id_atitude, acao_nome),
    FOREIGN KEY (id_atitude) REFERENCES ocorrencia_atitude_com(id_atitude) ON DELETE CASCADE
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Ex: Banho de Neblina, Desfile, Visita';

CREATE TABLE ac_apoio_instituicao (
    id_atitude INT NOT NULL,
    instituicao_nome VARCHAR(100) NOT NULL,
    PRIMARY KEY (id_atitude, instituicao_nome),
    FOREIGN KEY (id_atitude) REFERENCES ocorrencia_atitude_com(id_atitude) ON DELETE CASCADE
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Ex: PMPE, PCPE, Igrejas';

-- ===================================================================
-- 12 - ANEXOS, ARQUIVOS E MÍDIA
-- ===================================================================

CREATE TABLE formulario (
    id_formulario INT AUTO_INCREMENT PRIMARY KEY,
    id_ocorrencia INT NOT NULL,
    tipo_formulario VARCHAR(100) NOT NULL,
    dados JSON,
    id_preenchido_por INT,
    preenchido_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_ocorrencia) REFERENCES ocorrencia(id_ocorrencia) ON DELETE CASCADE,
    FOREIGN KEY (id_preenchido_por) REFERENCES usuario(id_usuario) ON DELETE SET NULL
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Formulário genérico com payload JSON';

CREATE TABLE arquivo (
    id_arquivo INT AUTO_INCREMENT PRIMARY KEY,
    id_ocorrencia INT,
    id_formulario INT,
    nome_original VARCHAR(255),
    caminho VARCHAR(1024),
    tipo_mime VARCHAR(100),
    tamanho_bytes BIGINT,
    enviado_por INT,
    enviado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_ocorrencia) REFERENCES ocorrencia(id_ocorrencia) ON DELETE CASCADE,
    FOREIGN KEY (id_formulario) REFERENCES formulario(id_formulario) ON DELETE SET NULL,
    FOREIGN KEY (enviado_por) REFERENCES usuario(id_usuario) ON DELETE SET NULL
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Arquivos e fotos anexados';

-- ===================================================================
-- 13 - AUDITORIA E LOGS
-- ===================================================================

CREATE TABLE auditoria_log (
    id_log INT AUTO_INCREMENT PRIMARY KEY,
    data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_usuario INT,
    usuario_nome VARCHAR(255),
    acao_tipo VARCHAR(100),
    modulo VARCHAR(100),
    recurso_tabela VARCHAR(100),
    recurso_id VARCHAR(100),
    descricao TEXT,
    dados_anteriores JSON,
    dados_posteriores JSON,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE SET NULL
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE acesso_log (
    id_acesso INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    ip VARCHAR(50),
    user_agent TEXT,
    data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    sucesso TINYINT(1) DEFAULT 1,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE SET NULL
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ===================================================================
-- 14 - APOIOS EXTERNOS E DIVERSOS
-- ===================================================================

CREATE TABLE agencia_apoio (
    id_agencia INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255),
    tipo VARCHAR(100),
    contato VARCHAR(255),
    telefone VARCHAR(50),
    email VARCHAR(120)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE ocorrencia_agencia (
    id_ocorr_agencia INT AUTO_INCREMENT PRIMARY KEY,
    id_ocorrencia INT NOT NULL,
    id_agencia INT,
    descricao TEXT,
    acionado TINYINT(1) DEFAULT 0,
    horario_acionamento DATETIME,
    FOREIGN KEY (id_ocorrencia) REFERENCES ocorrencia(id_ocorrencia) ON DELETE CASCADE,
    FOREIGN KEY (id_agencia) REFERENCES agencia_apoio(id_agencia) ON DELETE RESTRICT
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE tarefa (
    id_tarefa INT AUTO_INCREMENT PRIMARY KEY,
    id_ocorrencia INT,
    titulo VARCHAR(255),
    descricao TEXT,
    responsavel INT,
    status VARCHAR(50),
    data_vencimento DATE,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_ocorrencia) REFERENCES ocorrencia(id_ocorrencia) ON DELETE CASCADE,
    FOREIGN KEY (responsavel) REFERENCES usuario(id_usuario) ON DELETE SET NULL
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE mensagem (
    id_mensagem INT AUTO_INCREMENT PRIMARY KEY,
    id_ocorrencia INT,
    id_remetente INT,
    conteudo TEXT,
    enviado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    lida TINYINT(1) DEFAULT 0,
    FOREIGN KEY (id_ocorrencia) REFERENCES ocorrencia(id_ocorrencia) ON DELETE CASCADE,
    FOREIGN KEY (id_remetente) REFERENCES usuario(id_usuario) ON DELETE SET NULL
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- ===================================================================
-- 15 - INDICES E AJUSTES FINAIS
-- ===================================================================

CREATE INDEX idx_ocorrencia_data ON ocorrencia (data_hora_registro);
CREATE INDEX idx_ocorrencia_status ON ocorrencia (id_status);
CREATE INDEX idx_ocorrencia_tipo ON ocorrencia (id_tipo);
CREATE INDEX idx_ocorrencia_prioridade ON ocorrencia (id_prioridade);
CREATE INDEX idx_vitima_ocorrencia ON vitima(id_ocorrencia);

SET foreign_key_checks = 0;

-- ===================================================================
-- 0. DADOS INICIAIS (DML)
-- ===================================================================

-- 0.1 MUNICIPIO (6 Registros Iniciais)
TRUNCATE TABLE municipio;
INSERT INTO municipio (id_municipio, nome, uf) VALUES
(1, 'Recife', 'PE'), (2, 'Jaboatão dos Guararapes', 'PE'),
(3, 'Olinda', 'PE'), (4, 'Paulista', 'PE'),
(5, 'Moreno', 'PE'), (6, 'Camaragibe', 'PE');

-- 0.2 REGIAO (3 Registros Iniciais)
TRUNCATE TABLE regiao;
INSERT INTO regiao (id_regiao, nome, descricao) VALUES
(1, '1ª Região Metropolitana Sul', 'Recife e Jaboatão'),
(2, '2ª Região Metropolitana Norte', 'Olinda e Paulista'),
(3, '3ª Região Zona da Mata', 'Moreno e Camaragibe');


-- 0.3 TIPO_OCORRENCIA (5 Registros Iniciais + 10 novos)
TRUNCATE TABLE tipo_ocorrencia;
INSERT INTO tipo_ocorrencia (id_tipo, codigo, nome) VALUES
(1, 'A-1', 'Atendimento Pré-Hospitalar (APH)'),
(2, 'I-2', 'Incêndio em Edificação'),
(3, 'S-1', 'Salvamento em Altura'),
(4, 'P-5', 'Prevenção e Guarda de Serviço'),
(5, 'PP-7', 'Atendimento com Produtos Perigosos'),
(6, 'AC-6', 'Atitude Comunitária (Ação Social)'),
(7, 'I-1', 'Incêndio em Vegetação'),
(8, 'S-2', 'Salvamento Aquático'),
(9, 'V-1', 'Acidente de Trânsito com Vítima'),
(10, 'S-3', 'Salvamento em Desabamento'),
(11, 'A-2', 'Transporte Inter-Hospitalar'),
(12, 'I-3', 'Incêndio em Veículo'),
(13, 'S-4', 'Salvamento em Área de Difícil Acesso'),
(14, 'AC-7', 'Apoio a Outros Órgãos'),
(15, 'PP-8', 'Vazamento de Combustível');

-- 0.4 NATUREZA_ATENDIMENTO (6 Registros Iniciais + 9 novos)
TRUNCATE TABLE natureza_atendimento;
INSERT INTO natureza_atendimento (id_natureza, codigo, nome) VALUES
(1, '01', 'Queda da Próprio Altura'), (2, '02', 'Mal Súbito'),
(3, '10', 'Incêndio em Residência'), (4, '11', 'Incêndio em Comércio'),
(5, '25', 'Salvamento em Poço'), (6, '30', 'Vazamento de Gás (GLP)'),
(7, '21', 'Colisão Automóvel x Automóvel'),
(8, '35', 'Resgate de Animal Silvestre'),
(9, '40', 'Incêndio em Terreno Baldio'),
(10, '41', 'Salvamento Marítimo - Afogamento'),
(11, '42', 'Corte de Árvore Risco Iminente'),
(12, '45', 'Apoio a Evento de Grande Público'),
(13, '50', 'Deslizamento de Barreira'),
(14, '51', 'Vazamento de Amônia'),
(15, '55', 'Cabo Aéreo Rompido');

-- 0.5 STATUS_OCORRENCIA
TRUNCATE TABLE status_ocorrencia;
INSERT INTO status_ocorrencia (id_status, nome, descricao, cor) VALUES
(1, 'Em Aberto', 'Chamado recém-recebido', '#007bff'),
(2, 'Em Andamento', 'Viaturas em deslocamento/operação', '#ffc107'),
(3, 'Concluída', 'Ocorrência finalizada', '#28a745'),
(4, 'Cancelada', 'Chamado cancelado', '#dc3545');

-- 0.6 PRIORIDADE
TRUNCATE TABLE prioridade;
INSERT INTO prioridade (id_prioridade, nome) VALUES
(1, 'Alta'), (2, 'Média'), (3, 'Baixa');

-- 0.7 FORMA_ACIONAMENTO
TRUNCATE TABLE forma_acionamento;
INSERT INTO forma_acionamento (id_forma, nome) VALUES
(1, '193 (Telefone)'), (2, 'Rádio/COBOM'),
(3, 'Presencial'), (4, 'Outros Órgãos (PM, PRF)');

-- 0.8 TIPO_VTR
TRUNCATE TABLE tipo_vtr;
INSERT INTO tipo_vtr (id_tipo_vtr, nome, descricao) VALUES
(1, 'ABT', 'Auto Bomba Tanque - Combate a Incêndio'),
(2, 'UR', 'Unidade de Resgate - APH'),
(3, 'AR', 'Auto Resgate - Salvamento e Apoio'),
(4, 'ABSL', 'Auto Busca e Salvamento - Salvamento aquático/terrestre'),
(5, 'AER', 'Aeronave de Resgate - Apoio Aéreo'),
(6, 'AE', 'Auto Escada - Incêndio em Altura'),
(7, 'ASA', 'Ambulância de Suporte Avançado');

-- 0.9 PAPEL
TRUNCATE TABLE papel;
INSERT INTO papel (id_papel, nome) VALUES
(1, 'Administrador'), (2, 'Comandante'), (3, 'Operador'), (4, 'Dispatch (Atendente)');

-- 0.10 UNIDADE
TRUNCATE TABLE unidade;
INSERT INTO unidade (id_unidade, codigo, nome, tipo, id_municipio, id_endereco, telefone) VALUES
(1, '1º GBM', 'Grupamento de Bombeiros Cordeiro (Recife)', 'GBM', 1, 1, '3182-3232'),
(2, '2º GBM', 'Grupamento de Bombeiros Jaboatão', 'GBM', 2, 2, '3465-9000'),
(3, '3º SBM', 'Subgrupamento de Bombeiros Olinda', 'SBM', 3, 3, '3439-1111'),
(4, '4º SBM', 'Subgrupamento de Bombeiros Paulista', 'SBM', 4, 4, '3435-0000'),
(5, '5º PBM', 'Posto de Bombeiros Moreno', 'PBM', 5, 5, '3512-4000'),
(6, '6º PBM', 'Posto de Bombeiros Camaragibe', 'PBM', 6, 6, '3458-1000'), 
(7, '7º PBM', 'Posto de Bombeiros Boa Vista (Recife)', 'PBM', 1, 7, '3183-4000'), 
(8, '8º PBM', 'Posto de Bombeiros Candeias (Jaboatão)', 'PBM', 2, 8, '3466-5000'), 
(9, '9º PBM', 'Posto de Bombeiros Casa Caiada (Olinda)', 'PBM', 3, 9, '3439-5555'), 
(10, '10º PBM', 'Posto de Bombeiros Santo Antônio (Recife)', 'PBM', 1, 10, '3184-6000');

-- ===================================================================
-- 1. ESTRUTURA GEOGRÁFICA E LOCAIS
-- ===================================================================

-- 1.1 ENDERECO (15 Registros)
TRUNCATE TABLE endereco;
INSERT INTO endereco (id_endereco, id_municipio, logradouro, numero, bairro, uf, cep, coordenadas, referencia) VALUES
-- Endereços das 10 UNIDADES 
(1, 1, 'Avenida Caxangá', '2000', 'Cordeiro', 'PE', '50710-000', '{"lat": -8.0461, "lon": -34.9287}', '1º GBM'),
(2, 2, 'Avenida Ayrton Senna', '1500', 'Piedade', 'PE', '54410-000', '{"lat": -8.1729, "lon": -34.9125}', '2º GBM'),
(3, 3, 'Avenida Governador Carlos de Lima Cavalcanti', '125', 'Rio Doce', 'PE', '53000-000', '{"lat": -7.9892, "lon": -34.8430}', '3º SBM'),
(4, 4, 'Avenida Dr. Cláudio José Gueiros Leite', '400', 'Janga', 'PE', '53400-000', '{"lat": -7.8800, "lon": -34.8500}', '4º SBM'),
(5, 5, 'BR-232', 'Km 25', 'Centro', 'PE', '54800-000', '{"lat": -8.1250, "lon": -35.0900}', '5º PBM'),
(6, 6, 'Avenida Dr. Belmino Correia', '100', 'Centro', 'PE', '54750-000', '{"lat": -8.0105, "lon": -34.9810}', '6º PBM Camaragibe'),
(7, 1, 'Rua do Sol', '500', 'Boa Vista', 'PE', '50050-000', '{"lat": -8.0600, "lon": -34.8800}', '7º PBM Boa Vista (Recife)'),
(8, 2, 'Rua 15 de Novembro', '100', 'Candeias', 'PE', '54450-000', '{"lat": -8.1900, "lon": -34.9100}', '8º PBM Candeias (Jaboatão)'),
(9, 3, 'Avenida Rui Barbosa', '450', 'Casa Caiada', 'PE', '53130-000', '{"lat": -7.9750, "lon": -34.8350}', '9º PBM Casa Caiada (Olinda)'),
(10, 1, 'Rua da Aurora', '50', 'Santo Antônio', 'PE', '50010-230', '{"lat": -8.0581, "lon": -34.8856}', '10º PBM Santo Antônio (Recife)'),
(11, 1, 'Rua do Futuro', '500', 'Ilha do Retiro', 'PE', '50750-500', '{"lat": -8.0583, "lon": -34.9080}', 'Estádio de futebol central'),
(12, 2, 'Avenida Boa Viagem', '4500', 'Piedade', 'PE', '54400-000', '{"lat": -8.1820, "lon": -34.9080}', 'Em frente ao Edifício X'),
(13, 3, 'Rua 7 de Setembro', '12', 'Bairro Novo', 'PE', '53130-000', '{"lat": -7.9950, "lon": -34.8250}', 'Próximo a padaria'),
(14, 4, 'Rua Getúlio Vargas', '10', 'Centro', 'PE', '53400-000', '{"lat": -7.8850, "lon": -34.8450}', 'Próximo a loja de materiais'),
(15, 5, 'Rua das Flores', '33', 'Vila Holandesa', 'PE', '54800-000', '{"lat": -8.1300, "lon": -35.0800}', 'Residência isolada');

-- 1.2 LOCAL_PERMANENTE
TRUNCATE TABLE local_permanente;
INSERT INTO local_permanente (id_local, nome, id_endereco, capacidade, observacoes) VALUES
(1, 'Estádio Ilha do Retiro', 11, 30000, 'Principal palco de jogos'),
(2, 'Teatro Santa Isabel', 7, 800, 'Referência cultural no centro do Recife'),
(3, 'Parque Dona Lindu', 12, 10000, 'Área de lazer em Boa Viagem'),
(4, 'Classic Hall', 4, 20000, 'Casa de shows em Olinda/Paulista'),
(5, 'Polo Cultural do Carnaval', 3, 50000, 'Localização histórica de eventos'),
(6, 'Ginásio de Esportes Olinda', 15, 5000, 'Ginásio municipal'),
(7, 'Fábrica Tacaruna', 7, 1000, 'Antiga fábrica para eventos de pequeno porte'),
(8, 'Shopping Recife', 14, 0, 'Local de grande público e alto risco'),
(9, 'Centro de Convenções PE', 3, 25000, 'Maior espaço de eventos do estado'),
(10, 'Praça da Várzea', 1, 500, 'Ponto de encontro da comunidade'),
(11, 'Colégio Militar do Recife', 1, 3000, 'Local para grandes formaturas'),
(12, 'Terminal Rodoviário TIP', 1, 5000, 'Local de alto fluxo de pessoas'),
(13, 'Porto de Suape', 2, 0, 'Área de risco industrial e portuário'),
(14, 'Cais da Alfândega', 1, 3000, 'Local de eventos turísticos'),
(15, 'Hospital Getúlio Vargas', 1, 0, 'Referência para APH e treinamento');

-- ===================================================================
-- 2. PESSOAL E LOGÍSTICA
-- ===================================================================

-- 2.1 USUARIO
TRUNCATE TABLE usuario;
INSERT INTO usuario (id_usuario, matricula, nome_completo, nome_guerra, email, posto_gradacao, id_unidade, cpf, ativo) VALUES
(1, '10001-9', 'João Marcelo de Albuquerque', 'Albuquerque', 'joao.albuquerque@siob.pe.com', 'Comandante Geral', 1, '111.111.111-11', 1), -- 1º GBM
(2, '10002-8', 'Bárbara Rodrigues da Costa', 'Bárbara', 'barbara.rodrigues@siob.pe.com', 'Capitão', 1, '222.222.222-22', 1), -- 1º GBM
(3, '10003-7', 'Carlos Silva Oliveira', 'Carlos', 'carlos.oliveira@siob.pe.com', 'Tenente', 2, '333.333.333-33', 1), -- 2º GBM
(4, '10004-6', 'Daniel Ferreira Lima', 'Lima', 'daniel.lima@siob.pe.com', 'Sargento', 3, '444.444.444-44', 1), -- 3º SBM
(5, '10005-5', 'Emília Rocha Santos', 'Emília', 'emilia.santos@siob.pe.com', 'Cabo', 4, '555.555.555-55', 1), -- 4º SBM
(6, '10006-4', 'Francisco Pereira Gomes', 'Gomes', 'francisco.gomes@siob.pe.com', 'Cabo', 5, '666.666.666-66', 1), -- 5º PBM
(7, '10007-3', 'Gustavo Henrique Costa', 'Gustavo', 'gustavo.costa@siob.pe.com', 'Sargento', 6, '777.777.777-77', 1), -- 6º PBM (Camaragibe)
(8, '10008-2', 'Helena Maria Souza', 'Helena', 'helena.souza@siob.pe.com', 'Tenente', 7, '888.888.888-88', 1), -- 7º PBM (Recife)
(9, '10009-1', 'Igor Tavares Mendes', 'Igor', 'igor.mendes@siob.pe.com', 'Cabo', 8, '999.999.999-99', 1), -- 8º PBM (Jaboatão)
(10, '10010-8', 'Juliana Santos Pires', 'Juliana', 'juliana.pires@siob.pe.com', 'Cabo', 9, '000.000.000-00', 1), -- 9º PBM (Olinda)
(11, '10011-7', 'Kleber R. Fernandes', 'Kleber', 'kleber.fernandes@siob.pe.com', 'Capitão', 10, '101.101.101-01', 1), -- 10º PBM (Recife)
(12, '10012-6', 'Laura Gonçalves Dias', 'Laura', 'laura.dias@siob.pe.com', 'Sargento', 1, '102.102.102-02', 1), -- 1º GBM
(13, '10013-5', 'Marcelo Antunes Neves', 'Marcelo', 'marcelo.neves@siob.pe.com', 'Capitão', 2, '103.103.103-03', 1), -- 2º GBM
(14, '10014-4', 'Naiara Queiroz Lima', 'Naiara', 'naiara.lima@siob.pe.com', 'Cabo', 3, '104.104.104-04', 1), -- 3º SBM
(15, '10015-3', 'Otávio Borges Pinto', 'Otávio', 'otavio.pinto@siob.pe.com', 'Sargento', 4, '105.105.105-05', 1); -- 4º SBM

-- 2.2 CONTA_SEGURA (15 Registros, Senha Fictícia: 'Senha123')
TRUNCATE TABLE conta_segura;
INSERT INTO conta_segura (id_usuario, senha_hash, duas_fatores) VALUES
(1, 'hash_jma_01', 1), (2, 'hash_brc_02', 1), (3, 'hash_cso_03', 0), (4, 'hash_dfl_04', 0),
(5, 'hash_ers_05', 0), (6, 'hash_fpg_06', 0), (7, 'hash_ghc_07', 1), (8, 'hash_hms_08', 0),
(9, 'hash_itm_09', 0), (10, 'hash_jsp_10', 0), (11, 'hash_krf_11', 1), (12, 'hash_lgd_12', 0),
(13, 'hash_man_13', 1), (14, 'hash_nql_14', 0), (15, 'hash_obp_15', 0);


-- 2.3 USUARIO_PAPEL (Múltiplos papéis para comandantes/oficiais)
TRUNCATE TABLE usuario_papel;
INSERT INTO usuario_papel (id_usuario, id_papel) VALUES
(1, 1), (1, 2), (2, 2), (2, 3), (3, 3), (3, 4), (4, 4), (5, 3), (6, 4), (7, 3),
(7, 4), (8, 3), (9, 3), (10, 3), (11, 2), (11, 3);

-- 2.4 VIATURA (7 Iniciais + 8 Novas = 15)
TRUNCATE TABLE viatura;
INSERT INTO viatura (id_vtr, prefixo, placa, id_tipo_vtr, modelo, ano, id_unidade, status, hodometro_atual) VALUES
(1, 'ABT-01', 'KGT1A23', 1, 'Mercedes Benz 1726', 2022, 1, 'Em Operação', 15500), -- 1º GBM (Recife)
(2, 'UR-05', 'KJS5B45', 2, 'Renault Master', 2023, 1, 'Em Operação', 8900), -- 1º GBM (Recife)
(3, 'AR-10', 'KMN9C67', 3, 'Chevrolet Blazer', 2018, 2, 'Em Operação', 95000), -- 2º GBM (Jaboatão)
(4, 'ABSL-02', 'KOP2D89', 4, 'Ford Ranger', 2021, 3, 'Em Manutenção', 45000), -- 3º SBM (Olinda)
(5, 'AER-01', 'FAB1A23', 5, 'Helicóptero Esquilo B3', 2019, 1, 'Em Operação', 1200), -- 1º GBM (Recife)
(6, 'AE-03', 'KPL3E11', 6, 'Volvo FM 400', 2020, 4, 'Em Operação', 25000), -- 4º SBM (Paulista)
(7, 'ASA-01', 'KQS4F22', 7, 'Mercedes Benz Sprinter', 2024, 6, 'Em Operação', 5000), -- 6º PBM (Camaragibe)
(8, 'ABT-02', 'KTR5G33', 1, 'Iveco Tector', 2021, 7, 'Em Operação', 30000), -- 7º PBM (Recife)
(9, 'UR-06', 'KUV6H44', 2, 'Fiat Ducato', 2019, 8, 'Em Operação', 60000), -- 8º PBM (Jaboatão)
(10, 'AR-11', 'KWX7I55', 3, 'Toyota Hilux', 2022, 5, 'Em Operação', 18000), -- 5º PBM (Moreno)
(11, 'ABT-03', 'KYZ8J66', 1, 'Scania P310', 2023, 9, 'Em Operação', 10000), -- 9º PBM (Olinda)
(12, 'UR-07', 'LAA9K77', 2, 'VW Kombi (Antiga)', 1995, 10, 'Em Reserva', 150000), -- 10º PBM (Recife)
(13, 'AR-12', 'LBB1L88', 3, 'Jeep Renegade', 2024, 2, 'Em Operação', 5000), -- 2º GBM (Jaboatão)
(14, 'ABSL-03', 'LCC2M99', 4, 'Land Rover Defender', 2015, 3, 'Em Operação', 120000), -- 3º SBM (Olinda)
(15, 'AE-04', 'LDD3N00', 6, 'MAN TGS', 2017, 4, 'Em Operação', 40000); -- 4º SBM (Paulista)

-- 2.5 CATEGORIA_EQUIPAMENTO (15 Registros)
TRUNCATE TABLE categoria_equipamento;
INSERT INTO categoria_equipamento (id_categoria, nome, descricao) VALUES
(1, 'EPI Incêndio', 'Equipamento de Proteção Individual para Combate a Incêndio'),
(2, 'EPI APH', 'Equipamento de Proteção Individual para Atendimento Pré-Hospitalar'),
(3, 'Resgate Veicular', 'Equipamento para desencarceramento'),
(4, 'Resgate em Altura', 'Cordas, mosquetões, ascensores'),
(5, 'Equip. Aquático', 'Coletes, botes, nadadeiras'),
(6, 'Equip. APH Avançado', 'Desfibriladores, ventiladores'),
(7, 'Mangueiras', 'Linhas de combate a incêndio'),
(8, 'Bombas e Acessórios', 'Bombas portáteis e acessórios de sucção'),
(9, 'Iluminação e Geração', 'Geradores, holofotes'),
(10, 'Comunicação', 'Rádios HT, repetidores'),
(11, 'Contenção PP', 'Barreiras, absorventes'),
(12, 'Equipamento de Mergulho', 'Cilindros, reguladores'),
(13, 'Ferramentas Manuais', 'Machados, pás, picaretas'),
(14, 'Sinalização', 'Cones, fitas de isolamento'),
(15, 'Material de Imobilização', 'KED, talas, prancha');

-- 2.6 EQUIPAMENTO (15 Registros)
TRUNCATE TABLE equipamento;
INSERT INTO equipamento (id_equipamento, codigo, nome, id_categoria, quantidade, localizacao) VALUES
(1, 'EPI-CAP-01', 'Capacete de Combate (40 un)', 1, 40, 'Almoxarifado Geral'),
(2, 'EPI-LUV-02', 'Luva Nitrílica (1000 pares)', 2, 1000, 'Almoxarifado APH'),
(3, 'DES-01', 'Desencarcerador Holmatro', 3, 5, 'VTR ABTs'),
(4, 'CORDA-05', 'Corda Estática 11mm (200m)', 4, 10, 'Mesa de Salvamento'),
(5, 'COLETE-03', 'Colete Salva-Vidas P-G', 5, 50, 'OBM Aquático'),
(6, 'DEA-01', 'Desfibrilador Externo Automático', 6, 8, 'VTR URs'),
(7, 'MANG-2-15', 'Mangueira 2.1/2" (15m)', 7, 100, 'VTR ABTs'),
(8, 'BOMBA-01', 'Bomba Submersível', 8, 3, 'VTR ARs'),
(9, 'GER-02', 'Gerador Portátil 5kVA', 9, 4, 'VTR ARs'),
(10, 'HT-DIGITAL', 'Rádio HT Digital', 10, 50, 'COBOM/VTRs'),
(11, 'BAR-CONT-01', 'Barreira de Contenção (50m)', 11, 2, 'OBM PP'),
(12, 'CIL-SCUBA', 'Cilindro de Mergulho 12L', 12, 20, 'OBM Salvamento'),
(13, 'PICARETA-01', 'Picareta Ponta e Olhal', 13, 15, 'VTR ABTs'),
(14, 'CONE-10', 'Cone de Sinalização 75cm', 14, 100, 'VTRs Diversas'),
(15, 'PRANCHA-02', 'Prancha Rígida', 15, 30, 'VTR URs');


-- ===================================================================
-- 3. OCORRÊNCIAS PRINCIPAIS (15 Registros de Ocorrência)
-- ===================================================================

TRUNCATE TABLE ocorrencia;
INSERT INTO ocorrencia (id_ocorrencia, numero_aviso, titulo, descricao, id_tipo, id_natureza, id_status, id_prioridade, id_forma_acionamento, id_unidade_responsavel, id_endereco, area_obm, data_aviso, hora_recebimento, id_criado_por) VALUES
(1, 'COBOM-2025/10/001', 'Incêndio em Apartamento', 'Fogo em cozinha, 5º andar. Fumaça intensa.', 2, 3, 2, 1, 1, 1, 13, 1, '2025-10-11 10:00:00', '10:00:00', 4), -- **Unid 1**, Endereço 13
(2, 'COBOM-2025/10/002', 'Vítima de Afogamento', 'Resgate em mar agitado. Vítima já na areia, inconsciente.', 8, 10, 3, 1, 2, 2, 12, 1, '2025-10-11 11:30:00', '11:30:00', 6), -- **Unid 2**, Endereço 12
(3, 'COBOM-2025/10/003', 'Queda de Altura', 'Pedreiro caiu do andaime, cerca de 4 metros. Consciente, mas com dor.', 1, 1, 2, 1, 1, 3, 13, 1, '2025-10-11 13:45:00', '13:45:00', 7), -- **Unid 3**, Endereço 13
(4, 'COBOM-2025/10/004', 'Vazamento de Gás', 'Forte cheiro de gás em loja de departamento. Área isolada pela segurança.', 5, 6, 3, 2, 3, 4, 14, 1, '2025-10-12 09:00:00', '09:00:00', 9), -- **Unid 4**, Endereço 14
(5, 'COBOM-2025/10/005', 'Mal Súbito em Idoso', 'Homem de 70 anos com desmaio súbito em casa. Família acionou.', 1, 2, 3, 2, 1, 5, 15, 1, '2025-10-12 14:00:00', '14:00:00', 10), -- **Unid 5**, Endereço 15
(6, 'COBOM-2025/10/006', 'Acidente Carro x Moto', 'Colisão com motociclista ferido. Fratura exposta na perna.', 9, 7, 2, 1, 1, 6, 6, 0, '2025-10-12 17:30:00', '17:30:00', 12), -- **Unid 6**, Endereço 6
(7, 'COBOM-2025/10/007', 'Guarda de Serviço', 'Serviço de prevenção no teatro para evento de grande porte.', 4, 12, 3, 3, 2, 7, 7, 1, '2025-10-13 19:00:00', '19:00:00', 2), -- **Unid 7**, Endereço 7
(8, 'COBOM-2025/10/008', 'Incêndio em Vegetação', 'Queimada em terreno baldio. Risco de propagação para residências.', 7, 9, 3, 2, 1, 8, 8, 1, '2025-10-14 10:45:00', '10:45:00', 13), -- **Unid 8**, Endereço 8
(9, 'COBOM-2025/10/009', 'Apoio Social - Visita', 'Visita de cunho social a escola para palestra sobre primeiros socorros.', 6, 12, 3, 3, 3, 9, 9, 1, '2025-10-15 08:30:00', '08:30:00', 5), -- **Unid 9**, Endereço 9
(10, 'COBOM-2025/10/010', 'Resgate de Animal', 'Gato preso em poste de alta tensão. Situação de risco.', 3, 8, 3, 3, 1, 10, 10, 1, '2025-10-15 15:00:00', '15:00:00', 8), -- **Unid 10**, Endereço 10
(11, 'COBOM-2025/10/011', 'Transporte Inter-Hosp.', 'Transferência de paciente grave (UTI) entre hospitais.', 11, 2, 3, 2, 2, 1, 1, 0, '2025-10-16 09:15:00', '09:15:00', 2), -- **Unid 1**, Endereço 1
(12, 'COBOM-2025/10/012', 'Incêndio em Veículo', 'Carro pegando fogo após pane elétrica em via pública.', 12, 7, 3, 1, 1, 2, 2, 1, '2025-10-16 11:40:00', '11:40:00', 12), -- **Unid 2**, Endereço 2
(13, 'COBOM-2025/10/013', 'Vazamento de Produto', 'Vazamento de amônia em câmara fria de frigorífico. Alto risco.', 5, 14, 2, 1, 1, 3, 3, 1, '2025-10-17 07:00:00', '07:00:00', 5), -- **Unid 3**, Endereço 3
(14, 'COBOM-2025/10/014', 'Queda de Barreira', 'Pequeno deslizamento de terra em área de morro. Sem vítimas.', 10, 13, 3, 2, 1, 4, 4, 1, '2025-10-17 15:30:00', '15:30:00', 9), -- **Unid 4**, Endereço 4
(15, 'COBOM-2025/10/015', 'Corte de Árvore', 'Árvore caída na via devido à chuva. Obstrução da pista.', 3, 11, 3, 3, 1, 5, 5, 1, '2025-10-18 08:00:00', '08:00:00', 10); -- **Unid 5**, Endereço 5


-- 3.1 SOLICITANTE (15 Registros)
TRUNCATE TABLE solicitante;
INSERT INTO solicitante (id_solicitante, id_ocorrencia, nome, cpf_rg, telefone, relacionamento) VALUES
(1, 1, 'Maria Lúcia P. S.', '111.222.333-44', '98765-4321', 'Vizinha'),
(2, 2, 'Lucas Silva Almeida', '222.333.444-55', '98777-6666', 'Amigo da Vítima'),
(3, 3, 'Geraldo Rocha', '333.444.555-66', '98888-5555', 'Mestre de Obras'),
(4, 4, 'Ana Carla Tavares', '444.555.666-77', '98999-4444', 'Gerente da Loja'),
(5, 5, 'Júlia Mendes', '555.666.777-88', '99000-3333', 'Filha da Vítima'),
(6, 6, 'Patrícia Nunes', '666.777.888-99', '99111-2222', 'Motorista Envolvida'),
(7, 7, 'Ricardo Alves', '777.888.999-00', '99222-1111', 'Segurança do Teatro'),
(8, 8, 'Fábio Costa', '888.999.000-11', '99333-0000', 'Morador Próximo'),
(9, 9, 'Diretora Escola', '999.000.111-22', '99444-9999', 'Representante Instituição'),
(10, 10, 'Joana Dantas', '000.111.222-33', '99555-8888', 'Proprietária do Gato'),
(11, 11, 'Enfermeira Chefe', '111.222.333-45', '99666-7777', 'Hospital de Origem'),
(12, 12, 'Pedro Henrique', '222.333.444-56', '99777-6666', 'Testemunha'),
(13, 13, 'Supervisor Fábrica', '333.444.555-67', '99888-5555', 'Responsável pela Área'),
(14, 14, 'Vizinho A', '444.555.666-78', '99999-4444', 'Morador da Comunidade'),
(15, 15, 'Taxista', '555.666.777-89', '90000-3333', 'Passando na hora da queda');

-- 3.2 CHAMADA_DISPATCH (15 Registros)
TRUNCATE TABLE chamada_dispatch;
INSERT INTO chamada_dispatch (id_chamada, id_ocorrencia, origem, canal, hora_chamada, id_registrador) VALUES
(1, 1, 'Residência', '193', '2025-10-11 10:00:00', 4),
(2, 2, 'Rua', 'Rádio Viatura', '2025-10-11 11:30:00', 6),
(3, 3, 'Comércio', '193', '2025-10-11 13:45:00', 7),
(4, 4, 'Alarme', 'Presencial', '2025-10-12 09:00:00', 9),
(5, 5, 'Residência', '193', '2025-10-12 14:00:00', 10),
(6, 6, 'Via Pública', '193', '2025-10-12 17:30:00', 12),
(7, 7, 'Unidade', 'E-mail', '2025-10-13 19:00:00', 2),
(8, 8, 'Comunidade', '193', '2025-10-14 10:45:00', 13),
(9, 9, 'Instituição', 'Telefone Fixo', '2025-10-15 08:30:00', 5),
(10, 10, 'Residência', '193', '2025-10-15 15:00:00', 8),
(11, 11, 'Hospital', 'Rádio Viatura', '2025-10-16 09:15:00', 2),
(12, 12, 'Via Pública', '193', '2025-10-16 11:40:00', 12),
(13, 13, 'Indústria', 'Presencial', '2025-10-17 07:00:00', 5),
(14, 14, 'Comunidade', '193', '2025-10-17 15:30:00', 9),
(15, 15, 'Via Pública', '193', '2025-10-18 08:00:00', 10);

-- 3.3 DESLOCAMENTO (15 Registros - Mínimo 1 VTR por Ocorrência, exceto 7 e 9 que são Ações Internas/Apoio)
TRUNCATE TABLE deslocamento;
INSERT INTO deslocamento (id_deslocamento, id_ocorrencia, id_vtr, chamado_em, hora_saida, hora_chegada_local, hora_saida_local, hora_retorno_quartel, hodometro_saida, hodometro_local, distancia_km) VALUES
(1, 1, 1, '2025-10-11 10:01:00', '2025-10-11 10:05:00', '2025-10-11 10:15:00', '2025-10-11 11:00:00', '2025-10-11 11:15:00', 15500, 15505, 5.0), -- VTR 1 (Unid 1)
(2, 2, 3, '2025-10-11 11:31:00', '2025-10-11 11:35:00', '2025-10-11 11:45:00', '2025-10-11 12:30:00', '2025-10-11 12:45:00', 95000, 95010, 10.0), -- VTR 3 (Unid 2)
(3, 3, 14, '2025-10-11 13:46:00', '2025-10-11 13:50:00', '2025-10-11 13:55:00', '2025-10-11 14:30:00', '2025-10-11 14:40:00', 120000, 120003, 3.0), -- VTR 14 (Unid 3)
(4, 4, 6, '2025-10-12 09:01:00', '2025-10-12 09:04:00', '2025-10-12 09:10:00', '2025-10-12 10:00:00', '2025-10-12 10:10:00', 25000, 25005, 5.0), -- VTR 6 (Unid 4)
(5, 5, 10, '2025-10-12 14:01:00', '2025-10-12 14:06:00', '2025-10-12 14:20:00', '2025-10-12 15:00:00', '2025-10-12 15:20:00', 18000, 18015, 15.0), -- VTR 10 (Unid 5)
(6, 6, 7, '2025-10-12 17:31:00', '2025-10-12 17:35:00', '2025-10-12 17:50:00', '2025-10-12 18:30:00', '2025-10-12 18:45:00', 5000, 5015, 15.0), -- VTR 7 (Unid 6)
(7, 7, 8, '2025-10-13 18:45:00', '2025-10-13 19:00:00', '2025-10-13 19:30:00', '2025-10-14 00:00:00', '2025-10-14 00:30:00', 30000, 30020, 20.0), -- VTR 8 (Unid 7)
(8, 8, 9, '2025-10-14 10:46:00', '2025-10-14 10:50:00', '2025-10-14 11:00:00', '2025-10-14 11:45:00', '2025-10-14 12:00:00', 60000, 60010, 10.0), -- VTR 9 (Unid 8)
(9, 9, 11, '2025-10-15 08:30:00', '2025-10-15 08:45:00', '2025-10-15 09:00:00', '2025-10-15 11:30:00', '2025-10-15 12:00:00', 10000, 10015, 15.0), -- VTR 11 (Unid 9)
(10, 10, 12, '2025-10-15 15:01:00', '2025-10-15 15:05:00', '2025-10-15 15:15:00', '2025-10-15 16:00:00', '2025-10-15 16:10:00', 150000, 150005, 5.0), -- VTR 12 (Unid 10)
(11, 11, 2, '2025-10-16 09:16:00', '2025-10-16 09:20:00', '2025-10-16 09:45:00', '2025-10-16 10:30:00', '2025-10-16 10:50:00', 8900, 8925, 25.0), -- VTR 2 (Unid 1)
(12, 12, 13, '2025-10-16 11:41:00', '2025-10-16 11:45:00', '2025-10-16 12:00:00', '2025-10-16 12:45:00', '2025-10-16 13:00:00', 5000, 5015, 15.0), -- VTR 13 (Unid 2)
(13, 13, 4, '2025-10-17 07:01:00', '2025-10-17 07:05:00', '2025-10-17 07:15:00', '2025-10-17 08:00:00', '2025-10-17 08:10:00', 45000, 45010, 10.0), -- VTR 4 (Unid 3)
(14, 14, 15, '2025-10-17 15:31:00', '2025-10-17 15:35:00', '2025-10-17 15:50:00', '2025-10-17 16:30:00', '2025-10-17 16:45:00', 40000, 40015, 15.0), -- VTR 15 (Unid 4)
(15, 15, 10, '2025-10-18 08:01:00', '2025-10-18 08:05:00', '2025-10-18 08:15:00', '2025-10-18 09:00:00', '2025-10-18 09:10:00', 18015, 18025, 10.0); -- VTR 10 (Unid 5)

-- 3.4 GUARNICAO (15 Registros)
TRUNCATE TABLE guarnicao;
INSERT INTO guarnicao (id_guarnicao, id_ocorrencia, id_vtr, id_usuario, funcao) VALUES
(1, 1, 1, 2, 'Comandante da VTR'), (2, 2, 3, 3, 'Comandante da VTR'),
(3, 3, 14, 8, 'Comandante da VTR'), (4, 4, 6, 5, 'Operador'),
(5, 5, 10, 6, 'Motorista'), (6, 6, 7, 7, 'Comandante da VTR'),
(7, 7, 8, 8, 'Comandante da VTR'), (8, 8, 9, 9, 'Operador'),
(9, 9, 11, 10, 'Operador'), (10, 10, 12, 11, 'Comandante da VTR'),
(11, 11, 2, 2, 'Comandante da VTR'), (12, 12, 13, 13, 'Comandante da VTR'),
(13, 13, 4, 14, 'Operador'), (14, 14, 15, 5, 'Operador'),
(15, 15, 10, 6, 'Comandante da VTR');

-- ===================================================================
-- 4. ATENDIMENTO PRÉ-HOSPITALAR (APH)
-- ===================================================================

-- Ocorrências com APH: 2 (Afogamento), 3 (Queda), 5 (Mal Súbito), 6 (Acidente), 11 (Transporte)
-- 15 Registros de Vítima para 5 Ocorrências (média de 3 por ocorrência)

-- 4.1 VITIMA (15 Registros)
TRUNCATE TABLE vitima;
INSERT INTO vitima (id_vitima, id_ocorrencia, nome, idade, sexo, estado_consciencia, id_endereco) VALUES
(1, 2, 'Vítima Não Identificada', 25, 'M', 'Inconsciente', 8),
(2, 2, 'João da Silva', 30, 'M', 'Consciente', 8),
(3, 3, 'Manoel de Jesus', 45, 'M', 'Consciente', 9),
(4, 5, 'Dona Alzira Souza', 72, 'F', 'Inconsciente', 11),
(5, 6, 'Paula R. Lima (Motociclista)', 35, 'F', 'Consciente', 12),
(6, 6, 'Vítima Não Lesionada (Carro)', 50, 'M', 'Consciente', 12),
(7, 11, 'Paciente UTI (Transferência)', 65, 'M', 'Sedado', 1),
(8, 2, 'Criança (Afogamento leve)', 10, 'F', 'Consciente', 8),
(9, 3, 'Auxiliar de Pedreiro', 22, 'M', 'Consciente', 9),
(10, 5, 'Maria F. Santos', 68, 'F', 'Consciente', 11),
(11, 6, 'Vítima Não Lesionada (Passageiro)', 28, 'F', 'Consciente', 12),
(12, 1, 'Morador (Intoxicação fumaça)', 40, 'M', 'Consciente', 7),
(13, 13, 'Funcionário Frigorífico (Amônia)', 55, 'M', 'Inconsciente', 3),
(14, 13, 'Funcionário Frigorífico (Amônia)', 32, 'F', 'Consciente', 3),
(15, 1, 'Morador (Intoxicação fumaça)', 35, 'F', 'Consciente', 7);

-- 4.2 LESAO (15 Registros)
TRUNCATE TABLE lesao;
INSERT INTO lesao (id_vitima, tipo_lesao, regiao_corporal, gravidade, descricao) VALUES
(1, 'Afogamento', 'Pulmonar', 'Grave', 'Parada Cardiorrespiratória'),
(2, 'Exaustão', 'Geral', 'Média', 'Cansaço e ingestão de água'),
(3, 'Fratura', 'Membro Inferior', 'Grave', 'Fratura de fêmur fechada'),
(4, 'Mal Súbito', 'Cardíaca', 'Grave', 'Possível AVE, sem resposta verbal'),
(5, 'Fratura Exposta', 'Membro Inferior', 'Grave', 'Fratura tíbia e fíbula'),
(6, 'Nenhuma', 'Nenhuma', 'Leve', 'Apenas escoriações leves'),
(7, 'Doença Base', 'Sistêmica', 'Grave', 'Paciente em estado grave pré-existente'),
(8, 'Afogamento', 'Geral', 'Leve', 'Tosse e desconforto respiratório'),
(9, 'Contusão', 'Membros Superiores', 'Média', 'Luxação do ombro'),
(10, 'Hipotensão', 'Geral', 'Média', 'Pressão baixa, tontura'),
(11, 'Nenhuma', 'Nenhuma', 'Leve', 'Sem lesões'),
(12, 'Intoxicação por Monóxido', 'Respiratória', 'Média', 'Dificuldade de respirar, dor de cabeça'),
(13, 'Intoxicação por Amônia', 'Respiratória', 'Grave', 'Inconsciente por inalação'),
(14, 'Intoxicação por Amônia', 'Ocular', 'Média', 'Irritação grave nos olhos'),
(15, 'Intoxicação por Monóxido', 'Respiratória', 'Leve', 'Tosse leve');

-- 4.3 SINAL_VITAL (15 Registros)
TRUNCATE TABLE sinal_vital;
INSERT INTO sinal_vital (id_vitima, registrado_em, pa, fc, fr, sao2, glicemia) VALUES
(1, '2025-10-11 11:45:00', '0/0', 0, 0, 50, 90.0),
(2, '2025-10-11 11:47:00', '120/80', 100, 20, 95, 110.0),
(3, '2025-10-11 13:55:00', '130/90', 95, 18, 98, 98.0),
(4, '2025-10-12 14:20:00', '80/50', 120, 25, 90, 80.0),
(5, '2025-10-12 17:50:00', '110/70', 110, 22, 96, 120.0),
(6, '2025-10-12 17:55:00', '120/80', 80, 16, 99, 100.0),
(7, '2025-10-16 09:30:00', '100/60', 90, 18, 95, 150.0),
(8, '2025-10-11 11:50:00', '110/70', 90, 18, 97, 105.0),
(9, '2025-10-11 13:58:00', '125/85', 92, 17, 99, 95.0),
(10, '2025-10-12 14:25:00', '90/60', 105, 20, 96, 115.0),
(11, '2025-10-12 17:58:00', '120/80', 75, 16, 100, 102.0),
(12, '2025-10-11 10:18:00', '130/85', 95, 20, 92, 99.0),
(13, '2025-10-17 07:18:00', '90/60', 115, 28, 88, 105.0),
(14, '2025-10-17 07:22:00', '120/80', 90, 18, 95, 95.0),
(15, '2025-10-11 10:20:00', '120/80', 90, 18, 95, 97.0);

-- 4.4 QUEIMADURA (5 Registros - Não todas as vítimas têm)
TRUNCATE TABLE queimadura;
INSERT INTO queimadura (id_vitima, local_corpo, grau, area_afetada) VALUES
(1, 'Membros Superiores', '1º Grau', '1%'),
(12, 'Face', '2º Grau', '2%'),
(13, 'Pescoço', '1º Grau', '1%'),
(14, 'Olhos/Face', '2º Grau', '5%'),
(15, 'Mãos', '1º Grau', '1%');

-- 4.5 MATERIAL_BASE (15 Registros - Catálogo)
TRUNCATE TABLE material_base;
INSERT INTO material_base (id_material, nome, descricao, unidade_medida) VALUES
(1, 'Atadura Crepe 15cm', 'Para imobilização e curativos', 'Unidade'),
(2, 'Colar Cervical', 'Imobilização cervical', 'Unidade'),
(3, 'Soro Fisiológico 500ml', 'Hidratação e limpeza', 'Unidade'),
(4, 'Máscara de O2 não reinalante', 'Oxigenoterapia', 'Unidade'),
(5, 'Luva de Procedimento (Caixa)', 'Higiene e segurança', 'Caixa'),
(6, 'Kit Queimadura', 'Tratamento imediato de queimaduras', 'Unidade'),
(7, 'Prancha Rígida', 'Imobilização total', 'Unidade'),
(8, 'DEA (Pás e Bateria)', 'Desfibrilação', 'Unidade'),
(9, 'Fita de Isolamento', 'Isolamento de área', 'Rolo'),
(10, 'Kit de Sutura', 'Pequenos procedimentos', 'Unidade'),
(11, 'Gaze Estéril', 'Curativos', 'Pacote'),
(12, 'Ambu - Reanimador Manual', 'Ventilação assistida', 'Unidade'),
(13, 'Maca de Rodas', 'Transporte de pacientes', 'Unidade'),
(14, 'Talão de Ocorrência', 'Registro de APH', 'Talão'),
(15, 'Fármacos (Catálogo)', 'Medicamentos de uso restrito', 'Unidade');

-- 4.6 MATERIAL_APH_UTILIZADO (15 Registros - Uso real)
TRUNCATE TABLE material_aph_utilizado;
INSERT INTO material_aph_utilizado (id_ocorr_material, id_ocorrencia, id_material, quantidade_utilizada) VALUES
(1, 2, 4, 1), (2, 2, 7, 1), (3, 3, 2, 1), (4, 3, 7, 1),
(5, 5, 4, 1), (6, 5, 11, 5), (7, 6, 2, 1), (8, 6, 7, 1),
(9, 6, 1, 3), (10, 11, 13, 1), (11, 11, 15, 1), (12, 1, 9, 1),
(13, 13, 5, 2), (14, 13, 11, 10), (15, 2, 12, 1);

-- 4.7 APH_ATENDIMENTO (5 Ocorrências x 1 Registro = 5, mais 10 para completar)
TRUNCATE TABLE aph_atendimento;
INSERT INTO aph_atendimento (id_aph, id_ocorrencia, id_vitima, data_atendimento, sinais_iniciais, acoes_realizadas, destino, id_preenchido_por) VALUES
(1, 2, 1, '2025-10-11', '{"resp": "0", "pulso": "0", "cinemática": "afogamento"}', '{"acao": "RCP e Desfibrilador", "detalhe": "Transferido ao hospital"}', 'Hospital da Restauração', 3),
(2, 3, 3, '2025-10-11', '{"resp": "18", "pulso": "95", "cinemática": "queda de 4m"}', '{"acao": "Imobilização C e V", "detalhe": "Sinais vitais estáveis"}', 'Hospital Dom Hélder', 8),
(3, 5, 4, '2025-10-12', '{"resp": "25", "pulso": "120", "cinemática": "desmaio súbito"}', '{"acao": "Oxigenoterapia", "detalhe": "Hipotenso, encaminhado"}', 'Hospital Getúlio Vargas', 13),
(4, 6, 5, '2025-10-12', '{"resp": "22", "pulso": "110", "cinemática": "colisão frontal"}', '{"acao": "Controle de Hemorragia", "detalhe": "Imobilização de Fratura"}', 'Hospital da Restauração', 2),
(5, 11, 7, '2025-10-16', '{"resp": "18", "pulso": "90", "cinemática": "transporte UTI"}', '{"acao": "Monitoramento Avançado", "detalhe": "Transporte concluído com sucesso"}', 'Hospital Português', 8),
(6, 2, 2, '2025-10-11', '{"resp": "20", "pulso": "100", "cinemática": "afogamento"}', '{"acao": "Avaliação e Conforto", "detalhe": "Liberado no local"}', 'Liberado no Local', 3),
(7, 3, 9, '2025-10-11', '{"resp": "17", "pulso": "92", "cinemática": "queda de 4m"}', '{"acao": "Avaliação Lesão", "detalhe": "Encaminhado para UPA"}', 'UPA Olinda', 8),
(8, 5, 10, '2025-10-12', '{"resp": "20", "pulso": "105", "cinemática": "desmaio súbito"}', '{"acao": "Oxigenoterapia", "detalhe": "Hipotensa, encaminhada UPA"}', 'UPA Moreno', 13),
(9, 6, 6, '2025-10-12', '{"resp": "16", "pulso": "80", "cinemática": "colisão frontal"}', '{"acao": "Avaliação", "detalhe": "Liberado no local"}', 'Liberado no Local', 2),
(10, 6, 11, '2025-10-12', '{"resp": "16", "pulso": "75", "cinemática": "colisão frontal"}', '{"acao": "Avaliação", "detalhe": "Liberado no local"}', 'Liberado no Local', 2),
(11, 1, 12, '2025-10-11', '{"resp": "20", "pulso": "95", "cinemática": "Intoxicação"}', '{"acao": "Retirada do local e O2", "detalhe": "Encaminhado UPA"}', 'UPA Caxangá', 4),
(12, 1, 15, '2025-10-11', '{"resp": "18", "pulso": "90", "cinemática": "Intoxicação"}', '{"acao": "Retirada do local e O2", "detalhe": "Encaminhado UPA"}', 'UPA Caxangá', 4),
(13, 13, 13, '2025-10-17', '{"resp": "28", "pulso": "115", "cinemática": "Vazamento"}', '{"acao": "Descontaminação e O2", "detalhe": "Hospital do Trauma"}', 'Hospital do Trauma', 5),
(14, 13, 14, '2025-10-17', '{"resp": "18", "pulso": "90", "cinemática": "Vazamento"}', '{"acao": "Lavagem ocular", "detalhe": "Liberado após atendimento"}', 'Liberado no Local', 5),
(15, 2, 8, '2025-10-11', '{"resp": "18", "pulso": "90", "cinemática": "afogamento"}', '{"acao": "Avaliação e Conforto", "detalhe": "Liberado aos pais"}', 'Liberado aos Pais', 3);


-- ===================================================================
-- 5. FORMULÁRIOS SECUNDÁRIOS
-- ===================================================================

-- 5.1 OCORRENCIA_INCENDIO (3 Ocorrências: 1, 8, 12 - 5 registros)
TRUNCATE TABLE ocorrencia_incendio;
INSERT INTO ocorrencia_incendio (id_incendio, id_ocorrencia, tipo_local, causa_presumida, tempo_extincao_minutes, consumo_agua_litros, area_atingida_m2, comandante_matricula, id_preenchido_por) VALUES
(1, 1, 'Residência (Apartamento)', 'Curto-circuito na cozinha', 30, 2000.00, 15.00, '10002-8', 2),
(2, 8, 'Vegetação (Terreno Baldio)', 'Ação Humana/Descarte', 45, 1000.00, 250.00, '10008-2', 8),
(3, 12, 'Veículo (Carro de Passeio)', 'Pane elétrica no motor', 15, 500.00, 5.00, '10003-7', 3),
(4, 1, 'Residência (Apartamento)', 'Gordura em fogo', 20, 1500.00, 10.00, '10002-8', 2),
(5, 8, 'Vegetação (Terreno Baldio)', 'Foco secundário', 15, 300.00, 50.00, '10008-2', 8);

-- 5.2 OCORRENCIA_SALVAMENTO (4 Ocorrências: 2, 10, 14, 15 - 5 registros)
TRUNCATE TABLE ocorrencia_salvamento;
INSERT INTO ocorrencia_salvamento (id_salvamento, id_ocorrencia, tipo_operacao, local_operacao, numero_vitimas, comandante_matricula, id_preenchido_por) VALUES
(1, 2, 'Resgate Aquático', 'Mar Aberto (Praia)', 3, '10003-7', 3),
(2, 10, 'Resgate em Altura', 'Poste de Eletricidade', 0, '10011-7', 11),
(3, 14, 'Resgate Terrestre', 'Área de Barreira', 0, '10011-7', 11),
(4, 15, 'Corte e Poda', 'Via Pública', 0, '10013-5', 13),
(5, 2, 'Resgate Aquático', 'Borda da Praia', 1, '10003-7', 3);

-- 5.3 MERGULHADOR_OPERACAO (5 Registros)
TRUNCATE TABLE mergulhador_operacao;
INSERT INTO mergulhador_operacao (id_mergulhador, id_salvamento, matricula, nome_guerra, profundidade_m, tempo_fundo_seconds, tempo_total_seconds, cilindro_bar_inicial, cilindro_bar_final) VALUES
(1, 1, '10009-1', 'Igor', 5.0, 600, 900, 200, 120),
(2, 1, '10014-4', 'Naiara', 5.0, 600, 900, 200, 110),
(3, 1, '10009-1', 'Igor', 8.0, 300, 600, 120, 70),
(4, 5, '10014-4', 'Naiara', 3.0, 120, 200, 200, 180),
(5, 5, '10009-1', 'Igor', 2.0, 60, 150, 180, 165);

-- 5.4 OCORR_PRODUTO_PERIGOSO (2 Ocorrências: 4, 13 - 5 registros)
TRUNCATE TABLE ocorr_produto_perigoso;
INSERT INTO ocorr_produto_perigoso (id_produto_perigoso, id_ocorrencia, grupo, nome_produto, numero_onu, classe_risco, volume, unidade_volume, estado_fisico, id_preenchido_por) VALUES
(1, 4, 'Gases Inflamáveis', 'Gás Liquefeito de Petróleo (GLP)', '1075', '2.1', 50.0, 'Litros', 'Gasoso', 11),
(2, 13, 'Gases Tóxicos', 'Amônia Anidra', '1005', '2.3', 100.0, 'Litros', 'Gasoso', 5),
(3, 4, 'Gases Inflamáveis', 'Gás Natural (GNV)', '1971', '2.1', 20.0, 'Litros', 'Gasoso', 11),
(4, 13, 'Gases Tóxicos', 'Amônia Anidra', '1005', '2.3', 200.0, 'Litros', 'Gasoso', 5),
(5, 13, 'Gases Tóxicos', 'Amônia Anidra', '1005', '2.3', 50.0, 'Litros', 'Gasoso', 5);

-- 5.5 PP_ACAO_ADOTADA (5 Registros)
TRUNCATE TABLE pp_acao_adotada;
INSERT INTO pp_acao_adotada (id_produto_perigoso, acao_nome, descricao) VALUES
(1, 'Isolamento de Área', 'Raio de 50 metros isolado'),
(2, 'Contenção', 'Vedação de válvula de segurança'),
(3, 'Ventilação Natural', 'Abertura de janelas e portas'),
(4, 'Evacuação', 'Retirada de 10 funcionários'),
(5, 'Monitoramento', 'Monitoramento da concentração com medidor de gases');

-- 5.6 OCORRENCIA_PREVENCAO (1 Ocorrência: 7 - 5 registros)
TRUNCATE TABLE ocorrencia_prevencao;
INSERT INTO ocorrencia_prevencao (id_prevencao, id_ocorrencia, id_local_evento, nome_evento, evento_regularizado, ar_av_ae_status, publico_presente, comandante_matricula, id_preenchido_por) VALUES
(1, 7, 2, 'Espetáculo Teatral', 1, 'valido', 750, '10008-2', 8), -- Unidade 7
(2, 7, 14, 'Feira Gastronômica', 1, 'valido', 2500, '10011-7', 11), -- Unidade 10
(3, 7, 6, 'Partida de Futebol Categoria Base', 1, 'valido', 400, '10004-6', 4), -- Unidade 3
(4, 7, 1, 'Grande Show Musical', 1, 'valido', 28000, '10002-8', 2), -- Unidade 1
(5, 7, 10, 'Festa Junina Comunitária', 0, 'vencido', 300, '10013-5', 13); -- Unidade 2

-- 5.7 PREVENCAO_TIPO_EVENTO (5 Registros)
TRUNCATE TABLE prevencao_tipo_evento;
INSERT INTO prevencao_tipo_evento (id_prevencao, tipo_evento) VALUES
(1, 'Teatro'), (2, 'Feira'), (3, 'Esportivo'), (4, 'Show Musical'), (5, 'Comunitário');

-- 5.8 PREVENCAO_ESTRUTURA (5 Registros)
TRUNCATE TABLE prevencao_estrutura;
INSERT INTO prevencao_estrutura (id_prevencao, estrutura_nome, montada) VALUES
(1, 'Posto de Comando', 1), (2, 'Ambulância no Local', 1), (3, 'Rádio HT', 1),
(4, 'Posto de Atendimento Médico', 1), (5, 'Viaturas de Incêndio (Reserva)', 1);

-- 5.9 OCORRENCIA_ATITUDE_COM (1 Ocorrência: 9 - 5 Registros)
TRUNCATE TABLE ocorrencia_atitude_com;
INSERT INTO ocorrencia_atitude_com (id_atitude, id_ocorrencia, tipo_atividade, publico_alvo, participantes, resultado, id_preenchido_por) VALUES
(1, 9, 'Palestra e Demonstração', 'Estudantes (6-12 anos)', 150, 'Crianças engajadas e aprendendo sobre 193', 5),
(2, 9, 'Campanha de Arrecadação', 'Comunidade Local', 50, 'Arrecadação de 100kg de alimentos', 5),
(3, 9, 'Visita ao Quartel', 'Escoteiros', 30, 'Crianças conhecendo a rotina e equipamentos', 5),
(4, 9, 'Banho de Neblina', 'Moradores de Olinda', 500, 'Ação de integração durante evento', 5),
(5, 9, 'Treinamento Voluntário', 'Associação de Moradores', 20, 'Treinamento de primeiros socorros básicos', 5);

-- 5.10 AC_INTERACAO_SOCIAL (5 Registros)
TRUNCATE TABLE ac_interacao_social;
INSERT INTO ac_interacao_social (id_atitude, acao_nome) VALUES
(1, 'Palestra'), (2, 'Campanha Social'), (3, 'Visita Educativa'),
(4, 'Banho de Neblina'), (5, 'Treinamento Comunitário');

-- 5.11 AC_APOIO_INSTITUICAO (5 Registros - Catálogo de Instituições)
CREATE TABLE IF NOT EXISTS instituicao_base (id_instituicao INT AUTO_INCREMENT PRIMARY KEY, nome VARCHAR(100) UNIQUE);
INSERT INTO instituicao_base (nome) VALUES ('PMPE'), ('PCPE'), ('Polícia Federal'), ('Prefeitura Olinda'), ('Igreja X');
TRUNCATE TABLE ac_apoio_instituicao;
INSERT INTO ac_apoio_instituicao (id_atitude, instituicao_nome) VALUES
(1, 'Prefeitura Olinda'), (2, 'Igreja X'), (3, 'PMPE'), (4, 'Prefeitura Olinda'), (5, 'PMPE');


-- ===================================================================
-- 6. APOIOS E DIVERSOS (Relacionamentos N:N, Logs e Tarefas)
-- ===================================================================

-- 6.1 AGENCIA_APOIO (15 Registros)
TRUNCATE TABLE agencia_apoio;
INSERT INTO agencia_apoio (id_agencia, nome, tipo, contato, telefone) VALUES
(1, 'Polícia Militar PE', 'Segurança Pública', 'CMT do Batalhão', '3182-3200'),
(2, 'Polícia Rodoviária Federal', 'Fiscalização', 'Plantão PRF', '191'),
(3, 'CELPE (Neoenergia)', 'Serviço Público', 'Emergência', '116'),
(4, 'COMPESA', 'Serviço Público', 'Emergência', '0800-281-0195'),
(5, 'Defesa Civil Recife', 'Apoio Social', 'Plantão 24h', '3412-2428'),
(6, 'SAMU Metropolitano', 'Saúde', 'Coordenação', '192'),
(7, 'IML', 'Perícia', 'Plantão', '3423-5332'),
(8, 'Guarda Municipal Jaboatão', 'Segurança Pública', 'Plantão GM', '3462-8000'),
(9, 'Emlurb Recife', 'Serviço Público', 'Limpeza Urbana', '3303-3600'),
(10, 'Hospital da Restauração', 'Saúde', 'Emergência', '3181-5555'),
(11, 'Secretaria de Meio Ambiente', 'Fiscalização', 'Plantão', '3182-8800'),
(12, 'Polícia Civil PE', 'Investigação', 'Plantão', '3419-4155'),
(13, 'IBAMA', 'Fiscalização Ambiental', 'Plantão', '3322-2210'),
(14, 'Infraero', 'Apoio Aeroportuário', 'Gerência', '3464-4133'),
(15, 'Força Aérea Brasileira (FAB)', 'Apoio Aéreo', 'Plantão SAR', '3464-8181');

-- 6.2 OCORRENCIA_AGENCIA (15 Registros)
TRUNCATE TABLE ocorrencia_agencia;
INSERT INTO ocorrencia_agencia (id_ocorr_agencia, id_ocorrencia, id_agencia, descricao, acionado, horario_acionamento) VALUES
(1, 1, 1, 'Apoio no isolamento da rua', 1, '2025-10-11 10:05:00'),
(2, 2, 6, 'Apoio e transporte da vítima de afogamento', 1, '2025-10-11 11:45:00'),
(3, 3, 3, 'Desligamento de energia na área da queda', 1, '2025-10-11 13:50:00'),
(4, 4, 3, 'Desligamento da rede de gás da rua', 1, '2025-10-12 09:05:00'),
(5, 6, 2, 'Controle do trânsito na BR', 1, '2025-10-12 17:35:00'),
(6, 7, 1, 'Guarda externa do evento', 1, '2025-10-13 18:00:00'),
(7, 8, 9, 'Limpeza da área após rescaldo', 1, '2025-10-14 12:05:00'),
(8, 10, 3, 'Desligamento temporário do poste', 1, '2025-10-15 15:05:00'),
(9, 11, 6, 'Acompanhamento na transferência do paciente', 1, '2025-10-16 09:20:00'),
(10, 12, 1, 'Isolamento da via durante o incêndio', 1, '2025-10-16 11:45:00'),
(11, 13, 11, 'Fiscalização e laudo do vazamento', 1, '2025-10-17 07:10:00'),
(12, 14, 5, 'Avaliação estrutural da barreira', 1, '2025-10-17 15:55:00'),
(13, 15, 9, 'Remoção da árvore da pista', 1, '2025-10-18 08:30:00'),
(14, 1, 6, 'Apoio em intoxicação por fumaça', 1, '2025-10-11 10:10:00'),
(15, 13, 10, 'Apoio médico especializado', 1, '2025-10-17 07:20:00');

-- 6.3 TAREFA (15 Registros)
TRUNCATE TABLE tarefa;
INSERT INTO tarefa (id_tarefa, id_ocorrencia, titulo, descricao, responsavel, status, data_vencimento) VALUES
(1, 1, 'Concluir Laudo Incêndio', 'Detalhar perdas e danos no laudo I-2', 2, 'Pendente', '2025-10-14'),
(2, 2, 'Preencher APH Completo', 'Revisar sinais vitais da vítima 1', 3, 'Concluído', '2025-10-12'),
(3, 4, 'Desmobilizar PP', 'Retirar barreiras de contenção após 24h', 11, 'Pendente', '2025-10-13'),
(4, 6, 'Coletar Imagens', 'Obter fotos da colisão para anexar ao relatório', 2, 'Em Andamento', '2025-10-14'),
(5, 7, 'Revisar Checklist', 'Verificar se todos os itens de prevenção foram checados', 8, 'Concluído', '2025-10-14'),
(6, 9, 'Relatório de AC', 'Emitir relatório de Atividade Comunitária para o CMT', 5, 'Pendente', '2025-10-16'),
(7, 10, 'Laudo Resgate Animal', 'Registrar o sucesso da operação e o estado do animal', 11, 'Concluído', '2025-10-16'),
(8, 13, 'Controle de Estoque PP', 'Repor absorventes químicos utilizados', 5, 'Em Andamento', '2025-10-18'),
(9, 15, 'Revisão da Motosserra', 'Enviar motosserra para manutenção após o corte', 13, 'Pendente', '2025-10-19'),
(10, 1, 'Verificar Hidrante', 'Checar hidrante mais próximo do local do incêndio', 12, 'Concluído', '2025-10-11'),
(11, 3, 'Notificar MTE', 'Informar o Ministério do Trabalho sobre o acidente de trabalho', 8, 'Pendente', '2025-10-15'),
(12, 5, 'Acompanhamento', 'Ligar para a família da vítima em 48h', 10, 'Pendente', '2025-10-14'),
(13, 8, 'Limpeza da VTR', 'Lavar o ABT-01 após rescaldo', 14, 'Concluído', '2025-10-14'),
(14, 12, 'Laudo da Perícia', 'Anexar laudo do carro carbonizado', 3, 'Pendente', '2025-10-20'),
(15, 14, 'Revisão da Área', 'Realizar nova visita à área de risco em 7 dias', 9, 'Pendente', '2025-10-24');

-- 6.4 MENSAGEM (15 Registros)
TRUNCATE TABLE mensagem;
INSERT INTO mensagem (id_mensagem, id_ocorrencia, id_remetente, conteudo, enviado_em, lida) VALUES
(1, 1, 2, 'Cmt, fogo controlado. Estamos em fase de rescaldo.', '2025-10-11 10:45:00', 1),
(2, 1, 1, 'Recebido, Cap. Bárbara. Sem mais vítimas?', '2025-10-11 10:47:00', 1),
(3, 2, 3, '3 vítimas resgatadas. Duas conscientes, uma PCR. SAMU a caminho.', '2025-10-11 11:40:00', 1),
(4, 4, 11, 'Vazamento de GLP confirmado. Válvula fechada e área segura.', '2025-10-12 09:30:00', 1),
(5, 6, 2, 'Colisão grave. Solicitando apoio da PRF urgente.', '2025-10-12 17:35:00', 1),
(6, 7, 8, 'Prevenção em andamento. Público tranquilo, tudo conforme o plano.', '2025-10-13 21:00:00', 1),
(7, 8, 13, 'Fogo em vegetação extinto. Iniciando o rescaldo e limpeza.', '2025-10-14 11:30:00', 1),
(8, 10, 11, 'Gato resgatado com sucesso! Entregue à proprietária Joana.', '2025-10-15 15:45:00', 1),
(9, 13, 5, 'Vazamento de amônia isolado. Estamos ventilando a área.', '2025-10-17 07:30:00', 1),
(10, 15, 13, 'Árvore cortada e retirada. Trânsito liberado.', '2025-10-18 08:45:00', 1),
(11, 1, 7, 'Finalizando desencarceramento na porta.', '2025-10-11 10:15:00', 0),
(12, 3, 3, 'Vítima 3 imobilizada, a caminho do hospital.', '2025-10-11 14:15:00', 0),
(13, 5, 10, 'Mal súbito. Paciente foi levado para a UPA de Moreno.', '2025-10-12 15:10:00', 0),
(14, 12, 12, 'Fogo no motor extinto. Aguardando guincho.', '2025-10-16 12:15:00', 0),
(15, 14, 9, 'Barreira não oferece risco de desabamento no momento. Acompanhamento da Defesa Civil.', '2025-10-17 16:00:00', 0);


-- 6.5 AUDITORIA_LOG (15 Registros de Exemplo)
TRUNCATE TABLE auditoria_log;
INSERT INTO auditoria_log (id_log, data_hora, id_usuario, usuario_nome, acao_tipo, modulo, recurso_tabela, recurso_id, descricao) VALUES
(1, '2025-10-11 09:30:00', 1, 'Albuquerque', 'LOGIN', 'Sistema', 'USUARIO', '1', 'Login de Administrador'),
(2, '2025-10-11 10:00:15', 4, 'Lima', 'CREATE', 'Dispatch', 'OCORRENCIA', '1', 'Criação da Ocorrência #001'),
(3, '2025-10-11 10:05:30', 2, 'Bárbara', 'UPDATE', 'Logística', 'DESLOCAMENTO', '1', 'Saída de Viatura ABT-01'),
(4, '2025-10-11 11:30:45', 6, 'Gomes', 'CREATE', 'Dispatch', 'OCORRENCIA', '2', 'Criação da Ocorrência #002'),
(5, '2025-10-12 10:01:00', 11, 'Kleber', 'UPDATE', 'Recursos', 'VIATURA', '8', 'Atualização de Hodômetro VTR ABT-02'),
(6, '2025-10-13 19:30:00', 2, 'Bárbara', 'UPDATE', 'Status', 'OCORRENCIA', '7', 'Status alterado para Concluída'),
(7, '2025-10-14 11:35:00', 8, 'Helena', 'CREATE', 'Formulário', 'OCORRENCIA_INCENDIO', '2', 'Registro de Incêndio em Vegetação'),
(8, '2025-10-15 08:35:00', 5, 'Emília', 'CREATE', 'Formulário', 'OCORRENCIA_ATITUDE_COM', '1', 'Registro de Atividade Comunitária'),
(9, '2025-10-16 09:40:00', 13, 'Marcelo', 'UPDATE', 'APH', 'APH_ATENDIMENTO', '5', 'Atualização de Destino de Transferência'),
(10, '2025-10-17 08:15:00', 5, 'Emília', 'CREATE', 'Formulário', 'OCORR_PRODUTO_PERIGOSO', '2', 'Registro de Vazamento de Amônia'),
(11, '2025-10-17 15:55:00', 9, 'Igor', 'CREATE', 'Auxiliar', 'OCORRENCIA_AGENCIA', '12', 'Acionamento da Defesa Civil'),
(12, '2025-10-18 09:00:00', 10, 'Juliana', 'CREATE', 'Formulário', 'OCORRENCIA_SALVAMENTO', '4', 'Registro de Corte de Árvore'),
(13, '2025-10-18 09:05:00', 10, 'Juliana', 'UPDATE', 'Status', 'OCORRENCIA', '15', 'Status alterado para Concluída'),
(14, '2025-10-18 09:08:00', 1, 'Albuquerque', 'LOGOUT', 'Sistema', 'USUARIO', '1', 'Logout de Administrador'),
(15, '2025-10-18 09:10:00', 2, 'Bárbara', 'UPDATE', 'Logística', 'GUARNICAO', '1', 'Ajuste de Função em Guarnição');

-- 6.6 ACESSO_LOG (15 Registros)
TRUNCATE TABLE acesso_log;
INSERT INTO acesso_log (id_acesso, id_usuario, ip, data_hora, sucesso) VALUES
(1, 1, '192.168.1.10', '2025-10-11 09:30:00', 1),
(2, 4, '10.0.0.5', '2025-10-11 09:55:00', 1),
(3, 2, '172.16.0.12', '2025-10-11 10:03:00', 1),
(4, 6, '10.0.0.5', '2025-10-11 11:28:00', 1),
(5, 7, '192.168.1.15', '2025-10-11 13:40:00', 1),
(6, 9, '172.16.0.20', '2025-10-12 08:50:00', 1),
(7, 10, '192.168.1.18', '2025-10-12 13:55:00', 1),
(8, 12, '10.0.0.8', '2025-10-12 17:25:00', 1),
(9, 2, '172.16.0.12', '2025-10-13 18:40:00', 1),
(10, 13, '192.168.1.20', '2025-10-14 10:40:00', 1),
(11, 5, '10.0.0.10', '2025-10-15 08:25:00', 1),
(12, 8, '172.16.0.25', '2025-10-16 09:00:00', 1),
(13, 11, '192.168.1.25', '2025-10-17 06:55:00', 1),
(14, 1, '192.168.1.10', '2025-10-18 09:08:00', 0), -- Tentativa de login falha
(15, 10, '192.168.1.18', '2025-10-18 09:09:00', 1);


-- 6.7 FORMULARIO (15 Registros - Registros Genéricos para diferentes tipos de formulário)
TRUNCATE TABLE formulario;
INSERT INTO formulario (id_formulario, id_ocorrencia, tipo_formulario, dados, id_preenchido_por) VALUES
(1, 1, 'Incêndio I-2', '{"detalhe_consumo": "4 linhas d''água usadas", "viaturas_apoio": ["AR-08"]}', 2),
(2, 2, 'APH Padrão', '{"glasgow": 3, "sinais_de_trauma": "não", "procedimento_especial": "desfibrilação"}', 3),
(3, 3, 'APH Padrão', '{"glasgow": 15, "sinais_de_trauma": "sim", "procedimento_especial": "imobilização de coluna"}', 8),
(4, 4, 'Produto Perigoso', '{"tipo_vazamento": "vazamento pequeno", "risco_secundario": "explosão"}', 11),
(5, 5, 'APH Padrão', '{"glasgow": 8, "sinais_de_trauma": "não", "procedimento_especial": "acesso venoso"}', 13),
(6, 6, 'Vítimas de Trânsito', '{"cinemática": "colisão frontal", "velocidade_estimada": "60 km/h"}', 2),
(7, 7, 'Prevenção de Evento', '{"vistoria_previa": "ok", "pontos_criticos": "saídas de emergência"}', 8),
(8, 8, 'Incêndio em Vegetação', '{"tipo_vegetacao": "capim seco", "velocidade_propagacao": "rápida"}', 13),
(9, 9, 'Atitude Comunitária', '{"recepcao": "excelente", "feedback": "positivo da direção"}', 5),
(10, 10, 'Resgate Animal', '{"animal_tipo": "gato", "altura_resgate": "15 metros"}', 11),
(11, 11, 'Transporte Inter-Hospitalar', '{"equipamento_acompanhando": "monitor multiparamétrico", "condição_estável": "sim"}', 2),
(12, 12, 'Incêndio em Veículo', '{"tipo_combustivel": "gasolina", "causa_confirmada": "curto-circuito"}', 3),
(13, 13, 'Produto Perigoso', '{"tipo_recipiente": "tanque de armazenamento", "risco_ambiental": "alto"}', 8),
(14, 14, 'Salvamento em Desabamento', '{"material_envolvido": "terra e concreto", "necessidade_escoramento": "sim"}', 11),
(15, 15, 'Corte de Árvore', '{"risco_imediato": "queda sobre residência", "técnica_utilizada": "corte seccionado"}', 13);

-- 6.8 ARQUIVO (15 Registros)
TRUNCATE TABLE arquivo;
INSERT INTO arquivo (id_arquivo, id_ocorrencia, id_formulario, nome_original, caminho, tipo_mime, tamanho_bytes, enviado_por) VALUES
(1, 1, 1, 'foto_incendio_cozinha.jpg', '/media/1/incendio_cozinha.jpg', 'image/jpeg', 500000, 2),
(2, 2, 2, 'ficha_aph_002.pdf', '/media/2/ficha_aph_002.pdf', 'application/pdf', 250000, 3),
(3, 4, 4, 'checklist_gás.pdf', '/media/4/checklist_gas.pdf', 'application/pdf', 150000, 11),
(4, 6, 6, 'foto_colisão_vtr05.jpg', '/media/6/colisao_vtr05.jpg', 'image/jpeg', 800000, 2),
(5, 7, 7, 'planta_teatro.pdf', '/media/7/planta_teatro.pdf', 'application/pdf', 500000, 8),
(6, 9, 9, 'foto_palestra_escola.jpg', '/media/9/palestra_escola.jpg', 'image/jpeg', 650000, 5),
(7, 13, 13, 'relatorio_amonia.pdf', '/media/13/relatorio_amonia.pdf', 'application/pdf', 400000, 8),
(8, 15, 15, 'foto_arvore_corte.jpg', '/media/15/corte_arvore.jpg', 'image/jpeg', 750000, 13),
(9, 1, 1, 'relatorio_comando_1.pdf', '/media/1/relatorio_cmdo_1.pdf', 'application/pdf', 300000, 2),
(10, 2, 2, 'registro_desfibrilador.txt', '/media/2/reg_dea_002.txt', 'text/plain', 10000, 3),
(11, 3, 3, 'foto_local_queda.jpg', '/media/3/local_queda.jpg', 'image/jpeg', 450000, 8),
(12, 11, 11, 'ficha_transferencia.pdf', '/media/11/ficha_transf.pdf', 'application/pdf', 200000, 2),
(13, 14, 14, 'foto_barreira.jpg', '/media/14/barreira.jpg', 'image/jpeg', 600000, 9),
(14, 10, 10, 'video_resgate_gato.mp4', '/media/10/video_gato.mp4', 'video/mp4', 1500000, 11),
(15, 12, 12, 'relatorio_pericia_carro.pdf', '/media/12/pericia_carro.pdf', 'application/pdf', 350000, 3);


CREATE TABLE gps_viatura (
    id_rastro INT AUTO_INCREMENT PRIMARY KEY,
    id_vtr INT NOT NULL,
    latitude DECIMAL(10,6) NOT NULL,
    longitude DECIMAL(10,6) NOT NULL,
    velocidade DECIMAL(5,2),
    direcao VARCHAR(50),
    registrado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_vtr) REFERENCES viatura(id_vtr) ON DELETE CASCADE
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Rastreamento em tempo real das viaturas';


CREATE TABLE gps_ocorrencia (
    id_localizacao INT AUTO_INCREMENT PRIMARY KEY,
    id_ocorrencia INT NOT NULL,
    latitude DECIMAL(10,6) NOT NULL,
    longitude DECIMAL(10,6) NOT NULL,
    precisao_metros DECIMAL(6,2),
    coletado_por INT,
    coletado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_ocorrencia) REFERENCES ocorrencia(id_ocorrencia) ON DELETE CASCADE,
    FOREIGN KEY (coletado_por) REFERENCES usuario(id_usuario) ON DELETE SET NULL
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Coordenadas GPS exatas do local da ocorrência';

CREATE TABLE midia_ocorrencia (
    id_midia INT AUTO_INCREMENT PRIMARY KEY,
    id_ocorrencia INT NOT NULL,
    tipo ENUM('foto', 'video') NOT NULL,
    caminho_arquivo VARCHAR(1024) NOT NULL COMMENT 'URL ou caminho do arquivo',
    latitude DECIMAL(10,6) NULL,
    longitude DECIMAL(10,6) NULL,
    capturado_por INT,
    capturado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    descricao TEXT,
    FOREIGN KEY (id_ocorrencia) REFERENCES ocorrencia(id_ocorrencia) ON DELETE CASCADE,
    FOREIGN KEY (capturado_por) REFERENCES usuario(id_usuario) ON DELETE SET NULL
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Fotos e vídeos associados às ocorrências';

CREATE TABLE assinatura_digital (
    id_assinatura INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_ocorrencia INT NULL,
    id_formulario INT NULL,
    hash_documento VARCHAR(512) NOT NULL COMMENT 'Hash SHA256 do conteúdo assinado',
    assinatura_base64 TEXT COMMENT 'Assinatura digital codificada',
    certificado_digital VARCHAR(255),
    ip_assinatura VARCHAR(50),
    data_assinatura DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_ocorrencia) REFERENCES ocorrencia(id_ocorrencia) ON DELETE SET NULL,
    FOREIGN KEY (id_formulario) REFERENCES formulario(id_formulario) ON DELETE SET NULL
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Assinaturas digitais vinculadas a usuários e ocorrências';



SET foreign_key_checks = 1;
