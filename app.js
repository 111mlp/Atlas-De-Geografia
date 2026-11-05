(() => {
  'use strict';
  const projects = window.ATLAS_DATA || [];
  const $ = (sel, base=document) => base.querySelector(sel);
  const $$ = (sel, base=document) => [...base.querySelectorAll(sel)];
  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const summaries = {
    'atlas-01': {title:'Instituições em diálogo.', text:'Como organizações e blocos ajudam a coordenar desafios que ultrapassam fronteiras — e onde estão os limites dessa cooperação.', overline:'RECORTE DO GRUPO'},
    'atlas-02': {title:'Duas formas de organizar a economia.', text:'Propriedade, trabalho, mercado e papel do Estado: conceitos e experiências históricas apresentados pelos estudantes.', overline:'COMPARAÇÃO DE IDEIAS'},
    'atlas-03': {title:'Uma ordem mundial em disputa.', text:'A rivalidade entre Estados Unidos e União Soviética reorganizou alianças, conflitos, tecnologia e imaginários entre 1945 e 1991.', overline:'RECORTE HISTÓRICO'},
    'atlas-04': {title:'As desigualdades também têm endereço.', text:'Uma leitura regional do Brasil por indicadores de renda, educação, saúde, emprego e industrialização.', overline:'ESCALA NACIONAL'},
    'atlas-05': {title:'Um planeta, muitas realidades.', text:'PIB, PIB per capita, IDH, população, trabalho e indústria em perspectiva mundial.', overline:'ESCALA GLOBAL'}
  };
  const shortNames = {'atlas-01':'Organizações','atlas-02':'Capitalismo × socialismo','atlas-03':'Guerra Fria','atlas-04':'Brasil desigual','atlas-05':'Mundo desigual'};
  const icons = ['◌','⇄','◉','⌁','∞'];
  const headingRx = /^(\d+(?:\.\d+)*[.)]?\s+.+|QUESTÃO NORTEADORA|ANÁLISE:?|FONTES PRINCIPAIS:?|MAPA TEMÁTICO.+|BLOCO (?:OCIDENTAL|ORIENTAL)|CAPITALISMO|SOCIALISMO|ONU|OMS|OMC|UNIÃO EUROPEIA|MERCOSUL|USMCA|PIB(?: PER CAPITA)?|IDH|POPULAÇÃO(?:\s*\(.+\))?|EMPREGO|INDUSTRIALIZAÇÃO|REFERÊNCIAS.+)$/i;
  const isHeading = p => p.type !== 'table' && (/^heading/i.test(p.style || '') || (headingRx.test((p.text || '').trim()) && (p.text || '').length < 120));
  const root = document.documentElement;
  const body = document.body;
  const reader = $('#reader');
  let currentIndex = 0;
  let lastFocused = null;
  let selectionTimer;

  function buildTopicNav(){
    $('#topic-nav').innerHTML = projects.map((p,i)=>`<button class="nav-item topic-item${i===currentIndex?' is-active':''}" type="button" data-project="${escapeHTML(p.id)}" aria-label="Abrir ${escapeHTML(p.title)}"${i===currentIndex?' aria-current="page"':''}><span class="nav-icon" aria-hidden="true">${icons[i]||'◌'}</span><span class="nav-copy"><strong>${escapeHTML(shortNames[p.id]||p.title)}</strong><small>${escapeHTML(p.kicker)} · ${p.number}/05</small></span><span class="nav-chevron" aria-hidden="true">↗</span></button>`).join('');
    $$('.topic-item').forEach((button,index)=>{
      button.addEventListener('click',()=>selectProject(index));
      button.addEventListener('keydown',event=>{const dir=event.key==='ArrowDown'||event.key==='ArrowRight'?1:event.key==='ArrowUp'||event.key==='ArrowLeft'?-1:0;if(!dir)return;event.preventDefault();const next=(index+dir+projects.length)%projects.length;selectProject(next);$(`.topic-item[data-project="${projects[next].id}"]`).focus()});
    });
  }
  function selectProject(index){
    const next=(index+projects.length)%projects.length;
    if(next===currentIndex && body.dataset.initialized==='true')return;
    currentIndex=next;const p=projects[currentIndex];const summary=summaries[p.id]||{};
    $('#section-copy').classList.add('is-changing');$('.data-card').classList.add('is-changing');
    window.clearTimeout(selectionTimer);
    selectionTimer=window.setTimeout(()=>{
      $$('.topic-item').forEach((b,i)=>{const active=i===currentIndex;b.classList.toggle('is-active',active);if(active)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
      $('#breadcrumb-current').textContent=(shortNames[p.id]||p.title).toLocaleUpperCase('pt-BR');
      $('#map-style-label').textContent=p.kicker.toLocaleUpperCase('pt-BR');
      $('#active-number').textContent=`CADERNO ${p.number} / 05`;
      $('#map-kicker').textContent=`CADERNO ${p.number} · ${p.kicker.toLocaleUpperCase('pt-BR')}`;
      $('#map-title').textContent=p.title;
      $('#map-subtitle').textContent=p.dek;
      $('#map-footer-caption').textContent=`${p.students.length} ESTUDANTES · ${p.media.length} MÍDIAS ORIGINAIS`;
      $('#section-number').textContent=p.number;
      $('#section-kicker-text').textContent=summary.overline||'EM FOCO';
      $('#section-title').textContent=summary.title||p.title;
      $('#section-description').textContent=summary.text||p.dek;
      $('#section-heading-index').textContent=`[ ${p.number} — 05 ]`;
      $('#note-number').textContent=p.number;
      $('#data-overline').textContent=`NO DOCUMENTO · ${p.kicker.toLocaleUpperCase('pt-BR')}`;
      $('#data-title').textContent=p.students.length===1?'1 estudante':`${p.students.length} estudantes`;
      $('#data-description').textContent=p.media.length?`${p.media.length} imagem(ns) ou mídia(s) preservada(s) do arquivo enviado. A pesquisa completa inclui texto e créditos.`:'Pesquisa textual completa, com créditos e fontes apresentados no documento.';
      $('#data-chip-label').textContent=p.references.length?`${p.references.length} REFERÊNCIAS · ${p.media.length} MÍDIAS`:`${p.students.length} ESTUDANTES · SEM LISTA BIBLIOGRÁFICA`;
      body.classList.remove('is-transitioning');void body.offsetWidth;body.classList.add('is-transitioning');
      $('#section-copy').classList.remove('is-changing');$('.data-card').classList.remove('is-changing');
      window.setTimeout(()=>body.classList.remove('is-transitioning'),650);
      body.dataset.initialized='true';
    },120);
  }
  function linkify(text){
    const safe=escapeHTML(text);
    return safe.replace(/(https?:\/\/[^\s<>"']+)/g,url=>{let clean=url.replace(/[.,;\])]+$/,'');let tail=url.slice(clean.length);return `<a href="${clean}" target="_blank" rel="noopener noreferrer">${clean}</a>${tail}`});
  }
  function renderTable(item){
    const rows=(item.rows||[]).filter(row=>row.some(cell=>String(cell).trim()));
    if(!rows.length)return '';
    const heading=String(rows[0][0]||'').trim().toLocaleLowerCase('pt-BR');
    const hasHeader=['cidade','indicador','aspecto','organismo'].includes(heading);
    const cellHTML=value=>String(value||'').split('\n').map(part=>linkify(part)).join('<br>');
    const head=hasHeader?`<thead><tr>${rows[0].map(cell=>`<th scope="col">${cellHTML(cell)}</th>`).join('')}</tr></thead>`:'';
    const bodyRows=hasHeader?rows.slice(1):rows;
    const bodyHTML=bodyRows.map(row=>`<tr>${row.map(cell=>`<td>${cellHTML(cell)}</td>`).join('')}</tr>`).join('');
    return `<div class="table-frame" role="region" aria-label="Tabela extraída do trabalho escolar" tabindex="0"><table class="source-table">${head}<tbody>${bodyHTML}</tbody></table></div>`;
  }
  function getQuestion(p){
    const i=p.content.findIndex(x=>/questão norteadora/i.test(x.text));
    if(i<0)return null;
    return p.content.slice(i+1).find(x=>x.text.length>24)?.text||null;
  }
  function renderText(p){
    const qIndex=p.content.findIndex(x=>/questão norteadora/i.test(x.text));
    const question=qIndex>=0?p.content.slice(qIndex+1).find(x=>x.text.length>24)?.text:null;
    const skip=new Set();if(qIndex>=0){skip.add(qIndex);if(question){const qi=p.content.findIndex((x,i)=>i>qIndex&&x.text===question);if(qi>=0)skip.add(qi)}}
    const blocks=[];let heading=null,paras=[];
    const flush=()=>{if(heading||paras.length){blocks.push(`${heading?`<h2>${escapeHTML(heading)}</h2>`:''}${paras.map(text=>`<p${/^(Figura|Mapa|Fonte|Análise da|Análise:|Observação:)/i.test(text)?' class="caption"':''}>${linkify(text)}</p>`).join('')}`);heading=null;paras=[]}};
    p.content.forEach((item,i)=>{if(skip.has(i))return;if(item.type==='table'){flush();blocks.push(renderTable(item));return}const text=(item.text||'').trim();if(!text)return;if(isHeading(item)){flush();heading=text}else paras.push(text)});flush();
    return {question,html:blocks.join('')};
  }
  const chartBar=(label,width,value)=>`<div class="bar-row"><span class="bar-label">${escapeHTML(label)}</span><span class="bar-track"><span class="bar-fill" style="width:${Math.max(2,Math.min(100,width))}%"></span></span><span class="bar-val">${escapeHTML(value)}</span></div>`;
  function visuals(p){
    if(p.id==='atlas-05')return `<div class="reader-data"><div class="reader-data-card"><h3>Indicadores globais mencionados</h3><p>Valores e anos conforme o documento do grupo; cada série tem seu próprio ano de referência.</p>${chartBar('IDH mundial · 2023',75.6,'0,756')}${chartBar('Desemprego · 2025',4.8,'4,8%')}${chartBar('Emprego manufatureiro · 2025',13.7,'13,7%')}</div><div class="reader-data-card"><h3>População e economia urbana</h3><p>População mundial em 2024</p><strong>8,2 bilhões</strong><p>Cerca de 4,75 bilhões de pessoas viviam em áreas urbanas em 2025. A ONU projeta cerca de 10,3 bilhões de habitantes em meados da década de 2080.</p></div></div>`;
    if(p.id==='atlas-04')return `<div class="reader-data"><div class="reader-data-card"><h3>IDH estadual · destaques do texto</h3><p>Índices transcritos do trabalho, em escala de 0 a 1.</p>${chartBar('Distrito Federal',86.6,'0,866')}${chartBar('São Paulo',83.8,'0,838')}${chartBar('Santa Catarina',83.3,'0,833')}${chartBar('Alagoas',74.6,'0,746')}${chartBar('Maranhão',74.5,'0,745')}</div><div class="reader-data-card"><h3>Participação na indústria</h3><p>Receita líquida de vendas citada no documento (IBGE, 2024).</p>${chartBar('Sudeste',55.3,'55,3%')}${chartBar('Sul',20.5,'20,5%')}<p>O trecho fornecido não quantifica as demais regiões.</p></div></div>`;
    if(p.id==='atlas-03')return `<div class="reader-timeline">${[['1945','Fim da Segunda Guerra e início da ordem bipolar.'],['1949','Criação da OTAN; surgem os dois Estados alemães.'],['1955','Fundação do Pacto de Varsóvia.'],['1961','Construção do Muro de Berlim; voo de Yuri Gagarin.'],['1962','Crise dos Mísseis de Cuba.'],['1969','Missão Apollo 11 chega à Lua.'],['1989','Queda do Muro de Berlim.'],['1991','Dissolução do Pacto de Varsóvia e fim da União Soviética.']].map(([y,t])=>`<div class="reader-time"><b>${y}</b><span>${escapeHTML(t)}</span></div>`).join('')}</div>`;
    if(p.id==='atlas-02')return `<div class="reader-compare"><div><h3>Capitalismo</h3><p>Propriedade privada, empresas e produção orientada principalmente pelos mercados e pela busca de lucro.</p></div><div><h3>Socialismo</h3><p>Propriedade coletiva, social ou estatal; em sua proposta, a organização econômica prioriza necessidades sociais e redução das desigualdades.</p></div></div>`;
    if(p.id==='atlas-01')return `<div class="reader-data"><div class="reader-data-card"><h3>Instituições analisadas</h3><p>O trabalho percorre quatro organizações internacionais e três blocos regionais:</p><p><strong>ONU · OMS · OMC<br>União Europeia · Mercosul · USMCA</strong></p></div><div class="reader-data-card"><h3>Cooperação e limites</h3><p>As pesquisas apresentam funções, áreas de atuação, sedes e restrições da cooperação internacional, conforme o documento estudantil.</p></div></div>`;
    return '';
  }
  function renderMedia(p){
    if(!p.media.length)return `<h2>Acervo visual</h2><p class="small-note">O DOCX de origem não contém mídias incorporadas. O conteúdo textual foi preservado integralmente.</p>`;
    return `<h2>Imagens e mídias do documento</h2><div class="media-gallery">${p.media.map(m=>`<figure><img loading="lazy" src="${escapeHTML(m.src)}" alt="${escapeHTML(m.alt)}"><figcaption>${escapeHTML(m.alt)}</figcaption></figure>`).join('')}</div>`;
  }
  function renderRefs(p){
    if(!p.references.length)return `<h2>Referências bibliográficas</h2><p class="empty-reference">O documento original não apresenta uma lista bibliográfica formal identificável. As fontes mencionadas no texto foram mantidas junto aos trechos correspondentes.</p>`;
    return `<h2>Referências bibliográficas</h2><ol class="reader-references">${p.references.map(r=>`<li>${linkify(r)}</li>`).join('')}</ol>`;
  }
  function renderProject(p){
    const copy=renderText(p);const participants=p.students.length?p.students.map(x=>escapeHTML(x)).join('<br>'):'Os nomes dos participantes não foram identificados no documento.';
    return `<div class="reader-eyebrow">CADERNO ${p.number} / ${escapeHTML(p.kicker).toLocaleUpperCase('pt-BR')}</div><h1 id="reader-title">${escapeHTML(p.title)}</h1><p class="reader-subtitle">${escapeHTML(p.subtitle)} · Taubaté, SP · 2026</p>${copy.question?`<div class="reader-question">${escapeHTML(copy.question)}</div>`:''}<div class="reader-tools"><button type="button" data-reader-view="students">Ver todos os estudantes</button><button type="button" data-reader-view="references">Ver todas as referências</button></div><div class="reader-copy">${copy.html}</div><h2>Visualizações complementares</h2>${visuals(p)}${renderMedia(p)}<h2>Estudantes participantes</h2><div class="reader-credits"><strong>GRUPO ${p.number} · ${escapeHTML(p.title)}</strong><br>${participants}</div>${renderRefs(p)}<p class="small-note">Transcrição e organização dos materiais fornecidos. Gráficos e linhas do tempo são visualizações editoriais dos dados e fatos citados pelos grupos; não substituem as fontes originais.</p>`;
  }
  function renderStudents(){
    return `<div class="reader-eyebrow">VOZES DO PROJETO / 21 ESTUDANTES</div><h1 id="reader-title">Quem pesquisou.</h1><p class="reader-subtitle">As grafias dos nomes foram mantidas conforme aparecem nos documentos enviados.</p><div class="students-all">${projects.map(p=>`<section class="student-group"><small>GRUPO ${p.number} / ${escapeHTML(p.kicker).toLocaleUpperCase('pt-BR')}</small><h2>${escapeHTML(p.title)}</h2><p>${p.students.length?p.students.map(escapeHTML).join('<br>'):'Nomes não identificados no arquivo.'}</p></section>`).join('')}</div>`;
  }
  function renderReferences(){
    const total=projects.reduce((n,p)=>n+p.references.length,0);
    return `<div class="reader-eyebrow">BIBLIOGRAFIA / ${total} ENTRADAS IDENTIFICADAS</div><h1 id="reader-title">Fontes e referências.</h1><p class="reader-subtitle">Referências copiadas dos atlas estudantis. Links externos abrem em nova aba.</p>${projects.map(p=>`<section class="reference-group"><h2>${escapeHTML(p.title)}</h2><div class="reference-count">CADERNO ${p.number} · ${p.references.length} ${p.references.length===1?'REFERÊNCIA':'REFERÊNCIAS'}</div>${p.references.length?`<ol class="reader-references">${p.references.map(r=>`<li>${linkify(r)}</li>`).join('')}</ol>`:'<p class="empty-reference">Não foi localizada uma bibliografia formal neste documento. Fontes citadas no corpo do texto permanecem junto à pesquisa completa.</p>'}</section>`).join('')}`;
  }
  function openReader(view='project'){
    if(!reader.open)lastFocused=document.activeElement;const p=projects[currentIndex];let html,label;
    if(view==='students'){html=renderStudents();label='VOZES DO PROJETO'}
    else if(view==='references'){html=renderReferences();label='FONTES & REFERÊNCIAS'}
    else {html=renderProject(p);label=`CADERNO ${p.number} / 05`}
    $('#reader-content').innerHTML=html;$('#reader-label').textContent=label;
    $('.reader-scroll').scrollTop=0;
    if(!reader.open)reader.showModal();
    $$('[data-reader-view]',reader).forEach(btn=>btn.addEventListener('click',()=>openReader(btn.dataset.readerView)));
    $('#reader-close').focus();
  }
  function applyTheme(theme,persist=true){
    const light=theme==='light';root.dataset.theme=light?'light':'dark';
    const button=$('#theme-toggle');button.setAttribute('aria-pressed',String(light));button.setAttribute('aria-label',light?'Ativar modo escuro':'Ativar modo claro');$('.theme-label',button).textContent=light?'Modo escuro':'Modo claro';
    $('meta[name="theme-color"]').setAttribute('content',light?'#edf4f4':'#071521');
    if(persist){try{localStorage.setItem('atlas-coletivo-theme',light?'light':'dark')}catch(_){}}
  }
  function initTheme(){let initial='dark';try{const saved=localStorage.getItem('atlas-coletivo-theme');if(saved==='light'||saved==='dark')initial=saved}catch(_){}applyTheme(initial,false)}

  buildTopicNav();selectProject(0);initTheme();
  $('#theme-toggle').addEventListener('click',()=>applyTheme(root.dataset.theme==='dark'?'light':'dark'));
  $('#reader-theme').addEventListener('click',()=>applyTheme(root.dataset.theme==='dark'?'light':'dark'));
  $('#open-reader').addEventListener('click',()=>openReader('project'));
  $('#read-more').addEventListener('click',()=>openReader('project'));
  $('#reader-close').addEventListener('click',()=>reader.close());
  reader.addEventListener('click',event=>{if(event.target===reader)reader.close()});
  reader.addEventListener('close',()=>{if(lastFocused&&typeof lastFocused.focus==='function')lastFocused.focus()});
  $$('.extra-item').forEach(btn=>btn.addEventListener('click',()=>openReader(btn.dataset.view)));
  window.addEventListener('keydown',event=>{
    if(reader.open)return;
    if(event.altKey&&event.key==='ArrowDown'){event.preventDefault();selectProject(currentIndex+1)}
    if(event.altKey&&event.key==='ArrowUp'){event.preventDefault();selectProject(currentIndex-1)}
  });
})();
