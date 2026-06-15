document.addEventListener("DOMContentLoaded", () => {
    // Inicialização segura das Abas de Navegação
    const abas = ['painel', 'agroecologia', 'licoes', 'materiais', 'desafios', 'progresso'];
    abas.forEach(aba => {
        const btn = document.getElementById(`btn-tab-${aba}`);
        if(btn) btn.addEventListener('click', () => irParaAba(aba));
    });

    // Simulador de Diagnóstico
    const simuladorForm = document.getElementById('simulador-form');
    if (simuladorForm) simuladorForm.addEventListener('submit', (e) => e.preventDefault());
    
    ['solo', 'agua', 'insumos', 'biodiversidade'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', executingDiagnostico);
    });

    // Modais do Manual Técnico Interativo
    document.querySelectorAll('.agro-card-extended').forEach(card => {
        if (card.getAttribute('data-modal')) {
            card.addEventListener('click', () => { mostrarModal(card.getAttribute('data-modal')); });
        }
    });

    // Controles do Quiz de Fixação
    const btnQuizFacil = document.getElementById('btn-quiz-facil');
    if (btnQuizFacil) btnQuizFacil.addEventListener('click', () => mudarNivelQuiz('facil'));
    
    const btnQuizMedio = document.getElementById('btn-quiz-medio');
    if (btnQuizMedio) btnQuizMedio.addEventListener('click', () => mudarNivelQuiz('medio'));
    
    const btnQuizDificil = document.getElementById('btn-quiz-dificil');
    if (btnQuizDificil) btnQuizDificil.addEventListener('click', () => mudarNivelQuiz('dificil'));
    
    const btnNextQuestion = document.getElementById('btn-next-question');
    if (btnNextQuestion) btnNextQuestion.addEventListener('click', proximaQuestao);

    // Recursos Didáticos e Mídias
    const btnPdf = document.getElementById('btn-midia-pdf');
    if (btnPdf) btnPdf.addEventListener('click', () => abrirMidia('pdf'));
    
    const btnVideo = document.getElementById('btn-midia-video');
    if (btnVideo) btnVideo.addEventListener('click', () => abrirMidia('video'));
    
    const btnFecharMidia = document.getElementById('btn-fechar-midia');
    if (btnFecharMidia) btnFecharMidia.addEventListener('click', fecharMidia);

    // Jogo da Memória e Modal Geral
    const btnReiniciarJogo = document.getElementById('btn-reiniciar-jogo');
    if (btnReiniciarJogo) btnReiniciarJogo.addEventListener('click', inicializarJogo);
    
    const modalOverlay = document.getElementById('global-modal-overlay');
    if (modalOverlay) modalOverlay.addEventListener('click', fecharModalPorCliqueFora);

    // Execuções Iniciais automáticas
    executingDiagnostico();
    setTimeout(() => { if(document.getElementById('quiz-question-title')) renderizarQuestaoQuiz(); }, 500);
});

function irParaAba(nomeAba) {
    document.querySelectorAll('.view-pane').forEach(content => content.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(button => button.classList.remove('active'));

    const viewPane = document.getElementById(`view-${nomeAba}`);
    const navBtn = document.getElementById(`btn-tab-${nomeAba}`);

    if (viewPane) viewPane.classList.add('active');
    if (navBtn) navBtn.classList.add('active');

    const bibliotecaTitulos = {
        painel: ["Monitoramento de Impacto Agroecológico", "Tecnologia aplicada ao desenvolvimento sustentável da Escola do Campo rural."],
        agroecologia: ["Espaço de Capacitação Científica", "Visão detalhada e aprofundada das seis grandes diretrizes conservacionistas."],
        licoes: ["Quiz e Avaliação Continuada", "Fixação teórica através de blocos de múltipla escolha integrados."],
        materiais: ["Central de Recursos Didáticos", "Visualização integrada de acervos científicos públicos sem links externos."],
        desafios: ["Jogo da Memória Computacional", "Lógica de computação e pareamento para memorização biológica activa."],
        progresso: ["Painel de Métricas e Resultados", "Análise de evolução conceitual obtida nos simuladores computadorizados."]
    };

    if (bibliotecaTitulos[nomeAba]) {
        document.getElementById('page-title').innerText = bibliotecaTitulos[nomeAba][0];
        document.getElementById('page-subtitle').innerText = bibliotecaTitulos[nomeAba][1];
    }

    if (nomeAba === 'desafios') inicializarJogo();
}

function executingDiagnostico() {
    const soloEl = document.getElementById('solo');
    const aguaEl = document.getElementById('agua');
    const insumosEl = document.getElementById('insumos');
    const biodiversidadeEl = document.getElementById('biodiversidade');

    if (!soloEl || !aguaEl || !insumosEl || !biodiversidadeEl) return;

    const solo = soloEl.value;
    const agua = aguaEl.value;
    const insumos = insumosEl.value;
    const biodiversidade = biodiversidadeEl.value;

    let nota = 0;
    if (solo === 'excelente') nota += 25; else if (solo === 'alto') nota += 18; else if (solo === 'medio') nota += 10; else nota += 3;
    if (agua === 'excelente') nota += 25; else if (agua === 'alto') nota += 18; else if (agua === 'medio') nota += 10; else nota += 3;
    if (insumos === 'excelente') nota += 25; else if (insumos === 'alto') nota += 18; else if (insumos === 'medio') nota += 10; else nota += 3;
    if (biodiversidade === 'excelente') nota += 25; else if (biodiversidade === 'alto') nota += 18; else if (biodiversidade === 'medio') nota += 10; else nota += 3;

    document.getElementById('pontos-valor').innerText = nota;
    
    const metricSim = document.getElementById('metric-simulador');
    if (metricSim) metricSim.innerText = nota + "%";

    document.getElementById('pct-cultivo').innerText = Math.round(nota * 0.9) + "%";
    document.getElementById('bar-cultivo').style.width = Math.round(nota * 0.9) + "%";
    document.getElementById('pct-ambiental').innerText = Math.round(nota * 1.0) + "%";
    document.getElementById('bar-ambiental').style.width = Math.round(nota * 1.0) + "%";
    document.getElementById('pct-gestao').innerText = Math.round(nota * 0.85) + "%";
    document.getElementById('bar-gestao').style.width = Math.round(nota * 0.85) + "%";

    const badge = document.getElementById('status-badge');
    const detalheBox = document.getElementById('resultado-diagnostico-detalhe');
    detalheBox.classList.remove('hidden');

    if (nota >= 80) {
        badge.className = "pill-status state-active";
        badge.innerText = "EXCELENTE";
        detalheBox.className = "alert-box bom";
        detalheBox.innerHTML = `<strong>✨ Índice Impecável: ${nota}%</strong><br>Propriedade modelo! Os manejos adotados conservam a macroestrutura rústica do solo.`;
    } else if (nota >= 50) {
        badge.className = "pill-status state-wait";
        badge.innerText = "REGULAR";
        detalheBox.className = "alert-box alerta";
        detalheBox.innerHTML = `<strong>🌿 Índice Intermediário: ${nota}%</strong><br>Atenção às recomendações técnicas. É viável expandir o plantio direto.`;
    } else {
        badge.className = "pill-status state-wait";
        badge.innerText = "ALERTA CRÍTICO";
        detalheBox.className = "alert-box perigo";
        detalheBox.innerHTML = `<strong>⚠️ Risco Severo Detectado: ${nota}%</strong><br>Alto índice de degradação estrutural e lixiviação.`;
    }
}

const dadosEmbrapaPopups = {
    rotacao: { 
        titulo: "🔄 Rotação e Diversificação Complexa de Culturas", 
        intro: "A rotação de culturas consiste em alternar de forma planejada, sistemática e ordenada diferentes espécies vegetais em uma mesma área agrícola ao longo do tempo. Esta técnica rompe radicalmente a continuidade de hospedeiros, agindo como um controle preventivo essencial contra a proliferação de pragas, fungos fitopatogênicos e nematoides específicos do solo. Além disso, o consórcio de plantas com arquiteturas de raízes variadas (superficiais combinadas com pivotantes profundas) promove a descompactação mecânica natural do solo, melhora a porosidade e potencializa a infiltração de água e a ciclagem profunda de nutrientes preciosos.", 
        beneficios: ["Interrompe eficientemente o ciclo biológico de pragas rurais e patógenos.", "Promove a descompactação biológica natural através de múltiplos sistemas radiculares.", "Maximiza a atividade biológica e a diversidade da microbiota benéfica do solo."], 
        exemplo: "Planejamento estruturado: 1º Ano: Milho (Gramínea) → 2º Ano: Soja (Leguminosa) → 3º Ano: Nabo Forrageiro / Aveia Preta (Cobertura profunda)." 
    },
    adubacao: { 
        titulo: "🌱 Adubação Verde e Cobertura Viva de Solo", 
        intro: "Esta prática milenar baseia-se no cultivo planejado de plantas de rápido crescimento (principalmente leguminosas, crucíferas e gramíneas) com o objetivo exclusivo de enriquecer, proteger e reestruturar o solo. As espécies selecionadas possuem uma capacidade simbiótica incrível com bactérias fixadoras, capturando o nitrogênio gasoso livre na atmosfera e injetando-o diretamente na terra. Ao formar uma camada vegetal densa sobre a superfície, a adubação verde blinda a estrutura do solo contra a erosão hídrica severa, amortece oscilações extremas de temperatura e suprime o desenvolvimento de plantas daninhas por competição por luz.", 
        beneficios: ["Fixação biológica de Nitrogênio atmosférico de forma gratuita.", "Aporte maciço de matéria orgânica estável de altíssima qualidade.", "Eliminação do impacto erosivo das chuvas torrenciais na superfície."], 
        exemplo: "Cultivo intercalado ou em safrinha de Crotalária ou Mucuna Preta, seguido de roçagem para a formação de uma camada uniforme de palhada protetora." 
    },
    mip: { 
        titulo: "🐞 Manejo Integrado de Pragas (MIP-Agroecologia)", 
        intro: "O MIP é uma filosofia moderna e ecológica de tomada de decisões que gerencia as populações de pragas de modo a evitar que causem prejuízos econômicos, sem agredir o ecossistema. Em vez de pulverizações calendarizadas de veneno químico, o produtor realiza amostragens de campo semanais. A intervenção só ocorre se a população atingir o rigoroso Nível de Dano Econômico. O sistema prioriza defensivos de matriz biológica (como vírus, bactérias e fungos controladores) e incentiva a manutenção ativa de insetos predadores benéficos, restaurando a autorregulação natural da lavoura.", 
        beneficios: ["Redução drástica no custo de insumos e dependência química industrial.", "Preservação integral de polinizadores e predadores naturais (joaninhas, tesourinhas).", "Mitigação completa de riscos de contaminação e toxicidade alimentar."], 
        exemplo: "Monitoramento ativo da Lagarta-do-cartucho com aplicação direcionada de extrato de Neem ou do bioinseticidas biológicos à base de Bacillus thuringiensis (Bt)." 
    },
    safs: { 
        titulo: "🌳 Sistemas Agroflorestais Planejados (SAFs)", 
        intro: "Os SAFs representam a vanguarda da sustentabilidade ao combinar intencionalmente árvores perenes (madeireiras, frutíferas ou nativas) com cultivos agrícolas anuais e/ou criação de animais em um arranjo espacial e temporal harmônico. Esse design inteligente imita com perfeição a complexidade estrutural, a sucessão biológica e a estabilidade de uma floresta nativa. As raízes profundas das árvores realizam um bombeamento hidráulico e reciclagem de nutrientes de camadas profundas para a superfície. Além do ganho ambiental por sequestro de carbono e abrigo da fauna, garante resiliência econômica ao diversificar a produção anual da propriedade.", 
        beneficios: ["Reciclagem altamente eficiente de nutrientes profundos e proteção hídrica.", "Conforto térmico animal severo e diversificação de fontes de renda na mesma área.", "Sequestro ativo de Carbono atmosférico mitigando gases estufa."], 
        exemplo: "Consorciação agroflorestal: Fileiras de Eucalipto ou Erva-Mate intercaladas com cultivo de Milho, Feijão e pastagens sombreadas para pecuária leiteira." 
    },
    nascentes: { 
        titulo: "💧 Recuperação, Cercamento e Proteção de Nascentes", 
        intro: "A salvaguarda de fontes d'água em Áreas de Preservação Permanente (APP) exige ações coordenadas estruturais e ecológicas. O passo primordial é o isolamento físico absoluto em um raio mínimo de 50 metros ao redor do olho d'água para barrar o pisoteio de bovinos, que causa compactação drástica e destruição marginal. Uma vez isolada a área, procede-se ao reflorestamento denso com mudas nativas da região. As copas reduzem a evaporação direta, enquanto as raízes funcionam como verdadeiras esponjas filtrantes, retendo defensivos agrícolas ou sedimentos das enxurradas e garantindo água limpa e contínua.", 
        beneficios: ["Garantia de segurança hídrica contínua e vazão estável ao longo do ano.", "Filtragem biológica de resíduos e sedimentos suspensos.", "Retorno imediato da fauna endêmica e equilíbrio hidrológico."], 
        exemplo: "Instalação de cercamento com arame liso rígido e plantio de espécies higrófitas nativas (como Ingá, Salgueiro e Taboa) ao redor de fontes degradadas." 
    },
    curvas: { 
        titulo: "🚜 Engenharia de Curvas de Nível e Terraceamento", 
        intro: "Técnicas mecânicas fundamentais de conservação de solo recomendadas para relevos ondulados e encostas. O plantio em curvas de nível consiste em realizar todas as operações de preparo e semeadura seguindo linhas imaginárias perpendiculares ao declive (em nível altimétrico constante). O terraceamento adiciona barreiras físicas de terra (terraços) espaçados. Esse sistema cria obstáculos físicos severos que reduzem drasticamente a velocidade de escoamento das águas das enxurradas, transformando energia cinética destruidora em infiltração lenta e controlada, eliminando o surgimento de voçorocas.", 
        beneficios: ["Retenção quase total da camada de solo fértil superficial.", "Favorecimento massivo da recarga do lençol freático local por infiltração.", "Prevenção definitiva do assoreamento e contaminação de rios vizinhos."], 
        exemplo: "Uso do aparelho 'Pé-de-Galinha' ou nível de mangueira para demarcação exata das linhas de nível no terreno antes de abrir sulcos de plantio." 
    }
};

function mostrarModal(idAlvo) {
    const item = dadosEmbrapaPopups[idAlvo];
    if (!item) return;

    let bulletListHtml = "";
    item.beneficios.forEach(b => { bulletListHtml += `<li>📌 ${b}</li>`; });

    const layoutInjetado = `
        <div class="modal-box-body">
            <button id="btn-fechar-modal-generico" class="modal-btn-fechar">✕</button>
            <h2 class="modal-titulo-item">${item.titulo}</h2>
            <div class="modal-detailed-intro">${item.intro}</div>
            <div class="modal-detailed-grid">
                <div class="modal-detailed-col">
                    <h4>🎯 Impactos e Benefícios Reais:</h4>
                    <ul class="referencias-lista" style="padding-left:10px; list-style-type:none;">${bulletListHtml}</ul>
                </div>
                <div class="modal-detailed-col">
                    <h4>🚜 Aplicação Técnica no Campo:</h4>
                    <p class="modal-detailed-exemplo">${item.exemplo}</p>
                </div>
            </div>
        </div>
    `;

    document.getElementById('modal-content-injector').innerHTML = layoutInjetado;
    document.getElementById('global-modal-overlay').classList.remove('hidden');
    document.getElementById('btn-fechar-modal-generico').addEventListener('click', ocultarModal);
}

function ocultarModal() {
    document.getElementById('global-modal-overlay').classList.add('hidden');
    document.getElementById('modal-content-injector').innerHTML = '';
}

function fecharModalPorCliqueFora(e) {
    if (e.target.id === 'global-modal-overlay') ocultarModal();
}

const databaseQuestoes = {
    facil: [
        { q: "Qual o principal objetivo da rotação de culturas?", o: ["Desgastar o solo mais rápido", "Quebrar ciclos de pragas e doenças", "Usar apenas um tipo de adubo", "Aumentar o uso de químicos"], a: 1 },
        { q: "O que é adubação verde?", o: ["Pintar as plantas de verde", "Uso de plantas específicas para melhorar o solo", "Aplicar fertilizante sintético", "Irrigar com água tratada"], a: 1 },
        { q: "Qual inseto é um predador natural famoso no controle biológico (MIP)?", o: ["Lagarta-do-cartucho", "Joaninha", "Gafanhoto", "Cochonilha"], a: 1 },
        { q: "As curvas de nível servem principalmente para evitar o quê?", o: ["A erosão provocada pelas chuvas", "O crescimento das plantas", "A presença de pássaros", "O vento excessivo"], a: 0 },
        { q: "O que significa a sigla SAFs?", o: ["Sistemas Agroflorestais", "Sistemas de Adubação Forte", "Sustentabilidade Agrícola", "Associação de Produtores"], a: 0 },
        { q: "Qual a distância mínima recomendada para proteger uma nascente?", o: ["5 metros", "10 metros", "50 metros", "2 metros"], a: 2 },
        { q: "A palhada deixada sobre o solo ajuda a manter o quê?", o: ["O solo seco", "A umidade e a temperatura adequadas", "As pragas escondidas", "O solo compactado"], a: 1 },
        { q: "As plantas leguminosas ajudam a fixar qual elemento no solo?", o: ["Oxigênio", "Nitrogênio", "Ferro", "Cálcio"], a: 1 },
        { q: "O que o gado NÃO deve fazer na área de uma nascente protegida?", o: ["Ficar longe da cerca", "Pisotear e sujar a água", "Beber água fora da APP", "Sombra em árvores distantes"], a: 1 },
        { q: "A agroecologia busca imitar o funcionamento de qual sistema?", o: ["Uma fábrica industrial", "A própria natureza", "Um laboratório químico", "Uma cidade urbana"], a: 1 }
    ],
    medio: [
        { q: "No plantio consorciado de milho e soja, qual a vantagem da soja?", o: ["Sombra excessiva", "Fornecimento biológico de nitrogênio", "Atrair lagartas", "Produzir sementes inférteis"], a: 1 },
        { q: "Qual a principal função do terraceamento em declives acentuados?", o: ["Facilitar o trânsito de pedestres", "Fracionar e reter o fluxo volumoso das enxurradas", "Aumentar a evaporação da água", "Estilizar a paisagem rústica"], a: 1 },
        { q: "O nível econômico de dano no MIP serve para determinar o quê?", o: ["O preço final do grão no mercado", "O momento exato em que a praga causa prejuízo real justificando intervenção", "O custo do combustível do trator", "A quantidade de adubo por hectare"], a: 1 },
        { q: "Qual elemento é central na transição agroecológica?", o: ["Uso massivo de sementes transgênicas", "Redução gradual de insumos sintéticos industriais", "Abandono total da rotação de culturas", "Aumento do desmatamento legal"], a: 1 },
        { q: "Que benefício os Corredores Ecológicos trazem às propriedades?", o: ["Isolamento completo dos animais", "Livre trânsito e fluxo gênico da fauna silvestre", "Facilidade para queimar os campos", "Aumento da erosão nas margens"], a: 1 },
        { q: "A 'cobertura morta' atua como barreira contra qual processo físico?", o: ["Compactação subterrânea pura", "Impacto direto das gotas de chuva evitando o selamento superficial", "Evaporação profunda", "Crescimento de raíces pivotantes"], a: 1 },
        { q: "Por que árvores nativas são mantidas em pastagens no modelo sustentável?", o: ["Para atrapalhar o maquinário", "Proporcionar conforto térmico ao gado e reciclar nutrientes", "Secar o solo ao redor", "Impedir o nascimento do capim"], a: 1 },
        { q: "Qual destino correto deve ser dado às embalagens vazias de agrotóxicos?", o: ["Queimar nos fundos da propriedade", "Tríplice lavagem, perfuração e devolução nos centros credenciados", "Enterrar próximo ao riacho", "Reutilizar para água"], a: 1 },
        { q: "O dessecamento excessivo sem palhada expõe o solo a qual dano?", o: ["Lixiviação extrema provocada pelo vento e chuva", "Aumento excessivo de matéria orgânica", "Crescimento espontâneo de árvores", "Encharcamento perpétuo"], a: 0 },
        { q: "A compostagem transforma resíduos orgânicos em qual material?", o: ["Fertilizante químico solúvel", "Adubo estabilizado rico em húmus e nutrientes", "Defensivo sintético de alta potência", "Plástico biodegradável"], a: 1 }
    ],
    dificil: [
        { q: "Qual enzima bacteriana é responsável pela quebra do triplo enlace do N2 na fixação biológica?", o: ["Amilase bacteriana", "Nitrogenase", "Polimerase II", "Celulase termoativa"], a: 1 },
        { q: "Como os Sistemas Agroflorestais mitigam as oscilações térmicas extremas no microclima?", o: ["Através do bombeamento hidráulico subterrâneo", "Pelo amortecimento térmico promovido pela densidade do dossel arbóreo", "Gerando correntes de vento térmicas", "Por reflexão total das radiações ultravioletas"], a: 1 },
        { q: "O selamento superficial do solo decorre de qual dinâmica?", o: ["Energia cinética do impacto direto das gotas de chuva sobre a terra desnuda", "Crescimento radicular lateral de monoculturas", "Uso prolongado de adubação orgânica líquida", "Falta de minerais magnéticos no subsolo"], a: 0 },
        { q: "Como a rotação de culturas altera as propriedades biológicas do solo?", o: ["Estilizando a estrutura molecular do oxigênio", "Exsudando compostos carbonados diversos que fomentam microbiota especializada benéfica", "Neutralizando permanentemente o pH natural", "Eliminando os macroorganismos decompositores"], a: 1 },
        { q: "Qual a justificativa físico-química para a tríplice lavagem de embalagens?", o: ["Limpar o rótulo para facilitar a leitura", "Desprender mais de 99,9% dos resíduos químicos impregnados maximizando a descontaminação", "Alterar a composição molecular do plástico", "Permitir o reuso doméstico"], a: 1 },
        { q: "Na engenharia de solo, qual o princípio hidráulico das curvas de nível com terraços de retenção?", o: ["Acelerar o escoamento hídrico", "Infiltrar a água por redução da energia potencial gravitacional da enxurrada", "Evaporar o excesso de chuva", "Drenar a umidade para fora"], a: 1 },
        { q: "Qual a principal limitação ecológica no uso continuado de bioinseticidas à base de Bacillus thuringiensis (Bt)?", o: ["Eles volatilizam rapidamente abaixo de 10°C", "Seleção de populações de pragas resistentes caso manejados sem rotação de princípios ativos", "Intoxicação severa de polinizadores", "Incompatibilidade mecânica"], a: 1 },
        { q: "A micorrização atua de qual forma nas raíces das culturas agrícolas?", o: ["Atacando tecidos celulares meristemáticos", "Expandindo a área de absorção hídrica e fosfática através de hifas fúngicas simbióticas", "Inibindo o crescimento de pelos absorventes", "Tornando as raíces impermeáveis"], a: 1 },
        { q: "O processo de lixiviação consiste em qual fenômeno pedológico?", o: ["Acúmulo de palhada densa", "Lavagem e transporte de nutrientes solúveis rumo às camadas profundas pelo fluxo hídrico descendente", "Fixação estável de minerais", "Subida capilar de sais minerais"], a: 1 },
        { q: "Qual a meta estrutural final de uma transição agroecológica complexa de nível 3?", o: ["Trocar um insumo comercial industrial por outro biológico isolado", "Redesenhar o agroecossistema para funcionar autonomamente mimetizando processos naturais", "Mecanizar totalmente as áreas de preservação florestal", "Substituir a lavoura por pastagem intensiva"], a: 1 }
    ]
};

let nivelQuizAtual = 'facil';
let indiceQuestaoAtual = 0;
let totalAcertosQuiz = 0;

function mudarNivelQuiz(novoNivel) {
    nivelQuizAtual = novoNivel;
    indiceQuestaoAtual = 0;
    if(novoNivel === 'facil') totalAcertosQuiz = 0;

    const lblNivel = document.getElementById('lbl-nivel-atual');
    if (lblNivel) lblNivel.innerText = novoNivel.charAt(0).toUpperCase() + novoNivel.slice(1);

    renderizarQuestaoQuiz();
}

function renderizarQuestaoQuiz() {
    const listaQuestoes = databaseQuestoes[nivelQuizAtual];
    const dadosQuestao = listaQuestoes[indiceQuestaoAtual];
    const totalQ = listaQuestoes.length;
    const porcentagem = ((indiceQuestaoAtual + 1) / totalQ) * 100;

    const progressTxt = document.getElementById('quiz-progress-text');
    if(progressTxt) progressTxt.innerText = `Questão ${indiceQuestaoAtual + 1} de ${totalQ}`;

    const barFill = document.getElementById('quiz-bar-fill');
    if(barFill) barFill.style.width = `${porcentagem}%`;

    const qTitle = document.getElementById('quiz-question-title');
    if(qTitle) qTitle.innerText = dadosQuestao.q;

    const caixaOpcoes = document.getElementById('quiz-options-container');
    if(caixaOpcoes) {
        caixaOpcoes.innerHTML = "";
        dadosQuestao.o.forEach((opcao, indice) => {
            const btn = document.createElement('button');
            btn.innerText = opcao;
            btn.className = "quiz-option"; 
            btn.addEventListener('click', () => checarRespostaQuiz(indice, btn));
            caixaOpcoes.appendChild(btn);
        });
    }

    const btnNext = document.getElementById('btn-next-question');
    if(btnNext) {
        btnNext.classList.remove('hidden');
        btnNext.disabled = true;
    }
}

function checarRespostaQuiz(indiceSelecionado, elementoClicado) {
    const listaQuestoes = databaseQuestoes[nivelQuizAtual];
    const respostaCorreta = listaQuestoes[indiceQuestaoAtual].a;
    const caixaOpcoes = document.getElementById('quiz-options-container');
    if(!caixaOpcoes) return;

    const todosBotoes = caixaOpcoes.querySelectorAll('button');
    todosBotoes.forEach(b => b.disabled = true);

    if (indiceSelecionado === respostaCorreta) {
        elementoClicado.classList.add('correct');
        totalAcertosQuiz++;
    } else {
        elementoClicado.classList.add('wrong');
        todosBotoes[respostaCorreta].classList.add('correct');
    }

    const metricEl = document.getElementById('metric-quiz');
    if(metricEl) metricEl.innerText = `${totalAcertosQuiz}/30`;
    
    const btnNext = document.getElementById('btn-next-question');
    if(btnNext) btnNext.disabled = false;
}

function proximaQuestao() {
    const listaQuestoes = databaseQuestoes[nivelQuizAtual];
    indiceQuestaoAtual++;

    if (indiceQuestaoAtual < listaQuestoes.length) {
        renderizarQuestaoQuiz();
    } else {
        finalizarNivelQuiz();
    }
}

function finalizarNivelQuiz() {
    let proxNivel = '';
    let titulo = '';
    let msg = '';

    if (nivelQuizAtual === 'facil') {
        proxNivel = 'medio';
        titulo = "🌱 Nível Fácil Concluído!";
        msg = `Avançou com sucesso. Acertos parciais: ${totalAcertosQuiz}/10. Deseja iniciar o nível Médio?`;
    } else if (nivelQuizAtual === 'medio') {
        proxNivel = 'dificil';
        titulo = "🌿 Nível Médio Concluído!";
        msg = `Excelente ritmo de acertos: ${totalAcertosQuiz}/20. Deseja encarar o nível Avançado (Difícil)?`;
    } else {
        const porcentagemAcertos = (totalAcertosQuiz / 30) * 100;
        if (porcentagemAcertos >= 70) {
            gerarCertificado();
            liberarCertificadoNoProgresso();
        } else {
            mostrarReprovacao(porcentagemAcertos);
        }
        return;
    }

    const modalHtml = `
        <div class="text-center-box" style="padding: 20px;">
            <h2 class="modal-titulo">${titulo}</h2>
            <p class="modal-msg-text">${msg}</p>
            <div class="btn-gap">
                <button id="btn-avancar-nivel" class="btn-gerar-cert">Avançar Nível ➡️</button>
                <button id="btn-ficar-nivel" class="nav-btn btn-imprimir" style="background:#ccc; color:#333;">Ficar Aqui</button>
            </div>
        </div>
    `;
    
    document.getElementById('modal-content-injector').innerHTML = modalHtml;
    document.getElementById('global-modal-overlay').classList.remove('hidden');

    document.getElementById('btn-avancar-nivel').addEventListener('click', () => {
        mudarNivelQuiz(proxNivel);
        ocultarModal();
    });
    document.getElementById('btn-ficar-nivel').addEventListener('click', ocultarModal);
}

function mostrarReprovacao(porcentagem) {
    const modalHtml = `
        <div class="text-center-box" style="padding:20px;">
            <h2 class="modal-titulo" style="color: #f44336;">⚠️ Quase lá!</h2>
            <p class="modal-msg-text">Atingiu <strong>${porcentagem.toFixed(1)}%</strong> de acertos (${totalAcertosQuiz}/30).</p>
            <p style="margin-bottom: 20px; font-size:0.95rem; color:var(--text-light);">É necessário no mínimo <strong>70% de aproveitamento</strong> para emitir a certificação oficial.</p>
            <div class="btn-gap">
                <button id="btn-reiniciar-quiz" class="btn-gerar-cert">🔄 Tentar Novamente</button>
                <button id="btn-fechar-aviso" class="nav-btn btn-imprimir" style="background:#ccc; color:#333;">Fechar</button>
            </div>
        </div>
    `;
    document.getElementById('modal-content-injector').innerHTML = modalHtml;
    document.getElementById('global-modal-overlay').classList.remove('hidden');

    document.getElementById('btn-reiniciar-quiz').addEventListener('click', () => {
        mudarNivelQuiz('facil');
        ocultarModal();
    });
    document.getElementById('btn-fechar-aviso').addEventListener('click', ocultarModal);
}

function gerarCertificado() {
    const metricEl = document.getElementById('metric-quiz');
    if(metricEl) metricEl.innerText = `${totalAcertosQuiz}/30 (Aprovado)`;
    
    const modalHtml = `
        <div class="referencias-box" style="text-align:center;">
            <div class="cert-icone-topo">🏆</div>
            <h1 class="modal-titulo" style="font-size:1.8rem;">Certificado de Excelência</h1>
            <h3 class="certificado-subtitulo">Raízes do Amanhã | Tecnologia Rural</h3>
            <p class="certificado-texto" style="text-align:justify;">
                Certificamos para os devidos fins que o <strong>Aluno Online</strong> demonstrou excelente domínio 
                cognitivo nos módulos de monitoramento sustentável, cumprindo com distinção as etapas avaliativas 
                da plataforma digital com a marca de ${((totalAcertosQuiz/30)*100).toFixed(0)}% de aproveitamento técnico.
            </p>
            <div class="btn-gap">
                <button id="btn-fechar-certificado" class="nav-btn btn-imprimir" style="background:#ccc; color:#333;">Fechar</button>
                <button id="btn-download-certificado" class="btn-gerar-cert">📥 Baixar Documento</button>
            </div>
        </div>
    `;
    
    document.getElementById('modal-content-injector').innerHTML = modalHtml;
    document.getElementById('global-modal-overlay').classList.remove('hidden');
    
    document.getElementById('btn-fechar-certificado').addEventListener('click', ocultarModal);
    document.getElementById('btn-download-certificado').addEventListener('click', executarDownloadRealCertificado);
}

function executarDownloadRealCertificado() {
    const porcentagem = ((totalAcertosQuiz / 30) * 100).toFixed(0);
    const htmlConteudo = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Plus+Jakarta+Sans:wght@400;700&display=swap');
            body { margin: 0; padding: 20px; background: #f0f0f0; display: flex; justify-content: center; }
            .cert-container { 
                width: 900px; height: 630px; background: #f9f7f2; 
                border: 20px solid #0f271c; border-image: linear-gradient(135deg, #0f271c, #97cc52) 30;
                position: relative; padding: 40px; box-sizing: border-box; text-align: center;
                box-shadow: 0 0 20px rgba(0,0,0,0.2);
            }
            .faixa-ouro { 
                background: linear-gradient(to bottom, #97cc52, #0f271c);
                color: white; padding: 15px 40px; margin: 0 auto 30px;
                display: inline-block; font-family: 'Cinzel', serif; font-size: 24px; text-transform: uppercase;
            }
            h1 { font-family: 'Cinzel', serif; color: #0f271c; font-size: 32px; margin-bottom: 20px; }
            p { font-family: 'Plus Jakarta Sans', sans-serif; color: #333; line-height: 1.6; font-size: 16px; margin: 15px 0; }
            .assinaturas { display: flex; justify-content: space-between; margin-top: 80px; }
            .assinatura-box { border-top: 1px solid #333; width: 250px; padding-top: 10px; font-family: 'Cinzel', serif; font-size:13px; }
        </style>
    </head>
    <body>
        <div class="cert-container">
            <div class="faixa-ouro">PROJETO RAÍZES DO AMANHÃ</div>
            <div style="font-size: 14px; margin-bottom: 20px; font-family:sans-serif;">Conceito de Monitoramento de Impacto Agroecológico</div>
            
            <h1>CERTIFICADO DE EXCELÊNCIA AGROECOLÓGICA</h1>
            
            <p>Pelo presente certificado, declaramos que o <strong> ALUNO(A) ONLINE</strong> concluiu com aproveitamento exemplar o ecossistema pedagógico digital de sustentabilidade, atingindo a marca avaliativa de <strong>${totalAcertosQuiz} acertos de 30 possíveis (${porcentagem}% de rendimento)</strong> nas lições teóricas e computacionais.</p>
            
            <p style="font-weight: bold; margin-top: 20px; font-family:sans-serif;">PLATAFORMA DE MONITORAMENTO DE IMPACTO AGROECOLÓGICA & INTELIGÊNCIA TECNOLÓGICA COMPUTACIONAL</p>
            
            <div class="assinaturas">
                <div class="assinatura-box">
                    Raizes do Amanhã <br><span style="font-size:11px; color:#555;">Antônio Olinto, 14 de Junho de 2026</span>
                </div>
                <div class="assinatura-box">
                Agro Hub <br><span style="font-size:11px; color:#555;"> Antônio Olinto , 14 de Junho de 2026</span>
                </div>
            </div>
        </div>
    </body>
    </html>`;
    const blob = new Blob([htmlConteudo], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Certificado_Raizes_do_Amanha.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function liberarCertificadoNoProgresso() {
    const caixaCertificado = document.getElementById('status-certificado-box');
    if(caixaCertificado) {
        caixaCertificado.className = "certificado-status-liberado";
        caixaCertificado.innerHTML = `
            <div class="lock-icon">🏆</div>
            <h4>Parabéns! Certificado Liberado</h4>
            <p style="margin-bottom:15px; font-size:0.9rem;">O seu aproveitamento foi superior a 70% no Quiz. Faça o download abaixo:</p>
            <button id="btn-download-progresso" class="btn-gerar-cert">📥 Baixar Certificado</button>
        `;
        document.getElementById('btn-download-progresso').addEventListener('click', executarDownloadRealCertificado);
    }
}

function abrirMidia(tipoMidia) {
    const container = document.getElementById('media-viewport-container');
    const box = document.getElementById('media-frame-box');
    const titulo = document.getElementById('media-viewport-title');

    if(!container || !box) return;

    container.classList.remove('hidden');
    box.innerHTML = "";

    if (tipoMidia === 'pdf') {
        if(titulo) titulo.innerHTML = "📄 Livro Técnico: Conservando os Solos (Manual do Acervo Digital da UFPR)";
        const urlPdf = "https://acervodigital.ufpr.br/xmlui/bitstream/handle/1884/85232/Conservando_os_solos.pdf?sequence=1&isAllowed=y";
        box.innerHTML = `<iframe src="https://docs.google.com/gview?url=${encodeURIComponent(urlPdf)}&embedded=true" class="box-iframe-media"></iframe>`;
    } else if (tipoMidia === 'video') {
        if(titulo) titulo.innerHTML = "🎥 Videoaula Prática: Preservação de Nascentes Rurais";
        box.innerHTML = `<iframe src="https://www.youtube.com/embed/FHraCDyIhrI" class="box-iframe-media" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    }
    container.scrollIntoView({ behavior: 'smooth' });
}

function fecharMidia() {
    const container = document.getElementById('media-viewport-container');
    if(container) container.classList.add('hidden');
    const box = document.getElementById('media-frame-box');
    if(box) box.innerHTML = "";
}

// Lógica Autoral - Jogo da Memória Computacional
const cartasMemoriaOriginais = [
    { nome: "Plantio Direto", icone: "🚜" }, { nome: "Plantio Direto", icone: "🚜" },
    { nome: "Adubação Verde", icone: "🌿" }, { nome: "Adubação Verde", icone: "🌿" },
    { nome: "Rotação Culturas", icone: "🔄" }, { nome: "Rotação Culturas", icone: "🔄" },
    { nome: "Controle Biológico", icone: "🐞" }, { nome: "Controle Biológico", icone: "🐞" },
    { nome: "Mata Ciliar", icone: "🌳" }, { nome: "Mata Ciliar", icone: "🌳" },
    { nome: "Cerca Proteção", icone: "💧" }, { nome: "Cerca Proteção", icone: "💧" }
];

let vetorTemporarioCartas = [];
let jogadasEfetuadas = 0;
let segundosJogo = 0;
let timerIdInterv = null;
let jogoIniciado = false;

function embaralharFisherYates(array) {
    let m = array.length, t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}

function iniciarTimerJogo() {
    if (jogoIniciado) return;
    jogoIniciado = true;
    segundosJogo = 0;
    clearInterval(timerIdInterv);
    timerIdInterv = setInterval(() => {
        segundosJogo++;
        const mins = String(Math.floor(segundosJogo / 60)).padStart(2, '0');
        const secs = String(segundosJogo % 60).padStart(2, '0');
        const tVal = document.getElementById('timer-val');
        if(tVal) tVal.innerText = `${mins}:${secs}`;
    }, 1000);
}

function inicializarJogo() {
    clearInterval(timerIdInterv);
    const tVal = document.getElementById('timer-val');
    if(tVal) tVal.innerText = "00:00";
    
    const mVal = document.getElementById('moves-val');
    if(mVal) mVal.innerText = "0";

    jogadasEfetuadas = 0;
    jogoIniciado = false;
    vetorTemporarioCartas = [];

    const cartasEmbaralhadas = embaralharFisherYates([...cartasMemoriaOriginais]);
    const canvas = document.getElementById('memory-game-board');
    if(!canvas) return;
    canvas.innerHTML = "";

    cartasEmbaralhadas.forEach(item => {
        const bloco = document.createElement('div');
        bloco.className = "memory-tile";

        bloco.innerHTML = `
            <div class="tile-back">🌱</div>
            <div class="tile-front" style="display:none; flex-direction:column; align-items:center; justify-content:center; height:100%; font-weight:700;">
                <span style="font-size:1.6rem; margin-bottom:4px;">${item.icone}</span>
                <span style="font-size:0.75rem; color:var(--primary-green); text-align:center;">${item.nome}</span>
            </div>
        `;

        bloco.addEventListener('click', () => virarCartaTabuleiro(bloco, item));
        canvas.appendChild(bloco);
    });
}

function virarCartaTabuleiro(elementoCarta, objetoDado) {
    if (elementoCarta.classList.contains('flipped') || elementoCarta.classList.contains('matched') || vetorTemporarioCartas.length >= 2) return;

    iniciarTimerJogo();

    elementoCarta.classList.add('flipped');
    elementoCarta.querySelector('.tile-back').style.display = "none";
    elementoCarta.querySelector('.tile-front').style.display = "flex";

    vetorTemporarioCartas.push({ el: elementoCarta, d: objetoDado });

    if (vetorTemporarioCartas.length === 2) {
        jogadasEfetuadas++;
        const mVal = document.getElementById('moves-val');
        if(mVal) mVal.innerText = jogadasEfetuadas;

        if (vetorTemporarioCartas[0].d.nome === vetorTemporarioCartas[1].d.nome) {
            vetorTemporarioCartas[0].el.classList.add('matched');
            vetorTemporarioCartas[1].el.classList.add('matched');
            vetorTemporarioCartas = [];

            if (document.querySelectorAll('.memory-tile.matched').length === cartasMemoriaOriginais.length) {
                clearInterval(timerIdInterv);
                setTimeout(() => { alert(`🎉 Vitória! Missão biológica completada com sucesso em ${jogadasEfetuadas} jogadas!`); }, 400);
            }
        } else {
            setTimeout(() => {
                vetorTemporarioCartas[0].el.classList.remove('flipped');
                vetorTemporarioCartas[0].el.querySelector('.tile-back').style.display = "flex";
                vetorTemporarioCartas[0].el.querySelector('.tile-front').style.display = "none";

                vetorTemporarioCartas[1].el.classList.remove('flipped');
                vetorTemporarioCartas[1].el.querySelector('.tile-back').style.display = "flex";
                vetorTemporarioCartas[1].el.querySelector('.tile-front').style.display = "none";

                vetorTemporarioCartas = [];
            }, 900);
        }
    }
}