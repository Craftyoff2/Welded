(() => {
  const style = document.createElement('style');
  style.textContent = `
    .program-screen{max-width:1040px;margin:0 auto;padding:clamp(8px,3vw,30px) 0;animation:program-enter .28s ease both}
    @keyframes program-enter{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}
    .program-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;margin-top:28px}
    .program-card{position:relative;overflow:hidden;min-height:205px;text-align:left;cursor:pointer;border:1px solid var(--line);border-radius:16px;padding:24px;background:radial-gradient(ellipse at top right,#ff762e0b,transparent 52%),linear-gradient(145deg,#1c2023,#151719);color:var(--text);transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease}
    .program-card:hover{border-color:#b45b32;transform:translateY(-3px);box-shadow:0 14px 34px #0004}
    .program-card:focus-visible,.program-back:focus-visible{outline:2px solid var(--orange);outline-offset:3px}
    .program-card .program-icon{width:46px;height:46px;display:grid;place-items:center;border:1px solid #ff762e35;border-radius:13px;background:#ff762e12;color:var(--orange2);font-size:24px}
    .program-card h3{font:600 21px 'Space Grotesk',sans-serif;margin:18px 0 7px}
    .program-card p{max-width:52ch;color:var(--muted);font-size:13px;line-height:1.65;margin:0}
    .program-tag{display:inline-block;margin-top:17px;color:var(--orange2);font-size:10px;font-weight:700;letter-spacing:.8px}
    .program-back{margin-bottom:24px}
    .program-note{margin-top:20px}
    .scope-strip{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:20px;padding:13px 15px;border:1px solid #614029;background:linear-gradient(110deg,#2a211b,#201b18);border-radius:11px;color:#e4c5ac;font-size:12px}
    .scope-strip b{color:var(--orange2)}
    .scope-strip button{background:none;border:0;color:var(--orange2);font-weight:700;cursor:pointer}
    .scope-actions{display:flex;gap:8px;flex-shrink:0}
    .scope-actions button{padding:6px 9px;border:1px solid #614029;border-radius:7px;background:#2a211b;white-space:nowrap}
    .area-nav-button{border:0;background:transparent;color:#aab0b4;border-radius:9px;padding:11px 12px;text-align:left;display:flex;gap:12px;align-items:center;transition:.18s;cursor:pointer}
    .area-nav-button:hover{background:#202326;color:white}
    .area-nav-button .ico{width:18px;text-align:center;font-size:16px}
    .pending-mag-list{display:grid;gap:8px;margin-top:12px}
    .pending-mag-item{border:1px solid var(--line);border-radius:10px;background:#141719;padding:13px 15px}
    .pending-mag-item summary{cursor:pointer;font-size:13px;font-weight:600;line-height:1.5}
    .pending-mag-item summary::marker{color:var(--orange2)}
    .pending-mag-item .pending-options{margin:12px 0 0;padding-left:22px;color:#c4c9cb;font-size:12px;line-height:1.7}
    .overview-actions{display:flex;align-items:center;gap:9px;flex-wrap:wrap}
    .question-pager{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:15px;padding-top:14px;border-top:1px solid var(--line)}
    .question-pager-label{color:var(--muted);font-size:12px}
    .question-pager-controls{display:flex;gap:8px}
    @media(max-width:600px){.overview-actions{width:100%}.overview-actions .btn{flex:1}.question-pager{align-items:stretch;flex-direction:column}.question-pager-controls .btn{flex:1}}
    @media(max-width:600px){.program-grid{grid-template-columns:1fr;gap:12px;margin-top:22px}.program-card{min-height:158px;padding:20px}.scope-strip{align-items:flex-start;flex-direction:column}.scope-actions{width:100%;flex-wrap:wrap}}
    @media(prefers-reduced-motion:reduce){.program-screen,.program-card{animation:none;transition:none}}
  `;
  document.head.appendChild(style);

  const content = document.querySelector('.content');
  if (!content) return;
  const screen = document.createElement('section');
  screen.className = 'section active';
  screen.id = 'page-program';
  content.prepend(screen);

  const areaButton = document.createElement('button');
  areaButton.type = 'button';
  areaButton.className = 'area-nav-button';
  areaButton.innerHTML = '<span class="ico">⇄</span>Všechny oblasti';
  areaButton.title = 'Zpět na výběr všech oblastí';
  areaButton.onclick = () => goToProgramPicker();
  document.querySelector('.nav')?.append(areaButton);

  let activeProgram = null;
  const allQuestions = () => data.questions || [];
  const scopedQuestions = () => {
    const questions = allQuestions();
    if (activeProgram !== 'MAG') return questions.filter(q => (q.process || q.method || '').toUpperCase() !== 'MAG' && Number.isInteger(q.correctAnswer));
    return questions.filter(q => {
      const process = (q.process || q.method || '').toUpperCase();
      const category = (q.category || '').toLocaleLowerCase('cs-CZ');
      const title = (q.sectionTitle || '').toLocaleLowerCase('cs-CZ');
      return Number.isInteger(q.correctAnswer) && (process === 'MAG' || (category === 'bezpečnost' && /135/.test(title)));
    });
  };

  function openCategoryScreen(draw) {
    activeProgram = null;
    document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
    screen.classList.add('active');
    document.querySelectorAll('.nav button').forEach(button => button.classList.remove('active'));
    document.getElementById('crumb').textContent = 'Výběr oblasti';
    document.getElementById('sidebar').classList.remove('open');
    draw();
  }

  function goToProgramPicker() { openCategoryScreen(drawRoot); }
  function goToWeldingMethods() { openCategoryScreen(drawWelding); }

  function drawRoot() {
    screen.innerHTML = `<div class="program-screen">
      <div class="eyebrow">ZKOUŠKOVNÍK · PŘÍPRAVA KE ZKOUŠKÁM</div>
      <h2 class="page-title">Vyberte si oblast přípravy</h2>
      <p class="sub">Vyberte oblast přípravy. Otázky a pokrok zůstávají uložené v tomto zařízení.</p>
      <div class="program-grid">
        <button class="program-card" id="chooseWelding"><span class="program-icon">⚡</span><h3>Svářečák</h3><p>Příprava na svářečské zkoušky podle metody svařování.</p><span class="program-tag">MMA · MAG</span></button>
        <button class="program-card" id="chooseDriving"><span class="program-icon">▰</span><h3>Řidičáky</h3><p>Výběr skupiny řidičského oprávnění.</p><span class="program-tag">B · C · T</span></button>
      </div>
    </div>`;
    document.getElementById('chooseWelding').onclick = drawWelding;
    document.getElementById('chooseDriving').onclick = drawDriving;
  }

  function drawWelding() {
    const pendingMagCount = allQuestions().filter(q => (q.process || q.method || '').toUpperCase() === 'MAG' && !Number.isInteger(q.correctAnswer)).length;
    const availableMagCount = allQuestions().filter(q => (q.process || q.method || '').toUpperCase() === 'MAG' && Number.isInteger(q.correctAnswer)).length;
    screen.innerHTML = `<div class="program-screen"><button class="btn ghost program-back" id="programBack">← Zpět</button>
      <div class="eyebrow">SVÁŘEČÁK</div><h2 class="page-title">Vyberte metodu</h2>
      <p class="sub">Zvolte metodu, kterou se chcete připravovat.</p>
      <div class="program-grid">
        <button class="program-card" id="chooseMma"><span class="program-icon">ϟ</span><h3>MMA (Elektroda)</h3><p>Stávající databáze otázek.</p><span class="program-tag">OTÁZKY K DISPOZICI</span></button>
        <button class="program-card" id="chooseMag"><span class="program-icon">ϟ</span><h3>MAG (CO₂)</h3><p>${availableMagCount} technologických otázek je připraveno k procvičování.${pendingMagCount ? ` ${pendingMagCount} dalších čeká na klíč odpovědí.` : ''} Společné bezpečnostní otázky pro metodu 135 jsou také k dispozici.</p><span class="program-tag">${pendingMagCount ? 'ČÁSTEČNĚ PŘIPRAVENO' : 'OTÁZKY K DISPOZICI'}</span></button>
      </div></div>`;
    document.getElementById('programBack').onclick = drawRoot;
    document.getElementById('chooseMma').onclick = () => enterTrainer('MMA');
    document.getElementById('chooseMag').onclick = () => enterTrainer('MAG');
  }

  function drawDriving() {
    screen.innerHTML = `<div class="program-screen"><button class="btn ghost program-back" id="programBack">← Zpět</button>
      <div class="eyebrow">ŘIDIČÁKY</div><h2 class="page-title">Vyberte skupinu</h2>
      <p class="sub">Řidičské otázky budou doplněny později.</p>
      <div class="program-grid">
        ${[['B','Auto'],['C','Kamion'],['T','Traktor']].map(([code,label])=>`<article class="program-card"><span class="program-icon">▰</span><h3>Řidičák ${code} (${label})</h3><p>Tato část se připravuje.</p><span class="program-tag">JIŽ BRZY</span></article>`).join('')}
      </div><div class="notice program-note">Řidičské otázky zatím nejsou v aplikaci. Až budou připravené, půjde každou skupinu doplnit samostatně.</div>
      </div>`;
    document.getElementById('programBack').onclick = drawRoot;
  }

  function enterTrainer(program) {
    activeProgram = program;
    document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
    document.querySelectorAll('.nav button').forEach(button => button.classList.remove('active'));
    document.getElementById('page-overview').classList.add('active');
    document.getElementById('crumb').textContent = `Svářečák / ${program}`;
    const overview = document.getElementById('page-overview');
    let strip = document.getElementById('programScopeStrip');
    if (!strip) {
      strip = document.createElement('div');
      strip.id = 'programScopeStrip';
      overview.prepend(strip);
    }
    strip.className = 'scope-strip';
    strip.innerHTML = `<span>Aktivní příprava: <b>Svářečák · ${program === 'MMA' ? 'MMA (Elektroda)' : 'MAG (CO₂)'}</b>${program === 'MAG' ? ' · zatím společné bezpečnostní otázky pro metodu 135' : ''}</span><span class="scope-actions"><button type="button" id="changeMethod">Změnit metodu</button></span>`;
    document.getElementById('changeMethod').onclick = goToWeldingMethods;
    const overviewHeader = overview.querySelector('.header-row');
    if (overviewHeader && !overviewHeader.querySelector('.overview-actions')) {
      const newTestButton = overviewHeader.querySelector(':scope > button');
      if (newTestButton) {
        const actions = document.createElement('div');
        actions.className = 'overview-actions';
        const backButton = document.createElement('button');
        backButton.type = 'button';
        backButton.className = 'btn';
        backButton.textContent = '← Zpět na výběr kategorií';
        backButton.onclick = goToProgramPicker;
        newTestButton.replaceWith(actions);
        actions.append(backButton, newTestButton);
      }
    }
    document.getElementById('menuToggle').setAttribute('aria-expanded','false');
    overview.querySelector('#pendingMagNotice')?.remove();
    render();
    if (program === 'MAG') {
      const pendingCount = allQuestions().filter(q => (q.process || q.method || '').toUpperCase() === 'MAG' && !Number.isInteger(q.correctAnswer)).length;
      if (pendingCount) {
        const notice = document.createElement('div');
        notice.id = 'pendingMagNotice';
        notice.className = 'notice';
        notice.textContent = `${pendingCount} technologických otázek MAG je uloženo, ale čeká na správné odpovědi. Do testů a procvičování se zatím nezařazují.`;
        overview.insertBefore(notice, overview.children[1]);
      }
    }
  }

  // Keep the existing training engine and limit its question pool to the chosen method.
  const originalStartSession = window.startSession;
  window.startSession = function(type) {
    const originalQuestions = data.questions;
    data.questions = scopedQuestions();
    try { return originalStartSession(type); }
    finally { data.questions = originalQuestions; }
  };

  const originalValidateQuestions = window.validateQuestions;
  window.validateQuestions = function(items) {
    if (!Array.isArray(items)) return originalValidateQuestions(items);
    const normalized = items.map(item => item?.correctAnswer === null ? { ...item, correctAnswer: 0 } : item);
    return originalValidateQuestions(normalized).map((question, index) => ({
      ...question,
      correctAnswer: items[index].correctAnswer === null ? null : question.correctAnswer,
      process: items[index].process || items[index].method || undefined,
      status: items[index].status || undefined
    }));
  };

  // Keep category selectors in sync with the selected method after each normal render.
  const originalRender = window.render;
  window.render = function() {
    const result = originalRender();
    if (activeProgram) {
      const allowed = scopedQuestions();
      for (const id of ['examCategory','practiceCategory']) {
        const select = document.getElementById(id);
        if (!select) continue;
        const oldValue = select.value;
        const categories = [...new Set(allowed.map(q => q.category || 'Ostatní'))];
        const options = ['<option value="all">Všechny otázky</option>'];
        for (const category of categories) {
          options.push(`<option value="cat::${escapeHtml(category)}">${escapeHtml(category)} (všechny varianty)</option>`);
          const variants = [...new Map(allowed.filter(q => q.category === category && q.variation !== undefined).map(q => [q.variation, q.sectionTitle || `${category} /${q.variation}/`])).entries()].sort((a,b) => a[0]-b[0]);
          for (const [number,title] of variants) options.push(`<option value="var::${escapeHtml(category)}::${number}">${escapeHtml(category)} /${number}/ · ${escapeHtml(title)}</option>`);
        }
        select.innerHTML = options.join('');
        if ([...select.options].some(option => option.value === oldValue)) select.value = oldValue;
      }
    }
    return result;
  };

  const originalRenderTables = window.renderTables;
  let questionTablePage = 0;
  const questionTablePageSize = 25;
  window.renderTables = function() {
    const questions = allQuestions();
    const pageCount = Math.max(1, Math.ceil(questions.length / questionTablePageSize));
    questionTablePage = Math.max(0, Math.min(questionTablePage, pageCount - 1));
    const savedQuestions = data.questions;
    data.questions = questions.slice(questionTablePage * questionTablePageSize, (questionTablePage + 1) * questionTablePageSize);
    let result;
    try { result = originalRenderTables(); }
    finally { data.questions = savedQuestions; }
    const page = document.getElementById('page-database');
    if (!page) return result;
    const table = document.getElementById('questionTable');
    let pager = document.getElementById('questionTablePager');
    if (!pager && table) {
      pager = document.createElement('nav');
      pager.id = 'questionTablePager';
      pager.className = 'question-pager';
      pager.setAttribute('aria-label', 'Stránkování databáze otázek');
      table.insertAdjacentElement('afterend', pager);
    }
    if (pager) {
      const first = questions.length ? questionTablePage * questionTablePageSize + 1 : 0;
      const last = Math.min((questionTablePage + 1) * questionTablePageSize, questions.length);
      pager.innerHTML = `<span class="question-pager-label">Zobrazeno ${first}–${last} z ${questions.length} otázek · Strana ${questionTablePage + 1} z ${pageCount}</span><span class="question-pager-controls"><button type="button" class="btn" id="questionPagePrevious" ${questionTablePage === 0 ? 'disabled' : ''}>← Předchozí</button><button type="button" class="btn" id="questionPageNext" ${questionTablePage >= pageCount - 1 ? 'disabled' : ''}>Další →</button></span>`;
      document.getElementById('questionPagePrevious').onclick = () => { questionTablePage--; window.renderTables(); };
      document.getElementById('questionPageNext').onclick = () => { questionTablePage++; window.renderTables(); };
    }
    let panel = document.getElementById('magPendingQuestions');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'magPendingQuestions';
      panel.className = 'card';
      panel.style.marginTop = '16px';
      page.append(panel);
    }
    const pending = allQuestions().filter(q => (q.process || q.method || '').toUpperCase() === 'MAG' && !Number.isInteger(q.correctAnswer));
    panel.innerHTML = pending.length ? `<div class="card-head"><div class="card-title">MAG · otázky čekající na klíč</div><span class="badge warn">${pending.length} bez klíče</span></div><p class="sub" style="font-size:12px">Otázky si zde můžeš prohlédnout. Dokud nebudou doplněné správné odpovědi, nezařazují se do testů ani procvičování.</p><div class="pending-mag-list">${pending.map(q => `<details class="pending-mag-item"><summary>${q.number}. ${escapeHtml(q.question)}</summary>${(q.images||[]).map(src => `<img class="question-media" src="${escapeHtml(src)}" alt="Obrázek otázky" onclick="showImage('${escapeHtml(src)}')" onerror="this.remove()">`).join('')}<ol class="pending-options" type="A">${q.answers.map(answer => `<li>${escapeHtml(answer)}</li>`).join('')}</ol></details>`).join('')}</div>` : '';
    return result;
  };

  const originalShowPage = window.showPage;
  window.showPage = function(name) {
    if (!activeProgram) {
      drawRoot();
      return;
    }
    const result = originalShowPage(name);
    const pageNames = {overview:'Přehled',exam:'Spustit test',practice:'Procvičování',database:'Databáze otázek',statistics:'Statistiky',settings:'Nastavení',session:'Průběh testu',results:'Výsledky'};
    document.getElementById('crumb').textContent = `${activeProgram} · ${pageNames[name] || 'Příprava'}`;
    return result;
  };

  // Start with the area chooser rather than dropping directly into the welding dashboard.
  goToProgramPicker();
})();
