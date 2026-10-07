(() => {
  'use strict';

  const sections = {
    overview: {
      label: 'GLOBAL', breadcrumb: 'VISÃO GLOBAL', number: '01', kicker: 'CAMADA PRINCIPAL', title: 'O mundo, em perspectiva.',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae justo nec arcu feugiat tristique. Aenean at sapien sed erat consequat ultricies, et posuere metus viverra.',
      overline: 'REGISTRO CARTOGRÁFICO', dataTitle: 'Perspectiva<br>em movimento',
      dataDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Descubra o que muda quando mudamos o ponto de vista.', footer: 'VISUALIZAÇÃO GLOBAL', chip: 'CAMADA ATIVA', link: 'Explorar esta camada'
    },
    terrain: {
      label: 'TERRITÓRIOS', breadcrumb: 'TERRITÓRIOS', number: '02', kicker: 'FORMAS DA TERRA', title: 'Cada fronteira, uma história.',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Uma paisagem que se transforma a cada escala.',
      overline: 'CADERNO DE TERRITÓRIOS', dataTitle: 'Relevo &<br>fronteiras',
      dataDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Explore formas, limites e conexões entre lugares.', footer: 'CAMADA DE TERRITÓRIOS', chip: 'RELEVO ATIVO', link: 'Explorar territórios'
    },
    routes: {
      label: 'CONEXÕES', breadcrumb: 'CONEXÕES', number: '03', kicker: 'LINHAS DE ENCONTRO', title: 'Tudo está mais perto.',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Veja o planeta em movimento.',
      overline: 'CADERNO DE ROTAS', dataTitle: 'Caminhos<br>que convergem',
      dataDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Siga as linhas que ligam pontos distantes.', footer: 'CAMADA DE CONEXÕES', chip: 'ROTAS ATIVAS', link: 'Explorar conexões'
    },
    signals: {
      label: 'SINAIS', breadcrumb: 'SINAIS', number: '04', kicker: 'PONTOS DE INTERESSE', title: 'Encontre o que importa.',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      overline: 'CADERNO DE OBSERVAÇÃO', dataTitle: 'Sinais em<br>evidência',
      dataDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Uma coleção de pontos para olhar mais de perto.', footer: 'CAMADA DE SINAIS', chip: 'OBSERVAÇÃO ATIVA', link: 'Explorar os sinais'
    }
  };

  const root = document.documentElement;
  const body = document.body;
  const navButtons = [...document.querySelectorAll('.nav-item[data-style]')];
  const themeButton = document.getElementById('theme-toggle');
  const map = document.getElementById('world-map');
  const mapStage = document.getElementById('map-stage');
  const content = document.getElementById('section-copy');
  const dataCard = document.querySelector('.data-card');
  let transitionTimer;
  let currentStyle = 'overview';

  const setText = (id, value) => { document.getElementById(id).textContent = value; };

  function switchStyle(style, { focus = false } = {}) {
    if (!sections[style] || style === currentStyle) return;
    currentStyle = style;
    const section = sections[style];
    const activeButton = navButtons.find((button) => button.dataset.style === style);

    navButtons.forEach((button) => {
      const active = button === activeButton;
      button.classList.toggle('is-active', active);
      if (active) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    if (focus && activeButton) activeButton.focus();

    body.dataset.mapStyle = style;
    content.classList.add('is-changing');
    dataCard.classList.add('is-changing');
    body.classList.add('is-transitioning');
    window.clearTimeout(transitionTimer);
    transitionTimer = window.setTimeout(() => {
      setText('breadcrumb-current', section.breadcrumb);
      setText('map-style-label', section.label);
      setText('section-number', section.number);
      setText('section-kicker-text', section.kicker);
      setText('section-title', section.title);
      setText('section-description', section.description);
      setText('section-heading-index', `[ ${section.number} — 04 ]`);
      setText('note-number', section.number);
      setText('data-overline', section.overline);
      document.getElementById('data-title').innerHTML = section.dataTitle;
      setText('data-description', section.dataDescription);
      setText('map-footer-caption', section.footer);
      setText('data-chip-label', section.chip);
      setText('explore-label', section.link);
      content.classList.remove('is-changing');
      dataCard.classList.remove('is-changing');
      transitionTimer = window.setTimeout(() => body.classList.remove('is-transitioning'), 610);
    }, 130);
    mapStage.setAttribute('aria-label', `Mapa-múndi estilizado: camada ${section.label.toLowerCase()}`);
  }

  navButtons.forEach((button, index) => {
    button.addEventListener('click', () => switchStyle(button.dataset.style));
    button.addEventListener('keydown', (event) => {
      const direction = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : event.key === 'ArrowUp' || event.key === 'ArrowLeft' ? -1 : 0;
      if (!direction) return;
      event.preventDefault();
      const nextIndex = (index + direction + navButtons.length) % navButtons.length;
      switchStyle(navButtons[nextIndex].dataset.style, { focus: true });
    });
  });

  function applyTheme(theme, persist = true) {
    const light = theme === 'light';
    root.dataset.theme = light ? 'light' : 'dark';
    themeButton.setAttribute('aria-pressed', String(light));
    themeButton.setAttribute('aria-label', light ? 'Ativar modo escuro' : 'Ativar modo claro');
    themeButton.querySelector('.theme-label').textContent = light ? 'Modo escuro' : 'Modo claro';
    document.querySelector('meta[name="theme-color"]').setAttribute('content', light ? '#eff4f3' : '#071521');
    if (persist) {
      try { localStorage.setItem('atlas-orbit-theme', light ? 'light' : 'dark'); } catch (_) { /* storage opcional */ }
    }
  }

  let initialTheme = 'dark';
  try {
    const savedTheme = localStorage.getItem('atlas-orbit-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') initialTheme = savedTheme;
  } catch (_) { /* storage opcional */ }
  applyTheme(initialTheme, false);
  themeButton.addEventListener('click', () => applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

  // O SVG editável evita imagem quebrada em abertura local e quando o asset remoto não está disponível.
  function useFallbackMap() {
    const fallbackUrl = new URL(map.dataset.fallback, document.baseURI).href;
    if (map.currentSrc !== fallbackUrl) map.src = fallbackUrl;
  }
  map.addEventListener('error', useFallbackMap, { once: true });
  if (window.location.protocol === 'file:' || (map.complete && map.naturalWidth === 0)) useFallbackMap();

  document.getElementById('explore-link').addEventListener('click', (event) => {
    event.preventDefault();
    document.getElementById('section-description').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
})();
