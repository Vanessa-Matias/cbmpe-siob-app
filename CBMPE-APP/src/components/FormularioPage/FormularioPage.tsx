/**
 * @file FormularioPage.tsx
 * @description Página principal do fluxo de criação/edição de ocorrência.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FormularioBasico from './FormularioBasico';
import FormularioIncendio from './FormularioIncendio';
import FormularioSalvamento from './FormularioSalvamento';
import './FormularioPage.css';
import brasaoLogo from '../../assets/brasao.cbm.pe.png';

// Interface do objeto que o Dashboard espera
interface OcorrenciaDashboard {
    tipo: string;
    status: string;
    regiao: string;
    data: string;
    id?: string;
    numAviso?: string;
    prioridade?: string;
}

// Gera UUID simples (suficiente para localStorage)
const generateUUID = () =>
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });

// Estado inicial do formulário (limpo)
const getInitialFormData = () => ({
    id: generateUUID(),
    numAviso: '',
    pontoBase: '',
    viaturaTipo: '',
    viaturaOrdem: '',
    dataAviso: new Date().toISOString().split('T')[0],
    situacao: 'pendente',
    prioridade: 'Média',
    endereco: { rua: '', numero: '', bairro: '', municipio: 'Recife', latitude: '', longitude: '' },
    fotoOcorrencia: '',
    assinaturaDigital: '',
    formulariosPreenchidos: {
        atdPreHospitalar: false,
        incendio: false,
        salvamento: false,
        formularioGerenciamento: false,
        atividadeComunitaria: false,
        produtoPerigoso: false,
        prevencao: false,
        outroRelatorio: false,
    },
    incendio: { grupo: 'edificacao', operacao: { consumoAgua: 0 }, acoes: {}, recursos: {} },
    salvamento: { tipo: {}, acoes: {}, vitimas: {} },
    guarnicaoEmpenhada: { componentes: Array(6).fill(''), postoGrad: '', matriculaCmt: '', nomeGuerraCmt: '', vistoDivisao: '' },
    veiculo1: {},
    veiculo2: {},
    historico: '',
});

const FormularioPage: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();

    const [step, setStep] = useState<number>(1); // 1 = Básico | 2 = Natureza (Incêndio/Salvamento)
    const [formData, setFormData] = useState<any>(getInitialFormData());
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [activeNature, setActiveNature] = useState<'incendio' | 'salvamento' | ''>('');

    // Ao montar, se houver id, carregamos do localStorage (modo EDIÇÃO)
    useEffect(() => {
        if (id) {
            setIsEditMode(true);
            const raw = localStorage.getItem('ocorrencias');
            const list = raw ? JSON.parse(raw) : [];
            const found = list.find((o: any) => o.id === id);
            if (found) {
                setFormData(found);
                // Se já tem natureza marcada, predefine activeNature e step
                const markedNature = findMarkedNature(found.formulariosPreenchidos || {});
                if (markedNature) {
                    setActiveNature(markedNature);
                    setStep(2);
                }
            } else {
                alert('Ocorrência não encontrada (localStorage). Abrindo formulário em branco.');
                setFormData(getInitialFormData());
            }
        } else {
            setIsEditMode(false);
            setFormData(getInitialFormData());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // Helper: detecta natureza marcada (prioridade: incendio > salvamento)
    const findMarkedNature = (formularios: any) => {
        if (!formularios) return '';
        if (formularios.incendio) return 'incendio';
        if (formularios.salvamento) return 'salvamento';
        // Adicione outras naturezas aqui com prioridade mais baixa, se necessário
        return '';
    };

    // Handler genérico para inputs (suporta "obj.prop" nome)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | any) => {
        const { name, value, type } = e.target;
        const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        const keys = (name || '').split('.').filter(Boolean);

        setFormData((prev: any) => {
            const next = { ...prev };
            if (!name) return next;
            if (keys.length === 1) {
                next[keys[0]] = finalValue;
            } else {
                // cria aninhamento seguro
                let cur = next;
                for (let i = 0; i < keys.length - 1; i++) {
                    const k = keys[i];
                    cur[k] = cur[k] ?? {};
                    cur = cur[k];
                }
                cur[keys[keys.length - 1]] = finalValue;
            }

            // CRÍTICO: Se a natureza foi marcada/desmarcada, atualiza o activeNature
            if (keys[0] === 'formulariosPreenchidos') {
                const updatedNaturezas = { ...next.formulariosPreenchidos, [keys[1]]: finalValue };
                setActiveNature(findMarkedNature(updatedNaturezas));
            }
            
            return next;
        });
    };

    // Validação simples antes de salvar
    const validarFormularioBasico = (dados: any) => {
        if (!isEditMode) {
            if (!dados.endereco?.rua && !dados.endereco?.referencia && !dados.endereco?.bairro) {
                return { valido: false, mensagem: 'Preencha pelo menos Bairro, Rua ou Referência.' };
            }
        }
        // Validação de edição omitida para simplificação, assumindo que a validade está ok.
        return { valido: true, mensagem: '' };
    };

    // Salva no localStorage e atualiza dashboard
    const persistirOcorrencia = (dadosParaSalvar: any, shouldRedirect = false) => {
        try {
            //  Atualiza status automaticamente se a ocorrência estava pendente e foi editada
            if (isEditMode && dadosParaSalvar.situacao === 'pendente') {
                dadosParaSalvar.situacao = 'em-andamento';
            }

            //  Atualiza cor/status visual para o Dashboard
            const statusDashboard =
                dadosParaSalvar.situacao === 'em-andamento'
                    ? 'Em andamento'
                    : dadosParaSalvar.situacao === 'finalizada'
                    ? 'Concluída'
                    : dadosParaSalvar.situacao === 'cancelada'
                    ? 'Cancelada'
                    : dadosParaSalvar.situacao === 'trote'
                    ? 'Trote'
                    : 'Pendente';

            const ocorrenciaAtualizada = {
                ...dadosParaSalvar,
                status: statusDashboard,
            };

            //  Persiste no localStorage
            const raw = localStorage.getItem('ocorrencias');
            const lista = raw ? JSON.parse(raw) : [];
            const filtered = lista.filter((o: any) => o.id !== ocorrenciaAtualizada.id);
            filtered.push(ocorrenciaAtualizada);
            localStorage.setItem('ocorrencias', JSON.stringify(filtered));

            //  Emite evento para atualizar Dashboard
            window.dispatchEvent(new Event('ocorrencias:updated'));

            //  Feedback adequado
            if (shouldRedirect) {
                alert(`Ocorrência ${dadosParaSalvar.numAviso || ''} salva e finalizada. Redirecionando...`);
                navigate('/ocorrencias');
            }
            // Removeu alerta “Rascunho salvo com sucesso”
        } catch (err) {
            console.error('Erro salvando ocorrência:', err);
            alert('Erro ao salvar localmente. Veja console.');
        }
    };


    // Extract display type for dashboard
    const getDisplayType = (key: string | undefined, fallback: string) => {
        if (!key) return fallback;
        // CORREÇÃO: Tipo limpo para a lista/dashboard
        if (key === 'incendio') return 'Incêndio';
        if (key === 'salvamento') return 'Salvamento';
        if (key === 'atdPreHospitalar') return 'Atd. Pré-Hospitalar';
        return fallback;
    };

    // Handler principal de submit (recebido do FormularioBasico / Incendio / Salvamento)
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let dadosParaSalvar = { ...formData };
        
        // --- CORREÇÃO CRÍTICA DE STATUS (Captura do DOM) ---
        // Garante que o status e a prioridade mais recentes sejam lidos diretamente do select.
        const formEl = e.target as HTMLFormElement;
        const situacaoSelect = formEl?.querySelector('#situacao') as HTMLSelectElement | null;
        const prioridadeSelect = formEl?.querySelector('#prioridade') as HTMLSelectElement | null;

        if (situacaoSelect) {
             // Sobrescreve o valor do estado 'formData' com o valor real do <select>
             dadosParaSalvar.situacao = situacaoSelect.value;
        }
        if (prioridadeSelect) {
             dadosParaSalvar.prioridade = prioridadeSelect.value;
        }
        // --- FIM DA CAPTURA CRÍTICA ---

        // se não tiver numAviso em criação, gera
        if (!isEditMode && !dadosParaSalvar.numAviso) {
            const currentYear = new Date().getFullYear();
            const uniqueIdPart = (dadosParaSalvar.id || generateUUID()).slice(-4).toUpperCase();
            dadosParaSalvar.numAviso = `OC-${currentYear}-${uniqueIdPart}`;
            dadosParaSalvar.situacao = dadosParaSalvar.situacao || 'pendente';
        }

        // valida
        const valida = validarFormularioBasico(dadosParaSalvar);
        if (!valida.valido) {
            alert(valida.mensagem);
            return;
        }
        
        // Decide o que acontece depois de salvar: se um formulário de natureza foi marcado, avançamos para ele
        const markedNature = findMarkedNature(dadosParaSalvar.formulariosPreenchidos || {});

        // Prepara objeto para dashboard (mapeia status)
        const statusDashboard =
            dadosParaSalvar.situacao === 'em-andamento'
                ? 'Em andamento'
                : dadosParaSalvar.situacao === 'finalizada'
                ? 'Concluída'
                : dadosParaSalvar.situacao === 'cancelada'
                ? 'Cancelada'
                : dadosParaSalvar.situacao === 'trote'
                ? 'Trote'
                : 'Pendente';

        const ocorrenciaDashboard: OcorrenciaDashboard = {
            id: dadosParaSalvar.id || generateUUID(),
            tipo: markedNature ? getDisplayType(markedNature, 'Ocorrência Básica') : 'Ocorrência Básica',
            status: statusDashboard,
            regiao: dadosParaSalvar.endereco?.bairro || dadosParaSalvar.endereco?.municipio || 'Recife',
            data: new Date().toISOString(),
            numAviso: dadosParaSalvar.numAviso,
            prioridade: dadosParaSalvar.prioridade || 'Média',
            ...dadosParaSalvar,
        };

        // Persistência
        // Persiste o rascunho com o alert genérico "Rascunho salvo com sucesso."
        persistirOcorrencia(ocorrenciaDashboard, false);

        // Se marcou natureza -> avançar para a etapa correspondente
        if (markedNature === 'incendio') {
            setActiveNature('incendio');
            setStep(2);
            // MENSAGEM FORMAL DE SUCESSO E AVISO PARA PRÓXIMA ETAPA
            alert('Ocorrência Básica salva! Preencha a Etapa 2 (Detalhes da Natureza) para finalizar.');
            // Mantém os dados atualizados no estado
            setFormData(ocorrenciaDashboard);
            return;
        }

        if (markedNature === 'salvamento') {
            setActiveNature('salvamento');
            setStep(2);
            // MENSAGEM FORMAL DE SUCESSO E AVISO PARA PRÓXIMA ETAPA
            alert('Ocorrência Básica salva! Preencha a Etapa 2 (Detalhes da Natureza) para finalizar.');
            setFormData(ocorrenciaDashboard);
            return;
        }

        // Caso não tenha natureza marcada e o usuário estava no passo 1, apenas salva rascunho e permanece
        // Se o usuário já avançou e finalizou, essa parte deve redirecionar (Passo 2)
        if (step === 2) {
             persistirOcorrencia(ocorrenciaDashboard, true); // Finaliza e redireciona
             return;
        }
        
        // Salva rascunho e permanece no passo 1 (o alert já foi dado no persistirOcorrencia(..., false))
        setFormData(ocorrenciaDashboard);
    };

    // Handler quando usuário finaliza o formulário da natureza (etapa 2)
    const handleFinalizeNature = (e: React.FormEvent) => {
        e.preventDefault();

        // No Passo 2, o Status deve ser lido do estado (já que os selects de status estão no Passo 1)
        // A lógica de Status/ já foi resolvida no handleSubmit anterior.
        
        const dadosToSave = { ...formData };
        
        // Prepara objeto para dashboard (mapeia status)
        const statusDashboard =
            dadosToSave.situacao === 'em-andamento'
                ? 'Em andamento'
                : dadosToSave.situacao === 'finalizada'
                ? 'Concluída'
                : dadosToSave.situacao === 'cancelada'
                ? 'Cancelada'
                : dadosToSave.situacao === 'trote'
                ? 'Trote'
                : 'Pendente';

        const markedNature = findMarkedNature(dadosToSave.formulariosPreenchidos || {});

        const ocorrenciaDashboard: OcorrenciaDashboard = {
            id: dadosToSave.id || generateUUID(),
            tipo: markedNature ? getDisplayType(markedNature, 'Ocorrência Básica') : 'Ocorrência Básica',
            status: statusDashboard,
            regiao: dadosToSave.endereco?.bairro || dadosToSave.endereco?.municipio || 'Recife',
            data: new Date().toISOString(),
            numAviso: dadosToSave.numAviso,
            prioridade: dadosToSave.prioridade || 'Média',
            ...dadosToSave,
        };

        // Persistir e redirecionar para listagem (shouldRedirect = true -> mensagem de finalização)
        persistirOcorrencia(ocorrenciaDashboard, true);
        
        // Resetamos o estado após o redirecionamento
        setFormData(getInitialFormData()); 
    };


    // Cancel handlers
    const handleCancel = () => {
        if (window.confirm('Deseja cancelar e voltar à listagem de ocorrências?')) {
            navigate('/ocorrencias');
        }
    };

    const handleCancelIncendio = () => {
        // volta para passo 1
        setStep(1);
        setActiveNature('');
    };

    // UI: calcula se deve mostrar FormularioIncendio ou Salvamento na etapa 2
    const renderNatureForm = () => {
        if (activeNature === 'incendio') {
            return (
                <FormularioIncendio
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleFinalizeNature}
                    handleCancel={handleCancelIncendio}
                    submitText={isEditMode ? 'Atualizar e Finalizar' : 'Finalizar Ocorrência'}
                />
            );
        }

        if (activeNature === 'salvamento') {
            return (
                <FormularioSalvamento
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleFinalizeNature}
                    handleCancel={handleCancelIncendio}
                    submitText={isEditMode ? 'Atualizar e Finalizar' : 'Finalizar Ocorrência'}
                />
            );
        }

        // fallback: se não houver natureza definida, mostra aviso e mantém passo 1
        return (
            <div className="sub-section">
                <p>Nenhuma natureza marcada para detalhe. Marque "Incêndio" ou "Salvamento" em "Formulários Preenchidos" e salve para avançar.</p>
                <div style={{ marginTop: 12 }}>
                    <button className="button-cancel" onClick={() => setStep(1)}>
                        Voltar
                    </button>
                </div>
            </div>
        );
    };

    const deveAvancar = Object.values(formData.formulariosPreenchidos || {}).some((v: any) => v === true);
    const totalEtapas = deveAvancar ? 2 : 1;

    return (
        <div className="page-container">
            <div className="unified-card">
                <header className="page-header">
                    <div className="page-title">
                        <h2>{isEditMode ? `Editando Ocorrência #${formData.numAviso || 'Rascunho'}` : 'Nova Ocorrência'}</h2>
                        <p>{step === 1 ? `Etapa 1 de ${totalEtapas}: Formulário Básico` : `Etapa 2 de ${totalEtapas}: Detalhes da Natureza`}</p>
                    </div>
                    <img src={brasaoLogo} alt="Brasão CBMPE" className="header-logo" />
                </header>

                {step === 1 ? (
                    <FormularioBasico
                        formData={formData}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        handleCancel={handleCancel}
                        submitText={deveAvancar ? 'Avançar' : 'Salvar Rascunho'}
                    />
                ) : (
                    renderNatureForm()
                )}
            </div>
        </div>
    );
};

export default FormularioPage;