(function () {
  'use strict';

  const config = window.GAME_CONFIG;
  if (!config) {
    console.error('GAME_CONFIG が設定されていません');
    return;
  }

  const STORAGE_KEY = config.storageKey;

  const els = {
    titleScreen: document.getElementById('title-screen'),
    gameScreen: document.getElementById('game-screen'),
    sceneSetting: document.getElementById('scene-setting'),
    sceneBody: document.getElementById('scene-body'),
    choicesPanel: document.getElementById('choices-panel'),
    questionText: document.getElementById('question-text'),
    choicesList: document.getElementById('choices-list'),
    endingPanel: document.getElementById('ending-panel'),
    endingBadge: document.getElementById('ending-badge'),
    endingTitle: document.getElementById('ending-title'),
    endingCatch: document.getElementById('ending-catch'),
    endingAfterword: document.getElementById('ending-afterword'),
    progressBar: document.getElementById('progress-bar'),
    sceneIdLabel: document.getElementById('scene-id-label'),
    sceneChapter: document.getElementById('scene-chapter'),
    btnStart: document.getElementById('btn-start'),
    btnRestart: document.getElementById('btn-restart'),
    btnTitle: document.getElementById('btn-title'),
    endingsGallery: document.getElementById('endings-gallery'),
    playCountLabel: document.getElementById('play-count-label'),
  };

  let save = loadSave();
  let state = null;

  function defaultSave() {
    return {
      playCount: 0,
      unlockedEndings: [],
    };
  }

  function loadSave() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultSave();
      return { ...defaultSave(), ...JSON.parse(raw) };
    } catch {
      return defaultSave();
    }
  }

  function persistSave() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
  }

  function createGameState() {
    return {
      sceneId: config.startScene,
      flags: {},
      history: [],
    };
  }

  function getScene(id) {
    return SCENES[id] || null;
  }

  function resolveBody(scene, gameState) {
    const body = scene.body;
    if (typeof body === 'function') return body(gameState);
    return body || '';
  }

  function formatText(text) {
    const escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return escaped
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .split('\n\n')
      .map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`)
      .join('');
  }

  function choiceVisible(choice, gameState) {
    if (choice.hidden) {
      if (choice.requireSecondPlay && save.playCount < 1) return false;
      if (choice.requireFlag && !gameState.flags[choice.requireFlag]) return false;
    }
    if (choice.requireFlag && !choice.hidden && !gameState.flags[choice.requireFlag]) {
      return false;
    }
    return true;
  }

  function isEnding(id) {
    return id.startsWith('E');
  }

  function updateProgress() {
    const depth = state.history.length;
    const maxDepth = 6;
    const pct = Math.min(100, Math.round((depth / maxDepth) * 100));
    els.progressBar.style.width = `${pct}%`;
  }

  function renderEndingsGallery() {
    const all = config.endingIds;
    els.endingsGallery.innerHTML = all
      .map((id) => {
        const scene = SCENES[id];
        const unlocked = save.unlockedEndings.includes(id);
        const type = scene.ending.type;
        const meta = ENDING_META[type];
        return `<li class="gallery-item ${unlocked ? 'unlocked' : 'locked'} ${meta.className}">
          <span class="gallery-type">${unlocked ? meta.label : '???'}</span>
          <span class="gallery-title">${unlocked ? scene.ending.title : '未発見'}</span>
        </li>`;
      })
      .join('');
    els.playCountLabel.textContent =
      save.playCount > 0 ? `${save.playCount}周目クリア済み` : '初回プレイ';
  }

  function showTitle() {
    els.titleScreen.hidden = false;
    els.gameScreen.hidden = true;
    renderEndingsGallery();
  }

  function showGame() {
    els.titleScreen.hidden = true;
    els.gameScreen.hidden = false;
  }

  function renderScene() {
    const scene = getScene(state.sceneId);
    if (!scene) return;

    els.sceneIdLabel.textContent = scene.id;
    if (els.sceneChapter) {
      els.sceneChapter.textContent = scene.chapter || '';
      els.sceneChapter.hidden = !scene.chapter;
    }
    els.sceneSetting.textContent = scene.setting || '';
    els.sceneSetting.hidden = !scene.setting;

    if (scene.onEnter) scene.onEnter(state);

    const bodyHtml = formatText(resolveBody(scene, state));
    els.sceneBody.innerHTML = bodyHtml;

    els.choicesPanel.hidden = true;
    els.endingPanel.hidden = true;

    updateProgress();

    if (scene.ending) {
      renderEnding(scene);
      unlockEnding(scene.id);
      return;
    }

    if (scene.continueTo) {
      renderContinue(scene);
      return;
    }

    renderChoices(scene);
  }

  function renderContinue(scene) {
    els.choicesPanel.hidden = false;
    els.questionText.hidden = true;
    els.choicesList.innerHTML = '';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'choice-btn choice-continue';
    btn.textContent = scene.continueLabel || '続ける';
    btn.addEventListener('click', () => goTo(scene.continueTo));
    els.choicesList.appendChild(btn);
  }

  function renderChoices(scene) {
    const visible = (scene.choices || []).filter((c) => choiceVisible(c, state));

    els.choicesPanel.hidden = false;
    els.questionText.hidden = !scene.questionText;
    if (scene.questionText) {
      els.questionText.textContent = scene.questionText;
    }
    els.choicesList.innerHTML = '';

    visible.forEach((choice) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'choice-btn';
      if (choice.hidden) btn.classList.add('choice-hidden');
      btn.textContent = choice.text;
      btn.addEventListener('click', () => selectChoice(choice));
      els.choicesList.appendChild(btn);
    });
  }

  function renderEnding(scene) {
    const { ending } = scene;
    const meta = ENDING_META[ending.type];

    els.endingPanel.hidden = false;
    els.endingBadge.textContent = meta.label;
    els.endingBadge.className = `ending-badge ${meta.className}`;
    els.endingTitle.textContent = ending.title;
    els.endingCatch.textContent = ending.catchphrase;
    els.endingAfterword.textContent = ending.afterword;

    els.choicesPanel.hidden = false;
    els.questionText.hidden = true;
    els.choicesList.innerHTML = '';

    const restart = document.createElement('button');
    restart.type = 'button';
    restart.className = 'choice-btn choice-primary';
    restart.textContent = 'もう一度プレイ';
    restart.addEventListener('click', startGame);

    const title = document.createElement('button');
    title.type = 'button';
    title.className = 'choice-btn';
    title.textContent = 'タイトルへ';
    title.addEventListener('click', showTitle);

    els.choicesList.append(restart, title);
  }

  function unlockEnding(id) {
    let changed = false;
    if (!save.unlockedEndings.includes(id)) {
      save.unlockedEndings.push(id);
      changed = true;
    }
    if (!state.completed) {
      save.playCount += 1;
      state.completed = true;
      changed = true;
    }
    if (changed) persistSave();
  }

  function selectChoice(choice) {
    if (choice.flags) {
      Object.assign(state.flags, choice.flags);
    }
    goTo(choice.next);
  }

  function goTo(nextId) {
    state.history.push(state.sceneId);
    state.sceneId = nextId;
    renderScene();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function startGame() {
    state = createGameState();
    showGame();
    renderScene();
  }

  els.btnStart.addEventListener('click', startGame);
  els.btnRestart.addEventListener('click', startGame);
  els.btnTitle.addEventListener('click', showTitle);

  renderEndingsGallery();
})();
