(function () {
  'use strict';

  const listEl = document.getElementById('scenario-list');
  if (!listEl || typeof SCENARIOS === 'undefined') return;

  listEl.innerHTML = SCENARIOS.map(
    (scenario) => `
      <li class="scenario-card">
        <a class="scenario-link" href="${scenario.path}">
          <h2 class="scenario-title">${scenario.title}</h2>
          <p class="scenario-hook">${scenario.hook}</p>
          <p class="scenario-meta">${scenario.genre} / インタラクティブ小説 ${scenario.version} · エンディング ${scenario.endings}種</p>
        </a>
      </li>`
  ).join('');
})();
