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
        titulo: "Rotação e Diversificação Complexa de Culturas", 
        intro: "A rotação de culturas consiste em alternar de forma planejada, sistemática e ordenada diferentes espécies vegetais em uma mesma área agrícola ao longo do tempo. Esta técnica rompe radicalmente a continuidade de hospedeiros, agindo como um controle preventivo essencial contra a proliferação de pragas, fungos fitopatogênicos e nematoides específicos do solo. Além disso, o consórcio de plantas com arquiteturas de raízes variadas (superficiais combinadas com pivotantes profundas) promove a descompactação mecânica natural do solo, melhora a porosidade e potencializa a infiltração de água e a ciclagem profunda de nutrientes preciosos.", 
        beneficios: ["Interrompe eficientemente o ciclo biológico de pragas rurais e patógenos.", "Promove a descompactação biológica natural através de múltiplos sistemas radiculares.", "Maximiza a atividade biológica e a diversidade da microbiota benéfica do solo."], 
        exemplo: "Planejamento estruturado: 1º Ano: Milho (Gramínea) → 2º Ano: Soja (Leguminosa) → 3º Ano: Nabo Forrageiro / Aveia Preta (Cobertura profunda)." 
    },
    adubacao: { 
        titulo: "Adubação Verde e Cobertura Viva de Solo", 
        intro: "Esta prática milenar baseia-se no cultivo planejado de plantas de rápido crescimento (principalmente leguminosas, crucíferas e gramíneas) com o objetivo exclusivo de enriquecer, proteger e reestruturar o solo. As espécies selecionadas possuem uma capacidade simbiótica incrível com bactérias fixadoras, capturando o nitrogênio gasoso livre na atmosfera e injetando-o diretamente na terra. Ao formar uma camada vegetal densa sobre a superfície, a adubação verde blinda a estrutura do solo contra a erosão hídrica severa, amortece oscilações extremas de temperatura e suprime o desenvolvimento de plantas daninhas por competição por luz.", 
        beneficios: ["Fixação biológica de Nitrogênio atmosférico de forma gratuita.", "Aporte maciço de matéria orgânica estável de altíssima qualidade.", "Eliminação do impacto erosivo das chuvas torrenciais na superfície."], 
        exemplo: "Cultivo intercalado ou em safrinha de Crotalária ou Mucuna Preta, seguido de roçagem para a formação de uma camada uniforme de palhada protetora." 
    },
    mip: { 
        titulo: "Manejo Integrado de Pragas (MIP-Agroecologia)", 
        intro: "O MIP é uma filosofia moderna e ecológica de tomada de decisões que gerencia as populações de pragas de modo a evitar que causem prejuízos econômicos, sem agredir o ecossistema. Em vez de pulverizações calendarizadas de veneno químico, o produtor realiza amostragens de campo semanais. A intervenção só ocorre se a população atingir o rigoroso Nível de Dano Econômico. O sistema prioriza defensivos de matriz biológica (como vírus, bactérias e fungos controladores) e incentiva a manutenção ativa de insetos predadores benéficos, restaurando a autorregulação natural da lavoura.", 
        beneficios: ["Redução drástica no custo de insumos e dependência química industrial.", "Preservação integral de polinizadores e predadores naturais (joaninhas, tesourinhas).", "Mitigação completa de riscos de contaminação e toxicidade alimentar."], 
        exemplo: "Monitoramento ativo da Lagarta-do-cartucho com aplicação direcionada de extrato de Neem ou do bioinseticidas biológicos à base de Bacillus thuringiensis (Bt)." 
    },
    safs: { 
        titulo: "Sistemas Agroflorestais Planejados (SAFs)", 
        intro: "Os SAFs representam a vanguarda da sustentabilidade ao combinar intencionalmente árvores perenes (madeireiras, frutíferas ou nativas) com cultivos agrícolas anuais e/ou criação de animais em um arranjo espacial e temporal harmônico. Esse design inteligente imita com perfeição a complexidade estrutural, a sucessão biológica e a estabilidade de uma floresta nativa. As raízes profundas das árvores realizam um bombeamento hidráulico e reciclagem de nutrientes de camadas profundas para a superfície. Além do ganho ambiental por sequestro de carbono e abrigo da fauna, garante resiliência econômica ao diversificar a produção anual da propriedade.", 
        beneficios: ["Reciclagem altamente eficiente de nutrientes profundos e proteção hídrica.", "Conforto térmico animal severo e diversificação de fontes de renda na mesma área.", "Sequestro ativo de Carbono atmosférico mitigando gases estufa."], 
        exemplo: "Consorciação agroflorestal: Fileiras de Eucalipto ou Erva-Mate intercaladas com cultivo de Milho, Feijão e pastagens sombreadas para pecuária leiteira." 
    },
    nascentes: { 
        titulo: "Recuperação, Cercamento e Proteção de Nascentes", 
        intro: "A salvaguarda de fontes d'água em Áreas de Preservação Permanente (APP) exige ações coordenadas estruturais e ecológicas. O passo primordial é o isolamento físico absoluto em um raio mínimo de 50 metros ao redor do olho d'água para barrar o pisoteio de bovinos, que causa compactação drástica e destruição marginal. Uma vez isolada a área, procede-se ao reflorestamento denso com mudas nativas da região. As copas reduzem a evaporação direta, enquanto as raízes funcionam como verdadeiras esponjas filtrantes, retendo defensivos agrícolas ou sedimentos das enxurradas e garantindo água limpa e contínua.", 
        beneficios: ["Garantia de segurança hídrica contínua e vazão estável ao longo do ano.", "Filtragem biológica de resíduos e sedimentos suspensos.", "Retorno imediato da fauna endêmica e equilíbrio hidrológico."], 
        exemplo: "Instalação de cercamento com arame liso rígido e plantio de espécies higrófitas nativas (como Ingá, Salgueiro e Taboa) ao redor de fontes degradadas." 
    },
    curvas: { 
        titulo: "Engenharia de Curvas de Nível e Terraceamento", 
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
    const listaPerguntas = quizPerguntas[nivelAtual];
    const pergunta = listaPerguntas[questaoIndex];

    // Atualizar labels de cabeçalho do quiz
    const nomesNivel = { facil: 'Fácil', medio: 'Médio', dificil: 'Difícil' };
    labelNivel.textContent = nomesNivel[nivelAtual];

    const indicadorGlobal = (nivelAtual === 'facil' ? 0 : nivelAtual === 'medio' ? 10 : 20) + questaoIndex + 1;
    progressoTexto.textContent = `${indicadorGlobal}/30`;
    barraQuizFill.style.width = `${(indicadorGlobal / 30) * 100}%`;

    document.getElementById('quiz-question-title').textContent = `${questaoIndex + 1}. ${pergunta.q}`;
    containerOpcoes.innerHTML = '';
    
    btnProxima.classList.add('hidden');
    btnProxima.disabled = true;

    pergunta.o.forEach((opcao, idx) => {
        const btnOpcao = document.createElement('button');
        btnOpcao.className = 'quiz-option';
        btnOpcao.textContent = opcao;

        // Caso a questão já tenha sido respondida anteriormente
        if (respostasUsuario[nivelAtual][questaoIndex] !== undefined) {
            const respondidoIdx = respostasUsuario[nivelAtual][questaoIndex];
            if (idx === pergunta.c) btnOpcao.classList.add('correct');
            else if (idx === respondidoIdx) btnOpcao.classList.add('wrong');
            btnOpcao.disabled = true;
            btnProxima.classList.remove('hidden');
            btnProxima.disabled = false;
        } else {
            // Evento de clique na opção
            btnOpcao.addEventListener('click', () => {
                respostasUsuario[nivelAtual][questaoIndex] = idx;
                
                document.querySelectorAll('.quiz-option').forEach((b, bIdx) => {
                    b.disabled = true;
                    if (bIdx === pergunta.c) b.classList.add('correct');
                    else if (bIdx === idx) b.classList.add('wrong');
                });

                if (idx === pergunta.c) acertosGerais++;
                
                atualizarPainelProgresso();
                btnProxima.classList.remove('hidden');
                btnProxima.disabled = false;
            });
        }
        containerOpcoes.appendChild(btnOpcao);
    });
}

function atualizarPainelProgresso() {
    document.getElementById('metric-quiz').textContent = `${acertosGerais}/30`;
    const certBox = document.getElementById('status-certificado-box');

    if (certBox) {
        if (acertosGerais >= 21) {
            certBox.className = 'certificado-status-liberado';
            certBox.innerHTML = `
                <div class="lock-icon">🎓</div>
                <h4>Certificado Desbloqueado!</h4>
                <p>Excelente aproveitamento! Atingiu <strong>${Math.round((acertosGerais/30)*100)}% de acertos</strong> (${acertosGerais} de 30 questões) no Quiz.</p>
                <div class="btn-gap">
                    <button class="btn-gerar-cert" id="btn-abrir-doc-certificado">Visualizar Certificado do Agrinho</button>
                </div>
            `;
            document.getElementById('btn-abrir-doc-certificado').addEventListener('click', abrirCertificado);
        } else {
            certBox.className = 'certificado-status-bloqueado';
            certBox.innerHTML = `
                <div class="lock-icon">🔒</div>
                <h4>Certificado Indisponível</h4>
                <p>Atinja no mínimo <strong>70% de acertos</strong> (21 de 30 questões) no Quiz de Fixação para liberar o documento. Progresso Atual: ${acertosGerais} acertos.</p>
            `;
        }
    }
}

btnProxima.addEventListener('click', () => {
    questaoIndex++;
    if (questaoIndex >= 10) {
        if (nivelAtual === 'facil') {
            nivelAtual = 'medio'; questaoIndex = 0; marcarFocoNivel(btnMedio);
        } else if (nivelAtual === 'medio') {
            nivelAtual = 'dificil'; questaoIndex = 0; marcarFocoNivel(btnDificil);
        } else {
            questaoIndex = 9;
            alert('Trilha concluída! Verifique o seu aproveitamento e emita o certificado no painel de desempenho.');
            return;
        }
    }
    renderizarQuestao();
});

function marcarFocoNivel(btnAtivo) {
    [btnFacil, btnMedio, btnDificil].forEach(b => b.style.outline = 'none');
    btnAtivo.style.outline = '3px solid #1d2d24';
}

btnFacil.addEventListener('click', () => { nivelAtual = 'facil'; questaoIndex = 0; marcarFocoNivel(btnFacil); renderizarQuestao(); });
btnMedio.addEventListener('click', () => { nivelAtual = 'medio'; questaoIndex = 0; marcarFocoNivel(btnMedio); renderizarQuestao(); });
btnDificil.addEventListener('click', () => { nivelAtual = 'dificil'; questaoIndex = 0; marcarFocoNivel(btnDificil); renderizarQuestao(); });

// Inicialização das variáveis do Quiz
marcarFocoNivel(btnFacil);
renderizarQuestao();

// ==========================================
// 5. EMISSÃO DO CERTIFICADO AGRINHO ORIGINAL (ATUALIZADO)
// ==========================================
function abrirCertificado() {
    modalInjector.innerHTML = `
        <div class="text-center-box">
            <h2 class="modal-titulo">🎉 Parabéns! Certificado Conquistado!</h2>
            <p>Você atingiu mais de 70% de acertos no Quiz e comprovou seus conhecimentos de alto nível técnico em Agroecologia.</p>
            <p style="margin-top:10px; font-weight:700;">Pontuação Final: ${acertosGerais}/30 (${Math.round((acertosGerais/30)*100)}%)</p>
            <div class="btn-gap" style="margin-top:20px;">
                <button id="btn-download-certificado" class="btn-gerar-cert">📥 Baixar Documento Oficial</button>
                <button class="nav-btn btn-imprimir" style="background:#ccc; color:#000;" id="btn-fechar-modal-cert">Fechar</button>
            </div>
        </div>
    `;
    modalOverlay.classList.remove('hidden');
    document.getElementById('btn-fechar-modal-cert').addEventListener('click', () => modalOverlay.classList.add('hidden'));
    document.getElementById('btn-download-certificado').addEventListener('click', executarDownloadRealCertificado);
}

function executarDownloadRealCertificado() {
    const porcentagem = Math.round((acertosGerais / 30) * 100);
    const htmlConteudo = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <title>Certificado do Agrinho - Daniel Ribeiro</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Plus+Jakarta+Sans:wght@400;700&display=swap');
            body { margin: 0; padding: 20px; background-color: #f5f5f5; display: flex; justify-content: center; align-items: center; min-height: 90vh; }
            .cert-container { 
                background: white; border: 15px double #1a3c17; width: 900px; padding: 40px; 
                text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.1); position: relative;
                box-sizing: border-box;
            }
            .faixa-ouro { 
                font-family: 'Cinzel', serif; color: #b8860b; font-size: 20px; font-weight: bold; 
                margin-bottom: 10px; letter-spacing: 2px; text-transform: uppercase;
            }
            .sub-faixa { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; margin-bottom: 30px; color: #555; }
            h1 { font-family: 'Cinzel', serif; color: #1a3c17; font-size: 36px; margin-bottom: 25px; font-weight: 700; }
            p { font-family: 'Plus Jakarta Sans', sans-serif; color: #333; line-height: 1.7; font-size: 17px; margin: 20px 0; }
            .assinaturas { display: flex; justify-content: space-between; margin-top: 90px; }
            .assinatura-box { border-top: 1px solid #333; width: 260px; padding-top: 10px; font-family: 'Cinzel', serif; font-size: 14px; color: #1a3c17; }
        }
        </style>
    </head>
    <body>
        <div class="cert-container">
            <div class="faixa-ouro">PLATAFORMA RAÍZES DO AMANHÃ</div>
            <div class="sub-faixa">CONCEITO DE MONITORAMENTO DE IMPACTO AGROECOLÓGICO</div>
            
            <h1>CERTIFICADO DE EXCELÊNCIA AGROECOLÓGICA</h1>
            
            <p>Pelo presente certificado, declaramos que o aluno demonstrou notável domínio cognitivo e proficiência técnica nos módulos de monitoramento sustentável, cumprindo com distinção a jornada pedagógica digital da plataforma, atingindo a marca avaliativa de <strong>${acertosGerais} acertos de 30 possíveis (${porcentagem}% de rendimento)</strong> nas lições teóricas e computacionais.</p>
            
            <div class="assinaturas">
                <div class="assinatura-box">
                    Antônio Olinto<br><span style="font-size:12px; font-family: 'Plus Jakarta Sans', sans-serif;">Antônio Olinto, 14 de Junho de 2026</span>
                </div>
                <div class="assinatura-box">
                    Daniel Ribeiro<br><span style="font-size:12px; font-family: 'Plus Jakarta Sans', sans-serif;">Daniel Ribeiro, 14 de Junho de 2026</span>
                </div>
            </div>
        </div>
    </body>
    </html>`;
    const blob = new Blob([htmlConteudo], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Certificado_Oficial_Agrinho_Raizes_do_Amanhã.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// ==========================================
// 6. RECURSOS DIDÁTICOS (REPRODUTOR DE MÍDIA)
// ==========================================
const btnPdf = document.getElementById('btn-midia-pdf');
const btnVideo = document.getElementById('btn-midia-video');
const mediaViewport = document.getElementById('media-viewport-container');
const mediaTitle = document.getElementById('media-viewport-title');
const mediaFrameBox = document.getElementById('media-frame-box');
const btnFecharMidia = document.getElementById('btn-fechar-midia');

if (btnPdf && btnVideo && mediaViewport) {
    btnPdf.addEventListener('click', () => {
        mediaViewport.classList.remove('hidden');
        mediaTitle.textContent = "📄 Manual de Solos (UFPR) — Repositório Académico";
        mediaFrameBox.innerHTML = `
            <div style="background:#edf2ef; padding:30px; border-radius:8px; text-align:center; border:1px dashed var(--primary-green);">
                <h4>[Simulador de Visualização de Documento PDF]</h4>
                <p style="font-size:0.9rem; color:var(--text-light); margin-top:8px;">Leitor integrado: Amostragem Química, Perfis de Solo e Fertilidade Orgânica no Campo.</p>
                <button class="nav-btn btn-imprimir mt-15" style="display:inline-block; font-size:0.85rem;" onclick="window.open('https://www.ufpr.br', '_blank')">Abrir Link Externo Institucional</button>
            </div>
        `;
        mediaViewport.scrollIntoView({ behavior: 'smooth' });
    });

    btnVideo.addEventListener('click', () => {
        mediaViewport.classList.remove('hidden');
        mediaTitle.textContent = "🎥 Práticas de Conservação Direta no Campo";
        mediaFrameBox.innerHTML = `
            <div style="background:#edf2ef; padding:40px; border-radius:8px; text-align:center; border:1px dashed var(--primary-green);">
                <div style="font-size:3rem; margin-bottom:10px;">🎥</div>
                <h4>Vídeo Didático: Construção Prática de Curvas de Nível e Proteção de Olhos d'Água</h4>
                <p style="font-size:0.9rem; color:var(--text-light);">[Reprodutor Multimédia Simulado — Demonstração Rústica para Escolas do Campo no Paraná]</p>
            </div>
        `;
        mediaViewport.scrollIntoView({ behavior: 'smooth' });
    });

    btnFecharMidia.addEventListener('click', () => {
        mediaViewport.classList.add('hidden');
        mediaFrameBox.innerHTML = '';
    });
}

// ==========================================
// 7. JOGO DA MEMÓRIA COM EFEITO VIRTUAL 3D
// ==========================================
const memoryGameBoard = document.getElementById('memory-game-board');
const btnReiniciarJogo = document.getElementById('btn-reiniciar-jogo');
const timerVal = document.getElementById('timer-val');
const movesVal = document.getElementById('moves-val');

let conjuntoCartas = ['🌾', '🌾', '🌱', '🌱', '🌿', '🌿', '🌳', '🌳', '💧', '💧', '🔄', '🔄', '🐞', '🐞', '🚜', '🚜'];
let cartasViradas = [];
let contagemPares = 0;
let totalJogadas = 0;
let cronometro = null;
let segundosPassados = 0;
let jogoIniciado = false;

function formatarTempo(s) {
    const min = Math.floor(s / 60).toString().padStart(2, '0');
    const seg = (s % 60).toString().padStart(2, '0');
    return `${min}:${seg}`;
}

function iniciarCronometro() {
    if (cronometro) clearInterval(cronometro);
    segundosPassados = 0;
    cronometro = setInterval(() => {
        segundosPassados++;
        timerVal.textContent = formatarTempo(segundosPassados);
    }, 1000);
}

function embaralhar(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function inicializarJogoMemoria() {
    memoryGameBoard.innerHTML = '';
    cartasViradas = [];
    contagemPares = 0;
    totalJogadas = 0;
    movesVal.textContent = '0';
    timerVal.textContent = '00:00';
    clearInterval(cronometro);
    jogoIniciado = false;

    const cartasEmbaralhadas = embaralhar([...conjuntoCartas]);

    cartasEmbaralhadas.forEach((emoji, index) => {
        const tile = document.createElement('div');
        tile.className = 'memory-tile';
        tile.setAttribute('data-emoji', emoji);

        tile.innerHTML = `
            <div class="tile-back">❓</div>
            <div class="tile-front">${emoji}</div>
        `;

        tile.addEventListener('click', () => {
            if (!jogoIniciado) {
                iniciarCronometro();
                jogoIniciado = true;
            }

            if (tile.classList.contains('flipped') || tile.classList.contains('matched') || cartasViradas.length >= 2) {
                return;
            }

            tile.classList.add('flipped');
            cartasViradas.push(tile);

            if (cartasViradas.length === 2) {
                totalJogadas++;
                movesVal.textContent = totalJogadas;

                const t1 = cartasViradas[0];
                const t2 = cartasViradas[1];

                if (t1.getAttribute('data-emoji') === t2.getAttribute('data-emoji')) {
                    t1.classList.add('matched');
                    t2.classList.add('matched');
                    contagemPares += 2;
                    cartasViradas = [];

                    if (contagemPares === conjuntoCartas.length) {
                        clearInterval(cronometro);
                        setTimeout(() => {
                            alert(`🎉 Parabéns! Completou o Jogo da Memória Ecológico em ${formatarTempo(segundosPassados)} com ${totalJogadas} jogadas!`);
                        }, 400);
                    }
                } else {
                    setTimeout(() => {
                        t1.classList.remove('flipped');
                        t2.classList.remove('flipped');
                        cartasViradas = [];
                    }, 1000);
                }
            }
        });

        memoryGameBoard.appendChild(tile);
    });
}

if (btnReiniciarJogo) {
    btnReiniciarJogo.addEventListener('click', inicializarJogoMemoria);
}

// Inicialização automática do Jogo ao carregar a página
inicializarJogoMemoria();