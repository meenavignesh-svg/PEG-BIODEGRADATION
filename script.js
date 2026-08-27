(function () {
  "use strict";

  var cards = Array.prototype.slice.call(document.querySelectorAll(".card"));
  var links = Array.prototype.slice.call(document.querySelectorAll(".link"));
  var stage = document.getElementById("stage");
  var statusEl = document.getElementById("status");
  var statusText = statusEl ? statusEl.querySelector(".status-text") : null;
  var stepNum = document.getElementById("stepNum");
  var msg = document.getElementById("msg");
  var bar = document.getElementById("bar");
  var railFill = document.getElementById("railFill");
  var runBtn = document.getElementById("run");
  var resetBtn = document.getElementById("reset");

  if (!cards.length || !stage || !runBtn || !resetBtn) return;

  var TOTAL = cards.length;
  var messages = [
    "PEG wastewater enters the process.",
    "Waste reaches the biochar-hydrogel bed.",
    "Bacterial team is active.",
    "Long chains are broken into shorter pieces.",
    "End of the path: treated water."
  ];
  var statusWords = ["Feed", "Matrix", "Biology", "Breakdown", "Output"];

  var timer = null;
  var index = -1;
  var running = false;

  function setStatus(state, text) {
    if (statusEl) statusEl.setAttribute("data-state", state || "idle");
    if (statusText) statusText.textContent = text || "Ready";
  }

  function setProgress(pct) {
    var p = Math.max(0, Math.min(100, pct)) + "%";
    if (bar) bar.style.width = p;
    if (railFill) railFill.style.width = p;
  }

  function clearAll() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    running = false;
    index = -1;

    cards.forEach(function (c) {
      c.classList.remove("is-active", "is-done");
    });
    links.forEach(function (l) {
      l.classList.remove("is-on");
    });
    stage.classList.remove("is-running");

    setProgress(0);
    if (stepNum) stepNum.textContent = "0";
    if (msg) msg.textContent = "Press Run to play the steps.";
    runBtn.textContent = "Run";
    runBtn.classList.remove("is-busy");
    runBtn.disabled = false;
    setStatus("idle", "Ready");
  }

  function showStep(i) {
    cards.forEach(function (c, n) {
      c.classList.toggle("is-active", n === i);
      c.classList.toggle("is-done", n < i);
    });
    links.forEach(function (l, n) {
      l.classList.toggle("is-on", n < i);
    });

    var pct = ((i + 1) / TOTAL) * 100;
    setProgress(pct);
    if (stepNum) stepNum.textContent = String(i + 1);
    if (msg) msg.textContent = messages[i] || "";
    setStatus("run", statusWords[i] || "Run");
  }

  function finish() {
    running = false;
    cards.forEach(function (c) {
      c.classList.remove("is-active");
      c.classList.add("is-done");
    });
    links.forEach(function (l) {
      l.classList.add("is-on");
    });
    stage.classList.remove("is-running");
    setProgress(100);
    if (stepNum) stepNum.textContent = String(TOTAL);
    if (msg) msg.textContent = "All steps shown. Press Run to watch again.";
    runBtn.textContent = "Run again";
    runBtn.classList.remove("is-busy");
    runBtn.disabled = false;
    setStatus("done", "Done");
  }

  function tick() {
    index += 1;
    if (index >= TOTAL) {
      finish();
      return;
    }
    showStep(index);
    timer = setTimeout(tick, 1650);
  }

  function start() {
    if (running) return;
    clearAll();
    running = true;
    stage.classList.add("is-running");
    runBtn.textContent = "Running…";
    runBtn.classList.add("is-busy");
    runBtn.disabled = true;
    setStatus("run", "Starting");
    if (msg) msg.textContent = "Starting…";
    timer = setTimeout(tick, 280);
  }

  runBtn.addEventListener("click", function () {
    if (!running) start();
  });

  resetBtn.addEventListener("click", function () {
    clearAll();
  });

  cards.forEach(function (card, i) {
    card.addEventListener("click", function () {
      if (running) return;
      clearAll();
      index = i;
      showStep(i);
      setStatus("idle", "Step");
    });
  });

  clearAll();
})();
