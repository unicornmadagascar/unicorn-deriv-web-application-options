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

  const overlaygemini = document.getElementById("indicatorOverlay");
  const openBtngpt = document.getElementById("openPopupBtn__");
  const canvas = document.getElementById('Trendoverlay__');
  const contextMenu = document.getElementById('context-menu');
  const deleteItem = document.getElementById('deleteItem');
  const visibilityItem = document.getElementById('visibilityItem');
  const lockFiboItem = document.getElementById('lockFiboItem');
  const modal_symbol = document.getElementById('modalOverlay');
  const openBtn = document.getElementById('openPickerBtn');
  const ctx = canvas.getContext('2d');
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
  let isZigZagActive = false;
  let isMAActive = false; // Variable globale pour l'état
  let lastTotalPnL = 0;
  let allTradesData = [];
  let currentPage = 1;
  const rowsPerPage = 10;
  let currentSortOrder = 'none';
  let lastSeenTradeId = null;
  let historicalConn = null;
  let closedTradesHistory = [];
  let activeContracts = {};
  let currentSortCol = -1;
  let isAscending = true;
  /* --- Variables globales pour le dessin --- */
  let drawingObjects = [];
  let currentMode = null;
  let selectedObject = null;
  let activePoint = null;
  let setup = null;
  let activeHandle = null;
  let dragOffset = null;
  let showDrawings = true; // État de visibilité global
  let fiboObj = null;      // Outil Fibonacci
  let vpLookback = 300;    // Période ajustable pour le Volume Profile  
  let isFiboLocked = false; // État du verrouillage   
  let lastAlertPrice = 0;
  let lastAlertTime = 0;
  const alertThresholdPips = 2; // Sensibilité de détection (en pips/points)
  let showVolumeProfile = true; // État spécifique pour le VP
  let showFiboAnalysis = false; // Variable globale pour le rendu
  let selectedSymbol = null;
  let selectedSymbolLocated = null;
  let selectedSymbolconverted = null;
  let smoothedVol = 0; // Mémoire de la position précédente
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
  let currentChartSeries = null;
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
  let priceLines4openlines = {}; // Stocke les lignes actives (clé = contract_id)
  let currentContractTypeGlobal = "";
  let activeContractsData = {}; // Stockage des infos détaillées (profit, etc.)
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
  let currentInterval = "1m";  // par défaut

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
  // VARIABLES GLOBALES SYMBOLS
  // ================================ 
  const data = {
    metals: ["Gold/USD", "Palladium/USD", "Silver/USD", "Platinum/USD"],
    crypto: ["BTC/USD", "ETH/USD"],
    minor: ["AUD/CAD", "AUD/CHF", "AUD/NZD", "EUR/NZD", "GBP/CAD", "GBP/CHF", "GBP/NZD", "NZD/JPY", "NZD/USD", "USD/MXN", "USD/PLN"],
    major: ["AUD/JPY", "AUD/USD", "EUR/AUD", "EUR/CAD", "EUR/CHF", "EUR/GBP", "EUR/JPY", "EUR/USD", "GBP/JPY", "USD/CAD", "GBP/USD", "GBP/AUD", "USD/CHF"],
    step: ["Step Index 100", "Step Index 200", "Step Index 300", "Step Index 400", "Step Index 500"],
    jump: ["Jump 10 Index", "Jump 25 Index", "Jump 50 Index", "Jump 75 Index", "Jump 100 Index"],
    crash: ["Boom 300", "Boom 500", "Boom 600", "Boom 900", "Boom 1000", "Crash 300", "Crash 500", "Crash 600", "Crash 900", "Crash 1000"],
    continuous: ["Volatility 10 (1s)", "Volatility 15 (1s)", "Volatility 25 (1s)", "Volatility 30 (1s)", "Volatility 50 (1s)", "Volatility 75 (1s)", "Volatility 90 (1s)", "Volatility 100 (1s)", "Volatility 10", "Volatility 25", "Volatility 50", "Volatility 75", "Volatility 100"]
  };

  const SYMBOL_CONVERSION_MAP = {
    // METALS
    "Gold/USD": "frxXAUUSD", "Palladium/USD": "frxXPDUSD", "Platinum/USD": "frxXPTUSD", "Silver/USD": "frxXAGUSD",

    // CRYPTO
    "BTC/USD": "cryBTCUSD", "ETH/USD": "cryETHUSD",

    // FOREX MAJORS
    "AUD/JPY": "frxAUDJPY", "AUD/USD": "frxAUDUSD", "EUR/AUD": "frxEURAUD", "EUR/CAD": "frxEURCAD",
    "EUR/CHF": "frxEURCHF", "EUR/GBP": "frxEURGBP", "EUR/JPY": "frxEURJPY", "EUR/USD": "frxEURUSD",
    "GBP/JPY": "frxGBPJPY", "USD/CAD": "frxUSDCAD", "GBP/USD": "frxGBPUSD", "GBP/AUD": "frxGBPAUD", "USD/CHF": "frxUSDCHF",

    // FOREX MINORS
    "AUD/CAD": "frxAUDCAD", "AUD/CHF": "frxAUDCHF", "AUD/NZD": "frxAUDNZD", "EUR/NZD": "frxEURNZD",
    "GBP/CAD": "frxGBPCAD", "GBP/CHF": "frxGBPCHF", "GBP/NZD": "frxGBPNZD", "NZD/JPY": "frxNZDJPY",
    "NZD/USD": "frxNZDUSD", "USD/MXN": "frxUSDMXN", "USD/PLN": "frxUSDPLN",

    // VOLATILITY (1s)
    "Volatility 10 (1s)": "1HZ10V", "Volatility 15 (1s)": "1HZ15V", "Volatility 25 (1s)": "1HZ25V",
    "Volatility 30 (1s)": "1HZ30V", "Volatility 50 (1s)": "1HZ50V", "Volatility 75 (1s)": "1HZ75V",
    "Volatility 90 (1s)": "1HZ90V", "Volatility 100 (1s)": "1HZ100V",

    // VOLATILITY STANDARD
    "Volatility 10": "R_10", "Volatility 25": "R_25", "Volatility 50": "R_50", "Volatility 75": "R_75", "Volatility 100": "R_100",

    // BOOM & CRASH
    "Boom 300": "BOOM300N", "Boom 500": "BOOM500", "Boom 600": "BOOM600", "Boom 900": "BOOM900", "Boom 1000": "BOOM1000",
    "Crash 300": "CRASH300N", "Crash 500": "CRASH500", "Crash 600": "CRASH600", "Crash 900": "CRASH900", "Crash 1000": "CRASH1000",

    // JUMP & STEP
    "Jump 10 Index": "JD10", "Jump 25 Index": "JD25", "Jump 50 Index": "JD50", "Jump 75 Index": "JD75", "Jump 100 Index": "JD100",
    "Step Index 100": "stpRNG", "Step Index 200": "stpRNG2", "Step Index 300": "stpRNG3", "Step Index 400": "stpRNG4", "Step Index 500": "stpRNG5"
  };

  const SYMBOLS = [
    { symbol: "BOOM300N", name: "Boom 300" },
    { symbol: "CRASH300N", name: "Crash 300" },
    { symbol: "BOOM500", name: "Boom 500" },
    { symbol: "CRASH500", name: "Crash 500" },
    { symbol: "BOOM600", name: "Boom 600" },
    { symbol: "CRASH600", name: "Crash 600" },
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
    if (!symbolList) return;
    symbolList.innerHTML = "";

    SYMBOLS.forEach(s => {
      const el = document.createElement("div");
      el.className = "symbol-item";
      el.textContent = s.name;
      el.dataset.symbol = s.symbol;

      // État actif au chargement initial
      if (typeof currentSymbol !== 'undefined' && s.symbol === currentSymbol) {
        el.classList.add("selected");
      }

      el.addEventListener("click", () => {
        // --- SYNCHRONISATION GLOBALE ---
        document.querySelectorAll(".symbol-item").forEach(item => item.classList.remove("selected"));
        document.querySelectorAll(".asset-selector-item").forEach(item => item.classList.remove("selected"));

        el.classList.add("selected");

        if (!s.symbol) return;

        // Mise à jour du bouton principal du graphique (Optionnel mais recommandé)
        const openBtn = document.getElementById('openPickerBtn');
        if (openBtn) openBtn.innerText = `Instrument : ${s.name}`;

        console.log(`Tentative de basculement vers : ${s.name}`);

        loadSymbol(s.symbol, currentInterval, currentChartType)
          .then(() => {
            console.log(`Commande de chargement envoyée pour ${s.symbol}`);
            showToast(`Loading command sent for ${s.symbol}`, 'info');
          })
          .catch(error => {
            console.error("Erreur critique lors du basculement :", error);
            // CORRECTION : On utilise error.message (pas err.message)
            showToast(`Critical error during switch: ${error.message}`, 'error');
          });

        currentSymbol = s.symbol;
      });

      symbolList.appendChild(el);
    });
  }

  // On l'attache à window pour qu'elle soit accessible depuis le onchange="" du HTML
  window.updateSymbols = function () {
    const select = document.getElementById('categorySelect');
    const searchInput = document.getElementById('symbolSearch');

    if (!select) return;

    const category = select.value;

    // 1. Reset de la recherche quand on change de catégorie
    if (searchInput) searchInput.value = "";

    // 2. Vérification des données (on suppose que 'data' est défini globalement)
    if (typeof data !== 'undefined' && data[category]) {
      renderGrid(data[category]);
    } else {
      console.warn("Catégorie non trouvée ou 'data' non défini:", category);
      renderGrid([]);
    }
  };

  function renderGrid(symbols) {
    const grid = document.getElementById('symbolGrid');
    const validateBtn = document.getElementById('validateBtn');

    if (!grid) return;

    // 1. On vide la grille existante
    grid.innerHTML = '';

    // 2. On désactive le bouton valider par sécurité
    if (validateBtn) validateBtn.disabled = true;

    // 3. Cas où aucun symbole n'est trouvé
    if (symbols.length === 0) {
      grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: #6a6d78; padding: 40px;">
                <div style="font-size: 1.5rem; margin-bottom: 10px;">🔍</div>
                Aucun symbole trouvé
            </div>`;
      return;
    }

    // 4. Création des éléments
    symbols.forEach(symbol => {
      const div = document.createElement('div');
      div.className = 'asset-selector-item';
      div.innerText = symbol;

      // On s'assure que le style est appliqué pour le centrage si ce n'est pas fait en CSS
      div.style.display = "flex";
      div.style.alignItems = "center";
      div.style.justifyContent = "center";

      div.onclick = () => {
        // --- SYNCHRONISATION GLOBALE ---

        // A. Retirer la sélection des autres items de la POPUP
        document.querySelectorAll('.asset-selector-item').forEach(el =>
          el.classList.remove('selected')
        );

        // B. Retirer la sélection de la LISTE LATÉRALE (Sidebar)
        // Cela évite d'avoir deux symboles visuellement actifs
        document.querySelectorAll('.symbol-item').forEach(el =>
          el.classList.remove('selected')
        );

        // C. Appliquer la sélection visuelle sur l'item cliqué
        div.classList.add('selected');

        // D. Stocker le symbole choisi globalement
        selectedSymbol = symbol;
        currentSymbol = selectedSymbol;
        console.log(`Render : ${selectedSymbol}`);
        // E. Activer le bouton de validation  
        if (validateBtn) validateBtn.disabled = false;
      };

      grid.appendChild(div);
    });
  }

  window.filterSymbols = function () {
    const searchInput = document.getElementById('symbolSearch');
    if (!searchInput) return;

    const searchTerm = searchInput.value.toLowerCase().trim();

    // 1. Retour à la catégorie sélectionnée si recherche vide
    if (searchTerm === "") {
      if (typeof window.updateSymbols === 'function') {
        window.updateSymbols();
      }
      return;
    }

    // 2. Vérification que 'data' existe
    if (typeof data === 'undefined') {
      console.error("L'objet 'data' contenant les symboles est introuvable.");
      return;
    }

    // 3. RECHERCHE GLOBALE : Extraction et filtrage
    // .flatMap fusionne tous les tableaux de toutes les catégories en un seul
    const allFilteredSymbols = Object.values(data)
      .flat()
      .filter(symbol => symbol.toLowerCase().includes(searchTerm));

    // 4. Supprimer les doublons (Set)
    const uniqueSymbols = [...new Set(allFilteredSymbols)];

    // 5. Mise à jour de la grille
    if (typeof renderGrid === 'function') {
      renderGrid(uniqueSymbols);
    }
  };

  window.confirmSelection = function () {
    // 1. Sécurité de base : on vérifie si un symbole a été cliqué dans la grille
    if (!selectedSymbol) {
      showToast("Please select an instrument first", "warning");
      return;
    }

    // 2. Conversion du nom (ex: "Gold/USD") en code technique (ex: "frxXAUUSD")
    const selectedSymbolconverted = Callingsymbolforderiv(selectedSymbol);

    // 3. Mise à jour de l'interface utilisateur
    const openBtn = document.getElementById('openPickerBtn');
    if (openBtn) {
      openBtn.innerText = `Instrument : ${selectedSymbol}`;
    }

    // 4. Lancement du chargement du graphique
    // On met à jour la variable globale currentSymbol pour le reste de l'app
    currentSymbol = selectedSymbolconverted;

    loadSymbol(selectedSymbolconverted, currentInterval, currentChartType)
      .then(() => {
        console.log(`Successfully switched to ${selectedSymbolconverted}`);
        showToast(`${selectedSymbol} loaded`, "success");

        // --- SYNCHRONISATION VISUELLE DE LA SIDEBAR ---
        // On désélectionne tout dans la liste latérale
        document.querySelectorAll('.symbol-item').forEach(el => el.classList.remove('selected'));

        // On allume le symbole correspondant dans la sidebar
        const activeSidebarItem = document.querySelector(`.symbol-item[data-symbol="${selectedSymbolconverted}"]`);
        if (activeSidebarItem) {
          activeSidebarItem.classList.add('selected');
        }
      })
      .catch(error => {
        console.error("Chart loading error:", error);
        showToast("Failed to load chart", "error");
      });

    // 5. Fermeture du modal (Popup)
    if (typeof window.closeModal === 'function') {
      window.closeModal();
    }
  };

  // On attache la fonction à window pour qu'elle soit accessible depuis le onclick du HTML
  window.closeModal = function () {
    const modal = document.getElementById('modalOverlay');
    const validateBtn = document.getElementById('validateBtn');
    const searchInput = document.getElementById('symbolSearch');

    if (modal) {
      // 1. On cache le modal
      modal.style.display = 'none';

      // 2. Nettoyage de l'interface pour la prochaine fois
      if (searchInput) searchInput.value = '';
      if (validateBtn) validateBtn.disabled = true;

      console.log("Modal de sélection fermé.");
    } else {
      console.error("Élément 'modalOverlay' non trouvé dans le DOM.");
    }
  };

  function Callingsymbolforderiv(selectedsymbol4converting) {
    const symbol = selectedsymbol4converting.trim();

    // On cherche dans la map, si pas trouvé, on retourne le symbole original par défaut
    const converted = SYMBOL_CONVERSION_MAP[symbol];

    if (!converted) {
      console.warn(`Attention: Pas de conversion trouvée pour "${symbol}"`);
      return symbol;
    }

    return converted;
  }

  /**
 * ============================================================
 * CONFIGURATION ET CALCULS TECHNIQUES (LOGIQUE)
 * ============================================================
 */
  function calculateEMA(data, period) {
    if (!Array.isArray(data) || data.length === 0) return [];

    const k = 2 / (period + 1);
    let emaArray = [];

    let ema = data[0];
    emaArray.push(ema);

    for (let i = 1; i < data.length; i++) {
      ema = (data[i] - ema) * k + ema;
      emaArray.push(ema);
    }

    return emaArray;
  }

  function extractClosesFromCandles(candles) {
    return candles  
      .map(c => {  
        // Deriv candle standard
        if (c.close !== undefined) return Number(c.close);  

        // fallback tick
        if (c.value !== undefined && typeof c.value === "number") return c.value;

        return NaN;  
      })
      .filter(Number.isFinite);  
  }
 
  window.updateAngleGauge = function (candles) {

    const closes = extractClosesFromCandles(candles);  

    console.log(`Closes :`, closes);  

    if (closes.length < 210) return;

    const ema = calculateEMA(closes, 200);

    console.log(`EMA :`, ema);

    const lastEMA = ema[ema.length - 1];
    const prevEMA = ema[ema.length - 6];

    if (!Number.isFinite(lastEMA) || !Number.isFinite(prevEMA)) return;

    const deltaEMA = lastEMA - prevEMA;
    const lookback = 5;

    const angleDeg =
      Math.atan(deltaEMA / lookback) * (180 / Math.PI);

    console.log(
      `EMA200: ${lastEMA.toFixed(2)} | Angle: ${angleDeg.toFixed(2)}°`
    );

    // --- Jauge ---
    const maxAngle = 45;
    const clamped = Math.max(-maxAngle, Math.min(maxAngle, angleDeg));
    const percent = ((clamped + maxAngle) / (2 * maxAngle)) * 100;

    let color = "#ff9800";
    if (angleDeg > 2) color = "#089981";
    else if (angleDeg < -2) color = "#f23645";

    setGaugeValue("path-angle", percent, color);

    const valEl = document.getElementById("txt-angle-val");
    const labelEl = document.getElementById("txt-angle-label");

    if (valEl) valEl.innerText = angleDeg.toFixed(1) + "°";
    if (labelEl) {
      if (angleDeg > 2) labelEl.innerText = "ASCENDING";
      else if (angleDeg < -2) labelEl.innerText = "DESCENDING";
      else labelEl.innerText = "RANGING";
    }
  };

  // 3. Calcul de l'ATR (Volatilité)
  function calculateATR(candles, period = 50) {
    if (candles.length <= period) return { percent: 0 };

    let trs = [];
    for (let i = 1; i < candles.length; i++) {
      const tr = Math.max(
        candles[i].high - candles[i].low,
        Math.abs(candles[i].high - candles[i - 1].close),
        Math.abs(candles[i].low - candles[i - 1].close)
      );
      trs.push(tr);
    }

    let currentATR = trs.slice(0, period).reduce((a, b) => a + b) / period;
    for (let i = period; i < trs.length; i++) {
      currentATR = (currentATR * (period - 1) + trs[i]) / period;
    }

    const lastClose = candles[candles.length - 1].close;
    const baseRatio = (currentATR / lastClose) * 100;

    // --- RÉGLAGE : Sensibilité réduite ---
    // On passe de 1500 à 1000 pour calmer l'amplitude
    let volPercent = Math.sqrt(baseRatio) * 800;

    return {
      percent: Math.min(volPercent, 100).toFixed(1)
    };
  }

  // 4. Calcul de la Force Bulls vs Bears
  function calculateBullBearForce(candles, period = 14) {
    if (candles.length < period) return 50;
    let bullPower = 0, bearPower = 0;
    const start = candles.length - period;
    for (let i = start; i < candles.length; i++) {
      bullPower += (candles[i].close - candles[i].low);
      bearPower += (candles[i].high - candles[i].close);
    }
    const total = bullPower + bearPower;
    return total === 0 ? 50 : parseFloat(((bullPower / total) * 100).toFixed(1));
  }

  /**
   * ============================================================
   * MISE À JOUR VISUELLE (INTERFACE)
   * ============================================================
   */

  // Fonction universelle pour piloter le SVG (126 = vide, 0 = plein)
  function setGaugeValue(id, percent, color) {
    const path = document.getElementById(id);
    if (!path) return;
    const offset = 126 - (percent * 126 / 100);
    path.style.strokeDashoffset = offset;
    path.style.stroke = color;
  }

  // MISE À JOUR JAUGE 1 : Tendance
  function updateTrendGauge(candles) {
    const bullPercent = calculateBullBearForce(candles, 14);
    let color = "#ff9800", label = "Neutral";
    if (bullPercent > 55) { color = "#089981"; label = "Bullish"; }
    else if (bullPercent < 45) { color = "#f23645"; label = "Bearish"; }

    setGaugeValue('path-trend', bullPercent, color);
    document.getElementById('txt-trend-val').innerText = bullPercent + "%";
    document.getElementById('txt-trend-label').innerText = label;
  }

  // MISE À JOUR JAUGE 2 : Angle EMA
  function updateVolatilityGauge(candles) {
    const atr = calculateATR(candles, 50);
    const targetPercent = parseFloat(atr.percent);

    // --- RÉGLAGE : Lissage beaucoup plus fort ---
    // 0.05 signifie que l'aiguille ne parcourt que 5% de la distance vers la cible à chaque tick.
    // Cela crée un mouvement très fluide et "lourd".
    const smoothingFactor = 0.05;

    smoothedVol = smoothedVol + (targetPercent - smoothedVol) * smoothingFactor;

    let color = "#1976d2";
    let label = "Quiet";

    // Seuils de couleurs un peu plus larges pour éviter les changements brusques
    if (smoothedVol > 70) {
      color = "#f23645";
      label = "High Volatility";
    }
    else if (smoothedVol > 30) {
      color = "#f57c00";
      label = "Rising Volatility";
    }

    setGaugeValue('path-vol', smoothedVol, color);

    // On arrondit l'affichage pour éviter les chiffres qui défilent trop vite
    document.getElementById('txt-vol-val').innerText = Math.round(smoothedVol) + "%";
    document.getElementById('txt-vol-label').innerText = label;
  }

  /**
   * FONCTION PRINCIPALE À APPELER
   * @param {Array} candles - Données reçues de l'API Deriv
   */
  window.updateAllMarketGauges = function (candles) { 
    if (!candles || candles.length < 2) return;

    try {
      updateTrendGauge(candles);
      updateVolatilityGauge(candles);
      window.updateAngleGauge(candles);
      // L'angle EMA200 a besoin de son historique
      if (candles.length >= 210) {
       
      }
    } catch (e) {
      console.error("Erreur:", e);   
    }
  };  

  function initChart(currentChartType) {
    const containerHistoryList = document.getElementById("autoHistoryList");
    const container = document.getElementById("chartInner");
    if (!container) {
      console.error("Conteneur de graphique introuvable !");  
      return;
    }

    // 1. NETTOYAGE PHYSIQUE ET MÉMOIRE
    if (chart) {
      // Avant de supprimer le chart, on nettoie les lignes de prix actives
      // pour éviter les fuites de mémoire (Memory Leaks)
      if (currentSeries && priceLines4openlines) {
        Object.values(priceLines4openlines).forEach(line => {
          try { currentSeries.removePriceLine(line); } catch (e) { }
        });
      }

      try {
        chart.remove();
      } catch (e) {
        console.error("Erreur lors de la destruction du chart:", e);
      }
      chart = null;
    }

    // RÉINITIALISATION DES VARIABLES GLOBALES
    containerHistoryList.innerHTML = "";
    container.innerHTML = "";
    priceLines4openlines = {}; // Reset de l'objet des contrats

    // Reset des séries pour forcer leur recréation
    currentSeries = null;
    zigzagSeries = null;
    maSeries = null;

    // Reset des tableaux de données (Important pour ne pas mélanger les symboles)
    cache = [];         // Votre historique bougies
    priceData = [];     // Votre historique ticks (300)
    priceDataZZ = [];   // Source unifiée pour ZigZag/MA
    isWsInitialized = false;

    // CRÉATION DU NOUVEAU GRAPHIQUE (Optimisé Fond Blanc)
    chart = LightweightCharts.createChart(container, {
      layout: {
        background: { type: LightweightCharts.ColorType.Solid, color: '#ffffff' },
        textColor: '#333',
        fontSize: 12,
        fontFamily: 'Trebuchet MS, Roboto, Ubuntu, sans-serif',
      },
      grid: {
        // On utilise une couleur très claire pour que les lignes de Fibonacci restent prioritaires
        vertLines: { color: 'rgba(197, 203, 206, 0.2)' },
        horzLines: { color: 'rgba(197, 203, 206, 0.2)' },
      },
      crosshair: {
        // Crosshair sombre pour contraste sur fond blanc
        mode: LightweightCharts.CrosshairMode.Normal,
        vertLine: {
          width: 1,
          color: '#758696',
          style: LightweightCharts.LineStyle.Dash,
        },
        horzLine: {
          width: 1,
          color: '#758696',
          style: LightweightCharts.LineStyle.Dash,
        },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
        borderColor: '#D1D4DC', // Ligne de séparation propre en bas
      },
      rightPriceScale: {
        borderColor: '#D1D4DC', // Ligne de séparation propre à droite
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
    });

    // CONFIGURATION DES SÉRIES SELON LE TYPE
    if (currentChartType === "area") {
      currentSeries = chart.addAreaSeries({
        lineColor: "rgba(189, 6, 221, 1)",
        lineWidth: 3,
        topColor: "rgba(189, 6, 221, 0.35)",
        bottomColor: "rgba(189, 6, 221, 0.0)",
      });
    } else if (currentChartType === "candlestick") {
      currentSeries = chart.addCandlestickSeries({
        // Couleurs corps (plus denses pour le fond blanc)
        upColor: "#26a69a",
        downColor: "#ef5350",

        // Bordures : On utilise des couleurs pleines pour bien détacher la bougie
        borderUpColor: "#1a7369",   // Vert plus sombre pour le contour
        borderDownColor: "#b23c39", // Rouge plus sombre pour le contour

        // Mèches : Identiques aux bordures pour une cohérence visuelle
        wickUpColor: "#1a7369",
        wickDownColor: "#b23c39",

        // Optionnel : épaisseur des bordures
        borderVisible: true,
      });
    } else { // Fallback sur "line"
      currentSeries = chart.addLineSeries({
        color: "#2962FF",
        lineWidth: 2,
      });
    }

    // AUTO-RÉACTIVATION DES INDICATEURS
    // On recrée les "réceptacles" (séries) pour les données qui vont arriver
    if (isZigZagActive) {
      zigzagSeries = chart.addLineSeries({
        color: '#f39c12',
        lineWidth: 2,
        priceLineVisible: false,
      });
    }

    if (activePeriods.length > 0) {
      initMaSeries(); // Recrée les 3 lignes EMA 20, 50, 200 via le nouveau chart
    }

    // 1. Réinitialisation de la mémoire des contrats
    activeContractsData = {};
    activeContracts = {};
    lastTotalPnL = 0; // On remet aussi la mémoire de tendance à zéro

    // 2. Réinitialisation visuelle du compteur PnL
    const pnlDisplay = document.getElementById("total-pnl");
    const arrowDisplay = document.getElementById("pnl-arrow");

    if (pnlDisplay) {
      pnlDisplay.innerText = "0.00";
      pnlDisplay.style.color = "#fff"; // On remet en blanc (neutre)
    }

    if (arrowDisplay) {
      arrowDisplay.innerText = ""; // On enlève la flèche (haut ou bas)
    }
  }

  function styleType(currentChartType) {
    if (!currentChartType || currentChartType === null) return;

    if (currentChartType === "candlestick") { style_type = "candles"; }
    else { style_type = "ticks"; }

    return style_type;
  }

  function convertTF(currentInterval) {
    switch (currentInterval) {
      case "1m": return 60;
      case "2m": return 120;
      case "3m": return 180;
      case "5m": return 300;
      case "10m": return 600;
      case "15m": return 900;
      case "30m": return 1800;
      case "1h": return 3600;
      case "2h": return 7200;
      case "4h": return 14400;
      case "8h": return 2880;
      case "1d": return 86400;
    }
  }

  // normalize une candle brute en { time, open, high, low, close } ou null
  function normalize(c) {
    if (!c) return null;
    // Gère 'open_time' (live) ou 'epoch' (historique)
    const t = c.open_time || c.epoch || c.epoch_time || c.time;
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

    if (!symbol || !interval || !chartType) {
      throw new Error("Paramètres manquants pour loadSymbol");
      return;
    }

    currentSessionId++;
    const thisSessionId = currentSessionId;

    // --- NETTOYAGE COMPLET ---
    if (ws) {
      ws.onclose = null;
      ws.close();
      ws = null;
    }

    cache = [];
    priceDataZZ = [];
    isWsInitialized = false;

    // --- INITIALISATION DU GRAPHIQUE ---
    initChart(chartType);

    ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      if (thisSessionId !== currentSessionId) return;
      ws.send(JSON.stringify({ authorize: TOKEN }));
    };

    ws.onmessage = ({ data }) => {
      if (thisSessionId !== currentSessionId) {
        if (ws) ws.close();
        return;
      }

      const msg = JSON.parse(data);

      // 1. Autorisation -> Envoi des Payloads (Market + Contracts)
      if (msg.msg_type === "authorize") {
        // Payload Marché (Candles ou Ticks)
        const marketPayload = (chartType === "candlestick") ? {
          ticks_history: symbol,
          adjust_start_time: 1,
          subscribe: 1,
          end: "latest",
          count: 1000,
          granularity: convertTF(interval),
          style: "candles"
        } : {
          ticks_history: symbol,
          adjust_start_time: 1,
          subscribe: 1,
          end: "latest",
          count: 300,
          granularity: convertTF(interval),
          style: "ticks"
        };

        ws.send(JSON.stringify(marketPayload));

        // Payload Positions Ouvertes (Abonnement unique)
        ws.send(JSON.stringify({ proposal_open_contract: 1, subscribe: 1 }));
        return;
      }

      // --- DANS VOTRE ONSMESSAGE ---

      // A. Gestion de l'HISTORIQUE (Initialisation)
      if (msg.msg_type === "candles") {
        const candles = msg.candles;
        if (Array.isArray(candles)) {
          // On transforme et filtre toutes les bougies historiques
          const formattedData = candles.map(normalize).filter(Boolean);

          if (formattedData.length > 0) {
            cache = formattedData; // On remplit le cache
            currentSeries.setData(cache); // Chargement initial complet
            priceDataZZ = [...cache];

            chart.timeScale().fitContent();
            isWsInitialized = true;

            // Calcul initial des indicateurs sur tout l'historique
            formattedData.forEach(bar => updateIndicatorData(bar.time, bar));
            renderIndicators();

            // --- AJOUT : Mise à jour initiale des jauges ---
            if (typeof window.updateAllMarketGauges === 'function') {
              window.updateAllMarketGauges(cache);
            }
          }
        }
      }

      // B. Gestion du FLUX TEMPS RÉEL (Une seule barre à la fois)
      if (msg.msg_type === "ohlc") {
        const ohlc = msg.ohlc;
        const lastBar = normalize(ohlc);

        if (lastBar && isWsInitialized) {
          // Mise à jour de Lightweight Charts
          currentSeries.update(lastBar);

          // Mise à jour du cache local
          if (cache.length > 0) {
            const lastCacheIndex = cache.length - 1;

            if (cache[lastCacheIndex].time === lastBar.time) {
              // Même bougie : on remplace
              cache[lastCacheIndex] = lastBar;
            } else {
              // Nouvelle bougie : on ajoute
              cache.push(lastBar);
              if (cache.length > 1000) cache.shift();
            }
          }

          // Mise à jour et rendu des indicateurs
          updateIndicatorData(lastBar.time, lastBar);
          renderIndicators();

          // Force le rafraîchissement des dessins et du Volume Profile
          render();

          // --- AJOUT : Mise à jour des jauges en temps réel ---
          // On utilise le 'cache' mis à jour car nos fonctions de calcul
          // (EMA200, ATR, Bull/Bear) ont besoin de l'historique complet présent dans le cache.
          if (typeof window.updateAllMarketGauges === 'function') {
            window.updateAllMarketGauges(cache);
          }
        }
      }

      // 3. Gestion des données Ticks (Area/Line)
      if (msg.msg_type === "history" || msg.msg_type === "tick") {
        handleTickData(msg);
        // Note: handleTickData doit appeler renderIndicators() en interne
        render();
      }

      if (data.msg_type === "proposal_open_contract" && data.proposal_open_contract) {
        const c = data.proposal_open_contract;
        const id = c.contract_id;

        // Contrat encore ouvert
        if (c.is_sold === 0) {
          activeContracts[id] = Number(c.profit || 0);
        }
        // Contrat fermé → suppression  
        else {
          delete activeContracts[id];
        }

        updateGlobalPnL();
        updateDonutCharts();
      }

      if (msg.msg_type === "ping") ws.send(JSON.stringify({ ping: 1 }));

      Openpositionlines(currentSeries);
    };

    ws.onclose = () => {
      if (thisSessionId === currentSessionId) {
        setTimeout(() => loadSymbol(symbol, interval, chartType), 2000);
      }
    };
  }

  function Openpositionlines(currentSeries) {
    // Éviter les doublons de connexion
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

      // 1. Authentification
      if (data.msg_type === "authorize") {
        wsOpenLines.send(JSON.stringify({ proposal_open_contract: 1, subscribe: 1 }));
        return;
      }

      // 2. Gestion des contrats
      if (data.msg_type === "proposal_open_contract" && data.proposal_open_contract) {
        const c = data.proposal_open_contract;
        const id = c.contract_id;

        // --- CAS : CONTRAT CLOS ---
        if (c.status === "sold" || !!c.is_sold) {
          if (priceLines4openlines[id]) {
            currentSeries.removePriceLine(priceLines4openlines[id].line);
            delete priceLines4openlines[id];
          }
          return;
        }

        // --- CAS : CONTRAT ACTIF ---
        const entryPrice = parseFloat(c.entry_tick_display_value);
        const profit = parseFloat(c.profit || 0);
        if (isNaN(entryPrice)) return;

        // Style dynamique selon le profit
        const isWin = profit >= 0;
        const color = isWin ? "#00ff80" : "#ff4d4d";
        const lineStyle = isWin ? LightweightCharts.LineStyle.Solid : LightweightCharts.LineStyle.Dashed;

        // Label avec Bouton X simulé et Profit
        const labelText = `${c.contract_type} at @${entryPrice} | ${isWin ? '+' : ''}${profit.toFixed(2)} ${CURRENCY.toString()}`;

        if (!priceLines4openlines[id]) {
          // Création initiale
          const line = currentSeries.createPriceLine({
            price: entryPrice,
            color: color,
            lineWidth: 2,
            lineStyle: lineStyle,
            axisLabelVisible: true,
            title: labelText,
          });
          // On stocke la ligne, le prix et l'ID pour le clic
          priceLines4openlines[id] = { line, entryPrice, id };
        } else {
          // Mise à jour en temps réel (Fluide)
          priceLines4openlines[id].line.applyOptions({
            title: labelText,
            color: color,
            lineStyle: lineStyle,
          });
        }
      }

      // Heartbeat
      if (data.msg_type === "ping") wsOpenLines.send(JSON.stringify({ ping: 1 }));
    };

    wsOpenLines.onerror = (e) => console.error("⚠️ WS Open Lines Error:", e);
    wsOpenLines.onclose = () => {
      setTimeout(() => Openpositionlines(currentSeries), 5000);
    };
  }

  function updateGlobalPnL() {
    const container = document.getElementById("pnl-container");
    const pnlSpan = document.getElementById("total-pnl");
    const arrowSpan = document.getElementById("pnl-arrow");
    const closeAllBtn = document.getElementById("closeAll");

    if (!container || !pnlSpan || !arrowSpan) return;

    const activeIds = Object.keys(activeContracts);

    // 1️⃣ Visibilité
    if (activeIds.length === 0) {
      container.style.display = "none";
      lastTotalPnL = 0;
      if (closeAllBtn) {
        closeAllBtn.style.animation = "none";
        closeAllBtn.innerText = "Close All";
      }
      return;
    } else {
      container.style.display = "flex";
    }

    // 2️⃣ Calcul PnL total
    let currentTotal = 0;
    activeIds.forEach(id => {
      currentTotal += activeContracts[id];
    });

    // 3️⃣ Flèche tendance
    if (currentTotal > lastTotalPnL) {
      arrowSpan.innerText = " ▲";
      arrowSpan.style.color = "#00ffa3";
    } else if (currentTotal < lastTotalPnL) {
      arrowSpan.innerText = " ▼";
      arrowSpan.style.color = "#ff3d60";
    }

    // 4️⃣ Affichage PnL
    pnlSpan.innerText = currentTotal.toFixed(2);
    pnlSpan.style.color = currentTotal >= 0 ? "#00ffa3" : "#ff3d60";

    // 5️⃣ Flash visuel
    if (currentTotal !== lastTotalPnL) {
      container.style.transition = "box-shadow 0.2s ease";
      container.style.boxShadow =
        currentTotal > lastTotalPnL
          ? "0 0 15px rgba(0,255,163,0.5)"
          : "0 0 15px rgba(255,61,96,0.5)";

      setTimeout(() => {
        container.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
      }, 200);
    }

    // 6️⃣ Bouton Close All
    if (closeAllBtn) {
      const count = activeIds.length;
      if (count > 5) {
        closeAllBtn.style.animation = "pulse-red 1s infinite";
        closeAllBtn.innerText = `Close All (${count})`;
      } else {
        closeAllBtn.style.animation = "none";
        closeAllBtn.innerText = "Close All";
      }
    }

    // 7️⃣ Sauvegarde
    lastTotalPnL = currentTotal;
  }

  /**
 * Met à jour la source de données pour les indicateurs (ZigZag, MA)   
 */
  function updateIndicatorData(time, bar) {
    if (!bar || isNaN(bar.close)) return; // Sécurité : évite d'ajouter des données corrompues

    const lastIdx = priceDataZZ.length - 1;

    // Vérifie si on travaille sur la même bougie (temps identique)  
    if (lastIdx >= 0 && priceDataZZ[lastIdx].time === time) {
      // Mise à jour de la bougie en cours (le prix bouge encore)  
      priceDataZZ[lastIdx] = bar;
    } else {
      // C'est une nouvelle bougie (ou la première du flux)
      // Sécurité supplémentaire : on vérifie que le nouveau temps est bien supérieur au précédent
      if (lastIdx >= 0 && time < priceDataZZ[lastIdx].time) {
        console.warn("Donnée reçue en retard ignorée");
        return;
      }

      priceDataZZ.push(bar);

      // Limite de performance
      if (priceDataZZ.length > 2000) {
        priceDataZZ.shift();
      }
    }
  }

  function handleTickData(msg) {
    if (!currentSeries) return;

    // A. CHARGEMENT INITIAL (Affiche les 300 d'un coup)
    if (msg.msg_type === "history" && msg.history) {
      const h = msg.history;

      // Conversion du format Deriv vers Lightweight Charts
      priceData = h.times.map((t, i) => ({
        time: Number(t),
        value: Number(h.prices[i])
      }));

      // Affiche le bloc de 300 points immédiatement
      currentSeries.setData(priceData);

      // Ajuste le zoom pour que les 300 points prennent tout l'espace
      chart.timeScale().fitContent();

      // Prépare les données pour le ZigZag et les MA
      priceDataZZ = priceData.map(p => ({ time: p.time, close: p.value }));
      isWsInitialized = true;
      return;
    }

    // B. MISE À JOUR LIVE (Un par un)
    if (msg.msg_type === "tick" && msg.tick) {
      const t = msg.tick;
      const newTick = {
        time: Number(t.epoch),
        value: Number(t.quote)
      };

      // GESTION DE LA FENÊTRE GLISSANTE (300 points max)
      if (priceData.length >= 300) {
        priceData.shift();   // Enlève le plus vieux
        priceDataZZ.shift(); // Enlève aussi pour les indicateurs
      }

      priceData.push(newTick);
      priceDataZZ.push({ time: newTick.time, close: newTick.value });

      // Met à jour le graphique sans clignoter
      currentSeries.update(newTick);

      // Rafraîchit les indicateurs (MA, ZigZag) sur le nouveau point
      renderIndicators();
      updateGlobalPnL();
      Openpositionlines(currentSeries);
    }
  }

  function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');

    // Sécurité : au cas où le HTML n'est pas présent
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    // Attribution des icônes
    const icons = {
      success: '🟢',
      error: '🔴',
      info: '🔵',
      warning: '⚠️'
    };

    toast.innerHTML = `
        <span style="font-size: 1.2rem;">${icons[type] || '🔔'}</span>
        <div style="flex-grow: 1;">
            <div style="font-size: 0.85rem; opacity: 0.8;">Notification</div>
            <div style="font-size: 0.95rem; font-weight: 600;">${message}</div>
        </div>
    `;

    container.appendChild(toast);

    // Auto-destruction après 4 secondes
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      setTimeout(() => toast.remove(), 500);
    }, 10000);
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

        //displaySymbols(currentInterval, currentChartType);
        return;
      }

      // balance update
      if (data.msg_type === "balance" && data.balance) {
        const b = data.balance;
        accountInfo.textContent = `Account: ${b.loginid} | ${Number(b.balance).toFixed(2)} ${b.currency}`;
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

  /* =============================================
   WS SIGNAL ON HISTORY TABLE - VERSION MODERNE
   ============================================= */
  function addTradeHistoryColumn(trade) {
    if (trade.type !== "ML_SIGNAL") return;
    const tradeHistoryBody = document.getElementById("tradeHistoryBody__");
    if (!tradeHistoryBody) return;

    const tr = document.createElement("tr");
    tr.className = "new-signal-row";

    /* ========= TIME (Gris neutre) ========= */
    const timeTd = document.createElement("td");
    timeTd.innerHTML = `<span class="time-dim-light">${formatUnixTime(trade.time)}</span>`;
    tr.appendChild(timeTd);

    /* ========= SYMBOL (Texte sombre) ========= */
    const symbolTd = document.createElement("td");
    symbolTd.innerHTML = `<strong class="symbol-light">${trade.symbol}</strong>`;
    tr.appendChild(symbolTd);

    /* ========= SIGNAL (Badge doux) ========= */
    const signalTd = document.createElement("td");
    const isBuy = trade.signal === "BUY" || trade.signal === "UP";
    const signalClass = isBuy ? "signal-badge-buy-light" : "signal-badge-sell-light";
    signalTd.innerHTML = `<span class="${signalClass}">${trade.signal}</span>`;
    tr.appendChild(signalTd);

    /* ========= PRICE (Police technique) ========= */
    const priceTd = document.createElement("td");
    priceTd.className = "price-mono-light";
    priceTd.textContent = parseFloat(trade.price).toFixed(5);
    tr.appendChild(priceTd);

    /* ========= PROB (Contraste sur blanc) ========= */
    const probTd = document.createElement("td");
    const p = Math.min(Math.max(parseFloat(trade.prob), 0), 1);
    const probPercent = (p * 100).toFixed(1) + "%";

    let probStyle = "";
    if (p >= 0.5080 && p < 0.5092) {
      // Fond gris très clair pour le mode blanc
      probStyle = "background-color: #f1f2f6; color: #2d3436; border: 1px solid #dfe4ea; border-radius: 6px; padding: 2px 8px; font-weight: 700;";
    } else {
      // Violet/Magenta profond pour un bon contraste
      probStyle = "background-color: #89027e; color: #ffffff; border-radius: 6px; padding: 2px 8px; font-weight: 700;";
    }

    probTd.innerHTML = `
        <div class="prob-container-light">  
            <span style="${probStyle}">${probPercent}</span>
            <div class="prob-bar-bg-light">
                <div class="prob-bar-fill-light" style="width: ${p * 100}%; background-color: ${p >= 0.5080 ? '#00b894' : '#89027e'}"></div>
            </div>
        </div>
    `;
    tr.appendChild(probTd);

    /* ========= AJOUT ET LIMITE ========= */
    tradeHistoryBody.prepend(tr);
    while (tradeHistoryBody.rows.length > 10) {
      tradeHistoryBody.deleteRow(tradeHistoryBody.rows.length - 1);
    }
  }

  /* ======== CONVERSION TIMESTAMP ======== */
  function formatUnixTime(ts) {
    const date = new Date(ts * 1000); // UNIX → ms
    return date.toLocaleTimeString(); // ou toLocaleString()
  }

  /* CASHIER CONNECTION */
  /* =============================================================
   INITIALISATION ET CONNEXION WEBSOCKET
   ============================================================= */
  function connectDeriv__() {
    // On ferme l'ancienne connexion si elle existe encore
    if (wsTranscation === null) {
      wsTranscation = new WebSocket(WS_URL);
      wsTranscation.onopen = () => { wsTranscation.send(JSON.stringify({ authorize: TOKEN })); };
    }

    if (wsTranscation && (wsTranscation.readyState === WebSocket.OPEN || wsTranscation.readyState === WebSocket.CONNECTING)) {
      wsTranscation.onopen = () => { wsTranscation.send(JSON.stringify({ authorize: TOKEN })); };
    }

    if (wsTranscation && (wsTranscation.readyState === WebSocket.CLOSED || wsTranscation.readyState === WebSocket.CLOSING)) {
      wsTranscation = new WebSocket(WS_URL);
      wsTranscation.onopen = () => { wsTranscation.send(JSON.stringify({ authorize: TOKEN })); };
    }

    // Événement : Réception d'un message (Le coeur du système)
    wsTranscation.onmessage = (msg) => {
      const data = JSON.parse(msg.data);

      // On envoie les données vers le gestionnaire central que nous avons organisé
      handleDerivMessage__(data);
    };

    // Événement : Erreurs de réseau ou serveur
    wsTranscation.onerror = (err) => {
      showError("Impossible de joindre le serveur de transaction.");
      console.error("WebSocket Error:", err);
      wsTranscation.close();
      setTimeout(connectDeriv__, 1000);
    };

    // Événement : Déconnexion
    wsTranscation.onclose = (e) => {
      console.log("🔌 Connexion Deriv fermée");
      setTimeout(connectDeriv__, 1000);
    };
  }

  /* ============================
   HANDLE MESSAGES (Mise à jour)
============================ */
  function handleDerivMessage__(data) {
    const errorBox = document.getElementById("errorBox");

    // 1. Gestion des erreurs globales
    if (data.error) {
      showError(data.error.message);
      return;
    }

    // 2. Autorisation
    if (data.msg_type === "authorize") {
      console.log("🔐 Autorisé:", data.authorize.loginid);
      return;
    }

    // 3. Email de vérification envoyé
    if (data.msg_type === "verify_email") {
      errorBox.style.color = "#10b981";
      errorBox.textContent = "📧 Code envoyé ! Vérifiez vos emails.";
      return;
    }

    // 4. RÉCEPTION DES FRAIS CRYPTO (NOUVEAU)
    if (data.msg_type === "crypto_estimations") {
      const estimations = data.crypto_estimations;
      if (estimations) {
        const firstEntry = Object.values(estimations)[0];
        window.currentFeeId = firstEntry.unique_id; // Stockage pour le payload final
        updateFeeUI(firstEntry, data.echo_req.currency_code); // Appel de la fonction graphique
      }
      return;
    }

    // 5. RÉSULTAT DU CASHIER (URL OU TRANSACTION)
    if (data.msg_type === "cashier") {
      const result = data.cashier;

      // On vérifie si c'est une URL (String) ou un objet
      const url = (typeof result === 'string') ? result : result.url;

      if (url) {
        // C'est un lien (Doughflow, etc.) -> Ouvrir l'Iframe
        openWebview(url);
        document.getElementById("cashierModal").style.display = "none";
      } else {
        // C'est une transaction directe (Crypto API) -> Succès textuel
        errorBox.style.color = "#10b981";
        errorBox.textContent = "✅ Transaction traitée avec succès !";
        setTimeout(() => { document.getElementById("cashierModal").style.display = "none"; }, 2500);
      }
      return;
    }
  }

  // Déclencheur pour les frais crypto     
  const triggerEstimation = () => {
    // On s'assure que le socket est ouvert avant d'envoyer
    if (!wsTranscation || wsTranscation.readyState !== WebSocket.OPEN) return;

    const amount = document.getElementById('amountInput').value;
    const currency = document.getElementById('currencySelect').value.trim();
    const provider = document.getElementById('providerSelect').value;

    // On ne lance l'appel que si les 3 conditions sont réunies  
    if (amount && currency && provider === 'crypto') {
      console.log("🔄 Demande d'estimation des frais pour:", currency);
      wsTranscation.send(JSON.stringify({
        crypto_estimations: 1,
        currency_code: currency
      }));
    }
  };

  /* =============================================================
   MISE À JOUR VISUELLE DES FRAIS (UI)
   ============================================================= */
  function updateFeeUI(feeEntry, currencyCode) {
    const feeIndicator = document.getElementById('feeIndicator');
    const feeBadge = document.getElementById('feeBadge');
    const feeBar = document.getElementById('feeBar');
    const errorBox = document.getElementById('errorBox');

    // Sécurité : on vérifie que les éléments existent
    if (!feeIndicator || !feeEntry) return;

    // 1. Afficher le bloc de priorité
    feeIndicator.style.display = 'block';

    // 2. Définir les niveaux de priorité et couleurs
    // L'API Deriv renvoie généralement des frais optimisés.
    // On simule ici une logique de seuils pour l'aspect visuel :
    let priority = { label: "BAS", color: "#10b981", percent: "35%" }; // Vert

    if (feeEntry.fee > 0.0005) {
      priority = { label: "ÉLEVÉ", color: "#ef4444", percent: "100%" }; // Rouge
    } else if (feeEntry.fee > 0.0001) {
      priority = { label: "MOYEN", color: "#f59e0b", percent: "65%" };  // Orange
    }

    // 3. Appliquer les styles dynamiquement
    feeBadge.textContent = priority.label;
    feeBadge.style.backgroundColor = priority.color;

    feeBar.style.backgroundColor = priority.color;
    feeBar.style.width = priority.percent;

    // 4. Afficher le montant exact des frais sous la barre
    errorBox.style.color = "#64748b"; // Gris discret pour les frais
    errorBox.innerHTML = `Frais estimés : <strong>${feeEntry.fee} ${currencyCode}</strong>`;
  }

  // Ouvre l'iframe
  function openWebview(url) {
    document.getElementById("webviewFrame").src = url;
    document.getElementById("webviewModal").style.display = "flex";
  }

  // Affiche l'erreur dans l'errorBox
  function showError(msg) {
    const eb = document.getElementById("errorBox");
    eb.style.color = "#ef4444";
    eb.textContent = msg;
  }

  function DisconnectDeriv__() {
    if (wsTranscation && (wsTranscation.readyState === WebSocket.OPEN || wsTranscation.readyState === WebSocket.CONNECTING)) {
      // Envoyer unsubscribe avant de fermer
      try { setTimeout(() => { wsTranscation.close(); wsTranscation = null; }, 500); } catch (e) { }
    }
  }

  // ML COMPUTING
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

  reverseBtn.onclick = () => {
    console.log("🔄 Exécution du Reverse...");
    reversefunction();
  };

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
      showToast(`✔️ Reverse executed → ${oppositeType} x${qty}`, 'info');
    };
  }

  // Vos boutons restent les mêmes
  buyBtn.onclick = () => executeTrade("BUY");
  sellBtn.onclick = () => executeTrade("SELL");

  function executeTrade(type) {
    // 1. Sécurité : Vérifier si le WebSocket principal est prêt
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.error("Connexion non établie. Impossible de trader.");
      alert("Connexion en cours... réessayez dans un instant.");
      return;
    }

    multiplier = parseInt(Number(document.getElementById("multiplierSelect").value)) || 40;
    stake = parseFloat(Number(document.getElementById("stakeInput").value)) || 1.0;

    // 2. Préparation du payload
    // Note : On utilise 'stake' (global) et 'multiplier' (global)
    const payload = {
      buy: 1, // La valeur doit souvent être un string "1" ou le price_proposal_id
      price: stake.toFixed(2),
      parameters: {
        contract_type: type === "BUY" ? "MULTUP" : "MULTDOWN",
        symbol: currentSymbol,
        currency: CURRENCY.toString(),
        basis: "stake",
        amount: stake.toFixed(2),
        multiplier: multiplier,
        // stop_loss: 10, // Optionnel
        // take_profit: 20 // Optionnel
      }
    };

    // 3. Récupération du nombre de positions à ouvrir
    const count = type === "BUY"
      ? (parseInt(buyNumber.value) || 1)
      : (parseInt(sellNumber.value) || 1);

    if (multiplier === "" || stake === "" || count === "" || CURRENCY === "" || currentSymbol === "") {
      return;
    }

    // 4. Envoi immédiat (pas d'attente de reconnexion !)
    console.log(`🚀 Envoi de ${count} ordres ${type} sur ${currentSymbol}`);

    for (let i = 0; i < count; i++) {
      ws.send(JSON.stringify(payload));
    }

    showToast(`Placing ${count} ${type} orders: ${currentSymbol}`, 'info');
  }

  // Événement du bouton
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
        showToast(`Trade ${data.sell.contract_id} closed with profit: ${profit.toFixed(2)}`, 'success');
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
        console.log(`✅ Trade ${data.sell.contract_id} closed with loss: ${profit.toFixed(2)}`);
        showToast(`Trade ${data.sell.contract_id} closed with loss: ${profit.toFixed(2)}`, 'error');
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
        showToast(`Trade ${data.sell.contract_id} closed`, 'info');
      }
    };
  };

  // --- INITIALISATION (À appeler une seule fois au chargement ou au 1er clic) ---
  function initMaSeries() {
    if (!chart) return;

    // On crée les 3 séries d'un coup, mais elles restent vides au début
    maSeries = {
      20: chart.addLineSeries({ color: '#2962FF', lineWidth: 2, priceLineVisible: false, lastValueVisible: false }),
      50: chart.addLineSeries({ color: '#9c27b0', lineWidth: 2, priceLineVisible: false, lastValueVisible: false }),
      200: chart.addLineSeries({ color: '#ff9800', lineWidth: 2, priceLineVisible: false, lastValueVisible: false })
    };
  }

  // --- LOGIQUE DES BOUTONS (Appelée depuis le HTML) ---  
  window.toggleMA = function (period, button) {
    if (!chart) return;

    // Si on change de symbole, initChart aura mis maSeries à null
    if (maSeries === null) {
      initMaSeries();
    }

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
      // On efface la ligne immédiatement si on désactive
      if (maSeries[period]) maSeries[period].setData([]);
    }

    // On demande un rendu fluide
    renderIndicators();
  };

  function updateMAs() {
    if (!maSeries || !chart || !isWsInitialized || priceDataZZ.length === 0) return;

    [20, 50, 200].forEach(p => {
      if (activePeriods.includes(p)) {
        const data = calculateEMA(priceDataZZ, p);
        maSeries[p].setData(data);
      }
      // Note: Le "setData([])" est géré dans le toggle pour éviter de vider inutilement ici
    });
  }

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

  function renderIndicators() {
    // 1. Sécurités de base
    if (!isWsInitialized || priceDataZZ.length < 2) return;

    // 2. Utilisation de requestAnimationFrame pour la fluidité (60 FPS)
    requestAnimationFrame(() => {
      // --- ZIGZAG ---
      // Le ZigZag est coûteux en calcul, on vérifie bien son état
      if (isZigZagActive && typeof refreshZigZag === "function") {
        try {
          refreshZigZag();
        } catch (e) {
          console.error("Erreur lors du rafraîchissement du ZigZag:", e);
        }
      }

      // --- MOYENNES MOBILES (MA) ---
      // On ne les met à jour que si au moins une période est active
      if (activePeriods && activePeriods.length > 0 && typeof updateMAs === "function") {
        try {
          updateMAs();
        } catch (e) {
          console.error("Erreur lors de la mise à jour des MA:", e);
        }
      }

      // --- AUTRES INDICATEURS (Ex: RSI, Bollinger) ---
      // Vous pouvez ajouter d'autres conditions ici
    });
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
  window.toggleZigZag = function (btn) {
    if (!chart) return; // Sécurité : le graphique doit exister

    isZigZagActive = btn.classList.toggle("active");

    if (isZigZagActive) {
      btn.innerText = "ZigZag : ON";

      // CRÉATION IMMÉDIATE de la série si elle est absente
      if (!zigzagSeries) {
        zigzagSeries = chart.addLineSeries({
          color: '#f39c12',
          lineWidth: 2,
          priceLineVisible: false,
          lastValueVisible: false,
        });
      }

      // EXÉCUTION IMMÉDIATE du calcul
      refreshZigZag();
    } else {
      btn.innerText = "ZigZag : OFF";
      if (zigzagSeries) {
        zigzagSeries.setData([]);
        zigzagSeries.setMarkers([]);
        // Optionnel : on peut supprimer la série ou simplement la laisser vide
      }
    }
  };

  function refreshZigZag() {
    // 1. Vérifications de sécurité
    if (!isZigZagActive || !zigzagSeries || !priceDataZZ || priceDataZZ.length < 2) {
      return;
    }

    // 2. Calcul (assurez-vous que calculateZigZag retourne bien des données)
    const zzData = calculateZigZag(priceDataZZ, 7);

    if (zzData && zzData.points) {
      zigzagSeries.setData(zzData.points);
      if (zzData.markers) {
        zigzagSeries.setMarkers(zzData.markers);
      }
    }
  }

  /**
 * Fonction appelée par votre bouton HTML
 * <button onclick="enableTrendline(this)">Trendline</button>
 */
  window.enableTrendline = function (btn) {
    // On active le mode 'trend'
    currentMode = 'trend';

    // Feedback visuel sur le bouton
    // On retire la classe active des autres boutons si nécessaire
    document.querySelectorAll('.btn-drawing').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // On s'assure que le canvas peut recevoir les clics
    canvas.style.pointerEvents = 'all';

    btn.classList.add('active', 'btn-drawing');
  }

  // HTML: <button onclick="enableRectangle(this)">Zone (Rectangle)</button>

  window.enableRectangle = function (btn) {
    currentMode = 'rect'; // On change le mode   
    canvas.style.pointerEvents = 'all';

    // Gestion visuelle du bouton
    document.querySelectorAll('.btn-drawing').forEach(b => b.classList.remove('active'));
    btn.classList.add('active', 'btn-drawing');
  }

  window.enableTPSL = function (btn) {
    // Si on reclique sur le bouton alors qu'il est déjà actif, on le désactive
    if (currentMode === 'tpsl') {
      deactivateAllDrawingButtons();
      canvas.style.pointerEvents = 'none';
    } else {
      deactivateAllDrawingButtons(); // Nettoie les autres boutons (Trendline/Rect)
      currentMode = 'tpsl';
      btn.classList.add('active');
      canvas.style.pointerEvents = 'all';
    }
  }

  window.enableFibonacci = function (btn) {
    if (currentMode === 'fibo') {
      deactivateAllDrawingButtons();
      canvas.style.pointerEvents = 'none';
      showFiboAnalysis = false; // On cache tout quand on désactive
    } else {
      deactivateAllDrawingButtons();
      currentMode = 'fibo';
      btn.classList.add('active');
      canvas.style.pointerEvents = 'all';
      showFiboAnalysis = true; // On affiche tout quand on active
    }
    render(); // Rafraîchissement immédiat
  };

  /**
 * Redimensionne le canvas pour matcher exactement le chart
 */
  function resizeCanvas() {
    canvas.width = chartInner.clientWidth;
    canvas.height = chartInner.clientHeight;
    render();
  }

  /**
 * Le moteur de rendu rectifié
 * Dessine : Trendlines, Rectangles et Setup TP/SL
 */
  // --- 2. LE MOTEUR DE RENDU (RENDER) ---
  function render() {
    if (!ctx || !chartInner) return;

    // 1. Initialisation et Nettoyage (Ajustement dynamique à la taille du conteneur)
    canvas.width = chartInner.clientWidth;
    canvas.height = chartInner.clientHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!showDrawings) return;

    const timeScale = chart.timeScale();

    // --- BLOC D'ANALYSE (S'affiche avec le bouton Fibonacci) ---
    if (showFiboAnalysis) {

      // A. VOLUME PROFILE & VALUE AREA (70%)
      const vpData = (currentChartType === "candlestick") ? calculateVolumeProfile() : null;

      if (vpData) {
        ctx.save();
        const { profile, maxTotalVolume, rowHeight, vah, val } = vpData;
        const maxWidth = 300;
        const offsetFromPriceScale = 70;
        const startX = canvas.width - offsetFromPriceScale;

        for (const yKey in profile) {
          const d = profile[yKey];
          const y = parseFloat(yKey);
          const isInValueArea = d.price <= vah && d.price >= val;

          // Couleurs optimisées fond blanc
          const buyColor = isInValueArea ? 'rgba(0, 150, 136, 0.55)' : 'rgba(0, 150, 136, 0.15)';
          const sellColor = isInValueArea ? 'rgba(255, 82, 82, 0.45)' : 'rgba(255, 82, 82, 0.10)';

          const totalWidth = (d.total / maxTotalVolume) * maxWidth;
          const buyWidth = (d.buy / d.total) * totalWidth;

          ctx.fillStyle = sellColor;
          ctx.fillRect(startX - totalWidth, y, totalWidth, rowHeight - 0.5);
          ctx.fillStyle = buyColor;
          ctx.fillRect(startX - totalWidth, y, buyWidth, rowHeight - 0.5);

          // --- POINT OF CONTROL (POC) ---
          if (d.total === maxTotalVolume) {
            const pricePOC = currentSeries.coordinateToPrice(y).toFixed(2);
            ctx.strokeStyle = '#d35400';
            ctx.lineWidth = 2;
            ctx.strokeRect(startX - totalWidth, y, totalWidth, rowHeight - 0.5);

            ctx.fillStyle = '#d35400';
            const badgeWidth = 65;
            ctx.fillRect(startX - totalWidth - badgeWidth, y - 9, badgeWidth, 18);

            ctx.fillStyle = '#FFFFFF';
            ctx.font = "bold 11px Arial";
            ctx.textAlign = "center";
            ctx.fillText(pricePOC, startX - totalWidth - (badgeWidth / 2), y + 4);
          }
        }

        // Tracé des lignes VAH / VAL
        ctx.setLineDash([8, 4]);
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#2c3e50';
        [vah, val].forEach((limitPrice, index) => {
          const yLimit = currentSeries.priceToCoordinate(limitPrice);
          if (yLimit !== null) {
            ctx.beginPath();
            ctx.moveTo(startX - maxWidth, yLimit);
            ctx.lineTo(startX, yLimit);
            ctx.stroke();

            ctx.fillStyle = "#2c3e50";
            ctx.font = "bold 10px Arial";
            ctx.textAlign = "left";
            ctx.fillText(index === 0 ? "VAH (70%)" : "VAL (70%)", startX - maxWidth + 5, yLimit - 5);
          }
        });
        ctx.restore();
      }

      // B. FIBONACCI DYNAMIQUE
      const fiboParams = calculateDynamicFiboPOC();
      if (fiboParams) {
        ctx.save();
        const { fib0, fib100 } = fiboParams;
        const y0 = currentSeries.priceToCoordinate(fib0);
        const y100 = currentSeries.priceToCoordinate(fib100);

        if (y0 !== null && y100 !== null) {
          const rangeY = y100 - y0;
          const levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];

          levels.forEach(lvl => {
            const yLvl = y0 + (rangeY * lvl);
            const isMain = [0, 0.5, 0.618, 1].includes(lvl);
            ctx.strokeStyle = isMain ? 'rgba(0, 86, 179, 0.8)' : 'rgba(0, 0, 0, 0.15)';
            ctx.lineWidth = isMain ? 2 : 1;
            ctx.setLineDash(isMain ? [] : [5, 5]);

            ctx.beginPath();
            ctx.moveTo(0, yLvl);
            ctx.lineTo(canvas.width, yLvl);
            ctx.stroke();

            ctx.setLineDash([]);
            const priceLabel = currentSeries.coordinateToPrice(yLvl).toFixed(3);
            ctx.fillStyle = isMain ? "#0056b3" : "#555555";
            ctx.font = isMain ? "bold 12px Arial" : "10px Arial";
            ctx.textAlign = "left";
            ctx.fillText(`${(lvl * 100).toFixed(1)}% : ${priceLabel}`, 10, yLvl - 8);
          });
        }
        ctx.restore();
      }
    }

    // --- C. OBJETS CLASSIQUES ---
    drawingObjects.forEach((obj) => {
      ctx.save();
      const x1 = timeScale.timeToCoordinate(obj.p1.time);
      const x2 = timeScale.timeToCoordinate(obj.p2.time);
      const y1 = currentSeries.priceToCoordinate(obj.p1.price);
      const y2 = currentSeries.priceToCoordinate(obj.p2.price);

      if (x1 !== null && y1 !== null && x2 !== null && y2 !== null) {
        const isSelected = (selectedObject === obj);
        ctx.strokeStyle = isSelected ? '#e67e22' : '#2962FF';
        ctx.lineWidth = isSelected ? 3 : 2;

        if (obj.type === 'trend') {
          ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
        } else if (obj.type === 'rect') {
          ctx.fillStyle = isSelected ? 'rgba(230, 126, 34, 0.15)' : 'rgba(41, 98, 255, 0.08)';
          ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
          ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
        }
      }
      ctx.restore();
    });

    // --- D. CALENDRIER ÉCONOMIQUE (Nouveau - Appel de la fonction bulles) ---
    // On dessine ceci après les objets classiques pour qu'ils soient toujours visibles
    drawCalendarLabels(ctx);

    // --- E. SETUP TP/SL ---
    if (setup) {
      ctx.save();
      const x1 = timeScale.timeToCoordinate(setup.startTime);
      const x2 = timeScale.timeToCoordinate(setup.endTime);
      const yEntry = currentSeries.priceToCoordinate(setup.entryPrice);
      const yTP = currentSeries.priceToCoordinate(setup.tpPrice);
      const ySL = currentSeries.priceToCoordinate(setup.slPrice);

      if (x1 !== null && x2 !== null && yEntry !== null && yTP !== null && ySL !== null) {
        const w = x2 - x1;
        ctx.fillStyle = 'rgba(0, 150, 136, 0.2)';
        ctx.fillRect(x1, Math.min(yTP, yEntry), w, Math.abs(yEntry - yTP));
        ctx.fillStyle = 'rgba(255, 82, 82, 0.2)';
        ctx.fillRect(x1, Math.min(yEntry, ySL), w, Math.abs(ySL - yEntry));

        const rr = (Math.abs(setup.tpPrice - setup.entryPrice) / Math.max(0.0001, Math.abs(setup.entryPrice - setup.slPrice))).toFixed(2);
        ctx.fillStyle = "#2c3e50";
        ctx.font = "bold 12px Arial";
        ctx.fillText(`Ratio R/R: ${rr}`, x1 + 5, Math.min(yTP, yEntry) - 10);
      }
      ctx.restore();
    }
  }

  // --- CALCUL DU VOLUME PROFILE (Bicolore + POC) ---
  /**
 * Calcule le profil de volume basé sur les données du cache.
 * @returns {Object|null} Les données du profil ou null si indisponible.
 */
  function calculateDynamicFiboPOC() {
    if (typeof cache === 'undefined' || cache.length === 0) return null;

    const lookback = vpLookback || 300;
    const startIndex = Math.max(0, cache.length - lookback);
    const data = cache.slice(startIndex);

    // 1. Calculer le POC Historique (Prix avec le plus de volume/occurrences)
    const vp = calculateVolumeProfile();
    if (!vp) return null;

    let maxVol = 0;
    let pocY = 0;
    for (const y in vp.profile) {
      if (vp.profile[y].total > maxVol) {
        maxVol = vp.profile[y].total;
        pocY = parseFloat(y);
      }
    }
    const pocPrice = currentSeries.coordinateToPrice(pocY);

    // 2. Trouver le plus Haut et plus Bas de la période
    let highest = -Infinity;
    let lowest = Infinity;
    data.forEach(bar => {
      if (bar.high > highest) highest = bar.high;
      if (bar.low < lowest) lowest = bar.low;
    });

    // 3. Déterminer la direction (Si POC est en haut ou en bas)
    // Comme dans votre code : bool pocIsHigh = (MathAbs(pocPrice - highestPrice) < MathAbs(pocPrice - lowestPrice))
    const pocIsHigh = Math.abs(pocPrice - highest) < Math.abs(pocPrice - lowest);

    let fib0, fib100;
    if (pocIsHigh) {
      fib0 = highest;
      fib100 = lowest;
    } else {
      fib0 = lowest;
      fib100 = highest;
    }

    return { fib0, fib100, pocIsHigh, pocPrice };
  }

  function calculateVolumeProfile() {
    if (!cache || cache.length === 0) return null;

    const lookback = 300;
    const startIndex = Math.max(0, cache.length - lookback);
    const data = cache.slice(startIndex);

    // Trouver les extrêmes de prix sur la période
    const prices = data.flatMap(d => [d.high, d.low]);
    const minP = Math.min(...prices);
    const maxP = Math.max(...prices);
    const rowHeightPrice = (maxP - minP) / 50; // Précision de 50 lignes

    const profile = {};
    let maxTotalVolume = 0;
    let totalVolumeSum = 0;

    data.forEach(bar => {
      const volume = bar.volume || 100;
      const buyVol = bar.close > bar.open ? volume * 0.6 : volume * 0.4;

      // Distribution sur les niveaux de prix
      for (let p = bar.low; p <= bar.high; p += rowHeightPrice) {
        const yPos = currentSeries.priceToCoordinate(p);
        if (yPos === null) continue;

        const yKey = Math.round(yPos);
        if (!profile[yKey]) {
          profile[yKey] = { total: 0, buy: 0, price: p }; // On stocke le prix p ici
        }

        const steps = Math.max(1, (bar.high - bar.low) / rowHeightPrice);
        const vPerStep = volume / steps;

        profile[yKey].total += vPerStep;
        profile[yKey].buy += (buyVol / steps);
        totalVolumeSum += vPerStep;

        if (profile[yKey].total > maxTotalVolume) maxTotalVolume = profile[yKey].total;
      }
    });

    // --- CALCUL VA (70%) ---
    const sortedLevels = Object.values(profile).sort((a, b) => b.total - a.total);
    let currentAcc = 0;
    const target = totalVolumeSum * 0.7;
    let vaPrices = [];

    for (let node of sortedLevels) {
      if (currentAcc < target) {
        currentAcc += node.total;
        vaPrices.push(node.price);
      } else break;
    }

    // Sécurité : si la VA est vide, on prend les extrêmes
    const vah = vaPrices.length > 0 ? Math.max(...vaPrices) : maxP;
    const val = vaPrices.length > 0 ? Math.min(...vaPrices) : minP;

    return {
      profile,
      maxTotalVolume,
      rowHeight: 5, // Hauteur de secours
      vah,
      val
    };
  }

  // --- LOGIQUE DE GÉNÉRATION INITIALE ---
  function generateLinkedSetup(clickTime, clickPrice) {
    // On crée un setup par défaut autour du point cliqué
    setup = {
      type: 'tpsl',
      startTime: clickTime,
      endTime: clickTime, // Sera étiré par le mouvement de souris ou par défaut
      entryPrice: clickPrice,
      tpPrice: clickPrice + (clickPrice * 0.01), // +1% par défaut
      slPrice: clickPrice - (clickPrice * 0.005) // -0.5% par défaut
    };

    // On définit directement la poignée droite comme active pour étirer la largeur au premier clic
    activeHandle = 'RIGHT';
    render();
  }

  function deactivateAllDrawingButtons() {
    document.querySelectorAll('.btn-drawing').forEach(btn => {
      btn.classList.remove('active');
    });
    currentMode = null; // Réinitialise aussi le mode d'attente
  }

  // Table
  function initTable() {
    const container = document.getElementById("autoHistoryList");
    if (!container) return;

    container.innerHTML = `
    <div class="table-wrapper">
        <div class="table-header-flex" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h3 style="margin: 0; font-size: 1.1rem; font-weight: 700; color: #1e293b;">
                Live Portfolio 
                <span id="wsStatus" class="status-dot status-offline" title="Checking connection..."></span>
            </h3>
            <div class="header-actions">
                <button id="exportCSV" onclick="downloadHistoryCSV()" class="btn-secondary">📊 Export CSV</button>
            </div>
        </div>

        <div class="table-responsive" style="overflow-x: auto;">
            <table class="trade-table" id="autoTradeTable">
                <thead>
                    <tr>
                        <th><input type="checkbox" id="selectAll" "title="Tout sélectionner" onclick="toggleSelectAll(this)"></th>
                        <th>Time</th>
                        <th>Contract ID</th>
                        <th>Symbol</th>    
                        <th>Type</th>  
                        <th>Stake</th>
                        <th>Mult.</th>
                        <th>Entry</th>
                        <th>TP</th>
                        <th>SL</th>
                        <th>Profit</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="autoTradeBody">
                    </tbody>
            </table>
        </div>

        <div class="table-footer-stats">
            <div class="stats-group" style="display: flex; gap: 30px;">
                <div class="stats-item">
                    <label>Active Positions</label>
                    <span id="totalOpenContracts">0</span>
                </div>
                <div class="stats-item">
                    <label>Floating P/L</label>  
                    <span id="totalFloatingProfit" class="total-neutral">0.00 USD</span>
                </div>
            </div>
            
            <div class="actions-group" style="display: flex; gap: 12px; align-items: center;">
                <button id="deleteSelected" onclick="deleteSelectedRows()" class="btn-delete-light">🗑 Delete Selected</button>
                <button id="panicCloseAll" class="panic-btn" onclick="panicCloseAll()">🚨 Emergency Close All</button>
            </div>
        </div>
    </div>  
    `;

    // Dans votre fonction initTable()
    const selectAllElement = document.getElementById('selectAll');
    if (selectAllElement) {
      selectAllElement.addEventListener('change', function () {
        const checkboxes = document.querySelectorAll('.rowSelect');
        checkboxes.forEach(cb => {
          cb.checked = this.checked;

          // OPTIONNEL : Mise à jour visuelle de la ligne (couleur de fond)
          const row = cb.closest('tr');
          if (row) {
            row.style.backgroundColor = this.checked ? "#f0f7ff" : "";
          }
        });
      });
    }

    const panicBtn = document.getElementById("panicCloseAll");
    if (panicBtn) {
      panicBtn.addEventListener("click", panicCloseAll);
    }

    const download = document.getElementById("exportCSV");
    if (download) {
      download.addEventListener("click", downloadHistoryCSV);
    }

    const deleteSelectedBtn = document.getElementById("deleteSelected");
    if (deleteSelectedBtn) {
      deleteSelectedBtn.addEventListener("click", deleteSelectedRows);
    }

    const masterCb = document.getElementById('selectAll');
    if (masterCb) {
      masterCb.addEventListener('change', function () {
        toggleSelectAll(this); // "this" représente ici le masterCb
      });
    }
  }

  function updateTotalStats() {
    const tbody = document.getElementById("autoTradeBody");
    const totalOpenSpan = document.getElementById("totalOpenContracts");
    const totalFloatingSpan = document.getElementById("totalFloatingProfit");

    if (!tbody) return;

    const rows = tbody.querySelectorAll("tr");
    let totalProfit = 0;

    // 1. Mise à jour du nombre de positions
    if (totalOpenSpan) {
      totalOpenSpan.textContent = rows.length;
    }

    // 2. Calcul du Profit Global (Floating P/L)
    rows.forEach(row => {
      // Le profit est dans la 11ème cellule (index 10)
      const profitCell = row.cells[10];
      if (profitCell) {
        // On extrait le nombre (enlève le +, le USD, etc.)
        const val = parseFloat(profitCell.textContent.replace(/[^+-.0-9]/g, '')) || 0;
        totalProfit += val;
      }
    });

    // 3. Mise à jour de l'affichage du Profit Total
    if (totalFloatingSpan) {
      const sign = totalProfit > 0 ? "+" : "";
      totalFloatingSpan.textContent = `${sign}${totalProfit.toFixed(2)} USD`;

      // Gestion des couleurs
      totalFloatingSpan.classList.remove('total-positive', 'total-negative', 'total-neutral');
      if (totalProfit > 0) {
        totalFloatingSpan.style.color = "#10b981"; // Vert
        totalFloatingSpan.classList.add('total-positive');
      } else if (totalProfit < 0) {
        totalFloatingSpan.style.color = "#ef4444"; // Rouge
        totalFloatingSpan.classList.add('total-negative');
      } else {
        totalFloatingSpan.style.color = "#64748b"; // Gris
        totalFloatingSpan.classList.add('total-neutral');
      }
    }
  }

  function updateDonutCharts() {
    // 1. Cible les éléments de vos cercles
    const profitPath = document.getElementById("panel-circle-profit-path");
    const lossPath = document.getElementById("panel-circle-loss-path");
    const profitText = document.getElementById("panel-profit-percent-text");
    const lossText = document.getElementById("panel-loss-percent-text");
    const pValueElem = document.getElementById("panel-profitvalue");
    const lValueElem = document.getElementById("panel-lossvalue");

    const tbody = document.getElementById("autoTradeBody");
    if (!tbody || !profitPath || !lossPath) return;

    const rows = tbody.querySelectorAll("tr");
    let countProfit = 0;
    let countLoss = 0;
    let totalProfitVal = 0;
    let totalLossVal = 0;

    // 2. Analyse des données dans le tableau
    rows.forEach(row => {
      // Index 10 = 11ème colonne (Profit)
      const cell = row.cells[10];
      if (cell) {
        // Nettoyage : on enlève tout sauf chiffres, points et signes
        const val = parseFloat(cell.textContent.replace(/[^+-.0-9]/g, '')) || 0;

        if (val >= 0) {
          countProfit++;
          totalProfitVal += val;
        } else {
          countLoss++;
          totalLossVal += Math.abs(val);
        }
      }
    });

    const totalTrades = rows.length;

    // 3. Calcul des pourcentages (Win Rate)
    const winRate = totalTrades > 0 ? (countProfit / totalTrades) * 100 : 0;
    const lossRate = totalTrades > 0 ? (countLoss / totalTrades) * 100 : 0;

    // 4. Animation des cercles (SVG dasharray)
    // Format: "pourcentage, reste"
    profitPath.setAttribute("stroke-dasharray", `${winRate}, 100`);
    lossPath.setAttribute("stroke-dasharray", `${lossRate}, 100`);

    // 5. Mise à jour des textes
    if (profitText) profitText.textContent = `${Math.round(winRate)}%`;
    if (lossText) lossText.textContent = `${Math.round(lossRate)}%`;

    if (pValueElem) pValueElem.textContent = totalProfitVal.toFixed(2);
    if (lValueElem) lValueElem.textContent = totalLossVal.toFixed(2);
  }

  // DELETE SELECTED ROWS
  function deleteSelectedRows() {
    // 1. On récupère toutes les checkboxes cochées
    const selectedCheckboxes = document.querySelectorAll('.rowSelect:checked');

    if (selectedCheckboxes.length === 0) {
      alert("Aucun contrat sélectionné.");
      return;
    }

    const confirmMsg = `Êtes-vous sûr de vouloir clôturer ces ${selectedCheckboxes.length} positions ?`;
    if (confirm(confirmMsg)) {
      selectedCheckboxes.forEach(cb => {
        // 2. On remonte à la ligne (tr) pour lire le data-contract
        const row = cb.closest('tr');
        if (row) {
          const contractId = row.dataset.contract;

          // 3. Appel de votre fonction de clôture individuelle
          if (contractId && typeof closeContract === 'function') {
            closeContract(contractId);
          }
        }
      });

      showToast(`${selectedCheckboxes.length} Contracts were closed`, 'info');

      // 4. Reset de la case "Tout sélectionner"
      const selectAllCb = document.getElementById('selectAll');
      if (selectAllCb) selectAllCb.checked = false;
    }
  }

  /**
 * Alterne la sélection de toutes les lignes du tableau
 * @param {HTMLInputElement} masterCheckbox - La case à cocher "Select All"
 */
  function toggleSelectAll(masterCheckbox) {
    // On cible toutes les cases à cocher des lignes dans le corps du tableau
    const checkboxes = document.querySelectorAll('#autoTradeBody .rowSelect');

    checkboxes.forEach(cb => {
      // On aligne l'état de chaque case sur celui de la case principale
      cb.checked = masterCheckbox.checked;

      // Mise à jour visuelle de la ligne (optionnel)
      const row = cb.closest('tr');
      if (row) {
        if (masterCheckbox.checked) {
          row.style.backgroundColor = "#f0f7ff"; // Bleu très léger si coché
        } else {
          row.style.backgroundColor = ""; // Retour au style normal
        }
      }
    });
  }

  // --- 💰 Ferme un contrat  
  /**
 * Envoie un ordre de vente (fermeture) pour un contrat spécifique
 * @param {string|number} contract_id - L'identifiant unique du contrat
 */
  function closeContract(contract_id) {
    // 1. Sécurité : Vérifier si l'ID est présent
    if (!contract_id) {
      console.warn("⚠️ Tentative de fermeture sans ID de contrat.");
      return;
    }

    const id = contract_id.toString().trim();

    // 2. Vérifier si la connexion WebSocket existe et est ouverte
    if (typeof wsplContracts !== 'undefined' && wsplContracts !== null && wsplContracts.readyState === WebSocket.OPEN) {

      // Préparation de la requête API Deriv
      const sellRequest = {
        sell: id,
        price: 0 // "0" force la vente immédiate au prix du marché
      };

      // Envoi de la requête
      wsplContracts.send(JSON.stringify(sellRequest));
      console.log(`%c 📤 Ordre de vente envoyé pour le contrat : ${id}`, "color: #3b82f6; font-weight: bold;");
      showToast(`Trade ${id} closed`, 'info');
    } else {
      // 4. Gestion de l'erreur de connexion
      console.error("❌ Impossible de fermer le contrat : WebSocket déconnecté.");
      alert("Action impossible : La connexion au serveur est perdue.");

      // Optionnel : Tentative de reconnexion automatique
      if (typeof connectDeriv_table === 'function') {
        setUIStatus('offline');
        connectDeriv_table();
      }
    }
  }

  /**
 * Ferme instantanément toutes les positions ouvertes dans la table
 */
  function panicCloseAll() {
    const tbody = document.getElementById("autoTradeBody");
    const rows = tbody ? tbody.querySelectorAll("tr") : [];

    if (rows.length === 0) {
      alert("Aucune position ouverte à fermer.");
      return;
    }

    // 1. Confirmation de sécurité
    const confirmPanic = confirm(`🚨 ALERTE URGENCE 🚨\nVoulez-vous fermer immédiatement les ${rows.length} positions ouvertes ?`);
    if (!confirmPanic) return;

    console.warn("--- DÉCLENCHEMENT PANIC CLOSE ---");
    showToast(`⚠️ PANIC CLOSE TRIGGERED`, 'warn');

    // 2. Vérification de la connexion WebSocket avant de boucler  
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      alert("Erreur critique : La connexion au serveur est perdue. Impossible de fermer les positions.");
      return;
    }

    // 3. Désactivation visuelle immédiate du bouton Panic
    const panicBtn = document.getElementById("panicCloseAll");
    if (panicBtn) {
      panicBtn.disabled = true;
      panicBtn.innerHTML = "⌛ Closing All...";
      panicBtn.style.backgroundColor = "#94a3b8"; // Gris neutre
    }

    // 4. Boucle de fermeture massive
    rows.forEach(row => {
      const contractId = row.dataset.contract;
      if (contractId) {
        // On applique un style visuel "en cours" sur chaque ligne
        row.style.opacity = "0.4";
        row.style.pointerEvents = "none";

        // Appel de votre fonction de clôture individuelle
        closeContract(contractId);
      }
    });

    // 5. Réinitialisation du bouton après un délai de sécurité
    setTimeout(() => {
      if (panicBtn) {
        panicBtn.disabled = false;
        panicBtn.innerHTML = "🚨 Emergency Close All";
        panicBtn.style.backgroundColor = ""; // Reprend le style CSS
      }
    }, 5000);
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

  // --- 🔄 S’abonne aux détails d’un contrat
  function subscribeContractDetails(contract_id) {
    wsplContracts.send(JSON.stringify({ proposal_open_contract: 1, contract_id: contract_id, subscribe: 1 }));
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

    updateTotalStats();
    updateDonutCharts();
    Openpositionlines(currentSeries);
  }

  /**
 * Action pour le bouton Export CSV
 */
  function downloadHistoryCSV() {
    const table = document.getElementById("autoTradeTable");
    if (!table) return alert("Tableau introuvable.");

    const rows = Array.from(table.querySelectorAll("tr"));

    // 1. Définition du séparateur (le point-virgule est le plus fiable pour Excel FR)
    const separator = ";";

    const csvContent = rows.map(row => {
      const cells = Array.from(row.querySelectorAll("th, td"));

      // On ignore la 1ère (checkbox) et la dernière colonne (bouton)
      return cells.slice(1, -1).map(cell => {
        // On récupère le texte, on enlève les retours à la ligne
        let data = cell.innerText.replace(/\n/g, ' ').trim();

        // Si la donnée contient le séparateur, on l'entoure de guillemets
        // On remplace les guillemets simples par des doubles pour ne pas casser le CSV
        if (data.includes(separator) || data.includes('"')) {
          data = `"${data.replace(/"/g, '""')}"`;
        }
        return data;
      }).join(separator); // Utilisation du point-virgule
    }).join("\n");

    // 2. Création du BLOB avec le BOM UTF-8 (indispensable pour Excel)
    // Le code \ufeff indique à Excel : "Ceci est de l'UTF-8, traite les colonnes correctement"
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);

    // 3. Procédure de téléchargement
    const link = document.createElement("a");
    const timestamp = new Date().toLocaleDateString().replace(/\//g, '-') + "_" + new Date().getHours() + "h" + new Date().getMinutes();

    link.setAttribute("href", url);
    link.setAttribute("download", `Rapport_Trading_${timestamp}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log("✅ Fichier Excel (CSV) généré avec séparation par colonnes.");
  }

  function setUIStatus(state) {
    const dot = document.getElementById("wsStatus");
    if (!dot) return;

    if (state === 'online') {
      dot.classList.remove("status-offline");
      dot.classList.add("status-online");
      dot.title = "Connected to Deriv";
    } else {
      dot.classList.remove("status-online");
      dot.classList.add("status-offline");
      dot.title = "Connection Lost / Connecting...";
    }
  }

  // --- 🧱 Connexion WebSocket
  /**
 * Initialise la connexion WebSocket avec Deriv et gère le flux de données
 */
  function connectDeriv_table() {
    // 1. Empêcher les connexions multiples si une est déjà en cours ou ouverte
    if (wsplContracts && (wsplContracts.readyState === WebSocket.OPEN || wsplContracts.readyState === WebSocket.CONNECTING)) {
      console.log("ℹ️ Connexion déjà active ou en cours...");
      return;
    }

    console.log("🌐 Connexion au serveur de trading...");
    wsplContracts = new WebSocket(WS_URL);

    // --- ÉVÉNEMENT : OUVERTURE ---
    wsplContracts.onopen = () => {
      console.log("✅ WebSocket Connecté");
      setUIStatus('online'); // La pastille passe au vert

      // Authentification immédiate
      wsplContracts.send(JSON.stringify({ authorize: TOKEN }));
    };

    // --- ÉVÉNEMENT : RÉCEPTION DES MESSAGES ---
    wsplContracts.onmessage = (msg) => {
      const data = JSON.parse(msg.data);

      switch (data.msg_type) {
        case "authorize":
          console.log("🔓 Authentifié avec succès !");
          // Une fois autorisé, on demande le portfolio et on s'abonne aux contrats
          wsplContracts.send(JSON.stringify({ portfolio: 1 }));
          wsplContracts.send(JSON.stringify({ proposal_open_contract: 1, subscribe: 1 }));
          break;

        case "proposal_open_contract":
          // C'est ici que la table reçoit ses données en temps réel
          if (typeof handleContractDetails === 'function' && typeof updateGlobalPnL === 'function') {
            handleContractDetails(data);
            updateGlobalPnL();
          }
          break;

        case "portfolio":
          if (typeof handlePortfolio === 'function') {
            handlePortfolio(data);
          }
          break;

        case "sell":
          console.log("💰 Confirmation de vente reçue pour le contrat :", data.sell.contract_id);
          break;

        case "error":
          console.error("❌ Erreur API :", data.error.message);
          break;
      }

      Openpositionlines(currentSeries);
    };

    // --- ÉVÉNEMENT : FERMETURE ---
    wsplContracts.onclose = () => {
      console.warn("🔴 Connexion perdue. Tentative de reconnexion dans 3s...");
      setUIStatus('offline'); // La pastille passe au gris
      wsplContracts = null;

      // Tentative de reconnexion automatique
      setTimeout(connectDeriv_table, 3000);
    };

    // --- ÉVÉNEMENT : ERREUR RÉSEAU ---
    wsplContracts.onerror = (error) => {
      console.error("❌ Erreur WebSocket :", error);
      setUIStatus('offline');
      wsplContracts.close(); // Déclenche onclose pour la reconnexion   
    };
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
    const container = document.getElementById("HistoricalContract");

    container.innerHTML = `
    <div id="quickStatsHeader" style="display: flex; gap: 15px; margin-bottom: 15px;">
        <div style="flex: 1; background: #f1f5f9; padding: 10px; border-radius: 8px; text-align: center; border: 1px solid #e2e8f0;">
            <label style="display: block; font-size: 0.65rem; color: #64748b; text-transform: uppercase; font-weight: bold;">Total Trades</label>
            <span id="totalTradesCount" style="font-size: 1.2rem; font-weight: 800; color: #1e293b;">0</span>
        </div>
        <div style="flex: 1; background: #f1f5f9; padding: 10px; border-radius: 8px; text-align: center; border: 1px solid #e2e8f0;">
            <label style="display: block; font-size: 0.65rem; color: #64748b; text-transform: uppercase; font-weight: bold;">Win/Loss Ratio</label>
            <span id="winLossRatio" style="font-size: 1.2rem; font-weight: 800; color: #10b981;">0%</span>
        </div> 
    </div>  
  
    <div id="symbolAnalysisContainer" style="margin-bottom: 20px; padding: 15px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
        <h4 style="margin: 0 0 10px 0; font-size: 0.75rem; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">📊 Profit per Symbol</h4>
        <div id="symbolBarChart" style="display: flex; align-items: flex-end; gap: 10px; height: 120px; padding-top: 20px; overflow-x: auto; min-width: 100%;">
            </div>
    </div>

    <div class="table-controls" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; gap: 10px; flex-wrap: wrap;">
        <div style="display: flex; gap: 8px; flex: 1; min-width: 300px;">
            <input type="text" id="symbolFilter" placeholder="🔍 Filter by symbol (ex: R_100)..." 
                   style="flex: 1; padding: 10px; border-radius: 8px; border: 1px solid #e2e8f0; outline: none;">
            <button id="resetFilters" style="padding: 10px; border-radius: 8px; border: 1px solid #e2e8f0; background: white; cursor: pointer; font-weight: bold; color: #64748b;">🔄 Reset</button>
            <button id="generateReport" style="padding: 10px; border-radius: 8px; border: none; background: #1e293b; color: white; cursor: pointer; font-weight: bold;">📄 PDF</button>
        </div>

        <div class="pagination-controls" style="display: flex; align-items: center; gap: 10px; background: #f8fafc; padding: 5px 12px; border-radius: 8px; border: 1px solid #e2e8f0;">
            <button id="prevPage" style="border: none; background: transparent; cursor: pointer; color: #2563eb; font-weight: bold;">◀</button>
            <span id="pageInfo" style="font-size: 0.8rem; font-weight: 800; color: #475569; min-width: 80px; text-align: center;">Page 1 / 1</span>
            <button id="nextPage" style="border: none; background: transparent; cursor: pointer; color: #2563eb; font-weight: bold;">▶</button>
        </div>
    </div>

    <div class="table-responsive" style="border-radius: 10px; border: 1px solid #f1f5f9; overflow: hidden;">
        <table class="trade-table" id="autoHistoricalTrade" style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="background: #f8fafc;">
                    <th style="padding: 12px; font-size: 0.7rem; color: #64748b; text-transform: uppercase;">Time</th>
                    <th style="padding: 12px; font-size: 0.7rem; color: #64748b; text-transform: uppercase;">Contract</th>
                    <th style="padding: 12px; font-size: 0.7rem; color: #64748b; text-transform: uppercase;">Symbol</th>
                    <th style="padding: 12px; font-size: 0.7rem; color: #64748b; text-transform: uppercase;">Type</th>
                    <th style="padding: 12px; font-size: 0.7rem; color: #64748b; text-transform: uppercase;">Stake</th>
                    <th style="padding: 12px; font-size: 0.7rem; color: #64748b; text-transform: uppercase;">Mult.</th>
                    <th style="padding: 12px; font-size: 0.7rem; color: #64748b; text-transform: uppercase;">TP</th>
                    <th style="padding: 12px; font-size: 0.7rem; color: #64748b; text-transform: uppercase;">SL</th>
                    <th id="sortProfit" style="padding: 12px; font-size: 0.7rem; color: #2563eb; text-transform: uppercase; cursor: pointer; font-weight: 800; border-bottom: 2px solid #dbeafe;">Profit ↕</th>
                    <th style="padding: 12px; font-size: 0.7rem; color: #64748b; text-transform: uppercase;">Status</th>
                </tr>
            </thead>
            <tbody id="autoHistoricalBody">
                <tr><td colspan="10" style="text-align: center; padding: 40px; color: #94a3b8;">No data available.</td></tr>
            </tbody>
        </table>
    </div>

    <div id="tradeNotifier" style="position: fixed; top: 20px; right: 20px; z-index: 10000; display: flex; flex-direction: column; gap: 10px;"></div>
    `;

    // Attachement immédiat des nouveaux événements
    document.getElementById("symbolFilter").addEventListener("input", filterAndRender);
    document.getElementById("resetFilters").addEventListener("click", resetAll);
    document.getElementById("sortProfit").addEventListener("click", sortDataByProfit);
    document.getElementById("prevPage").addEventListener("click", () => { if (currentPage > 1) { currentPage--; filterAndRender(); } });
    document.getElementById("nextPage").addEventListener("click", () => {
      const maxPage = Math.ceil(allTradesData.length / rowsPerPage);
      if (currentPage < maxPage) { currentPage++; filterAndRender(); }
    });
    document.getElementById("generateReport").addEventListener("click", GetpdfTradereport);
  }

  function resetAll() {
    // 1. Réinitialiser les champs de saisie (Filtre par symbole)
    const filterInput = document.getElementById("symbolFilter");
    if (filterInput) filterInput.value = "";

    // 2. Réinitialiser l'état du tri (Revenir au tri par date DESC)
    currentSortOrder = 'none';
    const sortBtn = document.getElementById("sortProfit");
    if (sortBtn) {
      sortBtn.textContent = "Profit ↕";
      sortBtn.style.color = "#2563eb"; // On remet la couleur bleue d'origine
    }

    // 3. Remettre les données dans l'ordre chronologique original (Le plus récent en haut)
    // On suppose que l'API renvoie les données triées par date de vente (sell_time)
    allTradesData.sort((a, b) => b.sell_time - a.sell_time);

    // 4. Revenir à la première page
    currentPage = 1;

    // 5. Relancer le rendu global
    // Cela va recalculer les stats (cercles), le graphique en barres et le tableau
    filterAndRender();

    // 6. Petit feedback visuel (Optionnel)
    console.log("Filtres réinitialisés avec succès.");
  }

  function updateHistoricalTable(trades) {
    allTradesData = trades;

    // Si on a des trades et que le premier (le plus récent) est différent du dernier vu
    if (trades.length > 0) {
      const latestTrade = trades[0];

      if (lastSeenTradeId !== null && latestTrade.contract_id !== lastSeenTradeId) {
        // APPEL DE LA NOTIFICATION pour le nouveau trade détecté
        notifyNewTrade(latestTrade);
      }

      // On met à jour l'ID du dernier trade vu
      lastSeenTradeId = latestTrade.contract_id;
    }

    currentPage = 1;
    filterAndRender();
    updateHistoricalChart(trades);
  }

  /**
 * Met à jour le graphique linéaire de performance cumulative
 * @param {Array} trades - Liste des transactions récupérées de l'API
 */
  function updateHistoricalChart(trades) {
    if (!areahistoricalSeries || !trades || trades.length === 0) return;

    // 1. Transformer les trades en profit CUMULÉ (Courbe d'équité)
    // C'est plus parlant visuellement que des profits isolés
    const sortedTrades = [...trades].sort((a, b) => a.sell_time - b.sell_time);

    let cumulativeProfit = 0;
    const seenTimes = new Set();
    const chartData = [];

    sortedTrades.forEach(t => {
      const time = Number(t.sell_time);
      const profit = parseFloat(t.sell_price) - parseFloat(t.buy_price);

      if (!isNaN(time) && !isNaN(profit) && !seenTimes.has(time)) {
        cumulativeProfit += profit;
        seenTimes.add(time);
        chartData.push({
          time: time,
          value: parseFloat(cumulativeProfit.toFixed(2))
        });
      }
    });

    if (chartData.length > 0) {
      console.log("📊 Chart updated with cumulative data:", chartData);
      areahistoricalSeries.setData(chartData);
      charthistorical.timeScale().fitContent();
    }
  }

  function inithistoricalchart() {
    const container = document.getElementById("HistoricalgraphicalContract");
    if (!container) {
      console.error("❌ Container 'HistoricalgraphicalContract' introuvable !");
      return;
    }

    // Nettoyage si un graphique existe déjà
    if (charthistorical) {
      charthistorical.remove();
      charthistorical = null;
    }
    container.innerHTML = "";

    // Création du graphique Lightweight
    charthistorical = LightweightCharts.createChart(container, {
      width: container.clientWidth,
      height: 300,
      layout: {
        background: { type: 'solid', color: '#ffffff' },
        textColor: '#64748b',
      },
      grid: {
        vertLines: { color: '#f1f5f9' },
        horzLines: { color: '#f1f5f9' },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: '#e2e8f0',
      },
      rightPriceScale: {
        borderColor: '#e2e8f0',
      },
    });

    // Configuration de la série Area (Profit cumulé)
    areahistoricalSeries = charthistorical.addAreaSeries({
      lineColor: '#3b82f6',
      topColor: 'rgba(59, 130, 246, 0.4)',
      bottomColor: 'rgba(59, 130, 246, 0.0)',
      lineWidth: 3,
      priceFormat: { type: 'price', precision: 2, minMove: 0.01 },
    });

    // Charger les données aléatoires initiales
    setRandomSeries();

    // Responsive : ajuster la taille si la fenêtre change
    window.addEventListener('resize', () => {
      if (charthistorical) {
        charthistorical.applyOptions({ width: container.clientWidth });
      }
    });
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

  function filterAndRender() {
    // 1. Sécurisation de l'accès au champ de filtre
    const filterInput = document.getElementById("symbolFilter");
    const filterValue = filterInput ? filterInput.value.toUpperCase() : "";

    // 2. Filtrage sécurisé (Correction du crash)
    const filtered = allTradesData.filter(t => {
      // On récupère une chaîne de caractère quoi qu'il arrive
      const symbol = String(t.underlying_symbol || t.description || "");
      return symbol.toUpperCase().includes(filterValue);
    });

    // 3. Calcul des statistiques
    const stats = calculateWinRate(filtered);

    // 4. Mise à jour sécurisée des éléments de l'en-tête
    const totalCountEl = document.getElementById("totalTradesCount");
    const winRatioEl = document.getElementById("winLossRatio");

    if (totalCountEl) totalCountEl.textContent = filtered.length;
    if (winRatioEl) {
      winRatioEl.textContent = stats.winRate + "%";
      winRatioEl.style.color = stats.winRate >= 50 ? "#10b981" : "#ef4444";
    }

    // 5. Mise à jour des composants visuels
    updateCirclesUI(stats);
    renderSymbolAnalysis(filtered);

    // 6. Gestion de la Pagination sécurisée
    const rPerPage = typeof rowsPerPage !== 'undefined' ? rowsPerPage : 10;
    const totalPages = Math.ceil(filtered.length / rPerPage) || 1;

    // Sécurité pour ne pas être sur une page inexistante
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const start = (currentPage - 1) * rPerPage;
    const paginatedData = filtered.slice(start, start + rPerPage);

    // 7. Rendu final du tableau
    renderTableRows(paginatedData);

    // 8. Mise à jour du texte de pagination
    const pageInfoEl = document.getElementById("pageInfo");
    if (pageInfoEl) {
      pageInfoEl.textContent = `Page ${currentPage} / ${totalPages}`;
    }
  }

  function renderTableRows(trades) {
    const tbody = document.getElementById("autoHistoricalBody");
    tbody.innerHTML = "";

    if (trades.length === 0) {
      tbody.innerHTML = '<tr><td colspan="10" style="text-align:center; padding: 30px;">No matching trades found</td></tr>';
      return;
    }

    trades.forEach(t => {
      const profit = parseFloat(t.sell_price) - parseFloat(t.buy_price);
      const isWin = profit > 0;

      // On crée la ligne
      const tr = document.createElement("tr");
      tr.style.borderBottom = "1px solid #f1f5f9";

      tr.innerHTML = `
            <td style="padding: 12px; font-size: 0.8rem;">${new Date(t.sell_time * 1000).toLocaleString()}</td>
            <td style="padding: 12px; font-size: 0.75rem; color: #64748b;">#${t.contract_id}</td>
            <td style="padding: 12px; font-weight: 700;">${t.underlying_symbol}</td>
            <td style="padding: 12px; font-size: 0.75rem;">${t.contract_type}</td>
            <td style="padding: 12px;">${t.buy_price.toFixed(2)}</td>
            <td style="padding: 12px;">${t.multiplier || "-"}</td>
            <td style="padding: 12px; color: #10b981;">${t.take_profit || "-"}</td>
            <td style="padding: 12px; color: #ef4444;">${t.stop_loss || "-"}</td>
            <td style="padding: 12px; font-weight: 800; color: ${isWin ? '#10b981' : '#ef4444'};">
                ${isWin ? '+' : ''}${profit.toFixed(2)}
            </td>
            <td style="padding: 12px;">
                <span class="badge-status ${isWin ? 'badge-win' : 'badge-loss'}">
                    ${isWin ? 'WIN' : 'LOSS'}
                </span>
            </td>
        `;
      tbody.appendChild(tr);
    });
  }

  function notifyNewTrade(trade) {
    const notifier = document.getElementById("tradeNotifier");
    const profit = (parseFloat(trade.sell_price) - parseFloat(trade.buy_price)).toFixed(2);
    const toast = document.createElement("div");
    toast.className = "toast-notification"; // Ajoutez du CSS pour le style
    toast.style.cssText = `background: white; border-left: 5px solid ${profit > 0 ? '#10b981' : '#ef4444'}; padding: 15px; margin-top: 10px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);`;
    toast.innerHTML = `<strong>${trade.underlying_symbol}</strong>: ${profit} USD`;
    notifier.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  }

  function fetchHistoricalData(from, to) {
    // 1. Fermer proprement l'ancienne connexion
    if (historicalConn) {
      historicalConn.onopen = null;
      historicalConn.onmessage = null;
      historicalConn.onerror = null;
      historicalConn.close();
    }

    // 2. Initialisation (Utilisez l'URL directe si WS_URL pose problème)
    const APP_ID = '109310';
    const finalURL = `wss://ws.binaryws.com/websockets/v3?app_id=${APP_ID}`;

    historicalConn = new WebSocket(finalURL);

    // 3. Gestionnaire d'erreur de connexion
    historicalConn.onerror = (error) => {
      console.error("WebSocket Error:", error);
      alert("Connection timeout or network error. Please check your internet.");
    };

    historicalConn.onopen = () => {
      console.log("Connected to Deriv API...");
      historicalConn.send(JSON.stringify({ authorize: TOKEN }));
    };

    historicalConn.onmessage = (msg) => {
      const data = JSON.parse(msg.data);

      if (data.error) {
        console.error("API Error:", data.error.message);
        return;
      }

      if (data.msg_type === "authorize") {
        historicalConn.send(JSON.stringify({
          profit_table: 1,
          description: 1,
          date_from: from,
          date_to: to,
          limit: 100,
          sort: "DESC"
        }));
      }

      if (data.msg_type === "profit_table") {
        if (data.profit_table && data.profit_table.transactions.length > 0) {
          const transactions = data.profit_table.transactions;
          if (transactions.length > 0) {
            // 1. Notifier le dernier trade
            notifyNewTrade(transactions[0]);
            // 2. Mettre à jour la table et les stats
            updateHistoricalTable(transactions);
            // 3. Mettre à jour le graphique (Nouvelle fonction ci-dessus)
            updateHistoricalChart(transactions);
          }
        } else {
          // Cas où il n'y a aucun trade sur la période
          document.getElementById("autoHistoricalBody").innerHTML =
            '<tr><td colspan="10" style="text-align:center;">No trades found for this period.</td></tr>';
        }
      }
    };
  }

  function calculateWinRate(trades) {
    if (!trades.length) return { winRate: 0, lossRate: 0, totalProfitPrice__: 0, totalLossPrice__: 0 };
    let wins = 0, p = 0, l = 0;
    trades.forEach(t => {
      const diff = t.sell_price - t.buy_price;
      if (diff > 0) { wins++; p += diff; } else { l += Math.abs(diff); }
    });
    return {
      winRate: Math.round((wins / trades.length) * 100),
      lossRate: 100 - Math.round((wins / trades.length) * 100),
      totalProfitPrice__: p.toFixed(2),
      totalLossPrice__: l.toFixed(2)
    };
  }

  function updateCirclesUI(stats) {
    const configs = [
      { id: "circle-profit-path", val: stats.winRate, textId: "profit", color: "#3b82f6" },
      { id: "circle-loss-path", val: stats.lossRate, textId: "loss", color: "#ef4444" },
      { id: "circle-pl-path", val: stats.winRate, textId: "pl", color: "#10b981" }
    ];

    configs.forEach(c => {
      const path = document.getElementById(c.id);
      const span = document.getElementById(c.textId);
      if (path) path.setAttribute("stroke-dasharray", `${c.val}, 100`);
      if (span) span.textContent = `${c.val}%`;
    });

    // Mise à jour des valeurs brutes (Profit et Perte)
    if (document.getElementById("profitvalue"))
      document.getElementById("profitvalue").textContent = stats.totalProfitPrice__;

    if (document.getElementById("lossvalue"))
      document.getElementById("lossvalue").textContent = stats.totalLossPrice__;

    // AJOUT : Calcul et affichage du P/L Net
    const plValueEl = document.getElementById("plvalue");
    if (plValueEl) {
      const netPL = (parseFloat(stats.totalProfitPrice__) - parseFloat(stats.totalLossPrice__)).toFixed(2);
      plValueEl.textContent = (netPL > 0 ? "+" : "") + netPL; // Ajoute un "+" si positif

      // Changement de couleur dynamique pour le P/L Net
      plValueEl.style.color = netPL >= 0 ? "#10b981" : "#ef4444";
    }
  }

  function renderSymbolAnalysis(trades) {
    const chart = document.getElementById("symbolBarChart");
    if (!chart) return;
    const totals = {};
    trades.forEach(t => {
      const s = t.underlying_symbol || "Other";
      totals[s] = (totals[s] || 0) + (t.sell_price - t.buy_price);
    });
    const maxP = Math.max(...Object.values(totals).map(Math.abs), 1);
    chart.innerHTML = Object.entries(totals).map(([sym, val]) => `
        <div style="display: flex; flex-direction: column; align-items: center; flex: 1; min-width: 50px;">
            <span style="font-size: 0.7rem; color: ${val >= 0 ? '#10b981' : '#ef4444'}">${val.toFixed(0)}</span>
            <div style="width: 15px; height: ${(Math.abs(val) / maxP) * 100}px; background: ${val >= 0 ? '#10b981' : '#ef4444'}; border-radius: 3px 3px 0 0;"></div>
            <span style="font-size: 0.6rem; transform: rotate(-45deg); margin-top: 10px;">${sym}</span>
        </div>`).join('');
  }

  function sortDataByProfit() {
    currentSortOrder = (currentSortOrder === 'desc') ? 'asc' : 'desc';
    allTradesData.sort((a, b) => {
      const pA = a.sell_price - a.buy_price;
      const pB = b.sell_price - b.buy_price;
      return currentSortOrder === 'desc' ? pB - pA : pA - pB;
    });
    document.getElementById("sortProfit").textContent = currentSortOrder === 'desc' ? "Profit ↓" : "Profit ↑";
    filterAndRender();
  }

  function initCalendarTable() {
    const CalendarList = document.getElementById("CalendarList");

    // Construction du tableau avec des classes pour le style moderne
    CalendarList.innerHTML = `
    <table id="calendarTable" class="modern-calendar">
      <thead>
        <tr>
          <th class="col-check">
            <div class="custom-checkbox">
              <input type="checkbox" id="selectAll__">
              <label for="selectAll__"></label>
            </div>
          </th>
          <th class="sortable">Time <span class="sort-icon">↕</span></th>
          <th class="sortable">Code</th>
          <th class="sortable">Country</th>
          <th class="sortable">Indicator</th>
          <th class="sortable">Sector</th>
          <th class="sortable">Curr.</th>
          <th class="sortable text-center">Imp.</th>
          <th class="sortable">Impact</th>
          <th>Actual</th>
          <th>Previous</th>
          <th>Forecast</th>
          <th>Rev.</th>
        </tr>
      </thead>
      <tbody id="calendarBody">
        <tr class="empty-state">
          <td colspan="13">
            <div class="no-data-content">
               <span class="icon">📅</span>
               <p>No economic events loaded.</p>  
            </div>
          </td>
        </tr>  
      </tbody>
    </table>
  `;

    // 🧩 Gestion du tri avec feedback visuel
    const headers = CalendarList.querySelectorAll("th.sortable");
    headers.forEach((th) => {
      th.addEventListener("click", () => {
        // Retirer la classe active des autres
        headers.forEach(h => h.classList.remove('active-sort'));
        th.classList.add('active-sort');

        const index = Array.from(th.parentNode.children).indexOf(th);
        sortCalendarTable(index);
      });
    });

    // 🧩 Sélection globale améliorée
    const selectAll__ = document.getElementById("selectAll__");
    if (selectAll__) {
      selectAll__.addEventListener("change", e => {
        const checkboxes = CalendarList.querySelectorAll("#calendarBody input[type='checkbox']");
        checkboxes.forEach(cb => {
          cb.checked = e.target.checked;
          // Optionnel : ajouter une classe à la ligne pour le highlight
          const row = cb.closest('tr');
          if (row) row.classList.toggle('selected-row', e.target.checked);
        });
      });
    }
  }

  function sortCalendarTable(colIndex) {
    const table = document.getElementById("calendarTable");
    const tbody = document.getElementById("calendarBody");
    const rows = Array.from(tbody.querySelectorAll("tr"));

    // Ne pas trier s'il n'y a pas de données (ligne "No events")
    if (rows.length === 1 && rows[0].classList.contains('empty-state')) return;

    // Inverser l'ordre si on clique sur la même colonne
    if (currentSortCol === colIndex) {
      isAscending = !isAscending;
    } else {
      isAscending = true;
      currentSortCol = colIndex;
    }

    // Tri des lignes
    const sortedRows = rows.sort((a, b) => {
      const valA = a.cells[colIndex].textContent.trim();
      const valB = b.cells[colIndex].textContent.trim();

      // 1. Détection numérique (ex: 1.5, -0.2, 50k)
      const numA = parseFloat(valA.replace(/[^\d.-]/g, ''));
      const numB = parseFloat(valB.replace(/[^\d.-]/g, ''));

      if (!isNaN(numA) && !isNaN(numB)) {
        return isAscending ? numA - numB : numB - numA;
      }

      // 2. Détection de date/heure (format HH:mm ou DD/MM)
      // (Optionnel selon votre format de données)

      // 3. Tri textuel par défaut
      return isAscending
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });

    // Ré-insertion des lignes triées dans le DOM
    tbody.append(...sortedRows);

    // Mise à jour visuelle des icônes de tri
    updateSortIcons(colIndex, isAscending);
  }

  function updateSortIcons(activeIndex, ascending) {
    const headers = document.querySelectorAll("#calendarTable th.sortable");
    headers.forEach((th, idx) => {
      const icon = th.querySelector(".sort-icon");
      if (icon) {
        // On ajuste l'icône selon l'état du tri (index + 1 car la checkbox est en 0)
        if (idx + 1 === activeIndex) {
          icon.textContent = ascending ? "🔼" : "🔽";
          icon.style.opacity = "1";
        } else {
          icon.textContent = "↕";
          icon.style.opacity = "0.3";
        }
      }
    });
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
        console.log("Données reçues pour le tableau (fetchEconomicCalendar) :", allEvents);
        filterTable(allEvents);
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

  // ================================
  // FONCTION POUR METTRE À JOUR LE TABLEAU
  // ================================
  function updateCalendarTable(events) {
    const body = document.getElementById("calendarBody");
    if (!body) return;

    displayedEvents = events; // Stockage global pour l'accès via le graphique
    let rows = "";

    // Fonction interne pour la couleur des pastilles
    const getCurrencyColor = (curr) => {
      const colors = {
        'USD': '#22c55e', 'EUR': '#3b82f6', 'JPY': '#ef4444',
        'GBP': '#a855f7', 'AUD': '#f97316', 'CAD': '#06b6d4',
        'CHF': '#64748b', 'CNH': '#8b5cf6', 'CNY': '#8b5cf6', 'MXN': '#10b981'
      };
      return colors[curr] || '#94a3b8';
    };

    events.forEach((e) => {
      // 1. Extraction sécurisée
      const actual = e.actual?.display_value || "-";
      const previous = e.previous?.display_value || "-";
      const forecast = e.forecast?.display_value || "-";
      const revision = e.revision?.display_value || "-";
      const impactValue = e.impact || 0;

      // 2. Temps
      const timestamp = e.release_date || 0;
      const releaseDate = timestamp ? new Date(timestamp * 1000).toLocaleString() : "-";

      const currency = e.currency || "-";
      const indicator = e.event_name || "-";

      // 3. Style d'impact
      const impactClass = `imp-${Math.min(Math.max(impactValue, 1), 5)}`;
      const impactLabel = impactValue >= 4 ? "HIGH" : (impactValue >= 3 ? "MED" : "LOW");

      let impactTextColor = "#64748b";
      if (impactValue >= 4) impactTextColor = "#ef4444";
      else if (impactValue >= 2) impactTextColor = "#f59e0b";

      rows += `
            <tr id="row_${timestamp}" data-timestamp="${timestamp}">
                <td class="text-center">
                    <input type="checkbox" class="calendar-checkbox">
                </td>
                <td data-sort="${timestamp}" style="font-size: 0.85rem; color: #64748b;">${releaseDate}</td>
                <td>${GetCountrycode(currency)}</td>
                <td>${GetCountryname(currency)}</td>     
                <td>
                    <div class="impact-badge ${impactClass}" style="padding: 4px 12px; border-radius: 20px; display: inline-block; font-size: 0.8rem;">  
                         <span style="font-weight: bold; margin-right: 5px;">${impactLabel}:</span> ${indicator}
                    </div>
                </td>
                <td class="text-center">-</td>  
                <td class="text-center">
                    <div style="display: inline-flex; align-items: center; gap: 8px; padding: 4px 12px; background: #f8f9fb; border: 1px solid #e2e8f0; border-radius: 20px;">
                        <span style="width: 8px; height: 8px; background-color: ${getCurrencyColor(currency)}; border-radius: 50%;"></span>
                        <b style="color: #1e222d; font-size: 0.8rem;">${currency}</b>
                    </div>
                </td>  
                <td>
                    <span class="${impactClass}" style="padding: 4px 10px; border-radius: 20px; font-weight: bold; font-size: 0.7rem; display: inline-block; text-transform: uppercase;">
                       ${impactValue ? `Impact ${impactValue}` : "N/A"}
                    </span>
                </td>
                <td class="text-center" style="font-weight:bold; color: ${impactTextColor};" data-sort="${impactValue}">
                    ${impactValue}
                </td>
                <td style="font-weight: 700; color: #1e222d;">${actual}</td>
                <td style="color: #64748b;">${previous}</td>
                <td style="color: #64748b;">${forecast}</td>
                <td style="color: #94a3b8; font-size: 0.8rem;">${revision}</td>
            </tr>
        `;
    });

    body.innerHTML = rows || `
        <tr>
            <td colspan="13" style="text-align:center; padding: 40px; color:gray;">
                <div class="no-data-content" style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
                    <span style="font-size: 2rem;">🔍</span>
                    <span>Aucun événement trouvé pour cette période.</span>
                </div>
            </td>
        </tr>`;
  }

  window.exportSelectedToCSV = function () {
    const tbody = document.getElementById("calendarBody");
    const selectedRows = tbody.querySelectorAll("tr:has(input[type='checkbox']:checked)");

    if (selectedRows.length === 0) {
      alert("Veuillez sélectionner au moins un événement à exporter.");
      return;
    }

    // 1. Ajout de "sep=;" pour forcer Excel à ouvrir les colonnes correctement
    // 2. Utilisation du point-virgule comme séparateur (standard européen)
    let csvContent = "sep=;\n";
    csvContent += "Date;Currency;Event;Impact;Actual;Previous;Forecast\n";

    selectedRows.forEach(row => {
      const columns = row.querySelectorAll("td");

      // Extraction en s'assurant que les colonnes existent
      const date = columns[1]?.textContent.trim() || "";
      const eventName = columns[4]?.textContent.trim() || "";
      const currency = columns[6]?.textContent.trim() || "";
      const impact = columns[8]?.textContent.trim() || "";
      const actual = columns[9]?.textContent.trim() || "";
      const previous = columns[10]?.textContent.trim() || "";
      const forecast = columns[11]?.textContent.trim() || "";

      // On remplace les points-virgules internes par des espaces pour ne pas casser le CSV
      const clean = (txt) => txt.replace(/;/g, " ").replace(/"/g, '""');

      const line = [
        `"${clean(date)}"`,
        `"${clean(currency)}"`,
        `"${clean(eventName)}"`,
        `"${clean(impact)}"`,
        `"${clean(actual)}"`,
        `"${clean(previous)}"`,
        `"${clean(forecast)}"`
      ].join(";"); // On joint avec un point-virgule

      csvContent += line + "\n";
    });

    // Utilisation de l'encodage UTF-8 avec BOM (Byte Order Mark) pour les accents
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const fileName = `economic_export_${new Date().toISOString().slice(0, 10)}.csv`;

    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

    console.log("Données reçues pour le tableau (sortCalendarTable) :", displayedEvents);

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
  /**
 * Filtre global pour le calendrier économique
 * Gère : Mots-clés, Impact (Niveaux 1-5) et Dates (Début/Fin)
 */
  function filterTable(eventsList) {
    // 1. Utilise la liste passée en paramètre ou la liste globale
    const dataToFilter = eventsList || allEvents;

    if (!dataToFilter || !Array.isArray(dataToFilter)) {
      console.warn("filterTable: Aucune donnée à filtrer");
      return;
    }

    // 2. Récupération sécurisée des critères (avec valeurs par défaut)
    const searchQuery = document.getElementById('search')?.value.trim().toLowerCase() || "";
    const impactFilter = document.getElementById('impactFilter')?.value || "";
    const startDateStr = document.getElementById('startDate')?.value || "";
    const endDateStr = document.getElementById('endDate')?.value || "";

    // 3. Application du filtre
    const filteredEvents = dataToFilter.filter(event => {

      // --- A. FILTRE RECHERCHE ---
      // Utilisation des vraies clés Deriv : event_name et currency
      const searchableContent = `
            ${event.event_name || ''} 
            ${event.currency || ''}
        `.toLowerCase();
      const matchSearch = !searchQuery || searchableContent.includes(searchQuery);

      // --- B. FILTRE IMPACT ---
      const impactVal = Number(event.impact || 0);
      let matchImpact = true;
      if (impactFilter !== "") {
        if (impactFilter === "High") matchImpact = (impactVal >= 4);
        if (impactFilter === "Medium") matchImpact = (impactVal === 3);
        if (impactFilter === "Low") matchImpact = (impactVal >= 1 && impactVal <= 2);
      }

      // --- C. FILTRE DATES ---
      let matchDate = true;
      // Deriv utilise release_date (en secondes)
      const timestamp = Number(event.release_date || 0);

      if (timestamp > 0) {
        const eventDate = new Date(timestamp * 1000);
        eventDate.setHours(0, 0, 0, 0);

        if (startDateStr) {
          const startLimit = new Date(startDateStr);
          startLimit.setHours(0, 0, 0, 0);
          if (eventDate < startLimit) matchDate = false;
        }
        if (endDateStr) {
          const endLimit = new Date(endDateStr);
          endLimit.setHours(0, 0, 0, 0);
          if (eventDate > endLimit) matchDate = false;
        }
      } else if (startDateStr || endDateStr) {
        matchDate = false;
      }

      return matchSearch && matchImpact && matchDate;
    });

    // 4. Mise à jour de l'interface
    displayedEvents = filteredEvents;
    console.log(`Filtre appliqué : ${filteredEvents.length} événements conservés`);

    // Appel de l'affichage
    updateCalendarTable(filteredEvents);

    // 5. Mise à jour du compteur
    const statusElement = document.getElementById("status") || document.getElementById("statusEl");
    if (statusElement) {
      statusElement.textContent = `${filteredEvents.length} événements chargés`;
    }
  }

  function updateChartMarkers() {
    if (!currentSeries || !allEvents) return;

    // 1. Filtrer les événements cochés par l'utilisateur dans le tableau
    const selectedEvents = allEvents.filter(ev => ev.checked);

    // 2. Créer des marqueurs invisibles (ou discrets) pour Lightweight Charts
    // Cela force le graphique à créer l'espace nécessaire sur l'échelle de temps
    const markers = selectedEvents.map(ev => {
      const impactLabel = ev.impact >= 4 ? "HIGH" : (ev.impact === 3 ? "MED" : "LOW");
      return {
        time: ev.release_date,
        position: 'aboveBar',
        color: 'transparent', // On le rend invisible car on dessine notre propre bulle dans render()
        shape: 'circle',
        text: '',
      };
    });

    // Appliquer les marqueurs (ceci déclenche un rafraîchissement interne du graphique)
    currentSeries.setMarkers(markers);

    // 3. Forcer le redessin global de notre Canvas personnalisé (Volume Profile + Bulles Calendar)
    if (typeof render === 'function') {
      render();
    }
  }

  /**
 * Dessine les étiquettes du calendrier économique sur le Canvas.
 * À appeler à l'intérieur de votre fonction render().
 */
  function drawCalendarLabels(ctx) {
    // Vérification des dépendances
    if (!allEvents || allEvents.length === 0 || !currentSeries || !cache || cache.length === 0) return;

    const timeScale = chart.timeScale();
    const activeEvents = allEvents.filter(ev => ev.checked);

    activeEvents.forEach(ev => {
      // 1. Position horizontale
      const x = timeScale.timeToCoordinate(ev.release_date);

      // 2. Recherche de la bougie correspondante
      // Note: On s'assure que le timestamp correspond exactement
      const bar = cache.find(b => b.time === ev.release_date);

      if (x !== null && bar) {
        const yHigh = currentSeries.priceToCoordinate(bar.high);

        // 3. Couleurs d'impact (Harmonisées avec votre tableau)
        const impactValue = Number(ev.impact || 0);
        let color = "#2563eb"; // LOW
        if (impactValue >= 4) color = "#ef4444";      // HIGH
        else if (impactValue === 3) color = "#f59e0b"; // MED

        const impactLabel = impactValue >= 4 ? "HIGH" : (impactValue === 3 ? "MED" : "LOW");
        const text = `${impactLabel}: ${ev.event_name || ev.indicator || ''}`;

        ctx.save();

        // --- CALCULS DE DIMENSIONS ---
        ctx.font = "bold 11px Arial";
        const textWidth = ctx.measureText(text).width;
        const rectW = textWidth + 20;
        const rectH = 22;
        const rectX = x - rectW / 2;

        // Sécurité : Si yHigh est trop haut, on descend un peu le label
        let rectY = yHigh - 67;
        if (rectY < 5) rectY = yHigh + 20; // On le place en dessous si pas de place au dessus

        // 4. LIGNE DE RAPPEL (Dashed Line)
        ctx.beginPath();
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.moveTo(x, yHigh - 5);
        ctx.lineTo(x, rectY + rectH); // Relie la bougie au bas de la pilule
        ctx.stroke();

        // 5. DESSIN DE LA PILULE (Rectangle arrondi)
        ctx.shadowColor = "rgba(0,0,0,0.15)";
        ctx.shadowBlur = 5;
        ctx.shadowOffsetY = 2;
        ctx.fillStyle = color;

        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(rectX, rectY, rectW, rectH, 11);
        } else {
          // Fallback pour anciens navigateurs
          const r = 11;
          ctx.moveTo(rectX + r, rectY);
          ctx.arcTo(rectX + rectW, rectY, rectX + rectW, rectY + rectH, r);
          ctx.arcTo(rectX + rectW, rectY + rectH, rectX, rectY + rectH, r);
          ctx.arcTo(rectX, rectY + rectH, rectX, rectY, r);
          ctx.arcTo(rectX, rectY, rectX + rectW, rectY, r);
        }
        ctx.fill();

        // 6. TEXTE
        ctx.shadowBlur = 0; // On enlève l'ombre pour le texte
        ctx.shadowOffsetY = 0;
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, x, rectY + (rectH / 2) + 1);

        // 7. POINT D'ANCRAGE SUR LA MÈCHE
        ctx.beginPath();
        ctx.setLineDash([]); // On enlève les pointillés pour le cercle
        ctx.arc(x, yHigh - 5, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
      }
    });
  }

  function setupChartInteractions(chart) {
    const tooltip = document.getElementById('chart-tooltip');
    if (!tooltip) return;

    chart.subscribeCrosshairMove(param => {
      // 1. Nettoyage : Utilisation du nouveau nom de classe .active-event-sync
      document.querySelectorAll('.active-event-sync').forEach(row => {
        row.classList.remove('active-event-sync');
      });

      // 2. Vérification de la présence du curseur
      if (!param.time || !param.point || param.point.x < 0) {
        tooltip.style.display = 'none';
        return;
      }

      // 3. Recherche de l'événement économique
      const event = typeof displayedEvents !== 'undefined' ? displayedEvents.find(e => {
        const eventTime = Number(e.release_date || e.time);
        return eventTime === param.time;
      }) : null;

      // 4. Affichage et positionnement si un événement est trouvé
      if (event) {
        tooltip.style.display = 'block';

        // Contenu stylisé (Actual, Forecast, Previous)
        tooltip.innerHTML = `
                <div style="font-weight: bold; color: #1e222d; border-bottom: 1px solid #f1f3f6; padding-bottom: 6px; margin-bottom: 6px; font-size: 12px;">
                    ${event.event_name || 'Economic Event'}
                </div>
                <div style="display: flex; flex-direction: column; gap: 4px;">
                    <div style="display: flex; justify-content: space-between; gap: 20px;">
                        <span style="color: #64748b;">Actual:</span>
                        <span style="font-weight: 700; color: #00b060;">${event.actual?.display_value || '-'}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #64748b;">Forecast:</span>
                        <span style="font-weight: 600; color: #1e222d;">${event.forecast?.display_value || '-'}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; border-top: 1px dashed #e2e8f0; padding-top: 4px; margin-top: 2px;">
                        <span style="color: #94a3b8;">Previous:</span>
                        <span style="color: #94a3b8;">${event.previous?.display_value || '-'}</span>
                    </div>
                </div>
            `;

        // Positionnement intelligent (rectifié pour utiliser les dimensions du chart)
        const chartContainer = document.getElementById('chartInner');
        const containerWidth = chartContainer.clientWidth;
        const containerHeight = chartContainer.clientHeight;

        const tooltipWidth = 180;
        const tooltipHeight = 110;

        let left = param.point.x + 15;
        let top = param.point.y + 15;

        // Ajustement si le tooltip sort du cadre
        if (left + tooltipWidth > containerWidth) left = param.point.x - tooltipWidth - 15;
        if (top + tooltipHeight > containerHeight) top = param.point.y - tooltipHeight - 15;

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;

        // 5. Interaction avec le tableau (utilisation du nouveau nom de classe)
        const rowId = `row_${event.release_date || event.time}`;
        const row = document.getElementById(rowId);
        if (row) {
          row.classList.add('active-event-sync');
          row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      } else {
        // Cacher le tooltip si aucun événement n'est survolé
        tooltip.style.display = 'none';
      }
    });
  }

  /* --- Logique dynamique pour l'affichage Crypto --- */
  const providerSelect = document.getElementById('providerSelect');

  function updateCryptoVisibility() {
    const isCrypto = providerSelect.value === 'crypto';
    const cryptoFields = document.getElementById('cryptoFields');
    const typeSelect = document.getElementById('typeSelect');
    const currencySelect = document.getElementById('currencySelect');

    if (cryptoFields) {
      cryptoFields.style.display = isCrypto ? 'block' : 'none';
    }

    if (isCrypto) {
      if (typeSelect) typeSelect.value = 'api';
      if (currencySelect) currencySelect.placeholder = "BTC, ETH, USDT...";
    } else {
      if (currencySelect) currencySelect.placeholder = "USD, EUR...";
    }
  }

  document.getElementById("fetchTrades").addEventListener("click", () => {
    // 1. Récupérer les dates des inputs HTML
    const startValue = document.getElementById("startDate").value; // Format YYYY-MM-DD
    const endValue = document.getElementById("endDate").value;

    if (!startValue || !endValue) {
      alert("Please select both Start and End dates");
      return;
    }

    // 2. Convertir les dates en TimeStamp UNIX (secondes) pour l'API Deriv
    const fromTimestamp = startValue.toString();                                      // Math.floor(new Date(startValue).getTime() / 1000);
    // On ajoute 86399 secondes pour inclure toute la journée de fin (jusqu'à 23:59:59)
    const toTimestamp = endValue.toString();                                                              // Math.floor(new Date(endValue).getTime() / 1000) + 86399;

    // 3. APPEL DE LA FONCTION
    fetchHistoricalData(fromTimestamp, toTimestamp);
    GetProfitgraphical();
  });

  function GetpdfTradereport() {
    // 1. Récupération des données actuelles
    const holder = document.getElementById("accountHolder")?.textContent || "N/A";
    const balance = document.getElementById("balanceValue")?.textContent || "N/A";
    const start = document.getElementById("startDate").value;
    const end = document.getElementById("endDate").value;
    const winRate = document.getElementById("profit").textContent;
    const netProfit = document.getElementById("plvalue").textContent;

    // 2. Création du contenu du rapport
    const reportWindow = window.open('', '_blank');

    const htmlContent = `
        <html>
        <head>
            <title>Trading Report - ${holder}</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
                .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
                .header h1 { margin: 0; color: #2563eb; font-size: 24px; }
                .info-box { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 30px; }
                .info-item { background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #f1f5f9; }
                .info-item label { display: block; font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: bold; }
                .info-item span { font-size: 18px; font-weight: 700; }
                
                .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 40px; }
                .stat-card { text-align: center; padding: 20px; border-radius: 12px; color: white; }
                .card-blue { background: #3b82f6; }
                .card-green { background: #10b981; }
                .card-red { background: #ef4444; }
                
                table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
                th { background: #f1f5f9; text-align: left; padding: 12px; color: #475569; border-bottom: 2px solid #e2e8f0; }
                td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; }
                .win-text { color: #10b981; font-weight: bold; }
                .loss-text { color: #ef4444; font-weight: bold; }
                
                @media print {
                    button { display: none; }
                    body { padding: 0; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div>
                    <h1>Trading Performance Report</h1>
                    <p style="margin: 5px 0 0; color: #64748b;">Generated on ${new Date().toLocaleString()}</p>
                </div>
                <div style="text-align: right;">
                    <span style="background: #dbeafe; color: #1e40af; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: bold;">CONFIDENTIAL</span>
                </div>
            </div>

            <div class="info-box">
                <div class="info-item"><label>Account Holder</label><span>${holder}</span></div>
                <div class="info-item"><label>Current Balance</label><span>${balance}</span></div>
                <div class="info-item"><label>Period Start</label><span>${start}</span></div>
                <div class="info-item"><label>Period End</label><span>${end}</span></div>
            </div>

            <div class="stats-grid">
                <div class="stat-card card-blue"><h3>${winRate}</h3><p>Win Rate</p></div>
                <div class="stat-card card-green"><h3>${document.getElementById("profitvalue").textContent}</h3><p>Total Gross Profit</p></div>
                <div class="stat-card card-red"><h3>${document.getElementById("lossvalue").textContent}</h3><p>Total Gross Loss</p></div>
            </div>

            <h2 style="font-size: 16px; border-left: 4px solid #2563eb; padding-left: 10px;">Transaction History</h2>
            <table>
                <thead>
                    <tr>
                        <th>Date/Time</th>
                        <th>Symbol</th>
                        <th>Type</th>
                        <th>Stake</th>
                        <th>Profit/Loss</th>
                    </tr>
                </thead>
                <tbody>
                    ${Array.from(document.querySelectorAll("#autoHistoricalBody tr")).map(tr => `
                        <tr>
                            <td>${tr.cells[0].innerText}</td>
                            <td>${tr.cells[2].innerText}</td>
                            <td>${tr.cells[3].innerText}</td>
                            <td>${tr.cells[4].innerText}</td>
                            <td class="${parseFloat(tr.cells[8].innerText) >= 0 ? 'win-text' : 'loss-text'}">
                                ${tr.cells[8].innerText}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <div style="margin-top: 40px; text-align: center; color: #94a3b8; font-size: 10px;">
                <p>This report was generated automatically. Trading involves risk.</p>
            </div>
        </body>
        </html>
    `;

    // 3. Injection et Impression
    reportWindow.document.write(htmlContent);
    reportWindow.document.close();

    // On attend un court instant pour que le rendu soit prêt
    setTimeout(() => {
      reportWindow.print();
      // reportWindow.close(); // Optionnel : fermer l'onglet après impression  
    }, 500);
  }

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

        if (data.ping && data.msg_type === "ping") {
          connection.send(JSON.stringify({ ping: 1 }));
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
        showToast(`Trade ${contract_id} closed`, 'info');
      } else {
        alert("☑️ Please check the box before closing this contract.");
        showToast(`Please check the box before closing this contract`, 'error');
      }
    }
  });

  document.getElementById("contractsPanelToggle").addEventListener("click", function () {
    const panel = document.getElementById("contractsPanel");

    if (panel.style.display === "none" || panel.style.display === "") {
      panel.style.display = "flex";

      // On injecte la structure de la table
      initTable();

      this.innerText = "📄 Hide Open Contracts";
    } else {
      panel.style.display = "none";
      this.innerText = "📄 Show Open Contracts";
    }
  });

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
  initCalendarTable();
  initHistoricalTable();
  inithistoricalchart();

  if (typeof window.updateSymbols === 'function') {
    window.updateSymbols();
  }

  window.onload = async () => {
    if (!currentSymbol) return;
    await loadSymbol(currentSymbol, currentInterval, currentChartType);
    setupChartInteractions(chart);
  };

  // Simulation : mise à jour toutes les 2 secondes
  setInterval(() => {
    if (connectBtn.textContent !== "Connect") {
      // Subscribing Tables  S  
      connectDeriv_table();
    }
  }, 300);

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
      showToast(`Current Chart Type : ${currentChartType}`, 'info');
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

      showToast(`Current Interval: ${currentInterval}`, 'info');
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

      showToast(`Current Symbol: ${currentSymbol}`, 'info');
    });
  });

  // Ouvrir popup
  document.getElementById("DatasettingPopup").onclick = () => {
    document.getElementById("settingsPopup").classList.add("active");
  };

  // Fermer le popup
  document.getElementById("closePopupBtn").onclick = () => {
    document.getElementById("settingsPopup").classList.remove("active");
  };

  // Sauvegarder les valeurs
  document.getElementById("savePopupBtn").onclick = () => {
    // Exemple de récupération :
    multiplier = parseInt(Number(document.getElementById("multiplierSelect").value)) || 40;
    stake = parseFloat(Number(document.getElementById("stakeInput").value)) || 1.0;
    buyNum = parseInt(Number(document.getElementById("buyNumberInput").value)) || 1;
    sellNum = parseInt(Number(document.getElementById("sellNumberInput").value)) || 1;
    tp_contract = Number(document.getElementById("tpInput").value);
    sl_contract = Number(document.getElementById("slInput").value);

    console.log("Données sauvegardées :");
    console.log({ multiplier, stake, buyNumber, sellNumber, tp_contract, sl_contract });

    // Fermer après sauvegarde
    document.getElementById("settingsPopup").classList.remove("active");
    console.log("Paramètres sauvegardés !");
  };
  /* ================== POP UP FOR CASHIER ================== */

  /* =============================================================
   1. GESTION DE L'OUVERTURE / FERMETURE
   ============================================================= */
  document.getElementById("openCashierBtn").addEventListener("click", () => {
    document.getElementById("cashierModal").style.display = "flex";
    connectDeriv__(); // Votre fonction de connexion existante
    updateCryptoVisibility();
  });

  document.getElementById("closeCashierBtn").onclick = () => {
    document.getElementById("cashierModal").style.display = "none";
    DisconnectDeriv__();
  };

  /* --- Logique dynamique pour l'affichage Crypto --- */
  providerSelect.addEventListener('change', updateCryptoVisibility);

  /* ============================
   2. SEND VERIFICATION EMAIL
   ============================ */
  document.getElementById("sendEmailBtn").onclick = () => {
    const email = document.getElementById("emailInput").value.trim();
    const errorBox = document.getElementById("errorBox");

    if (!email) {
      showError("Veuillez entrer votre email");
      return;
    }

    // Note : On utilise 'payment_withdraw' pour autoriser les transactions cashier
    wsTranscation.send(JSON.stringify({
      verify_email: email,
      type: "payment_withdraw"
    }));

    errorBox.style.color = "#2563eb";
    errorBox.textContent = "Demande envoyée...";
  };

  /* ============================
   3. GENERATE TRANSACTION (CASHIER)
   ============================ */
  document.getElementById("validateCodeBtn").onclick = () => {
    const action = document.getElementById("actionSelect").value;
    const provider = document.getElementById("providerSelect").value;
    const type = document.getElementById("typeSelect").value;
    const currency = document.getElementById("currencySelect").value.trim();
    const code = document.getElementById("codeInput").value.trim();
    const amount = document.getElementById("amountInput").value.trim();
    const loginid = document.getElementById("loginidInput").value.trim();
    const address = document.getElementById("addressInput").value.trim();
    const dryRun = document.getElementById("dry_run_check").checked ? 1 : 0;

    if (!code) {
      showError("Code de vérification requis");
      return;
    }

    // Construction du Payload complet selon la documentation officielle
    const payload = {
      cashier: action,           // deposit | withdraw
      verification_code: code,
      provider: provider,        // doughflow | crypto | cashier
      type: type,                // url | api
      dry_run: dryRun
    };

    // Ajout des champs optionnels s'ils sont remplis
    if (amount) payload.amount = parseFloat(amount);
    if (loginid) payload.loginid = loginid;

    // Pour les retraits Crypto directs via API
    if (provider === 'crypto') {
      if (address) payload.address = address;
      if (currency) payload.currency = currency;
    }

    // Si des frais estimés ont été calculés précédemment
    if (typeof currentFeeId !== 'undefined' && currentFeeId) {
      payload.estimated_fee_unique_id = currentFeeId;
    }

    console.log("Envoi Transaction:", payload);
    wsTranscation.send(JSON.stringify(payload));
  };

  document.getElementById('amountInput').addEventListener('blur', triggerEstimation);
  document.getElementById('currencySelect').addEventListener('blur', triggerEstimation);

  /* ============================
     4. GESTION DE LA WEBVIEW
     ============================ */
  document.getElementById("closeWebview").onclick = () => {
    document.getElementById("webviewModal").style.display = "none";
    document.getElementById("webviewFrame").src = "about:blank";
    // DisconnectDeriv__(); // À utiliser si vous voulez couper le flux après transaction
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

  // CALENDAR CALLING EVENT 

  // À placer dans votre bloc d'initialisation
  document.getElementById("calendarBody").addEventListener("change", (e) => {
    if (e.target.type === 'checkbox') {
      // On récupère le timestamp depuis l'ID du TR parent
      const row = e.target.closest('tr');
      const timestamp = row ? row.getAttribute('data-timestamp') : null;

      if (timestamp) {
        // 1. Mise à jour de l'état dans votre liste de données
        // On cherche dans allEvents l'événement qui correspond au timestamp
        const eventObj = allEvents.find(ev => ev.release_date.toString() === timestamp);
        if (eventObj) {
          eventObj.checked = e.target.checked;
        }

        // 2. Lancement de la mise à jour visuelle du graphique
        updateChartMarkers();

        // 3. Gestion du style visuel de la ligne (votre code)
        row.classList.toggle('selected-row-active', e.target.checked);
      }
    }
  });

  /* ===================== SYMBOLS POPUP =========================== */

  openBtn.onclick = () => modal_symbol.style.display = 'flex';
  document.getElementById("litleclosebtn").onclick = () => modal_symbol.style.display = 'none';
  document.getElementById("symbolclosebtn").onclick = () => modal_symbol.style.display = 'none';

  window.onclick = function (event) {
    const modal = document.getElementById('modalOverlay');
    // Si la cible du clic est exactement l'overlay (et pas le contenu interne)
    if (event.target === modal) {
      window.closeModal();
    }
  };

  // On récupère le bouton par son ID
  const validateBtn = document.getElementById('validateBtn');
  validateBtn.addEventListener('click', () => { window.confirmSelection(); });

  document.addEventListener('keydown', function (event) {
    // Si la touche pressée est "Enter" et qu'un symbole est déjà choisi
    if (event.key === "Enter" && !document.getElementById('validateBtn').disabled) {
      window.confirmSelection();
    }
  });

  /* ===================== GRAPHICAL OBJECTS =========================== */

  canvas.addEventListener('mousedown', (e) => {
    if (!showDrawings) return;

    const x = e.offsetX;
    const y = e.offsetY;
    const ts = chart.timeScale();
    const time = ts.coordinateToTime(x);
    const price = currentSeries.coordinateToPrice(y);

    if (!time || !price) return;

    let hit = false;

    // 1. GESTION DU MODE CRÉATION (Trend, Rect, TP/SL, Fibo)
    if (currentMode) {
      if (currentMode === 'tpsl') {
        generateLinkedSetup(time, price);
      }
      else if (currentMode === 'fibo') {
        // Calcul automatique basé sur le POC historique lors de la création
        const fiboParams = calculateDynamicFiboPOC();

        if (fiboParams) {
          fiboObj = {
            type: 'fibo',
            startTime: time,
            pocPrice: fiboParams.fib0,      // Ancrage POC (0%)
            extentionPrice: fiboParams.fib100, // Extension (100%)
            levels: [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1],
            pocIsHigh: fiboParams.pocIsHigh
          };
        } else {
          // Fallback si pas de Volume Profile disponible
          fiboObj = {
            type: 'fibo',
            startTime: time,
            pocPrice: price,
            extentionPrice: price,
            levels: [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1]
          };
        }
        isFiboLocked = false; // Par défaut, le nouveau Fibo est dynamique (suit le marché)
        activeHandle = 'FIBO_EXT';
      }
      else {
        const newObj = {
          type: currentMode,
          p1: { time, price },
          p2: { time, price }
        };
        drawingObjects.push(newObj);
        selectedObject = newObj;
        activePoint = { obj: newObj, point: 'p2' };
      }

      currentMode = null;
      canvas.style.pointerEvents = 'all';
      document.querySelectorAll('.btn-drawing').forEach(btn => btn.classList.remove('active'));
      render();
      return;
    }

    // 2. GESTION DU FIBONACCI EXISTANT (Interaction avec les ancres)
    if (fiboObj) {
      // On permet l'interaction seulement si déverrouillé OU pour le sélectionner
      const xF = ts.timeToCoordinate(fiboObj.startTime);
      const yP = currentSeries.priceToCoordinate(fiboObj.pocPrice);
      const yE = currentSeries.priceToCoordinate(fiboObj.extentionPrice);

      // Détection des poignées d'ancrage (15px de rayon)
      if (Math.hypot(x - xF, y - yP) < 15) {
        activeHandle = 'FIBO_POC';
        isFiboLocked = true; // Si on touche manuellement, on verrouille l'automatisme
        hit = true;
      }
      else if (Math.hypot(x - xF, y - yE) < 15) {
        activeHandle = 'FIBO_EXT';
        isFiboLocked = true;
        hit = true;
      }
    }

    // 3. GESTION DU SETUP TP/SL EXISTANT
    if (!hit && setup) {
      const x1 = ts.timeToCoordinate(setup.startTime);
      const x2 = ts.timeToCoordinate(setup.endTime);
      const yEntry = currentSeries.priceToCoordinate(setup.entryPrice);
      const yTP = currentSeries.priceToCoordinate(setup.tpPrice);
      const ySL = currentSeries.priceToCoordinate(setup.slPrice);
      const midX = (x1 + x2) / 2;

      if (Math.hypot(x - midX, y - yTP) < 15) { activeHandle = 'TP_TOP'; hit = true; }
      else if (Math.hypot(x - midX, y - ySL) < 15) { activeHandle = 'SL_BOTTOM'; hit = true; }
      else if (Math.hypot(x - midX, y - yEntry) < 15) { activeHandle = 'ENTRY'; hit = true; }
      else if (Math.hypot(x - x1, y - yEntry) < 15) { activeHandle = 'LEFT'; hit = true; }
      else if (Math.hypot(x - x2, y - yEntry) < 15) { activeHandle = 'RIGHT'; hit = true; }
      else if (x > Math.min(x1, x2) && x < Math.max(x1, x2) && y > Math.min(yTP, ySL) && y < Math.max(yTP, ySL)) {
        activeHandle = 'MOVE_ALL';
        dragOffset = { timeDiff: x - x1, tpDiff: setup.tpPrice - price, slDiff: setup.slPrice - price, entryDiff: setup.entryPrice - price };
        hit = true;
      }
    }

    // 4. GESTION DES OBJETS CLASSIQUES (Trendlines, Rectangles)
    if (!hit) {
      for (let i = drawingObjects.length - 1; i >= 0; i--) {
        const obj = drawingObjects[i];
        const x1 = ts.timeToCoordinate(obj.p1.time);
        const y1 = currentSeries.priceToCoordinate(obj.p1.price);
        const x2 = ts.timeToCoordinate(obj.p2.time);
        const y2 = currentSeries.priceToCoordinate(obj.p2.price);

        if (Math.hypot(x - x1, y - y1) < 15) { selectedObject = obj; activePoint = { obj, point: 'p1' }; hit = true; break; }
        if (Math.hypot(x - x2, y - y2) < 15) { selectedObject = obj; activePoint = { obj, point: 'p2' }; hit = true; break; }

        if (obj.type === 'rect') {
          const minX = Math.min(x1, x2), maxX = Math.max(x1, x2);
          const minY = Math.min(y1, y2), maxY = Math.max(y1, y2);
          if (x >= minX && x <= maxX && y >= minY && y <= maxY) { selectedObject = obj; hit = true; break; }
        }
      }
    }

    // 5. MISE À JOUR DU CURSEUR ET RENDU
    if (!hit) {
      selectedObject = null;
      activeHandle = null;
      // On ne désactive plus totalement les pointerEvents pour permettre le clic droit/menu
      canvas.style.cursor = 'default';
    } else {
      canvas.style.cursor = 'grabbing';
    }

    render();
  });

  canvas.addEventListener('dblclick', (e) => {
    if (!showDrawings || !fiboObj) return;

    const x = e.offsetX;
    const y = e.offsetY;
    const ts = chart.timeScale();

    // Coordonnées des ancres actuelles
    const xF = ts.timeToCoordinate(fiboObj.startTime);
    const yP = currentSeries.priceToCoordinate(fiboObj.pocPrice);
    const yE = currentSeries.priceToCoordinate(fiboObj.extentionPrice);

    // Si on double-clique près de l'objet Fibonacci
    if (Math.hypot(x - xF, y - yP) < 30 || Math.hypot(x - xF, y - yE) < 30) {
      // RÉINITIALISATION : On déverrouille et on recalcule
      isFiboLocked = false;

      const fiboParams = calculateDynamicFiboPOC();
      if (fiboParams) {
        fiboObj.pocPrice = fiboParams.fib0;
        fiboObj.extentionPrice = fiboParams.fib100;
        fiboObj.pocIsHigh = fiboParams.pocIsHigh;
      }

      console.log("Fibonacci réinitialisé sur le POC dynamique.");
      render();
    }
  });

  window.addEventListener('mousemove', (e) => {
    // Si rien n'est en train d'être déplacé, on sort
    if (!activePoint && !activeHandle) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ts = chart.timeScale();
    const newTime = ts.coordinateToTime(x);
    const newPrice = currentSeries.coordinateToPrice(y);

    // --- CAS 1 : TRENDLINES ET RECTANGLES ---
    if (activePoint) {
      if (newTime && newPrice) {
        activePoint.obj[activePoint.point].time = newTime;
        activePoint.obj[activePoint.point].price = newPrice;
        render();
      }
    }

    // --- CAS 2 : OUTIL FIBONACCI (Nouveau) ---
    else if (activeHandle && activeHandle.startsWith('FIBO') && fiboObj) {
      if (activeHandle === 'FIBO_POC') {
        // Déplace le niveau 0% (le point d'ancrage POC)
        if (newPrice) fiboObj.pocPrice = newPrice;
        if (newTime) fiboObj.startTime = newTime;
      }
      else if (activeHandle === 'FIBO_EXT') {
        // Déplace le niveau 100% (l'extension)
        if (newPrice) fiboObj.extentionPrice = newPrice;
      }
      render();
    }

    // --- CAS 3 : OUTIL TP/SL ---
    else if (activeHandle && setup) {
      if (activeHandle === 'MOVE_ALL') {
        // Déplacement global du bloc
        if (newPrice && newTime) {
          const x1_new = x - dragOffset.timeDiff;
          const x1_old = ts.timeToCoordinate(setup.startTime);
          const x2_old = ts.timeToCoordinate(setup.endTime);
          const widthPixels = x2_old - x1_old;

          const timeStart = ts.coordinateToTime(x1_new);
          const timeEnd = ts.coordinateToTime(x1_new + widthPixels);

          setup.entryPrice = newPrice + dragOffset.entryDiff;
          setup.tpPrice = newPrice + dragOffset.tpDiff;
          setup.slPrice = newPrice + dragOffset.slDiff;

          if (timeStart) setup.startTime = timeStart;
          if (timeEnd) setup.endTime = timeEnd;
        }
      } else {
        // Redimensionnement par poignées individuelles
        if (activeHandle === 'TP_TOP' && newPrice) setup.tpPrice = newPrice;
        if (activeHandle === 'SL_BOTTOM' && newPrice) setup.slPrice = newPrice;
        if (activeHandle === 'ENTRY' && newPrice) setup.entryPrice = newPrice;
        if (activeHandle === 'LEFT' && newTime) setup.startTime = newTime;
        if (activeHandle === 'RIGHT' && newTime) setup.endTime = newTime;
      }
      render();
    }
  });

  window.addEventListener('mouseup', () => {
    activePoint = null;
    activeHandle = null;
    dragOffset = null;
  });

  // 1. Activation et Annulation (Appui sur touche)
  window.addEventListener('keydown', (e) => {
    // Mode "Édition forcée" : permet de cliquer sur une ligne existante
    if (e.key === 'Control' || e.key === 'Alt') {
      canvas.style.pointerEvents = 'all';
    }

    // Dans votre Window Event Listener 'keydown'
    else if (e.key.toLowerCase() === 'r') {
      isFiboLocked = false; // Déverrouille le mode auto
      render();
    }

    // Annulation totale  
    else if (e.key === 'Escape') {
      currentMode = null;
      activePoint = null; // On arrête tout déplacement en cours
      canvas.style.pointerEvents = 'none';

      // Éteindre le bouton visuellement
      document.querySelectorAll('.btn-drawingLine').forEach(btn => {
        btn.classList.remove('active');
      });

      render(); // Rafraîchir pour désélectionner visuellement l'objet
    }
  });

  canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();

    const x = e.offsetX;
    const y = e.offsetY;
    let objectFound = null;
    let isSetupFound = false;

    const ts = chart.timeScale();

    // 1. VÉRIFIER LE SETUP TP/SL D'ABORD (Priorité visuelle)
    if (setup) {
      const xStart = ts.timeToCoordinate(setup.startTime);
      const xEnd = ts.timeToCoordinate(setup.endTime);
      const yTP = currentSeries.priceToCoordinate(setup.tpPrice);
      const ySL = currentSeries.priceToCoordinate(setup.slPrice);

      if (xStart !== null && xEnd !== null && yTP !== null && ySL !== null) {
        const minX = Math.min(xStart, xEnd);
        const maxX = Math.max(xStart, xEnd);
        const minY = Math.min(yTP, ySL);
        const maxY = Math.max(yTP, ySL);

        // Si clic droit à l'intérieur du bloc TP/SL
        if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
          isSetupFound = true;
          selectedObject = null; // On déselectionne les lignes si on touche au setup
        }
      }
    }

    // 2. VÉRIFIER LES AUTRES OBJETS (Si le setup n'a pas été touché)
    if (!isSetupFound) {
      drawingObjects.forEach(obj => {
        const x1 = ts.timeToCoordinate(obj.p1.time);
        const y1 = currentSeries.priceToCoordinate(obj.p1.price);
        const x2 = ts.timeToCoordinate(obj.p2.time);
        const y2 = currentSeries.priceToCoordinate(obj.p2.price);

        if (x1 === null || y1 === null || x2 === null || y2 === null) return;

        if (obj.type === 'rect') {
          const minX = Math.min(x1, x2), maxX = Math.max(x1, x2);
          const minY = Math.min(y1, y2), maxY = Math.max(y1, y2);
          if (x >= minX && x <= maxX && y >= minY && y <= maxY) objectFound = obj;
        } else {
          if (Math.hypot(x - x1, y - y1) < 20 || Math.hypot(x - x2, y - y2) < 20) objectFound = obj;
        }
      });
    }

    // 3. AFFICHAGE DU MENU
    if (isSetupFound || objectFound) {
      if (objectFound) selectedObject = objectFound;

      render();

      contextMenu.style.display = 'block';
      // Utilisation de fixed + clientX/Y pour éviter les décalages de scroll
      contextMenu.style.left = (e.clientX + 5) + 'px';
      contextMenu.style.top = (e.clientY + 5) + 'px';
    } else {
      contextMenu.style.display = 'none';
      selectedObject = null;
      render();
    }
  });

  // Dans votre écouteur d'événements clavier (keydown)
  window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'v') {
      showVolumeProfile = !showVolumeProfile;
      render(); // Force le rafraîchissement
    }
  });

  // 2. Désactivation automatique (Relâchement de touche)
  window.addEventListener('keyup', (e) => {
    if (e.key === 'Control' || e.key === 'Alt') {
      // On ne coupe le pointerEvents QUE si on n'est pas en train 
      // de dessiner ou de déplacer un point.
      if (!currentMode && !activePoint) {
        canvas.style.pointerEvents = 'none';
      }
    }
  });

  window.addEventListener('keydown', (e) => {
    // On vérifie que l'utilisateur n'est pas en train d'écrire dans l'input du Lookback
    if (e.target.tagName === 'INPUT') return;

    const key = e.key.toLowerCase();

    // Touche 'L' pour Verrouiller/Déverrouiller le Fibonacci
    if (key === 'l' && fiboObj) {
      isFiboLocked = !isFiboLocked;

      // Mise à jour du texte du menu contextuel s'il existe
      const lockItem = document.getElementById('lockFiboItem');
      if (lockItem) lockItem.innerText = isFiboLocked ? "Déverrouiller Fibo" : "Verrouiller Fibo";

      console.log(isFiboLocked ? "Fibo verrouillé" : "Fibo déverrouillé");
      render();
    }

    // Touche 'H' pour Masquer/Afficher (Hide/Show) tous les dessins
    if (key === 'h') {
      showDrawings = !showDrawings;

      // Mise à jour du texte du menu contextuel
      const visItem = document.getElementById('visibilityItem');
      if (visItem) visItem.innerText = showDrawings ? "Masquer tout" : "Afficher tout";

      render();
    }

    // Touche 'Delete' ou 'Backspace' pour supprimer l'objet sélectionné
    if ((key === 'delete' || key === 'backspace') && selectedObject) {
      drawingObjects = drawingObjects.filter(o => o !== selectedObject);
      selectedObject = null;
      saveDrawings();
      render();
    }
  });

  window.addEventListener('keydown', function (e) {
    // Alt + F pour activer/désactiver le mode Fibonacci & Volume Profile
    if (e.altKey && (e.key === 'f' || e.key === 'F')) {
      e.preventDefault(); // Empêche le comportement par défaut du navigateur

      const fiboBtn = document.querySelector('.btn-drawing[onclick*="enableFibonacci"]');

      // On réutilise votre fonction existante pour rester cohérent
      if (typeof enableFibonacci === 'function') {
        enableFibonacci(fiboBtn);
      }

      // Notification visuelle rapide dans la console
      console.log("Analyse Mode:", showFiboAnalysis ? "ON" : "OFF");
    }

    // Optionnel : Touche 'Escape' pour tout fermer
    if (e.key === 'Escape') {
      if (showFiboAnalysis) {
        enableFibonacci(document.querySelector('.btn-drawing[onclick*="enableFibonacci"]'));
      }
    }
  });

  // --- ACTION DE SUPPRESSION RECTIFIÉE ---
  deleteItem.onclick = () => {
    if (selectedObject) {
      drawingObjects = drawingObjects.filter(o => o !== selectedObject);
      selectedObject = null;
    } else if (setup) {
      setup = null;
      // On désactive le bouton TP/SL si l'objet est supprimé
      deactivateAllDrawingButtons();
    }

    saveDrawings();
    contextMenu.style.display = 'none';
    render();
  };

  // Fermer le menu au clic gauche sur le canvas
  canvas.addEventListener('mousedown', (e) => {
    if (e.button === 0) { // Clic gauche
      contextMenu.style.display = 'none';
    }
  });

  window.addEventListener('mouseup', () => { activePoint = null; });

  /* --- Synchronisation avec le graphique --- */

  // Crucial : Redessiner quand on zoom ou scroll
  // On force le rendu dès que le graphique a fini de bouger
  chart.timeScale().subscribeVisibleLogicalRangeChange(() => {
    render();
  });

  // Action de Visibilité
  visibilityItem.onclick = () => {
    showDrawings = !showDrawings;
    visibilityItem.innerText = showDrawings ? "Masquer tout" : "Afficher tout";

    if (!showDrawings) {
      // Si on masque tout, on force l'arrêt de tout mode de dessin actif
      deactivateAllDrawingButtons();
    }

    contextMenu.style.display = 'none';
    render();
  };

  lockFiboItem.onclick = () => {
    isFiboLocked = !isFiboLocked;
    lockFiboItem.innerText = isFiboLocked ? "Déverrouiller Fibo" : "Verrouiller Fibo";
    contextMenu.style.display = 'none';
    render();
  };

  // Initialisation
  window.addEventListener('resize', resizeCanvas);
  setTimeout(resizeCanvas, 100); // Petit délai pour laisser le layout flex se stabiliser
});
