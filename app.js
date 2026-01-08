document.addEventListener("DOMContentLoaded", () => {
  const APP_ID = 109310;
  //const TOKEN = "n04kyiO7gVSyQuA";
  // 🔧 Nom de la clé utilisée dans localStorage
  const STORAGE_KEY = "deriv_accounts";
  const WS_URL = `wss://ws.derivws.com/websockets/v3?app_id=${APP_ID}`;
  const WS_CONTROL = 'ws://localhost:8000/control';
  const WS_SIGNAL = 'ws://localhost:8000/signal';

  // UI
  const connectBtn = document.getElementById("connectBtn");
  const symbolList = document.getElementById("symbolList");
  const chartInner = document.getElementById("chartInner");
  const volGauge = document.getElementById("volGauge");
  const trendGauge = document.getElementById("trendGauge");
  const probGauge = document.getElementById("probGauge");
  const controlFormPanel = document.getElementById("controlFormPanel");
  const controlPanelToggle = document.getElementById("controlPanelToggle");
  const accountInfo = document.getElementById("accountInfo");
  const plGauge = document.getElementById("plGauge");
  const multiplierInput = document.getElementById("multiplierSelect");
  const buyBtn = document.getElementById("buyBtn");
  const sellBtn = document.getElementById("sellBtn");
  const stakeInput = document.getElementById("stakeInput");
  const takeProfitInput = document.getElementById("tpInput");
  const stopLossInput = document.getElementById("slInput");
  const closewinning = document.getElementById("closeWinning");
  const closelosing = document.getElementById("closeLosing");
  const closeAll = document.getElementById("closeAll");
  const buyNumber = document.getElementById("buyNumberInput");
  const sellNumber = document.getElementById("sellNumberInput");
  const contractsPanelToggle = document.getElementById("contractsPanelToggle");
  const contractsPanel = document.getElementById("contractsPanel");
  const autoHistoryList = document.getElementById("autoHistoryList");
  const tradeEvalToggle = document.getElementById("tradeEvalToggle");
  const tradeEvalPanel = document.getElementById("tradeEvalPanel");
  const circles = document.querySelectorAll(".circle-chart");
  const holdername = document.getElementById("accountHolder");
  const balanceValue = document.getElementById("balanceValue");
  const HistoricalContract = document.getElementById("HistoricalContract");
  const losscurrency = document.getElementById("losscurrency");
  const profitcurrency = document.getElementById("profitcurrency");
  const plcurrency = document.getElementById("plcurrency");
  const plvalue = document.getElementById("plvalue");
  const lossvalue = document.getElementById("lossvalue");
  const profitvalue = document.getElementById("profitvalue");
  const tokencalendar = document.getElementById("tokencalendar");
  const statusEl = document.getElementById('status');
  const modal = document.getElementById("chartTypeModal");
  const openModalBtn = document.getElementById("openPopup");
  const closeModalBtn = document.getElementById("closeModal");
  const historicalchartcontainer = document.getElementById("HistoricalgraphicalContract");
  const reverseBtn = document.getElementById("reverseBtn");

  const overlayML = document.getElementById("overlayML");
  const countdownEl = document.getElementById("countdown");

  const startbtn = document.getElementById("START");
  const stopbtn = document.getElementById("STOP");
  const tradeHistoryStatus = document.getElementById("tradeHistoryStatus__");
  const tradeHistoryDataRow = document.getElementById("tradeHistoryDataRow__");
  const tradeHistoryBody = document.getElementById("tradeHistoryBody__");

  const startml5 = document.getElementById("ML5BTN");

  // Éléments UI
  const openCashierBtn = document.getElementById("openCashierBtn");
  const closePopupBtn = document.getElementById("closeCashierBtn");
  const cashierModal = document.getElementById("cashierModal");
  const emailInput = document.getElementById("emailInput");
  const codeInput = document.getElementById("codeInput");
  const sendEmailBtn = document.getElementById("sendEmailBtn");
  const validateCodeBtn = document.getElementById("validateCodeBtn");
  const cashFrame = document.getElementById("cashierFrame");

  const overlaygemini = document.getElementById("indicatorOverlay");
  const openBtngpt = document.getElementById("openPopupBtn__");
  // Tableau des périodes actuellement affichées
  let maSeries = null;
  let maws = null;
  let priceData = [];
  let activePeriods = [];
  let isConnected = false; // Pour savoir si le WebSocket est déjà lancé
  let wszz = null;
  let zigzagSeries = null;
  let priceDataZZ = [];
  let zigzagCache = [];
  let zigzagMarkers = [];
  let isWsConnected = false;
  let isWsInitialized = false;
  let currentSessionId = 0;
  // ================== x ==================

  let wsReady = false;
  let wsControl = null;
  let wsSignal = null;
  let ControlSocket = null;
  let engineStarted = false;
  let totalPL = 0; // cumul des profits et pertes
  let ws = null;
  let wsTranscation = null;
  let authToken = null;
  let connection = null;
  let wsContracts_reverse = null;
  let ws_calendar = null;
  let wsContracts__close = null;
  let wsContracts_winning = null;
  let wsContracts_losing = null;
  let wsAutomation_close = null;
  let connection_ws = null;
  let connection_ws_htx = null;
  let wsAutomation = null;
  let wsContracts = null;
  let wsplContracts = null;
  let wsContracts__ = null;
  let wsOpenLines = null;
  let wsplgauge = null;
  let currentSeries = null;
  let emaSeries = null;
  let closes = [];
  let wspl = null;
  let connection__ = null;
  let chart = null;
  let charthistorical = null;
  let areaSeries = null;
  let areahistoricalSeries = null;
  let chartData = [];
  let lastPrices = {};
  let recentChanges = [];
  let Dispersion;
  let isConnect = false;
  let it = 0;
  let iu = 0;
  let ROC = [];
  let roc_;
  let TOKEN;
  let CURRENCY;
  let allEvents = [];
  let currentSort = { column: null, ascending: true };
  let displayedEvents = []; // Liste filtrée actuellement visible
  // Historique local des ticks
  let closePrice;
  let tickHistory4openpricelines = [];
  const priceLines4openlines = {}; // Stocke les lignes actives (clé = contract_id)
  let Tick_arr = [];
  // Historique de profits
  let profitHistory = [];
  const contractsData = {}; // stockage des contrats {id: {profits: [], infos: {…}}}
  let contractSymbol;
  let contracts = [];
  let wsAI = null;
  let contracttype__ = "";
  let contractid__;
  const MAX_HISTORY = 500; // max taille du buffer
  let proposal__ = [];
  let transactions__ = [];
  let structresponse = [];
  let datapercent = {};
  let response;
  let style_type = "ticks";
  let candlesData = [];
  let candlesCache = [];
  let cache = [];
  let type = "";
  //------
  let multiplier = 40;
  let stake = 1;
  let buyNum = 1;
  let sellNum = 1;
  let tp_contract = 0;
  let sl_contract = 0;

  // ======================= GLOBAL STATE =======================
  let activeSignal = null;     // "BUY" ou "SELL"
  let activeLine = null;       // PriceLine
  let timeoutUntil = 0;        // timestamp (ms)
  const SIGNAL_TIMEOUT = 20000; // 20s
  const historicalMarkers = []; // Stocke tous les markers historiques
  //------
  let currentChartType = "candlestick"; // par défaut
  let currentInterval = "1 minute";  // par défaut

  // --- NEW: current symbol & pending subscribe ---
  let currentSymbol = "cryBTCUSD"; // symbole par défaut
  let pendingSubscribe = null;
  let authorized = false;

  // previousMomentum is kept across ticks for derivative calc
  let previousMomentum = 0;
  let smoothEMA = null;
  //---- BC MODEL ////////////////////////
  let prices__ = [];
  let lastProb = null;
  let probsNew = [];
  let ProbTick = [];
  let candles__ = [];
  let candles = [];
  // --- Tableau de markers déjà ajoutés sur le chart ---
  const calendarMarkers = {}; // stocke les markers par rowId
  // ================================
  // VARIABLES GLOBALES 
  // ================================
  let economicMarkers = {};
  let economicEventLines = [];
  let overlayCtx = null;
  // ================================
  // VARIABLES GLOBALES NN ML5
  // ================================ 
  const SEQ = 20;
  let buffer = [];
  const RUPTURE_THRESHOLD = 0.85;
  let autorunningml5 = false;
  let ruptureModel = null;
  let wsml5 = null;

  const SYMBOLS = [
    { symbol: "BOOM300N", name: "Boom 300" },
    { symbol: "CRASH300N", name: "Crash 300" },
    { symbol: "BOOM500", name: "Boom 500" },
    { symbol: "CRASH500", name: "Crash 500" },
    { symbol: "BOOM600", name: "Boom 600" },
    { symbol: "CRASH600", name: "Crash 600" },
    { symbol: "frxAUDUSD", name: "AUDUSD" },
    { symbol: "frxNZDUSD", name: "NZDUSD" },
    { symbol: "cryBTCUSD", name: "BTCUSD" },
    { symbol: "frxXAUUSD", name: "XAUUSD" },
    { symbol: "frxEURUSD", name: "EURUSD" },
    { symbol: "frxGBPUSD", name: "GBPUSD" },
    { symbol: "frxUSDJPY", name: "USDJPY" },
    { symbol: "R_50", name: "VIX 50" },
    { symbol: "R_75", name: "VIX 75" }
  ];
  const fmt = n => Number(n).toFixed(2);
  const safe = v => (typeof v === "number" && !isNaN(v)) ? v : 0;

  // --- SYMBOLS ---
  function displaySymbols(currentInterval, currentChartType) {
    const symbolList = document.getElementById("symbolList");
    symbolList.innerHTML = "";

    SYMBOLS.forEach(s => {
      const el = document.createElement("div");
      el.className = "symbol-item";
      el.textContent = s.name;
      el.dataset.symbol = s.symbol;

      // On rend l'écouteur d'événement asynchrone pour gérer le reset
      el.addEventListener("click", async () => {

        // 1. Gestion visuelle de la sélection
        document.querySelectorAll("#symbolList .symbol-item")
          .forEach(item => item.classList.remove("selected"));
        el.classList.add("selected");

        if (!s.symbol) return;

        // 2. Appel de la fonction unifiée (remplace connect et subscribeSymbol)
        // loadSymbol gère en interne le await resetZZChartVariable()
        try {
          await loadSymbol(s.symbol, currentInterval, currentChartType);
          console.log(`Changement vers ${s.name} réussi.`);
        } catch (error) {
          console.error("Erreur lors du basculement de symbole:", error);
        }
      });

      symbolList.appendChild(el);
    });
  }

  // --- INIT CHART ---
  function initChart(currentChartType) {
    try { if (chart) chart.remove(); } catch (e) { }
    chartInner.innerHTML = "";

    chart = LightweightCharts.createChart(chartInner, {
      layout: {
        textColor: "#333",
        background: { type: "solid", color: "#fff" },
      },
      grid: { vertLines: { color: "#eee" }, horzLines: { color: "#eee" } },
      timeScale: { timeVisible: true, secondsVisible: true }
    });

    // === Type de graphique dynamique ===  
    if (currentChartType === "area") {
      currentSeries = chart.addAreaSeries({
        lineColor: "rgba(189, 6, 221, 1)",
        lineWidth: 3,
        topColor: "rgba(189, 6, 221, 0.35)",
        bottomColor: "rgba(189, 6, 221, 0.0)",
      });
    } else if (currentChartType === "candlestick") {
      currentSeries = chart.addCandlestickSeries({
        upColor: "#26a69a",
        borderUpColor: "#26a69a",
        wickUpColor: "#26a69a",
        downColor: "#ef5350",
        borderDownColor: "#ef5350",
        wickDownColor: "#ef5350",
      });
    } else if (currentChartType === "line") {
      currentSeries = chart.addLineSeries({
        color: "#2962FF",
        lineWidth: 2,
      });
    }

    chartData = [];
    recentChanges = [];
    lastPrices = {};

  }

  function styleType(currentChartType) {
    if (!currentChartType || currentChartType === null) return;

    if ((currentChartType === "candlestick" || currentChartType === "hollow" || currentChartType === "ohlc")) { style_type = "candles"; }
    else { style_type = "ticks"; }

    return style_type;
  }

  function Payloadforsubscription(currentSymbol, currentInterval, currentChartType) {
    if (!currentSymbol || currentSymbol === null) return;

    const payload4subscription = {
      ticks_history: currentSymbol,
      adjust_start_time: 1,
      style: styleType(currentChartType),
      granularity: convertTF(currentInterval),
      count: 750,
      subscribe: 1,
      end: "latest",
      start: 1
    }

    return payload4subscription;
  }

  function convertTF(currentInterval) {
    switch (currentInterval) {
      case "1 minute": return 60;
      case "2 minutes": return 120;
      case "3 minutes": return 180;
      case "5 minutes": return 300;
      case "10 minutes": return 600;
      case "15 minutes": return 900;
      case "30 minutes": return 1800;
      case "1 hour": return 3600;
      case "2 hours": return 7200;
      case "4 hours": return 14400;
      case "8 hours": return 2880;
      default: return 86400;
    }
  }

  // normalize une candle brute en { time, open, high, low, close } ou null
  function normalize(c) {
    if (!c) return null;
    const t = c.epoch || c.epoch_time || c.time;
    if (!t) return null;
    const timestamp = Number(t);
    return {
      time: Math.floor(timestamp / (timestamp > 1e12 ? 1000 : 1)),
      open: Number(c.open),
      high: Number(c.high),
      low: Number(c.low),
      close: Number(c.close)
    };
  }

  async function loadSymbol(symbol, interval, chartType) {
    // 1. Incrémenter la session pour invalider tout flux précédent
    currentSessionId++;
    const thisSessionId = currentSessionId;

    if (!symbol) return;

    // 2. Nettoyage complet (Sockets, Chart, Données, UI)
    // On attend que tout soit effacé proprement
    await resetZZChartVariable();

    currentSymbol = symbol;
    currentInterval = interval;
    currentChartType = chartType;

    // 3. Créer le nouveau graphique vierge
    initChart(chartType);

    console.log(`Chargement : ${symbol} | Style : ${chartType} | Session : ${thisSessionId}`);

    // 4. Initialisation de la connexion WebSocket
    ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      // Sécurité : vérifier si on est toujours sur la bonne session
      if (thisSessionId !== currentSessionId) return;

      console.log("Connexion établie.");
      ws.send(JSON.stringify({ authorize: TOKEN }));
    };

    ws.onmessage = ({ data }) => {
      // --- FILTRE ANTI-CLIGNOTEMENT ---
      if (thisSessionId !== currentSessionId) {
        if (ws) ws.close();
        return;
      }

      const msg = JSON.parse(data);

      if (data.msg_type === "authorize" && data.authorize) {
        // Préparation du message selon le type de graphique
        let payload;
        if (chartType === "candlestick") {
          payload = {
            ticks_history: symbol,
            adjust_start_time: 1,
            subscribe: 1,
            end: "latest",
            granularity: convertTF(currentInterval), // Assurez-vous de convertir votre intervalle en secondes
            style: styleType(currentChartType)
          };
        } else {
          payload = {
            ticks: symbol,
            subscribe: 1
          };
        }

        ws.send(JSON.stringify(payload));
      }

      // AILLUAGE VERS LES FONCTIONS DE TRAITEMENT
      if (chartType === "candlestick") {
        handleCandleData(msg); // Utilise la fonction OHLC
      } else {
        handleTickData(msg);   // Utilise la fonction Ticks
      }

      // --- MISE À JOUR INDICATEURS (ZIGZAG) ---
      // Si le bouton ZigZag est actif (isWsInitialized), on recalcule
      if (isWsInitialized && typeof refreshZigZag === "function") {
        refreshZigZag();
      }

      // Gestion du Ping
      if (msg.msg_type === "ping") {
        ws.send(JSON.stringify({ ping: 1 }));
      }

      Openpositionlines(currentSeries);
    };

    ws.onclose = () => {
      if (thisSessionId === currentSessionId) {
        console.log("Session terminée.");
      }
    };

    ws.onerror = (err) => {
      if (thisSessionId === currentSessionId) {
        console.error("Erreur WebSocket:", err);
      }
    };
  }

  function handleCandleData(msg) {
    if (!currentSeries) return;

    // A. Historique complet
    if (msg.msg_type === "candles" && Array.isArray(msg.candles)) {
      candles = msg.candles.map(c => ({
        time: Number(c.epoch),
        open: Number(c.open),
        high: Number(c.high),
        low: Number(c.low),
        close: Number(c.close),
      }));
      currentSeries.setData(candles);
      chart.timeScale().fitContent();
    }

    // B. Mise à jour en temps réel (OHLC)
    if (msg.msg_type === "ohlc" && msg.ohlc) {
      const o = msg.ohlc;
      const openTime = Number(o.open_time);
      const bar = {
        time: openTime,
        open: Number(o.open),
        high: Number(o.high),
        low: Number(o.low),
        close: Number(o.close),
      };

      if (candles.length > 0) {
        const last = candles[candles.length - 1];
        if (last.time !== openTime) {
          candles.push(bar); // Nouvelle bougie
        } else {
          candles[candles.length - 1] = bar; // Mise à jour bougie actuelle
        }
        currentSeries.update(bar);
      }
    }
  }

  function handleTickData(msg) {
    if (!currentSeries) return;

    // A. Historique des prix (Area/Line)
    if (msg.msg_type === "history" && msg.history) {
      const h = msg.history;
      priceData = h.times.map((t, i) => ({
        time: Number(t),
        value: Number(h.prices[i])
      }));
      currentSeries.setData(priceData);
      chart.timeScale().fitContent();
    }

    // B. Nouveau Tick en temps réel
    if (msg.msg_type === "tick" && msg.tick) {
      const t = msg.tick;
      const newTick = {
        time: Number(t.epoch),
        value: Number(t.quote)
      };

      priceData.push(newTick);
      currentSeries.update(newTick);
    }
  }

  function connectInit(symbol, currentInterval, currentChartType) {

    if (!symbol) return;

    if (currentChartType !== "candlestick") return;

    currentSymbol = symbol;
    initChart(currentChartType);
    console.log("Connexion...");

    if (ws === null) {
      ws = new WebSocket(WS_URL);
      ws.onopen = () => { ws.send(JSON.stringify({ authorize: TOKEN })); };
    }

    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
      ws.onopen = () => { ws.send(JSON.stringify({ authorize: TOKEN })); };
    }

    if (ws && (ws.readyState === WebSocket.CLOSED || ws.readyState === WebSocket.CLOSING)) {
      ws = new WebSocket(WS_URL);
      ws.onopen = () => { ws.send(JSON.stringify({ authorize: TOKEN })); };
    }

    ws.onclose = () => { setTimeout(connectInit, 500); };

    ws.onmessage = ({ data }) => {
      let msg = {};
      try { msg = JSON.parse(data); } catch (e) { return; }

      if (msg.msg_type === "authorize" && msg.authorize) {
        console.log("Connecté");
        ws.send(JSON.stringify(Payloadforsubscription(currentSymbol, currentInterval, currentChartType)));
      }

      // Historique initial ou mise à jour live   
      if (msg.msg_type === "candles" && msg.candles) {
        const bars = Array.isArray(msg.candles)
          ? msg.candles.map(normalize).filter(Boolean)
          : [normalize(msg.candles)].filter(Boolean);

        if (!bars.length) return;

        // première fois : setData pour l'historique
        if (cache.length === 0) {
          cache = bars;
          currentSeries.setData(cache);
          chart.timeScale().fitContent();
          console.log(`Historique prêt (${bars.length} bougies)`);
          return;
        }

        // ensuite : live bougie par bougie
        const bar = bars[bars.length - 1];
        const last = cache[cache.length - 1];
        if (last && last.time === bar.time) {
          cache[cache.length - 1] = bar;
          currentSeries.update(bar);
        } else {
          cache.push(bar);
          currentSeries.update(bar);
        }
      }

      if (data.msg_type === "ping") {
        ws.send(JSON.stringify({ ping: 1 }));
      }

      if (msg.msg_type === "error") {
        console.error("Erreur WS:", msg);
        console.log("Erreur réseau ou payload");
      }

    };

    ws.onerror = (e) => {
      console.error("WS Error:", e);
      console.log("Erreur WebSocket");
    };
  }

  // --- CONNECT DERIV ---
  function connectDeriv() {

    if (wspl === null) {
      wspl = new WebSocket(WS_URL);
      wspl.onopen = () => { wspl.send(JSON.stringify({ authorize: TOKEN })); };
    }

    if (wspl && (wspl.readyState === WebSocket.OPEN || wspl.readyState === WebSocket.CONNECTING)) {
      wspl.onopen = () => { wspl.send(JSON.stringify({ authorize: TOKEN })); };
    }

    if (wspl && (wspl.readyState === WebSocket.CLOSED || wspl.readyState === WebSocket.CLOSING)) {
      wspl = new WebSocket(WS_URL);
      wspl.onopen = () => { wspl.send(JSON.stringify({ authorize: TOKEN })); };
    }

    wspl.onmessage = (evt) => {
      const data = JSON.parse(evt.data);
      // authorize response
      if (data.msg_type === "authorize" && data.authorize) {
        authorized = true;
        const acc = data.authorize.loginid;
        const bal = data.authorize.balance;
        const currency = data.authorize.currency || "";
        connectBtn.textContent = "Disconnect";
        accountInfo.textContent = `Account: ${acc} | ${Number(bal).toFixed(2)} ${currency}`;

        // subscribe balance updates
        wspl.send(JSON.stringify({ balance: 1, subscribe: 1 }));
        // if there was a pending subscribe requested earlier, do it now   
        if (pendingSubscribe) {
          // small delay to ensure WS state consistent
          setTimeout(() => {
            if (wspl && wspl.readyState === WebSocket.OPEN) {
              wspl.send(JSON.stringify({ forget_all: "ticks" }));
              wspl.send(JSON.stringify({ ticks: pendingSubscribe }));
              currentSymbol = pendingSubscribe;
              pendingSubscribe = null;
            }
          }, 300);
        }

        displaySymbols(currentInterval, currentChartType);
        return;
      }

      // balance update
      if (data.msg_type === "balance" && data.balance) {
        const b = data.balance;
        accountInfo.textContent = `Account: ${b.loginid} | ${Number(b.balance).toFixed(2)} ${b.currency}`;
        return;
      }

      // tick handling  
      if (data.msg_type === "tick" && data.tick) {
        handleTick(data.tick);
        return;
      }

      if (data.ping && data.msg_type === "ping") {
        wspl.send(JSON.stringify({ ping: 1 }));
      }
    };

    wspl.onclose = () => {
      connectBtn.textContent = "Connect";
      accountInfo.textContent = "";
      wspl = null;
      authorized = false;
      setTimeout(connectDeriv, 500);
    };
  }

  // --- CONNECT DERIV ---
  function DisconnectDeriv() {
    setTimeout(() => {
      if (wspl && wspl.readyState === WebSocket.OPEN) {
        wspl.send(JSON.stringify({ forget_all: ["candles", "ticks"] }));
        wspl.close();
        wspl = null;
        connectBtn.textContent = "Connect";
        accountInfo.textContent = "";
        authorized = false;
        console.log("Socket Closed");
      }
    }, 500);
  }

  // --- TICK HANDLER ---
  function handleTick(tick) {
    // ensure tick belongs to current symbol (or accept if no currentSymbol)
    if (!tick || !tick.symbol) return;
    if (currentSymbol && tick.symbol !== currentSymbol) return;

    const quote = safe(Number(tick.quote));
    // Deriv epoch is seconds; lightweight-charts accepts number seconds
    const epoch = Number(tick.epoch) || Math.floor(Date.now() / 1000);

    // update lastPrices per symbol key (keep generic)
    const prev = lastPrices[tick.symbol] ?? quote;
    lastPrices[tick.symbol] = quote;

    const change = quote - prev;
    recentChanges.push(change);
    if (recentChanges.length > 60) recentChanges.splice(0, 1);

    // update chartData and series   
    if (!currentSeries || !chart) return;

    const point = { time: epoch, value: quote };

    // if first data point, setData with small array to initialize
    if (!chartData.length) {
      chartData.push(point);
      if (chartData.length > 600) chartData.splice(0, 1);
      try {
        currentSeries.setData(chartData);
      } catch (e) {
        // fallback: try update
        try { currentSeries.update(point); } catch (err) { }
      }
    } else {
      // append and update
      chartData.push(point);
      if (chartData.length > 600) chartData.shift();

      // Prefer update (faster); fallback to setData if update throws
      try {
        currentSeries.update(point);
      } catch (e) {
        try { currentSeries.setData(chartData); } catch (err) { }
      }
    }

    // try to auto-fit time scale (safe)
    try { chart.timeScale().fitContent(); } catch (e) { }

    Openpositionlines(currentSeries);
  }

  // === LIGNES DES CONTRATS OUVERTS (avec proposal_open_contract) ===
  function Openpositionlines(currentSeries) {

    if (wsOpenLines === null) {
      wsOpenLines = new WebSocket(WS_URL);
      wsOpenLines.onopen = () => { wsOpenLines.send(JSON.stringify({ authorize: TOKEN })); };
    }

    if (wsOpenLines && (wsOpenLines.readyState === WebSocket.OPEN || wsOpenLines.readyState === WebSocket.CONNECTING)) {
      wsOpenLines.onopen = () => { wsOpenLines.send(JSON.stringify({ authorize: TOKEN })); };
    }

    if (wsOpenLines && (wsOpenLines.readyState === WebSocket.CLOSED || wsOpenLines.readyState === WebSocket.CLOSING)) {
      wsOpenLines = new WebSocket(WS_URL);
      wsOpenLines.onopen = () => { wsOpenLines.send(JSON.stringify({ authorize: TOKEN })); };
    }

    wsOpenLines.onmessage = (msg) => {
      const data = JSON.parse(msg.data);

      // Étape 1 : Authentification
      if (data.msg_type === "authorize") {
        wsOpenLines.send(JSON.stringify({ proposal_open_contract: 1, subscribe: 1 }));
      }

      // Étape 2 : Réception d’un contrat
      if (data.msg_type === "proposal_open_contract" && data.proposal_open_contract) {
        const c = data.proposal_open_contract;

        // Si le contrat est clos → supprimer la ligne
        if (c.status === "sold") {
          const id = c.contract_id;
          if (priceLines4openlines[id]) {
            try { currentSeries.removePriceLine(priceLines4openlines[id]); } catch { }
            delete priceLines4openlines[id];
            console.log(`❌ Ligne supprimée pour contrat ${id}`);
          }
          return;
        }

        // Si c’est un nouveau contrat ouvert
        const id = c.contract_id;
        if (!priceLines4openlines[id]) {
          const entryPrice = parseFloat(c.entry_tick_display_value);              // || c.buy_price
          if (!entryPrice || isNaN(entryPrice)) return;

          const type = c.contract_type;
          const color = type === "MULTUP" ? "#00ff80" : "#ff4d4d";

          const line = currentSeries.createPriceLine({
            price: entryPrice,
            color,
            lineWidth: 2,
            lineStyle: LightweightCharts.LineStyle.Dashed,
            axisLabelVisible: true,
            title: `${type} @ ${entryPrice.toFixed(2)}`,
          });

          priceLines4openlines[id] = line;
          console.log(`📍 Ligne ajoutée pour ${type} @ ${entryPrice}`);
        }
      }

      if (data.ping && data.msg_type === "ping") {
        wsOpenLines.send(JSON.stringify({ ping: 1 }));
      }
    };

    wsOpenLines.onerror = (e) => console.log("⚠️ WS error:", e);
    wsOpenLines.onclose = () => console.log("❌ WS closed for open lines");
  }


  function startMLCountdown() {
    console.log("🤖 ML STARTED");

    let count = 5;
    countdownEl.textContent = count;
    overlayML.style.display = "flex";

    const interval = setInterval(() => {
      count--;
      countdownEl.textContent = count;

      if (count === 0) {
        clearInterval(interval);
        countdownEl.textContent = "GO 🚀";

        setTimeout(() => {
          overlayML.style.display = "none";
        }, 700);
      }
    }, 1000);
  }

  // ======================= MAIN HANDLER =======================
  function handleMLSignal(data) {
    // Validation des données
    if (!data || typeof data !== 'object') return;

    const signal = data.signal;
    const symbol = data.symbol;
    const price = parseFloat(data.price);
    const prob = data.prob;               // Récupérer la probabilité
    const now = Date.now();

    if (!signal || !price || isNaN(price)) return;

    const baseSymbol = symbol ? symbol.slice(0, 3) : '';

    const isSpike =
      (baseSymbol === "CRA" && signal === "SELL") ||
      (baseSymbol === "BOO" && signal === "BUY");

    // ⛔ Bloquer si timeout actif (uniquement pour la ligne active)
    if (now < timeoutUntil) return;

    // 🚫 Ignorer si même signal actif (uniquement pour la ligne active)
    if (signal === activeSignal) return;

    // 🔄 Supprimer UNIQUEMENT la ligne active (pas les markers)
    removeActiveLine();

    // ✅ Créer nouvelle ligne active
    activeLine = createSignalLine(currentSeries, price, signal);
    activeSignal = signal;

    // 📌 TOUJOURS ajouter un marker historique pour les spikes
    if (isSpike) {
      createHistoricalMarker(currentSeries, price, signal, baseSymbol, prob, now / 1000);

      // 🔊 Jouer le son
      playBeepSound();

      // ⏱️ Activer timeout pour la ligne active
      timeoutUntil = now + SIGNAL_TIMEOUT;
    } else {
      timeoutUntil = 0;
    }
  }

  // ======================= CREATE HISTORICAL MARKER =======================
  function createHistoricalMarker(series, price, type, symbol, prob, timestamp) {
    try {
      const color = type === "BUY" ? "#2196F3" : "#E91E63";
      const shape = type === "BUY" ? "arrowUp" : "arrowDown";

      // Créer un marker (point sur le graphique)
      const marker = {
        time: timestamp || Date.now() / 1000, // en secondes pour Lightweight Charts
        position: 'inBar',
        color: color,
        shape: shape,
        size: 2,
        text: `SPIKE ${currentSymbol}\n${prob}%`,
      };

      // Ajouter à la série
      series.setMarkers(series.markers().concat([marker]));

      // Stocker la référence
      historicalMarkers.push({
        marker: marker,
        price: price,
        type: type,
        symbol: symbol,
        prob: prob,
        timestamp: timestamp || Date.now()
      });

      console.log(`📌 Marker historique ajouté: ${currentSymbol} ${type} @ ${price} (${prob}%)`);

      return marker;
    } catch (error) {
      console.error('Erreur création marker:', error);
      return null;
    }
  }

  // ======================= PLAY SPIKE SOUND =======================
  function playBeepSound() {
    try {
      if (window.AudioContext) {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.value = 800;
        gain.gain.value = 0.1;

        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      }
    } catch (e) {
      // Rien à faire si l'audio échoue
    }
  }

  // ======================= CREATE PRICE LINE =======================
  function createSignalLine(series, price, type) {
    if (!series || typeof series.createPriceLine !== 'function') return null;
    if (type !== "BUY" && type !== "SELL") return null;

    try {
      return series.createPriceLine({
        price: price,
        color: type === "BUY" ? "#2196F3" : "#E91E63",
        lineWidth: 2,
        lineStyle: LightweightCharts.LineStyle.Dashed,
        axisLabelVisible: true,
        title: `${type} @ ${price.toFixed(2)}`
      });
    } catch (error) {
      console.error('Erreur création ligne:', error);
      return null;
    }
  }

  // ======================= REMOVE LINE =======================
  function removeActiveLine() {
    if (!activeLine) return;

    try {
      currentSeries.removePriceLine(activeLine);
    } catch (error) {
      // Ignorer silencieusement l'erreur
    }

    activeLine = null;
    activeSignal = null;
  }

  /* ============================
   WS SIGNAL ON HISTORY TABLE
  ============================ */
  function addTradeHistoryColumn(trade) {

    // Sécurité
    if (trade.type !== "ML_SIGNAL") return;

    // Création d'une NOUVELLE LIGNE
    const tr = document.createElement("tr");

    /* ========= TIME ========= */
    const timeTd = document.createElement("td");
    timeTd.textContent = formatUnixTime(trade.time);
    tr.appendChild(timeTd);

    /* ========= SYMBOL ========= */
    const symbolTd = document.createElement("td");
    symbolTd.textContent = trade.symbol;
    tr.appendChild(symbolTd);

    /* ========= SIGNAL ========= */
    const signalTd = document.createElement("td");
    signalTd.textContent = trade.signal;
    signalTd.classList.add(
      trade.signal === "BUY"
        ? "tradeHistory__-signal-buy"
        : "tradeHistory__-signal-sell"
    );
    tr.appendChild(signalTd);

    /* ========= PRICE ========= */
    const priceTd = document.createElement("td");
    priceTd.textContent = trade.price;
    tr.appendChild(priceTd);

    /* ========= PROB ========= */
    const probTd = document.createElement("td");
    probTd.textContent = trade.prob;
    const p = Math.min(Math.max(trade.prob, 0), 1);
    probTd.classList.add("tradeHistory__-prob");
    if (p >= 0.5080 && p < 0.5092) {
      probTd.style.backgroundColor = "#ffffffff";
      probTd.style.color = "#414040ff";
    }
    else {
      probTd.style.backgroundColor = "#89027eff";
      probTd.style.color = "#ffffffff";
    }
    tr.appendChild(probTd);

    /* ========= AJOUT EN HAUT ========= */
    tradeHistoryBody.prepend(tr);

    /* ========= LIMITE À 10 LIGNES ========= */
    while (tradeHistoryBody.rows.length > 10) {
      tradeHistoryBody.deleteRow(tradeHistoryBody.rows.length - 1);
    }
  }

  /* ======== CONVERSION TIMESTAMP ======== */
  function formatUnixTime(ts) {
    const date = new Date(ts * 1000); // UNIX → ms
    return date.toLocaleTimeString(); // ou toLocaleString()
  }

  /* ============================
   INIT WEBSOCKET
  ============================ */
  function connectDeriv__() {
    wsTranscation = new WebSocket(WS_URL);

    wsTranscation.onopen = () => {
      console.log("✅ Connecté à Deriv");
      authorize__(TOKEN.trim());
    };

    wsTranscation.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      handleDerivMessage__(data);
    };

    wsTranscation.onerror = (err) => {
      showError("Erreur connexion Deriv");
      console.error(err);
    };
  }

  /* ============================
     HANDLE MESSAGES
  ============================ */
  function handleDerivMessage__(data) {
    if (data.error) {
      showError(data.error.message);
      return;
    }

    // Autorisation OK
    if (data.authorize) {
      console.log("🔐 Autorisé:", data.authorize.loginid);
      return;
    }

    // Email envoyé
    if (data.verify_email) {
      alert("📧 Code envoyé à votre email Deriv");
      return;
    }

    // URL Cashier générée
    if (data.cashier) {
      openWebview(data.cashier);
      return;
    }
  }

  /* ============================
     AUTHORIZE
  ============================ */
  function authorize__(token) {
    authToken = token;
    wsTranscation.send(JSON.stringify({
      authorize: token
    }));
  }

  /* ============================
   OPEN WEBVIEW
============================ */
  function openWebview(url) {
    document.getElementById("webviewFrame").src = url;
    document.getElementById("webviewModal").style.display = "flex";
  }

  /* ============================
     UI HELPERS
  ============================ */
  function showError(msg) {
    document.getElementById("errorBox").innerText = msg;
  }

  function DisconnectDeriv__() {
    if (wsTranscation && (wsTranscation.readyState === WebSocket.OPEN || wsTranscation.readyState === WebSocket.CONNECTING)) {
      // Envoyer unsubscribe avant de fermer
      try { setTimeout(() => { wsTranscation.close(); wsTranscation = null; }, 500); } catch (e) { }
    }
  }

  function startSignalPipeline(onMessageCallback) {
    if (wsSignal && wsSignal.readyState === WebSocket.OPEN) return;

    wsSignal = new WebSocket(WS_SIGNAL);

    wsSignal.onopen = () => {
      console.log("✅ Connecté à /signal");
      tradeHistoryStatus.innerText = "✅ Connected to Trade History WS";
    };

    wsSignal.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessageCallback(data); // callback UI
      handleMLSignal(data);
      addTradeHistoryColumn(data);
    };

    wsSignal.onclose = () => {
      console.log("❌ /signal fermé");
      tradeHistoryStatus.innerText = "❌ Trade History WS disconnected";
    };

    wsSignal.onerror = (err) => {
      console.error("Signal WS error:", err);
      tradeHistoryStatus.innerText = "⚠️ Trade History WS error";
    };
  }

  function startControlPipeline() {
    if (engineStarted) return;

    wsControl = new WebSocket(WS_CONTROL);

    wsControl.onopen = () => {
      console.log("✅ Connecté à /control");

      wsControl.send(JSON.stringify({
        cmd: "START",
        symbol: currentSymbol,
        token: TOKEN.trim(),
        stake: parseFloat(stakeInput.value) || 1,
        multiplier: parseInt(multiplierInput.value) || 40,
        currency: CURRENCY || "USD",
        style: styleType(currentChartType),
        granularity: convertTF(currentInterval),
        repeat: Number(buyNumber.value) || 1
      }));
    };

    wsControl.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      console.log("ENGINE:", msg.status);
      if (msg.status === "STARTED") engineStarted = true;
    };

    wsControl.onclose = () => {
      console.log("❌ /control fermé");
      engineStarted = false;
    };

    wsControl.onerror = (err) => {
      console.error("Control WS error:", err);
    };
  }

  function stopControlPipeline() {
    if (!wsControl || wsControl.readyState !== WebSocket.OPEN) return;

    wsControl.send(JSON.stringify({ cmd: "STOP" }));
    engineStarted = false;
  }

  function shutdownAllPipelines() {
    console.log("🛑 Fermeture complète des pipelines");

    if (wsControl) {
      wsControl.close();
      wsControl = null;
    }

    if (wsSignal) {
      wsSignal.close();
      wsSignal = null;
    }

    engineStarted = false;
  }

  buyBtn.onclick = () => executeTrade("BUY");
  sellBtn.onclick = () => executeTrade("SELL");
  reverseBtn.onclick = () => {
    console.log("Reversing positions...");
    reversefunction();
  }

  function reversefunction() {
    if (wsContracts_reverse) { wsContracts_reverse.close(); wsContracts_reverse = null; }

    console.log("Reversing positions...");

    wsContracts_reverse = new WebSocket(WS_URL);
    wsContracts_reverse.onopen = () => { wsContracts_reverse.send(JSON.stringify({ authorize: TOKEN })); };

    wsContracts_reverse.onmessage = (msg) => {
      const data = JSON.parse(msg.data);

      // 1. Authorization
      if (data.msg_type === "authorize") {
        wsContracts_reverse.send(JSON.stringify({ proposal_open_contract: 1, subscribe: 1 }));
        wsContracts_reverse.send(JSON.stringify({ portfolio: 1 }));
        return;
      }

      // 2. Save contract info
      if (data.msg_type === "proposal_open_contract") {
        const poc = data.proposal_open_contract;
        contracttype__ = poc.contract_type;
        contractid__ = poc.contract_id;
        return;
      }

      // 3. Portfolio received
      if (data.msg_type !== "portfolio") return;

      const contracts = data.portfolio.contracts;
      console.log("📌 Contrats ouverts :", contracts);

      if (!contracttype__) return;

      // Determine opposite direction
      const oppositeType = (contracttype__ === "MULTUP") ? "MULTDOWN" : "MULTUP";

      // User inputs
      const stake = parseFloat(stakeInput.value) || 1;
      const multiplier = parseInt(multiplierInput.value) || 40;
      const qty = (contracttype__ === "MULTUP")
        ? (parseInt(sellNumber.value) || 1)
        : (parseInt(buyNumber.value) || 1);

      // 4. Close all matching contracts   
      contracts
        .filter(c => c.contract_type === contracttype__)
        .forEach(c => {
          wsContracts_reverse.send(JSON.stringify({ sell: c.contract_id, price: 0 }));
          console.log("⛔ Fermeture demandée :", c.contract_id);
        });

      // 5. Open opposite direction
      for (let i = 0; i < qty; i++) {
        wsContracts_reverse.send(JSON.stringify({
          buy: 1,
          price: stake.toFixed(2),
          parameters: {
            contract_type: oppositeType,
            symbol: currentSymbol,
            currency: CURRENCY,
            basis: "stake",
            amount: stake.toFixed(2),
            multiplier: multiplier
          }
        }));
      }

      console.log(`✔️ Reverse exécuté → ${oppositeType} x${qty}`);
    };

  }

  //--- Trades (New)
  function executeTrade(type) {
    if (wsContracts) { wsContracts.close(); wsContracts = null; }

    wsContracts = new WebSocket(WS_URL);
    wsContracts.onopen = () => { wsContracts.send(JSON.stringify({ authorize: TOKEN })); };

    wsContracts.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.authorize && data.msg_type === "authorize") {
        const payload = {
          buy: 1,
          price: stake.toFixed(2),
          parameters: {
            contract_type: type === "BUY" ? "MULTUP" : "MULTDOWN",
            symbol: currentSymbol,
            currency: CURRENCY.toString(),
            basis: "stake",
            amount: stake.toFixed(2),
            multiplier: multiplier,
            //limit_order: { take_profit: 150, stop_loss: 130 }
          }
        }

        const numb_ = (type === "BUY") ? (parseInt(buyNumber.value) || 1)
          : (parseInt(sellNumber.value) || 1);

        for (let i = 0; i < numb_; i++) {
          wsContracts.send(JSON.stringify(payload));
        }
      }

      if (data.ping && data.msg_type === "ping") {
        wsContracts.send(JSON.stringify({ ping: 1 }));
      }
    };
  }

  closewinning.onclick = () => {
    if (wsContracts_winning) { wsContracts_winning.close(); wsContracts_winning = null; }

    console.log("Closing all profitable trades...");

    wsContracts_winning = new WebSocket(WS_URL);
    wsContracts_winning.onopen = () => { wsContracts_winning.send(JSON.stringify({ authorize: TOKEN })); };
    wsContracts_winning.onerror = (e) => {
      console.log("❌ WS Error: " + JSON.stringify(e));
    };

    wsContracts_winning.onmessage = (msg) => {
      const data = JSON.parse(msg.data);

      // Authorization successful
      if (data.msg_type === "authorize") {
        console.log("✅ Authorized successfully. Fetching portfolio...");
        wsContracts_winning.send(JSON.stringify({ portfolio: 1 }));
      }

      // Portfolio received
      if (data.msg_type === "portfolio" && data.portfolio?.contracts?.length > 0) {
        const contracts = data.portfolio.contracts || [];
        console.log("📊 Found " + contracts.length + " active contracts.");

        contracts.forEach((contract, i) => {
          setTimeout(() => {
            wsContracts_winning.send(
              JSON.stringify({
                proposal_open_contract: 1,
                contract_id: contract.contract_id,
              })
            );
          }, i * 200); // Délai de 500ms entre chaque demande
        });
      }

      // Proposal open contract (detail for each active trade)
      if (data.msg_type === "proposal_open_contract" && data.proposal_open_contract) {
        const poc = data.proposal_open_contract;
        const profit = parseFloat(poc.profit);

        if (profit > 0) {
          console.log(
            `💰 Closing profitable trade ${poc.contract_id} with profit ${profit.toFixed(2)}`
          );

          wsContracts_winning.send(
            JSON.stringify({
              sell: poc.contract_id,
              price: 0, // 0 = sell at market price
            })
          );
        }
      }

      // Sell confirmation
      if (data.msg_type === "sell") {
        const profit = parseFloat(data.sell.profit);
        console.log(`✅ Trade ${data.sell.contract_id} closed with profit: ${profit.toFixed(2)}`);
      }

      // No open contracts
      if (data.msg_type === "portfolio" && (!data.portfolio || !data.portfolio.contracts.length)) {
        console.log("⚠️ No active contracts found.");
      }
    };
  };

  closelosing.onclick = () => {
    if (wsContracts_losing) { wsContracts_losing.close(); wsContracts_losing = null; }

    console.log("Closing all profitable trades...");

    wsContracts_losing = new WebSocket(WS_URL);
    wsContracts_losing.onopen = () => { wsContracts_losing.send(JSON.stringify({ authorize: TOKEN })); };
    wsContracts_losing.onerror = (e) => {
      console.log("❌ WS Error: " + JSON.stringify(e));
    };

    wsContracts_losing.onmessage = (msg) => {
      const data = JSON.parse(msg.data);

      // Authorization successful
      if (data.msg_type === "authorize") {
        console.log("✅ Authorized successfully. Fetching portfolio...");
        wsContracts_losing.send(JSON.stringify({ portfolio: 1 }));
      }

      // Portfolio received
      if (data.msg_type === "portfolio" && data.portfolio?.contracts?.length > 0) {
        const contracts = data.portfolio.contracts || [];
        console.log("📊 Found " + contracts.length + " active contracts.");

        contracts.forEach((contract, i) => {
          setTimeout(() => {
            wsContracts_losing.send(
              JSON.stringify({
                proposal_open_contract: 1,
                contract_id: contract.contract_id,
              })
            );
          }, i * 200); // Délai de 500ms entre chaque demande
        });
      }

      // Proposal open contract (detail for each active trade)
      if (data.msg_type === "proposal_open_contract" && data.proposal_open_contract) {
        const poc = data.proposal_open_contract;
        const profit = parseFloat(poc.profit);

        if (profit < 0) {
          console.log(
            `💰 Closing profitable trade ${poc.contract_id} with profit ${profit.toFixed(2)}`
          );

          wsContracts_losing.send(
            JSON.stringify({
              sell: poc.contract_id,
              price: 0, // 0 = sell at market price
            })
          );
        }
      }

      // Sell confirmation
      if (data.msg_type === "sell") {
        const profit = parseFloat(data.sell.profit);
        console.log(`✅ Trade ${data.sell.contract_id} closed with profit: ${profit.toFixed(2)}`);
      }

      // No open contracts
      if (data.msg_type === "portfolio" && (!data.portfolio || !data.portfolio.contracts.length)) {
        console.log("⚠️ No active contracts found.");
      }
    };
  };

  closeAll.onclick = () => {
    if (wsContracts__close) { wsContracts__close.close(); wsContracts__close = null; }

    console.log("Closing all trades...");

    wsContracts__close = new WebSocket(WS_URL);
    wsContracts__close.onopen = () => { wsContracts__close.send(JSON.stringify({ authorize: TOKEN })); };
    wsContracts__close.onclose = () => { console.log("Disconnected"); console.log("WS closed"); };
    wsContracts__close.onerror = e => { console.log("WS error " + JSON.stringify(e)); };
    wsContracts__close.onmessage = (msg) => {
      const data = JSON.parse(msg.data);

      // 2️⃣ Quand autorisé, on demande le portefeuille
      if (data.msg_type === 'authorize') {
        wsContracts__close.send(JSON.stringify({ portfolio: 1 }));
      }

      // 3️⃣ Quand on reçoit les contrats ouverts
      if (data.msg_type === 'portfolio') {
        const contracts = data.portfolio.contracts || [];
        console.log('Contrats ouverts:', contracts);

        // 4️⃣ Fermer chaque contrat
        contracts.forEach(c => {
          wsContracts__close.send(JSON.stringify({ sell: c.contract_id, price: 0 }));
          console.log(`⛔ Fermeture du contrat ${c.contract_id} demandée`);
        });
      }

      // 5️⃣ Confirmation de fermeture
      if (data.msg_type === 'sell') {
        console.log('✅ Contrat fermé:', data.sell.contract_id);
      }
    };
  };

  // --- INITIALISATION (À appeler une seule fois au chargement ou au 1er clic) ---
  function initMaSeries() {
    // "chart" doit déjà exister globalement
    maSeries = {
      20: chart.addLineSeries({ color: '#2962FF', lineWidth: 2, title: 'EMA 20' }),
      50: chart.addLineSeries({ color: '#9c27b0', lineWidth: 2, title: 'EMA 50' }),
      200: chart.addLineSeries({ color: '#ff9800', lineWidth: 2, title: 'EMA 200' })
    };
  }

  // --- LOGIQUE DES BOUTONS (Appelée depuis le HTML) ---  
  window.toggleMA = function (period, button) {
    // ÉTAPE 1 : Si c'est le TOUT PREMIER CLIC sur n'importe quel bouton MA
    if (maSeries === null) {
      console.log("Premier clic : Initialisation des MA et de la connexion...");
      initMaSeries(); // Crée les lignes bleues, violettes, oranges
    }

    if (!isConnected) {
      startDerivConnection(); // Lance le WebSocket si ce n'est pas déjà fait
      isConnected = true;
    }

    // ÉTAPE 2 : Logique habituelle de toggle
    const index = activePeriods.indexOf(period);
    const className = `active-${period}`;

    if (index === -1) {
      activePeriods.push(period);
      button.classList.add(className);
      button.innerText = `MA ${period} : ON`;
    } else {
      activePeriods.splice(index, 1);
      button.classList.remove(className);
      button.innerText = `MA ${period} : OFF`;
    }

    // ÉTAPE 3 : Mise à jour immédiate
    updateMAs();
  };

  // --- COMMANDE BOUTON ---   
  window.toggleZigZag = function (btn) {

    // 2. RÉ-INITIALISATION : Si on change de symbole, zigzagSeries devient invalide.
    // On la recrée si elle est absente ou si le graphique a été réinitialisé.
    if (!zigzagSeries || zigzagSeries == null) {
      zigzagSeries = chart.addLineSeries({
        color: '#f39c12',
        lineWidth: 2,
        priceLineVisible: false,
      });
    }

    const active = btn.classList.toggle("active");

    if (active) {
      btn.innerText = "ZigZag 14 : ON";

      // Lancer la connexion si nécessaire
      if (!isWsInitialized) {
        startDerivConnectionZZ();
        isWsInitialized = true;
      }

      // 3. Recalculer les points avec les données actuelles du nouveau symbole
      refreshZigZag();

      // 4. Appliquer les données (Vérification de sécurité sur le cache)
      if (zigzagCache && zigzagCache.length > 0) {
        zigzagSeries.setData(zigzagCache);
        zigzagSeries.setMarkers(zigzagMarkers);
      }

    } else {
      btn.innerText = "ZigZag 14 : OFF";
      // On vérifie toujours l'existence avant d'agir
      if (zigzagSeries) {
        zigzagSeries.setData([]);
        zigzagSeries.setMarkers([]);
      }
    }
  };

  // --- CALCULS ET MISES À JOUR ---
  function calculateEMA(data, period) {
    if (data.length < period) return [];
    const ema = [];
    const k = 2 / (period + 1);
    let emaValue = data[0].close;
    for (let i = 0; i < data.length; i++) {
      emaValue = (data[i].close - emaValue) * k + emaValue;
      if (i >= period - 1) ema.push({ time: data[i].time, value: emaValue });
    }
    return ema;
  }

  // --- ALGORITHME ZIGZAG AVEC MISE À JOUR DES EXTRÊMES ---
  function calculateZigZag(data, period) {
    const points = [];
    const markers = [];
    let lastType = null;

    for (let i = period; i < data.length - period; i++) {
      let isHigh = true;
      let isLow = true;

      for (let j = 1; j <= period; j++) {
        if (data[i].high < data[i - j].high || data[i].high < data[i + j].high) isHigh = false;
        if (data[i].low > data[i - j].low || data[i].low > data[i + j].low) isLow = false;
      }

      if (isHigh) {
        if (lastType === 'H') {
          if (data[i].high > points[points.length - 1].value) {
            points[points.length - 1] = { time: data[i].time, value: data[i].high };
            // Mise à jour du marqueur (round)
            markers[markers.length - 1].time = data[i].time;
          }
        } else {
          lastType = 'H';
          points.push({ time: data[i].time, value: data[i].high });
          markers.push({
            time: data[i].time,
            position: 'aboveBar',
            color: '#f39c12', // Couleur orange pour les sommets
            shape: 'circle',   // Forme de rond
            size: 1,           // Taille du point
            text: 'H'          // Optionnel : enlever le texte si vous voulez juste le point
          });
        }
      }
      else if (isLow) {
        if (lastType === 'L') {
          if (data[i].low < points[points.length - 1].value) {
            points[points.length - 1] = { time: data[i].time, value: data[i].low };
            // Mise à jour du marqueur (round)
            markers[markers.length - 1].time = data[i].time;
          }
        } else {
          lastType = 'L';
          points.push({ time: data[i].time, value: data[i].low });
          markers.push({
            time: data[i].time,
            position: 'belowBar',
            color: '#26a69a', // Couleur verte pour les creux
            shape: 'circle',
            size: 1,
            text: 'L'
          });
        }
      }
    }

    if (points.length > 0) {
      const lastBar = data[data.length - 1];
      points.push({ time: lastBar.time, value: lastBar.close });
    }

    return { points, markers };
  }

  // Petite fonction utilitaire pour mettre à jour le cache et le dessin
  function refreshZigZag() {
    const results = calculateZigZag(priceDataZZ, 7);
    zigzagCache = results.points;
    zigzagMarkers = results.markers;

    // Si le bouton est sur "ON", on affiche immédiatement
    const btn = document.querySelector('.controls button');
    if (btn && btn.classList.contains('active')) {
      zigzagSeries.setData(zigzagCache);
      zigzagSeries.setMarkers(zigzagMarkers);
    }
  }

  function updateMAs() {
    if (!maSeries) return;

    [20, 50, 200].forEach(p => {
      // Si la période est active, on calcule, sinon on envoie un tableau vide []
      const data = activePeriods.includes(p) ? calculateEMA(priceData, p) : [];
      maSeries[p].setData(data); // C'est le [] qui fait disparaître la ligne
    });
  }

  function startDerivConnection() {
    /* ===============================  
       CONNEXION DERIV API (Live)
    ================================ */
    //if (maws && maws.readyState === WebSocket.OPEN) maws.close();

    const maws = new WebSocket(WS_URL);
    maws.onopen = () => {
      maws.send(JSON.stringify({ authorize: TOKEN }));
    };

    maws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);

      if (data.msg_type === "authorize" && data.authorize) {
        console.log("WS Connected and Authorized");
        maws.send(JSON.stringify(Payloadforsubscription(currentSymbol, currentInterval, currentChartType)));
      }

      // Historique au chargement
      if (data.candles) {
        priceData = data.candles.map(c => ({
          time: c.epoch,
          open: Number(c.open),
          high: Number(c.high),
          low: Number(c.low),
          close: Number(c.close)
        }));
        currentSeries.setData(priceData);
        chart.timeScale().fitContent();
      }

      // Nouveau tick (bougie en cours)
      if (data.ohlc) {
        const o = data.ohlc;
        const newCandle = {
          time: o.open_time,
          open: Number(o.open),
          high: Number(o.high),
          low: Number(o.low),
          close: Number(o.close)
        };

        if (priceData.length > 0 && priceData[priceData.length - 1].time === newCandle.time) {
          priceData[priceData.length - 1] = newCandle;
        } else {
          priceData.push(newCandle);
        }
        currentSeries.update(newCandle);
      }

      // Mise à jour des lignes MA à chaque nouveau mouvement de prix
      updateMAs();
    };
  }

  // --- CONNEXION DERIV ---
  function startDerivConnectionZZ() {

    const wszz = new WebSocket(WS_URL);
    wszz.onopen = () => { wszz.send(JSON.stringify({ authorize: TOKEN })) };

    wszz.onmessage = (msg) => {
      const data = JSON.parse(msg.data);

      if (data.msg_type === "authorize" && data.authorize) {
        console.log("WS Authorized and Connected");
        // 1. Demander l'historique ET s'abonner (subscribe: 1)
        wszz.send(JSON.stringify(Payloadforsubscription(currentSymbol, currentInterval, currentChartType)));
      }

      // A. HISTORIQUE (reçu une seule fois au début)
      if (data.candles) {
        priceDataZZ = data.candles.map(c => ({
          time: c.epoch,
          open: Number(c.open),
          high: Number(c.high),
          low: Number(c.low),
          close: Number(c.close)
        }));
        currentSeries.setData(priceDataZZ);
        refreshZigZag(); // Calcul initial
      }

      // B. TEMPS RÉEL (reçu à chaque tick via 'ohlc')
      if (data.ohlc) {
        const o = data.ohlc;
        const newCandle = {
          time: o.open_time,
          open: Number(o.open),
          high: Number(o.open), // Au début d'un tick, high/low sont l'open
          low: Number(o.low),
          close: Number(o.close)
        };

        // Vérifier si on met à jour la bougie actuelle ou si on en crée une nouvelle
        if (priceDataZZ.length > 0 && priceDataZZ[priceDataZZ.length - 1].time === newCandle.time) {
          priceDataZZ[priceDataZZ.length - 1] = newCandle;
        } else {
          priceDataZZ.push(newCandle);
        }

        // Mettre à jour le graphique et recalculer le ZigZag
        currentSeries.update(newCandle);
        refreshZigZag();
      }
    };

    wszz.onclose = () => {
      console.log("Connexion fermée. Reconnexion...");
      setTimeout(startDerivConnectionZZ, 5000);
    };
  }

  async function resetZZChartVariable() {
    // 1. Invalider immédiatement la session actuelle pour stopper les calculs en cours
    currentSessionId++;

    console.log("Nettoyage de la session en cours...");

    // 2. Fermeture propre et sécurisée de tous les WebSockets
    const sockets = [ws, wspl, maws, wszz];

    for (let socket of sockets) {
      if (socket) {
        try {
          // On retire les écouteurs pour éviter que le onclose ne déclenche des erreurs
          socket.onmessage = null;
          socket.onclose = null;
          socket.onerror = null;

          if (socket.readyState === WebSocket.OPEN) {
            // Optionnel : informer le serveur avant de couper
            socket.send(JSON.stringify({ forget_all: ["candles", "ticks"] }));
            socket.close();
          }
        } catch (e) {
          console.warn("Erreur lors de la fermeture d'un socket:", e);
        }
      }
    }

    // Reset des références de sockets
    ws = wspl = maws = wszz = null;

    // 3. Réinitialisation des états logiques
    isWsInitialized = false;

    // 4. Nettoyage de l'Interface Utilisateur (Bouton)
    const btn = document.querySelector('button[onclick*="toggleZigZag"]');
    if (btn) {
      btn.classList.remove("active");
      btn.innerText = "ZigZag 14 : OFF";
    }

    // 5. Destruction physique du graphique (Crucial contre le clignotement)
    if (chart) {
      try {
        chart.remove();
        chart = null;
      } catch (e) {
        console.error("Erreur lors de la suppression du graphique:", e);
      }
    }

    // 6. Vidage complet de tous les tableaux de données et caches
    candles = [];
    priceData = [];
    priceDataZZ = [];
    zigzagCache = [];
    zigzagMarkers = [];

    // Reset des séries pour forcer leur recréation au prochain loadSymbol
    currentSeries = null;
    zigzagSeries = null;

    // Petite pause asynchrone pour laisser le navigateur libérer la mémoire
    await new Promise(resolve => setTimeout(resolve, 50));

    console.log("Système entièrement réinitialisé. Prêt pour le nouveau symbole.");
  }

  // Table
  function initTable() {
    // Construction du tableau HTML
    autoHistoryList.innerHTML = `
    <table class="trade-table" id="autoTradeTable">
      <thead>
        <tr>
          <th><input type="checkbox" id="selectAll"></th>
          <th>Time of Trade</th>
          <th>Contract ID</th>
          <th>Symbol</th>    
          <th>Contract Type</th>  
          <th>Stake</th>
          <th>Multiplier</th>
          <th>Entry Spot</th>
          <th>TP (%)</th>
          <th>SL (%)</th>
          <th>Profit</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody id="autoTradeBody"></tbody>
    </table>
    <button id="deleteSelected" style="margin-top:8px; background:#dc2626; color:white; border:none; padding:6px 10px; border-radius:6px; cursor:pointer;">🗑 Delete Selected</button>
   `;

    const autoTradeBody = document.getElementById("autoTradeBody");
  }

  // Fonction d’ajout d’une ligne de trade
  function addTradeRow(trade) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><input type="checkbox" class="rowSelect"></td>
      <td>${trade.time}</td>
      <td>${trade.contract_id}</td>
      <td>${String(trade.symbol)}</td>
      <td class="${trade.type === "BUY" ? "buy" : "sell"}">${trade.type}</td>
      <td>${trade.stake.toFixed(2)}</td>
      <td>${trade.multiplier}</td>
      <td>${trade.entry_spot}</td>
      <td>${trade.tp}%</td>
      <td>${trade.sl}%</td>
      <td>${trade.profit}</td>
      <td>
        <button class="deleteRowBtn" style="background:#ef4444; border:none; color:white; border-radius:4px; padding:2px 6px; cursor:pointer;">Delete</button>
      </td>
    `;
    autoTradeBody.appendChild(tr);
  }

  // ==========================
  // 3️⃣ Souscription au portfolio et contrats ouverts
  // ==========================
  // --- 🔍 Récupère tous les contrats ouverts
  function fetchOpenContracts() {
    if (wsplContracts && wsplContracts.readyState === WebSocket.OPEN) {
      wsplContracts.send(JSON.stringify({ portfolio: 1 }));
    }
  }

  // --- 🔄 S’abonne aux détails d’un contrat
  function subscribeContractDetails(contract_id) {
    wsplContracts.send(JSON.stringify({ proposal_open_contract: 1, contract_id: contract_id, subscribe: 1 }));
  }

  // --- 💰 Ferme un contrat
  function closeContract(contract_id) {
    wsplContracts.send(JSON.stringify({ sell: contract_id.trim(), price: 0 }));
    console.log("🚪 Closing contract:", contract_id);
  }

  // --- 🧠 Gère les réponses Deriv
  function handlePortfolio(data) {
    const contracts = data?.portfolio?.contracts;
    if (!contracts || !contracts.length) {
      console.log("ℹ️ Aucun contrat ouvert actuellement.");
      return;
    }

    // Nettoie le tableau avant de remplir
    document.getElementById("autoTradeBody").innerHTML = "";

    // Abonne chaque contrat
    contracts.forEach(c => {
      console.log("📡 Subscribing to:", c.contract_id);
      subscribeContractDetails(c.contract_id);
    });
  }

  function handleContractDetails(data) {
    const c = data.proposal_open_contract;
    if (!c || !c.contract_id) return;

    const autoTradeBody = document.getElementById("autoTradeBody");

    // Supprime la ligne si le contrat est vendu
    if (c.is_sold) {
      const tr = autoTradeBody.querySelector(`[data-contract='${c.contract_id}']`);
      if (tr) tr.remove();
      console.log(`✅ Contract ${c.contract_id} closed.`);
      return;
    }

    // Objet formaté pour ton tableau
    const trade = {
      time: new Date(c.date_start * 1000).toLocaleTimeString(),
      contract_id: c.contract_id,
      symbol: c.underlying || c.symbol,
      type: c.contract_type === "MULTUP" ? "MULTUP" : "MULTDOWN",
      stake: c.buy_price || 0,
      multiplier: c.multiplier || "-",
      entry_spot: c.entry_tick_display_value ?? "-",
      tp: c.take_profit ?? "-",
      sl: c.stop_loss ?? "-",
      profit:
        c.profit !== undefined
          ? (c.profit >= 0 ? `+${c.profit.toFixed(2)}` : c.profit.toFixed(2))
          : "-"
    };

    // Vérifie si déjà présent
    let tr = autoTradeBody.querySelector(`[data-contract='${c.contract_id}']`);

    if (!tr) {
      // 🔹 Création d’une nouvelle ligne
      tr = document.createElement("tr");
      tr.dataset.contract = c.contract_id;
      tr.innerHTML = `  
        <td><input type="checkbox" class="rowSelect"></td>
        <td>${trade.time}</td>
        <td>${trade.contract_id}</td>
        <td>${trade.symbol.toString()}</td>
        <td class="${trade.type === "MULTUP" ? "MULTUP" : "MULTDOWN"}">${trade.type}</td>
        <td>${Number(trade.stake).toFixed(2)}</td>
        <td>${trade.multiplier}</td>
        <td>${trade.entry_spot}</td>
        <td>${trade.tp}</td>
        <td>${trade.sl}</td>
        <td style="color:${trade.profit >= 0 ? 'blue' : 'red'};">${(trade.profit > 0 ? "+" : "") + trade.profit}</td> 
        <td>
        <button class="deleteRowBtn"
          style="background:#ef4444; border:none; color:white; border-radius:4px; padding:2px 6px; cursor:pointer;">
          Close
        </button>
        </td>
      `;
      autoTradeBody.appendChild(tr);
    } else {
      // 🔄 Mise à jour en temps réel du profit
      tr.cells[10].textContent = trade.profit;
    }
  }

  // --- 🧱 Connexion WebSocket
  function connectDeriv_table() {

    if (wsplContracts === null) {
      wsplContracts = new WebSocket(WS_URL);
      wsplContracts.onopen = () => { wsplContracts.send(JSON.stringify({ authorize: TOKEN })); };
    }

    if (wsplContracts && (wsplContracts.readyState === WebSocket.OPEN || wsplContracts.readyState === WebSocket.CONNECTING)) {
      wsplContracts.onopen = () => { wsplContracts.send(JSON.stringify({ authorize: TOKEN })); };
    }

    if (wsplContracts && (wsplContracts.readyState === WebSocket.CLOSED || wsplContracts.readyState === WebSocket.CLOSING)) {
      wsplContracts = new WebSocket(WS_URL);
      wsplContracts.onopen = () => { wsplContracts.send(JSON.stringify({ authorize: TOKEN })); };
    }

    wsplContracts.onclose = () => { console.log("Disconnected"); console.log("WS closed"); setTimeout(connectDeriv_table, 300); };
    wsplContracts.onerror = e => { console.log("WS error " + JSON.stringify(e)); wsplContracts.close(); wsplContracts = null; setTimeout(connectDeriv_table, 300); };
    wsplContracts.onmessage = msg => {
      const data = JSON.parse(msg.data);
      switch (data.msg_type) {
        case "authorize":
          console.log("✅ Authorized, fetching open contracts...");
          fetchOpenContracts();
          break;
        case "portfolio":
          handlePortfolio(data);
          break;
        case "proposal_open_contract":
          handleContractDetails(data);
          break;
        case "sell":
          console.log("💰 Sell response:", data);
          break;
        default:
          break;
      }
    };

    wsplContracts.onerror = (err) => console.error("❌ WebSocket error:", err);
    wsplContracts.onclose = () => console.log("🔴 Disconnected");
  }

  // 🔹 Fonction utilitaire : obtenir tous les comptes depuis l’URL (après authorization Deriv)
  function getAllAccountsFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const accounts = [];

    for (const [key, value] of urlParams.entries()) {
      const match = key.match(/^acct(\d+)$/);
      if (match) {
        const index = match[1];
        const account = value;
        const token = urlParams.get(`token${index}`);
        const currency = urlParams.get(`cur${index}`) || "USD";

        if (token && account) {
          accounts.push({
            account,
            token,
            currency,
            addedAt: new Date().toISOString()
          });
        }
      }
    }

    return accounts;
  }

  // 🔹 Charger tous les comptes stockés
  function getStoredAccounts() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  // 🔹 Sauvegarder les comptes
  function saveAccounts(accounts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  }

  // 🔹 Fusionner sans doublons
  function mergeAccounts(newAccounts) {
    const existing = getStoredAccounts();
    newAccounts.forEach(acc => {
      if (!existing.some(a => a.account === acc.account)) {
        existing.push(acc);
      }
    });
    saveAccounts(existing);
    return existing;
  }

  // 🔹 Remplir automatiquement la combobox
  function populateAccountCombo() {
    const combo = document.getElementById("accountSelect");
    if (!combo) return;

    combo.innerHTML = '<option value="">Select an account!</option>';

    const accounts = getStoredAccounts();
    accounts.forEach(acc => {
      const option = document.createElement("option");
      option.value = acc.token;
      option.textContent = `${acc.account} (${acc.currency})`;
      combo.appendChild(option);
    });
  }

  // 🔹 Initialisation principale
  function initDerivAccountManager() {
    const newAccounts = getAllAccountsFromURL();

    if (newAccounts.length > 0) {
      console.log("✅ Comptes détectés :", newAccounts);
      mergeAccounts(newAccounts);
    }

    populateAccountCombo();
  }

  function initHistoricalTable() {
    // Construction du tableau HTML
    HistoricalContract.innerHTML = `
    <table class="trade-table" id = "autoHistoricalTrade">
        <thead>
          <tr>
            <th>Time</th>
            <th>Contract ID</th>
            <th>Symbol</th>
            <th>Contract Type</th>
            <th>Stake</th>
            <th>Multiplier</th>
            <th>TP</th>
            <th>SL</th>
            <th>Profit</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody id="autoHistoricalBody">
          <tr><td colspan="10" style="text-align:center;">No trade Found</td></tr>
        </tbody>
      </table>
   `;

    const autoHistoricalBody = document.getElementById("autoHistoricalBody");
  }

  // ==================================
  // 🔹 Fonction de connexion WebSocket
  // ==================================
  function connectHistoricalDeriv() {

    if (connection === null) {
      connection = new WebSocket(WS_URL);
      connection.onopen = () => {
        connection.send(JSON.stringify({ authorize: TOKEN }));
      };
    }

    if (connection && (connection.readyState === WebSocket.OPEN || connection.readyState === WebSocket.CONNECTING)) {
      connection.onopen = () => { connection.send(JSON.stringify({ authorize: TOKEN })); };
    }

    if (connection && (connection.readyState === WebSocket.CLOSED || connection.readyState === WebSocket.CLOSING)) {
      connection = new WebSocket(WS_URL);
      connection.onopen = () => { connection.send(JSON.stringify({ authorize: TOKEN })); };
    }

    connection.onclose = () => { console.log("Disconnected"); console.log("WS closed"); };
    connection.onerror = e => { console.log("WS error " + JSON.stringify(e)); };
    connection.onmessage = (msg) => {
      const data = JSON.parse(msg.data);

      if (data.msg_type === "authorize") {
        console.log("✅ Connecté à Deriv API");
      }

      // Quand on reçoit la profit_table
      if (data.msg_type === "profit_table") {
        transactions__ = data.profit_table.transactions;
        updateTradeTable(transactions__);
      }

      if (data.error) {
        console.error("⚠️ Erreur API :", data.error.message);
        alert("Erreur : " + data.error.message);
      }
    };
  }

  // ==========================================
  // 🔹 Fonction pour récupérer le profit_table
  // ==========================================
  function getProfitTable(fromTimestamp, toTimestamp) {
    if (!connection || connection.readyState !== WebSocket.OPEN) {
      console.error("❌ WebSocket non connecté.");
      return;
    }

    connection.send(JSON.stringify({
      profit_table: 1,
      description: 1,
      date_from: fromTimestamp,
      date_to: toTimestamp,
      limit: 500,
      sort: "DESC"
    }));
  }

  // ===============================
  // 🔹 Fonction pour mettre à jour le tableau
  // ===============================
  function updateTradeTable(trades) {
    const tbody = document.getElementById("autoHistoricalBody");
    tbody.innerHTML = "";

    if (trades.length === 0) {
      tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;">No Trade Found</td></tr>';
      return;
    }

    trades.forEach(trade => {
      const tr = document.createElement("tr");
      const time = trade.sell_time
        ? new Date(trade.sell_time * 1000).toLocaleString()
        : "-";

      const profit = trade.sell_price - trade.buy_price;
      const status = profit.toFixed(2) > 0 ? "Win" : (profit.toFixed(2) < 0 ? "Loss" : "Even");


      tr.innerHTML = `
       <td>${time}</td>
       <td>${trade.contract_id || "-"}</td>
       <td>${trade.underlying_symbol || "-"}</td>
       <td>${trade.contract_type || "-"}</td>
       <td>${trade.buy_price?.toFixed(2) || "-"}</td>
       <td>${trade.multiplier || "-"}</td>
       <td>${trade.take_profit || "-"}</td>
       <td>${trade.stop_loss || "-"}</td>
       <td style="color:${profit.toFixed(2) >= 0 ? 'limegreen' : 'red'};">${(profit.toFixed(2) > 0 ? "+" : "") + profit.toFixed(2)}</td>
       <td>${status}</td>
     `;
      tbody.appendChild(tr);
    });
  }

  function GetProfitConnection() {
    const startInput = document.getElementById("startDate").value;
    const endInput = document.getElementById("endDate").value;

    if (connection_ws === null) {
      connection_ws = new WebSocket(WS_URL);
      connection_ws.onopen = () => {
        connection_ws.send(JSON.stringify({ authorize: TOKEN }));
      };
    }

    if (connection_ws && (connection_ws.readyState === WebSocket.OPEN || connection_ws.readyState === WebSocket.CONNECTING)) {
      connection_ws.onopen = () => { connection_ws.send(JSON.stringify({ authorize: TOKEN })); };
    }

    if (connection_ws && (connection_ws.readyState === WebSocket.CLOSED || connection_ws.readyState === WebSocket.CLOSING)) {
      connection_ws = new WebSocket(WS_URL);
      connection_ws.onopen = () => { connection_ws.send(JSON.stringify({ authorize: TOKEN })); };
    }

    connection_ws.onclose = () => { console.log("Disconnected"); console.log("WS closed"); };
    connection_ws.onerror = e => { console.log("WS error " + JSON.stringify(e)); };
    connection_ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);

      if (data.msg_type === "authorize") {
        connection_ws.send(JSON.stringify({
          profit_table: 1,
          description: 1,
          date_from: startInput.toString(),
          date_to: endInput.toString(),
          limit: 500,
          sort: "DESC"
        }));
      }

      // Quand on reçoit la profit_table
      if (data.msg_type === "profit_table") {
        structresponse = getProfitStats(data);
        // Animation simultanée des cercles et des chiffres 
        profitvalue.textContent = " " + structresponse.totalProfitPrice__ + " " + CURRENCY.toString();
        lossvalue.textContent = " " + structresponse.totalLossPrice__ + " " + CURRENCY.toString();

        if (structresponse.totalPNLprice__ > 0) {
          plvalue.style.color = "#10b981";
          plvalue.textContent = " " + structresponse.totalPNLprice__ + " " + CURRENCY.toString();
        }
        else {
          plvalue.style.color = "#ff4d4d";
          plvalue.textContent = " " + structresponse.totalPNLprice__ + " " + CURRENCY.toString();
        }

        circles.forEach(circle => {
          let targetDeg = 0;
          let targetPercent = 0;

          if (circle.classList.contains("red")) { targetDeg = parseFloat(structresponse.lossRate) * 3.6; targetPercent = parseFloat(structresponse.lossRate); }
          if (circle.classList.contains("blue")) { targetDeg = parseFloat(structresponse.winRate) * 3.6; targetPercent = parseFloat(structresponse.winRate); }
          if (circle.classList.contains("mix")) { targetDeg = parseFloat(structresponse.pnlPercent) * 3.6; targetPercent = parseFloat(structresponse.pnlPercent); }

          let currentDeg = 0;
          let currentPercent = 0;
          const stepDeg = targetDeg / 60;       // 60 frames (≈ 1 sec)   
          const stepPercent = targetPercent / 60;
          const span = circle.querySelector("span");
          const color =
            circle.classList.contains("red")
              ? "#434040ff"
              : circle.classList.contains("blue")
                ? "#434040ff"
                : "#434040ff";

          const interval = setInterval(() => {
            if (currentDeg >= targetDeg) {
              clearInterval(interval);
              span.textContent = targetPercent + "%";
            } else {
              currentDeg += stepDeg;
              currentPercent += stepPercent;
              circle.style.background = `conic-gradient(${color} ${currentDeg}deg, #e5e7eb ${currentDeg}deg)`;
              span.textContent = Math.round(currentPercent) + "%";
            }
          }, 16); // 60 FPS
        });
      }
    };
  }

  // === Récupérer les contrats Deriv et tracer le profit ===
  function GetProfitgraphical() {
    const startInput = document.getElementById("startDate").value;
    const endInput = document.getElementById("endDate").value;

    if (!startInput || !endInput) {
      alert("Please select a start date and an end date.");
      return;
    }

    // Initialiser WS si nécessaire
    if (!connection_ws_htx || connection_ws_htx.readyState === WebSocket.CLOSED) {
      connection_ws_htx = new WebSocket(WS_URL);

      connection_ws_htx.onopen = () => {
        connection_ws_htx.send(JSON.stringify({ authorize: TOKEN }));
      };
    } else if (connection_ws_htx.readyState === WebSocket.OPEN) {
      connection_ws_htx.send(JSON.stringify({ authorize: TOKEN }));
    }

    connection_ws_htx.onmessage = (msg) => {
      const data = JSON.parse(msg.data);

      if (data.msg_type === "authorize") {
        connection_ws_htx.send(JSON.stringify({
          profit_table: 1,
          description: 1,
          date_from: startInput.toString(),
          date_to: endInput.toString(),
          limit: 500,
          sort: "ASC",
        }));
      }

      // Quand on reçoit la profit_table
      if (data.msg_type === "profit_table") {
        const txs = data.profit_table.transactions;

        // === Transformation des transactions en série exploitable ===
        const profitData = txs
          .filter(t => t.sell_time && !isNaN(t.sell_price)) // uniquement les clôturées
          .map(t => ({
            time: Number(t.sell_time),                  // timestamp UNIX en secondes
            value: +(t.sell_price - t.buy_price).toFixed(2), // profit net
          }))
          .filter(p => p.time > 0 && !isNaN(p.value))     // validation des données
          .sort((a, b) => a.time - b.time);               // ordre chronologique

        console.log("profitData:", profitData); // vérification 

        if (profitData.length > 0) {
          // 🔍 Filtrage & validation
          const cleanProfitData = profitData.filter((p, i) => {
            if (p.value === null || p.value === undefined || isNaN(p.value)) {
              console.warn(`⚠️ Valeur invalide @ index ${i}:`, p);
              return false;
            }
            return true;
          });

          const seenTimes = new Set();
          const uniqueData = cleanProfitData.filter(p => {
            if (seenTimes.has(p.time)) {
              console.warn(`⛔ Timestamp dupliqué ignoré:`, p);
              return false;
            }
            seenTimes.add(p.time);
            return true;
          });

          if (!uniqueData.length) {
            console.error("❌ Aucune donnée valide à afficher !");
            return;
          }

          console.log("📊 Données finales utilisées:", uniqueData);
          areahistoricalSeries.setData(uniqueData);
          charthistorical.timeScale().fitContent();
        } else {
          alert("No contracts found for this period.");
        }
      }
    };

    connection_ws_htx.onerror = (err) => {
      console.error("Erreur WS:", err);
    };
  }

  // === Initialisation du graphique ===
  function inihistoricalchart() {
    if (!historicalchartcontainer) {
      console.error("❌ Container 'HistoricalContract' introuvable !");
      return;
    }

    // Supprimer le graphique précédent
    if (charthistorical) charthistorical.remove();
    historicalchartcontainer.innerHTML = "";

    // Créer le graphique
    charthistorical = LightweightCharts.createChart(historicalchartcontainer, {
      layout: {
        textColor: "#333",
        background: { type: "solid", color: "#fff" },
      },
      grid: {
        vertLines: { color: "rgba(200,200,200,0.3)" },
        horzLines: { color: "rgba(200,200,200,0.3)" },
      },
      timeScale: { timeVisible: true, secondsVisible: false },
    });

    // AreaSeries unique
    areahistoricalSeries = charthistorical.addAreaSeries({
      lineColor: "gray",
      lineWidth: 2,
      topColor: "gray",
      bottomColor: "gray",
    });

    // Données aléatoires au démarrage
    setRandomSeries();
  }

  // === Série aléatoire avant les vrais contrats ===
  function setRandomSeries() {
    const now = Math.floor(Date.now() / 1000);
    let randomData = [];
    const target = 1.0;      // Valeur cible (asymptote)    
    let value = 0;           // Point de départ

    for (let i = 300; i >= 1; i--) {
      const time = now - i * 3600; // toutes les heures

      // facteur d'apprentissage + petite variation aléatoire
      const delta = (target - value) * 0.05 + (Math.random() * 0.1 - 0.05);

      value += delta;

      randomData.push({
        time,
        value: +value.toFixed(3)
      });
    }

    areahistoricalSeries.setData(randomData);
  }

  // 🔹 Fonction de calcul PNL, WinRate, LossRate  
  function getProfitStats(response) {
    const transactions = response?.profit_table?.transactions || [];
    if (!transactions.length) return { pnlPercent: '0', winRate: '0', lossRate: '0' };

    let totalProfit = 0, totalBuy = 0, wins = 0, losses = 0, totalprofitprice = 0, totallossprice = 0;

    for (const c of transactions) {
      if (!c.sell_price || !c.buy_price) continue;
      const profit = c.sell_price - c.buy_price;
      totalProfit += profit;
      totalBuy += c.buy_price;
      if (profit > 0) {
        wins++;
        totalprofitprice += profit;
      }
      else if (profit < 0) {
        losses++;
        totallossprice += profit;
      }
    }

    const totalPNLprice__ = totalProfit.toFixed(2);
    const totalProfitPrice__ = totalprofitprice.toFixed(2);
    const totalLossPrice__ = totallossprice.toFixed(2);
    const total = wins + losses;
    const pnlPercent = totalBuy > 0 ? ((totalProfit / totalBuy) * 100).toFixed(2) : 0;
    const winRate = total > 0 ? ((wins / total) * 100).toFixed(2) : 0;
    const lossRate = total > 0 ? ((losses / total) * 100).toFixed(2) : 0;

    return { pnlPercent, winRate, lossRate, totalPNLprice__, totalProfitPrice__, totalLossPrice__ };
  }

  function initCalendarTable() {
    const CalendarList = document.getElementById("CalendarList");

    // Construction du tableau HTML
    CalendarList.innerHTML = `
     <table id="calendarTable" class="calendar-table">
       <thead>
         <tr>
           <th><input type="checkbox" id="selectAll__"></th>
           <th>Time</th>
           <th>Country Code</th>
           <th>Country Name</th>
           <th>Indicator Type</th>
           <th>Sector</th>
           <th>Currency</th>
           <th>Importance</th>
           <th>Impact</th>
           <th>Actual</th>
           <th>Previous</th>
           <th>Forecast</th>
           <th>Revision</th>
         </tr>
       </thead>
       <tbody id="calendarBody">
         <tr>
          <td colspan="13" style="text-align:center; color:gray;">
              No events loaded.
           </td>
         </tr>
       </tbody>
     </table>
   `;

    // 🧩 Ajout des gestionnaires pour le tri si nécessaires
    const headers = CalendarList.querySelectorAll("th");
    headers.forEach((th, i) => {
      th.addEventListener("click", () => sortCalendarTable(i));
    });

    // 🧩 Bouton "Tout sélectionner"
    const selectAll__ = document.getElementById("selectAll__");
    if (selectAll__) {
      selectAll__.addEventListener("change", e => {
        const checkboxes__ = CalendarList.querySelectorAll("#calendarBody input[type='checkbox']");
        checkboxes__.forEach(cb => cb.checked = e.target.checked);
      });
    }
  }

  // ✅ Requête WS Deriv API
  function fetchEconomicCalendar() {
    const token = TOKEN;
    if (!token) { alert('Please enter your Deriv token.'); return; }

    statusEl.textContent = 'statut: connexion...';
    if (ws_calendar) ws_calendar.close();
    ws_calendar = new WebSocket(WS_URL);

    ws_calendar.onopen = () => ws_calendar.send(JSON.stringify({ authorize: token }));

    ws_calendar.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.error) { statusEl.textContent = 'Error: ' + data.error.message; return; }

      if (data.authorize) {
        statusEl.textContent = 'Authorized: ' + (data.authorize.loginid || '');
        sendCalendarRequest();
        return;
      }

      if (data.economic_calendar && Array.isArray(data.economic_calendar.events)) {
        allEvents = data.economic_calendar.events;
        filterTable();
        statusEl.textContent = allEvents.length + ' événements chargés';
      }
    };

    ws_calendar.onerror = (e) => { statusEl.textContent = 'Erreur WebSocket'; console.error(e); };
    ws_calendar.onclose = () => { statusEl.textContent = 'Connexion closed'; };
  }

  // ✅ Envoi du payload calendrier
  function sendCalendarRequest() {
    const currency = document.getElementById('currency').value || undefined;
    const start = document.getElementById('startDate').value;
    const end = document.getElementById('endDate').value;
    const payload = { economic_calendar: 1 };

    if (currency) payload.currency = currency;
    if (start) payload.start_date = Math.floor(new Date(start).getTime() / 1000);
    if (end) payload.end_date = Math.floor(new Date(end).getTime() / 1000);

    ws_calendar.send(JSON.stringify(payload));
    statusEl.textContent = 'statut: Resquest sent...';
  }

  // ✅ Met à jour les lignes du tableau
  // ================================
  // FONCTION POUR INITIER L’OVERLAY
  // ================================
  function createOverlayCanvas(chartContainer, chart, drawCallback) {
    const overlayCanvas = document.createElement('canvas');
    overlayCanvas.style.position = 'absolute';
    overlayCanvas.style.top = '0';
    overlayCanvas.style.left = '0';
    overlayCanvas.style.pointerEvents = 'none';
    overlayCanvas.width = chartContainer.offsetWidth;
    overlayCanvas.height = chartContainer.offsetHeight;
    chartContainer.appendChild(overlayCanvas);

    const ctx = overlayCanvas.getContext('2d');

    chart.subscribeVisibleTimeRangeChange(() => {
      overlayCanvas.width = chartContainer.offsetWidth;
      overlayCanvas.height = chartContainer.offsetHeight;
      drawCallback();
    });

    chart.subscribeCrosshairMove(() => drawCallback());

    return ctx;
  }

  // ================================
  // FONCTION POUR DESSINER LES LIGNES VERTICALES
  // ================================
  function drawEventLines(chart, overlayCtx, currentSeries) {
    if (!overlayCtx || !currentSeries) return;
    overlayCtx.clearRect(0, 0, overlayCtx.canvas.width, overlayCtx.canvas.height);

    const timeScale = chart.timeScale();

    economicEventLines.forEach(line => {
      const x = timeScale.timeToCoordinate(line.time);
      if (x === null) return;

      overlayCtx.beginPath();
      overlayCtx.strokeStyle = line.color;
      overlayCtx.lineWidth = 2;
      overlayCtx.setLineDash([4, 4]);
      overlayCtx.moveTo(x, 0);
      overlayCtx.lineTo(x, overlayCtx.canvas.height);
      overlayCtx.stroke();
    });

    overlayCtx.setLineDash([]);
  }

  // ================================
  // FONCTION POUR METTRE À JOUR LE TABLEAU
  // ================================
  function updateCalendarTable(events) {
    const body = document.getElementById("calendarBody");
    if (!body) return;

    displayedEvents = events;
    let rows = "";

    events.forEach((e, index) => {
      const actual = e.actual?.display_value || "-";
      const previous = e.previous?.display_value || "-";
      const forecast = e.forecast?.display_value || "-";
      const revision = e.revision?.display_value || "-";
      const impactValue = e.impact ?? "-";
      const releaseDate = e.release_date
        ? new Date(e.release_date * 1000).toLocaleString()
        : "-";
      const currency = e.currency || "-";
      const indicator = e.event_name || "-";

      let impactColor = "gray";
      if (impactValue >= 4) impactColor = "#ff4444";
      else if (impactValue >= 2) impactColor = "#ffaa00";
      else if (impactValue > 0) impactColor = "#22cc22";
      const impactClass = `impact-${Math.min(Math.max(impactValue, 1), 5)}`;

      rows += `
          <tr data-rowid="${index}">
            <td><input type="checkbox" class="calendar-checkbox"></td>
            <td data-sort="${e.release_date || 0}">${releaseDate}</td>
            <td>${GetCountrycode(currency)}</td>
            <td>${GetCountryname(currency)}</td>   
            <td>${indicator}</td>
            <td>-</td>
            <td>${currency}</td>
            <td>
              <span class="importance-box ${impactClass}"></span>  
              ${impactValue ? `Impact ${impactValue}` : ""}
            </td>
            <td style="color:${impactColor}; font-weight:bold;" data-sort="${impactValue}">
              ${impactValue}
            </td>
            <td>${actual}</td>
            <td>${previous}</td>
            <td>${forecast}</td>
            <td>${revision}</td>
          </tr>
        `;
    });

    body.innerHTML =
      rows ||
      `<tr><td colspan="13" style="text-align:center; color:gray;">
            No events found for this period.
         </td></tr>`;

    attachSortHandlers();
    attachCheckboxListener();
  }

  // ================================
  // FONCTION POUR LES CHECKBOX
  // ================================
  function attachCheckboxListener() {
    const checkboxes = document.querySelectorAll(".calendar-checkbox");

    checkboxes.forEach((cb, idx) => {
      cb.addEventListener("change", () => {
        const row = cb.closest("tr");
        const index = parseInt(row.dataset.rowid);
        const eventData = displayedEvents[index];
        if (!eventData) return;

        if (cb.checked) {
          addEconomicMarker(eventData, index);
        } else {
          removeEconomicMarker(eventData, index);
        }
      });
    });
  }

  // ================================
  // AJOUT D’UN MARKER + LIGNE
  // ================================
  function addEconomicMarker(eventData, index) {
    if (!currentSeries || !eventData) return;

    const t = Math.floor(eventData.release_date);

    const color =
      eventData.impact >= 4 ? "#484141ff" :
        eventData.impact >= 2 ? "#484141ff" :
          "#484141ff";

    // Marker classique
    const marker = {
      time: t,
      position: "aboveBar",
      color: color,
      shape: "circle",
      text: `@${eventData.currency} - ${eventData.event_name}\nImpact ${eventData.impact}`
    };
    const prevMarkers = currentSeries._economicMarkers || [];
    currentSeries._economicMarkers = [...prevMarkers, marker];
    currentSeries.setMarkers(currentSeries._economicMarkers);
    economicMarkers[index] = { marker };

    // Ligne verticale
    economicEventLines.push({ time: t, color: color });
    drawEventLines(chart, overlayCtx, currentSeries);
  }

  // ================================
  // SUPPRESSION D’UN MARKER + LIGNE
  // ================================
  function removeEconomicMarker(eventData, index) {
    if (!currentSeries || !currentSeries._economicMarkers) return;

    const t = Math.floor(eventData.release_date);

    currentSeries._economicMarkers = currentSeries._economicMarkers.filter(m => m.time !== t);
    currentSeries.setMarkers(currentSeries._economicMarkers);

    economicEventLines = economicEventLines.filter(line => line.time !== t);
    drawEventLines(chart, overlayCtx, currentSeries);

    delete economicMarkers[index];
  }

  function GetCountryname(currency) {
    for (let i = 0; i < 9; i++) {
      if (currency === "EUR") {
        response = "Europe (EU)";
        break;
      }
      else if (currency === "USD") {
        response = "United States (US)";
        break;
      }
      else if (currency === "CAD") {
        response = "Canada (CA)";
        break;
      }
      else if (currency === "AUD") {
        response = "Australia (AU)";
        break;
      }
      else if (currency === "JPY") {
        response = "Japan (JP)";
        break;
      }
      else if (currency === "CNY") {
        response = "China (CN)";
        break;
      }
      else if (currency === "GBP") {
        response = "United-Kingdom (GB)";
        break;
      }
      else if (currency === "MXN") {
        response = "Mexico (MX)";
        break;
      }
      else if (currency === "CHF") {
        response = "Switzerland (CH)";
        break;
      }
    }

    return (response);
  }

  function GetCountrycode(currency) {
    for (let i = 0; i < 9; i++) {
      if (currency === "EUR") {
        response = "EU";
        break;
      }
      else if (currency === "USD") {
        response = "US";
        break;
      }
      else if (currency === "CAD") {
        response = "CA";
        break;
      }
      else if (currency === "AUD") {
        response = "AU";
        break;
      }
      else if (currency === "JPY") {
        response = "JP";
        break;
      }
      else if (currency === "CNY") {
        response = "CN";
        break;
      }
      else if (currency === "GBP") {
        response = "GB";
        break;
      }
      else if (currency === "MXN") {
        response = "MX";
        break;
      }
      else if (currency === "CHF") {
        response = "CH";
        break;
      }
    }

    return (response);
  }

  function attachSortHandlers() {
    const headers = document.querySelectorAll("#calendarTable thead th");
    headers.forEach((th, index) => {
      th.style.cursor = "pointer";
      th.onclick = () => sortCalendarTable(index);
    });
  }

  function sortCalendarTable(columnIndex) {
    if (!displayedEvents.length) return;

    const columns = [
      "checkbox",
      "release_date",
      "country_code",
      "country_name",
      "event_name",
      "sector",
      "currency",
      "importance",
      "impact",
      "actual",
      "previous",
      "forecast",
      "revision",
    ];

    const key = columns[columnIndex];
    if (!key) return;

    // Inversion du sens de tri si on reclique sur la même colonne
    if (currentSort.column === key) {
      currentSort.ascending = !currentSort.ascending;
    } else {
      currentSort = { column: key, ascending: true };
    }

    displayedEvents.sort((a, b) => {
      const valA = extractValue(a, key);
      const valB = extractValue(b, key);

      if (typeof valA === "number" && typeof valB === "number")
        return currentSort.ascending ? valA - valB : valB - valA;
      return currentSort.ascending
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });

    updateCalendarTable(displayedEvents);
  }

  function extractValue(event, key) {
    switch (key) {
      case "release_date":
        return event.release_date || 0;
      case "impact":
        return event.impact || 0;
      case "event_name":
        return event.event_name || "";
      case "currency":
        return event.currency || "";
      case "actual":
        return parseFloat(event.actual?.display_value || 0);
      case "previous":
        return parseFloat(event.previous?.display_value || 0);
      case "forecast":
        return parseFloat(event.forecast?.display_value || 0);
      default:
        return "-";
    }
  }
  // ✅ Filtrage du tableau
  function filterTable() {
    const q = document.getElementById('search').value.toLowerCase();
    const imp = document.getElementById('impactFilter').value.toLowerCase();
    const start = document.getElementById('startDate').value;
    const end = document.getElementById('endDate').value;

    const filtered = allEvents.filter(e => {
      const raw = JSON.stringify(e).toLowerCase();
      const matchQ = !q || raw.includes(q);
      const matchI = !imp || String(e.importance || '').toLowerCase().includes(imp);

      let matchDate = true;
      if (start || end) {
        const ts = Number(e.date || e.time || 0) * 1000;
        if (ts) {
          const d = new Date(ts);
          if (start && d < new Date(start)) matchDate = false;
          if (end && d > new Date(end)) matchDate = false;
        }
      }

      return matchQ && matchI && matchDate;
    });

    displayedEvents = filtered; // garde la liste filtrée pour le tri
    updateCalendarTable(filtered);
  }

  // ===============================
  // 🔹 Événement du bouton Rechercher
  // ===============================
  document.getElementById("fetchTrades").addEventListener("click", () => {
    const startInput = document.getElementById("startDate").value;
    const endInput = document.getElementById("endDate").value;

    if (!startInput || !endInput) {
      alert("Please select a start and end date.");
      return;
    }

    const start = startInput.toString();     //Math.floor(new Date(startInput + "T00:00:00Z").getTime() / 1000);
    const end = endInput.toString();         //Math.floor(new Date(endInput + "T23:59:59Z").getTime() / 1000);

    console.log(`📅 Période sélectionnée : ${startInput} → ${endInput}`);
    getProfitTable(start, end);
    GetProfitgraphical();
    GetProfitConnection();
    connectHistoricalDeriv();
  });

  // 🔹 Gérer le changement de compte dans la combobox
  document.getElementById("accountSelect")?.addEventListener("change", (e) => {
    const selectedToken = e.target.value;
    const selectedAccount = getStoredAccounts().find(a => a.token === selectedToken);

    if (selectedAccount) {
      console.log("🔑 Compte sélectionné :", selectedAccount.account);
      console.log("💰 Devise :", selectedAccount.currency);
      console.log("🧾 Token :", selectedAccount.token);
      //--- APP TOKEN 
      TOKEN = selectedAccount.token;
      CURRENCY = selectedAccount.currency;
      profitcurrency.textContent = selectedAccount.currency;
      plcurrency.textContent = selectedAccount.currency;
      losscurrency.textContent = selectedAccount.currency;
      tokencalendar.value = selectedAccount.token;
      DisconnectDeriv();

      // Exemple d'utilisation : connexion Deriv WebSocket
      connection = new WebSocket(WS_URL);
      connection.onopen = () => {
        connection.send(JSON.stringify({ authorize: selectedAccount.token }));
      };
      connection.onmessage = (msg) => {
        const data = JSON.parse(msg.data);
        if (data.msg_type === "authorize") {
          //console.log("✅ Authorized successfully :", data.authorize.loginid);
          connection.send(JSON.stringify({ get_settings: 1 }));
          connection.send(JSON.stringify({ balance: 1, subscribe: 1 }));

          const bal = data.authorize.balance;
          const currency = selectedAccount.currency || "USD";
          balanceValue.textContent = bal.toString() + " " + currency;
        }

        if (data.msg_type === "get_settings") {
          const user = data.get_settings;
          const fullname = " " + data.get_settings.first_name + " " + data.get_settings.last_name;
          accountHolder.textContent = fullname.toString();
        }
      };
    }
  });

  // 🔹 Bouton pour supprimer uniquement le compte sélectionné
  document.getElementById("deleteSelectedAccount")?.addEventListener("click", () => {
    const combo = document.getElementById("accountSelect");
    const selectedToken = combo.value;

    if (!selectedToken) {
      alert("⚠️ Please first select an account to delete.");
      return;
    }

    let accounts = getStoredAccounts();
    const beforeCount = accounts.length;

    // Filtrer pour garder tous les comptes sauf celui sélectionné
    accounts = accounts.filter(acc => acc.token !== selectedToken);

    // Sauvegarder les changements
    saveAccounts(accounts);

    // Rafraîchir la combobox
    populateAccountCombo();

    if (accounts.length < beforeCount) {
      console.log("🗑️ Compte supprimé avec succès !");
    } else {
      console.warn("❌ Aucun compte correspondant trouvé.");
    }
  });

  // === 🧹 ÉVÉNEMENTS SUR LES BOUTONS DELETE ===
  document.addEventListener("click", (e) => {
    // Si l’utilisateur clique sur un bouton Close
    if (e.target.classList.contains("deleteRowBtn")) {
      const tr = e.target.closest("tr");
      const checkbox = tr.querySelector(".rowSelect");
      const contract_id = tr.dataset.contract;

      // On ne ferme que si la case est cochée
      if (checkbox && checkbox.checked) {
        closeContract(contract_id);
        tr.remove(); // suppression immédiate de la ligne
      } else {
        alert("☑️ Please check the box before closing this contract.");
      }
    }
  });

  // === 🧹 ÉVÉNEMENTS SUR LES BOUTONS DELETE ===
  document.addEventListener("click", (e) => {

    // 🔹 Suppression multiple (bouton global "Delete Selected")
    if (e.target.id === "deleteSelected") {
      const checkedBoxes = document.querySelectorAll(".rowSelect:checked");

      if (checkedBoxes.length === 0) {
        alert("Please select at least one contract to close.");
        return;
      }

      checkedBoxes.forEach((checkbox) => {
        const tr = checkbox.closest("tr");
        const contract_id = tr.children[2].textContent.trim();

        closeContract(contract_id);
        tr.remove();
      });

      alert("🟢 All selected contracts have been sent for closure!");
    }
  });

  // === 🔘 SÉLECTIONNER / DÉSÉLECTIONNER TOUT ===
  document.addEventListener("change", (e) => {
    if (e.target.id === "selectAll") {
      const checked = e.target.checked;
      document.querySelectorAll(".rowSelect").forEach(cb => cb.checked = checked);
    }
  });

  contractsPanelToggle.addEventListener("click", () => {
    if (!contractsPanel.classList.contains("active")) {
      contractsPanel.style.display = "flex";
      const contentHeight = contractsPanel.scrollHeight + "px";
      contractsPanel.style.height = contentHeight;
      contractsPanel.classList.add("active");
      contractsPanelToggle.textContent = "📁 Hide Contracts";
      autoHistoryList.innerHTML = " ";
      initTable();
    } else {
      contractsPanel.style.height = contractsPanel.scrollHeight + "px";
      requestAnimationFrame(() => {
        contractsPanel.style.height = "0";
      });
      contractsPanel.classList.remove("active");
      contractsPanelToggle.textContent = "📄 Show Contracts";
      setTimeout(() => (contractsPanel.style.display = "none"), 400);
    }
  });

  // === Automation Toggle ===
  startbtn.onclick = () => {
    setTimeout(startMLCountdown, 7000);
    startSignalPipeline((data) => {
      console.log(
        `[${new Date(data.time * 1000).toLocaleTimeString()}]`,
        data.signal,
        data.price,
        data.prob
      );
    });

    startControlPipeline();
  };

  stopbtn.onclick = () => {
    stopControlPipeline();
    shutdownAllPipelines();
  };

  // --- TOGGLE PANEL ---
  controlPanelToggle.addEventListener("click", () => {
    if (!controlFormPanel) return;
    if (controlFormPanel.classList.contains("active")) {
      controlFormPanel.classList.remove("active");
      controlFormPanel.style.display = "none";
    } else {
      controlFormPanel.style.display = "flex";
      setTimeout(() => controlFormPanel.classList.add("active"), 10);
    }
  });

  // wire connect button
  connectBtn.addEventListener("click", () => {
    if (!isConnect) {
      connectBtn.textContent = "Connecting...";
      accountInfo.textContent = "Connecting...";
      isConnect = true;
      connectDeriv();
      displaySymbols(currentInterval, currentChartType);
    } else {
      connectBtn.textContent = "Disconnecting...";
      accountInfo.textContent = "Disconnecting...";
      isConnect = false;
      DisconnectDeriv();
    }
  });

  // 1️⃣ Intercepter les erreurs globales
  window.addEventListener("error", function (e) {
    const msg = e.message || "";
    if (
      msg.includes("Unchecked runtime.lastError") ||
      msg.includes("The message port closed before a response was received") ||
      msg.includes("Error: no ad") ||
      msg.includes("content.js") ||
      msg.includes("iframe.js")
    ) {
      e.preventDefault();
      e.stopImmediatePropagation();
      return false; // empêche l'affichage
    }
  }, true);

  // startup
  initDerivAccountManager();
  displaySymbols(currentInterval, currentChartType);
  initChart(currentChartType);
  initTable();
  initHistoricalTable();
  inihistoricalchart();

  window.onload = () => {
    if (!currentSymbol) return;
    if (currentChartType !== "candlestick") return;
    connectInit(currentSymbol, currentInterval, currentChartType);
  };

  // Simulation : mise à jour toutes les 2 secondes
  setInterval(() => {
    if (connectBtn.textContent !== "Connect") {
      // Subscribing Tables  S
      connectDeriv_table();
    }
  }, 300);

  // Gestion du "Select All"  
  const selectAll = document.getElementById("selectAll");
  selectAll.addEventListener("change", () => {
    document.querySelectorAll(".rowSelect").forEach(cb => {
      cb.checked = selectAll.checked;
    });
  });

  // Supprimer les lignes sélectionnées
  document.getElementById("deleteSelected").addEventListener("click", () => {
    document.querySelectorAll(".rowSelect:checked").forEach(cb => {
      cb.closest("tr").remove();
    });
    selectAll.checked = false;
  });

  // === Trade Evaluation Panel Toggle ===
  tradeEvalToggle.addEventListener("click", () => {
    tradeEvalPanel.classList.toggle("active");

    if (tradeEvalPanel.classList.contains("active")) {
      // Animation simultanée des cercles et des chiffres
      circles.forEach(circle => {
        let targetDeg = 0;
        let targetPercent = 0;

        if (circle.classList.contains("red")) { targetDeg = 70; targetPercent = 20; }
        if (circle.classList.contains("blue")) { targetDeg = 280; targetPercent = 70; }
        if (circle.classList.contains("mix")) { targetDeg = 120; targetPercent = 50; }

        let currentDeg = 0;
        let currentPercent = 0;
        const stepDeg = targetDeg / 60;       // 60 frames (≈ 1 sec)
        const stepPercent = targetPercent / 60;
        const span = circle.querySelector("span");
        const color =
          circle.classList.contains("red")
            ? "#ef4444"
            : circle.classList.contains("blue")
              ? "#3b82f6"
              : "#10b981";

        const interval = setInterval(() => {
          if (currentDeg >= targetDeg) {
            clearInterval(interval);
            span.textContent = targetPercent + "%";
          } else {
            currentDeg += stepDeg;
            currentPercent += stepPercent;
            circle.style.background = `conic-gradient(${color} ${currentDeg}deg, #e5e7eb ${currentDeg}deg)`;
            span.textContent = Math.round(currentPercent) + "%";
          }
        }, 16); // 60 FPS
      });
    } else {
      // Réinitialisation des cercles à la fermeture
      circles.forEach(circle => {
        circle.style.background = "conic-gradient(#e5e7eb 0deg, #e5e7eb 360deg)";
        const span = circle.querySelector("span");
        span.textContent = "0%";
      });
    }
  });

  window.addEventListener('load', () => {
    // sécurise la récupération des tokens ici
    const params = new URLSearchParams(window.location.search);
    TOKEN = params.get('token1');
    CURRENCY = params.get('cur1');
    if (TOKEN) {
      // puis exécute l'autorisation Deriv
      console.log("USER TOKEN : " + TOKEN);
      tokencalendar.value = TOKEN;
    }
  });

  // ✅ Initialisation du tableau à la création
  initCalendarTable();

  document.getElementById('fetchCalendar').addEventListener('click', fetchEconomicCalendar);
  document.getElementById('refresh').addEventListener('click', () => {
    if (ws && ws.readyState === WebSocket.OPEN) sendCalendarRequest();
    else fetchEconomicCalendar();
  });
  document.getElementById('search').addEventListener('input', filterTable);
  document.getElementById('impactFilter').addEventListener('change', filterTable);
  document.getElementById('startDate').addEventListener('change', filterTable);
  document.getElementById('endDate').addEventListener('change', filterTable);

  // ✅ Définir des dates par défaut (1 semaine)
  (function initDates() {
    const today = new Date();
    const start = new Date(today); start.setDate(today.getDate() - 3);
    const end = new Date(today); end.setDate(today.getDate() + 3);
    document.getElementById('startDate').value = start.toISOString().slice(0, 10);
    document.getElementById('endDate').value = end.toISOString().slice(0, 10);
  })();

  window.addEventListener('beforeunload', () => { try { if (ws) ws.close(); } catch (e) { } });
  window.addEventListener('resize', () => chart.applyOptions({ width: chartInner.clientWidth, height: chartInner.clientHeight }));

  // === CONTRÔLES POPUP ===
  openModalBtn.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", e => {
    if (e.target === modal) modal.style.display = "none";
  });

  // === Changement du type de graphique ===
  document.querySelectorAll(".chart-type-btn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      currentChartType = e.target.dataset.type.trim();
      console.log("Current Chart Type : " + currentChartType);
      if (!currentSymbol) return;
      ws.send(JSON.stringify({ forget_all: ["candles", "ticks"] })); // oublie l'ancien symbole
      await loadSymbol(currentSymbol, currentInterval, currentChartType);
  
    });  
  });

  // === Changement d’intervalle ===
  document.querySelectorAll(".interval-btn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      // Récupère le texte du bouton (ex: "1 minute")
      currentInterval = e.target.textContent.trim();
      if (!currentSymbol) return;
      await loadSymbol(currentSymbol, currentInterval, currentChartType);
      console.log("⏱️ Current Interval:", currentInterval);

      // Supprime la classe active sur tous les boutons
      document.querySelectorAll(".interval-btn").forEach(b => b.classList.remove("active"));
      // Ajoute la classe active au bouton cliqué    
      e.target.classList.add("active");
    });
  });

  // === Changement de symbole  ===
  document.querySelectorAll(".symbol-item").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      currentSymbol = e.target.dataset.symbol.trim();
      if (!currentSymbol) return;
      await loadSymbol(currentSymbol, currentInterval, currentChartType);
      console.log("Current Symbol:", currentSymbol);
    });
  });

  //--- Connexion automatique au chargement de la page si conditions remplies ---
  // Ouvrir popup
  document.getElementById("DatasettingPopup").onclick = () => {
    document.getElementById("settingsPopup").style.display = "flex";
  };

  // Fermer popup
  document.getElementById("closePopupBtn").onclick = () => {
    document.getElementById("settingsPopup").style.display = "none";
  };

  // Sauvegarder + assigner les variables
  document.getElementById("savePopupBtn").onclick = () => {

    multiplier = parseInt(Number(document.getElementById("multiplierSelect").value)) || 40;
    stake = parseFloat(Number(document.getElementById("stakeInput").value)) || 1.0;
    buyNum = parseInt(Number(document.getElementById("buyNumberInput").value)) || 1;
    sellNum = parseInt(Number(document.getElementById("sellNumberInput").value)) || 1;
    tp_contract = Number(document.getElementById("tpInput").value);
    sl_contract = Number(document.getElementById("slInput").value);

    console.log("Données sauvegardées :");
    console.log({ multiplier, stake, buyNumber, sellNumber, tp_contract, sl_contract });

    // Fermer le popup
    document.getElementById("settingsPopup").style.display = "none";
  };

  // -------------------------------------------------------------
  // 1. Quand on ouvre la fenêtre, on initialise le WS + authorize
  // -------------------------------------------------------------
  openCashierBtn.addEventListener("click", async () => {
    cashierModal.classList.add("active");
    connectDeriv__();
  });

  closePopupBtn.onclick = () => {
    DisconnectDeriv__();
    cashierModal.classList.remove("active");
  };

  /* ============================
     SEND VERIFICATION EMAIL
  ============================ */
  document.getElementById("sendEmailBtn").onclick = () => {
    const email = document.getElementById("emailInput").value.trim();

    if (!email) {
      showError("Email requis");
      return;
    }

    wsTranscation.send(JSON.stringify({
      verify_email: email,
      type: "account_openning"
    }));
  };

  /* ============================
     GENERATE CASHIER URL
  ============================ */
  document.getElementById("validateCodeBtn").onclick = () => {
    const action = document.getElementById("actionSelect").value;
    const provider = document.getElementById("providerSelect").value;
    const currency = document.getElementById("currencySelect").value.trim();
    const code = document.getElementById("codeInput").value.trim();

    if (!code) {
      showError("Code email requis");
      return;
    }

    const payload = {
      cashier: action,           // deposit | withdrawal
      verification_code: code,
      provider: provider
    };

    if (currency) {
      payload.currency = currency;
    }

    wsTranscation.send(JSON.stringify(payload));
  };

  document.getElementById("closeWebview").onclick = () => {
    DisconnectDeriv__();
    document.getElementById("webviewModal").style.display = "none";
    document.getElementById("webviewFrame").src = "";
  };

  /* ================== POP UP FOR INDICATOR ================== */
  openBtngpt.onclick = () => overlaygemini.classList.remove("hidden");

  function closePopup() {
    overlaygemini.classList.add("hidden");
  }

  // Fermer si clic hors popup
  overlaygemini.addEventListener("click", (e) => {
    if (e.target === overlaygemini) closePopup();
  });



  // ================================
  // INITIALISATION DE L’OVERLAY (À APPELER UNE FOIS)
  // ================================  
  overlayCtx = createOverlayCanvas(chartInner, chart, () => drawEventLines(chart, overlayCtx, currentSeries));

});
