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
    'Polymer feed enters — PEG-rich waste is introduced into the train.',
    'Waste meets the biochar–hydrogel matrix — cells sit on a porous support.',
    'Consortium at work — three roles share chain attack, intermediate use, and biofilm support.',
    'Chains break down — long polymer → shorter pieces → metabolites.',
    'Treated stream — conceptual end of the mineralization path.'
  ];

  const statusLabels = [
    'Feed',
    'Matrix',
    'Biology',
    'Converting',
    'Output'
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
    stageText.textContent = 'Press Run to walk through the five steps one by one.';
    playBtn.textContent = 'Run process';
    playBtn.classList.remove('running');
    setStatus(null, 'Ready');
  }

  function activateStep(i) {
    nodes.forEach((n, idx) => {
      n.classList.remove('active');
      if (idx < i) n.classList.add('completed');
      else n.classList.remove('completed');
    });

    nodes[i].classList.add('active');

    connectors.forEach((c, idx) => {
      c.classList.toggle('active', idx < i);
    });

    bar.style.width = `${((i + 1) / nodes.length) * 100}%`;
    stageNum.textContent = String(i + 1);
    stageText.textContent = labels[i];
    setStatus('running', statusLabels[i]);
  }

  function step() {
    index++;

    if (index >= nodes.length) {
      running = false;
      nodes.forEach(n => {
        n.classList.remove('active');
        n.classList.add('completed');
      });
      connectors.forEach(c => c.classList.add('active'));
      bar.style.width = '100%';
      stageNum.textContent = '5';
      stageText.textContent = 'Full path shown. Press Run again to repeat.';
      playBtn.textContent = 'Run again';
      playBtn.classList.remove('running');
      setStatus('complete', 'Done');
      diagram.classList.remove('simulating');
      return;
    }

    activateStep(index);
    timer = setTimeout(step, 1700);
  }

  function start() {
    if (running) return;
    clearSimulation();
    running = true;
    diagram.classList.add('simulating');
    playBtn.textContent = 'Running…';
    playBtn.classList.add('running');
    setStatus('running', 'Starting');
    stageText.textContent = 'Starting the five-step walkthrough…';
    timer = setTimeout(step, 350);
  }

  playBtn.addEventListener('click', () => {
    if (running) return;
    start();
  });

  resetBtn.addEventListener('click', clearSimulation);

  nodes.forEach((node, i) => {
    node.addEventListener('click', () => {
      if (running) return;
      clearSimulation();
      index = i;
      activateStep(i);
      stageText.textContent = labels[i] + ' (selected)';
      setStatus(null, 'Focus');
    });
  });

  clearSimulation();
})();
