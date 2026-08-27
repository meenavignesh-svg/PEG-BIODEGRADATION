/* =========================================================
   BioHub – SIH 2026 Simulation Engine
   ========================================================= */

(() => {
  const nodes = [...document.querySelectorAll('.node')];
  const connectors = [...document.querySelectorAll('.connector')];
  const bar = document.getElementById('progressBar');
  const stageText = document.getElementById('stageText');
  const stageNum = document.getElementById('stageNum');
  const systemStatus = document.getElementById('systemStatus');
  const playBtn = document.getElementById('play');
  const resetBtn = document.getElementById('reset');
  const diagram = document.getElementById('diagram');

  const labels = [
    'Polymer feed enters the treatment train — PEG-rich waste stream is introduced.',
    'Waste contacts the biochar–hydrogel immobilization platform — high surface area support matrix.',
    'Microbial consortium activates — I. sakaiensis, P. putida and B. subtilis coordinate roles.',
    'Depolymerization & conversion underway — polymer chains break into intermediates and metabolites.',
    'Treated stream reaches conceptual mineralization endpoint — process cycle complete.'
  ];

  const statusLabels = [
    'FEED ACTIVE',
    'MATRIX ONLINE',
    'BIOLOGY ENGAGED',
    'CONVERTING',
    'OUTPUT READY'
  ];

  let timer = null;
  let index = -1;
  let running = false;

  function setStatus(mode, text) {
    systemStatus.classList.remove('running', 'complete');
    if (mode) systemStatus.classList.add(mode);
    systemStatus.querySelector('span').textContent = text;
  }

  function clearSimulation() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    running = false;
    index = -1;

    nodes.forEach(n => n.classList.remove('active', 'completed'));
    connectors.forEach(c => c.classList.remove('active'));
    diagram.classList.remove('simulating');

    bar.style.width = '0%';
    stageNum.textContent = '0';
    stageText.textContent = 'Ready — press Run Simulation to begin the conceptual process flow.';
    playBtn.innerHTML = '<span class="btn-icon">▶</span> Run Simulation';
    playBtn.classList.remove('running');
    setStatus(null, 'SYSTEM READY');
  }

  function activateStep(i) {
    // Mark previous as completed
    nodes.forEach((n, idx) => {
      n.classList.remove('active');
      if (idx < i) n.classList.add('completed');
      else n.classList.remove('completed');
    });

    // Activate current node
    nodes[i].classList.add('active');

    // Highlight connectors up to current
    connectors.forEach((c, idx) => {
      c.classList.toggle('active', idx < i);
    });

    // Progress & text
    const pct = ((i + 1) / nodes.length) * 100;
    bar.style.width = `${pct}%`;
    stageNum.textContent = String(i + 1);
    stageText.textContent = labels[i];
    setStatus('running', statusLabels[i]);
  }

  function step() {
    index++;

    if (index >= nodes.length) {
      // Finished
      running = false;
      nodes.forEach(n => {
        n.classList.remove('active');
        n.classList.add('completed');
      });
      connectors.forEach(c => c.classList.add('active'));
      bar.style.width = '100%';
      stageNum.textContent = '5';
      stageText.textContent = 'Simulation complete. Conceptual mineralization endpoint reached. Press Run Again to replay.';
      playBtn.innerHTML = '<span class="btn-icon">▶</span> Run Again';
      playBtn.classList.remove('running');
      setStatus('complete', 'CYCLE COMPLETE');
      diagram.classList.remove('simulating');
      return;
    }

    activateStep(index);
    timer = setTimeout(step, 1750);
  }

  function start() {
    if (running) return;
    clearSimulation();
    running = true;
    diagram.classList.add('simulating');
    playBtn.innerHTML = '<span class="btn-icon">Ⅱ</span> Running…';
    playBtn.classList.add('running');
    setStatus('running', 'INITIALIZING');
    stageText.textContent = 'Initializing process train…';

    // Small delay before first step for polish
    timer = setTimeout(step, 400);
  }

  // Event listeners
  playBtn.addEventListener('click', () => {
    if (running) return;
    start();
  });

  resetBtn.addEventListener('click', clearSimulation);

  // Optional: click a node to jump (only when not running)
  nodes.forEach((node, i) => {
    node.addEventListener('click', () => {
      if (running) return;
      clearSimulation();
      // Show single stage highlight
      index = i;
      activateStep(i);
      stageText.textContent = labels[i] + ' (manual focus)';
      setStatus(null, 'MANUAL FOCUS');
    });
  });

  // Init
  clearSimulation();
})();
