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
    if (!symbolList) return;
    symbolList.innerHTML = "";

    SYMBOLS.forEach(s => {
      const el = document.createElement("div");
      el.className = "symbol-item";
      el.textContent = s.name;
      el.dataset.symbol = s.symbol;

      // On enlève le async ici car loadSymbol gère ses propres asynchronicités (WS)
      el.addEventListener("click", () => {
        // 1. Mise à jour visuelle (immédiate pour le feedback utilisateur)
        const allItems = symbolList.querySelectorAll(".symbol-item");
        allItems.forEach(item => item.classList.remove("selected"));
        el.classList.add("selected");

        if (!s.symbol) return;

        console.log(`Tentative de basculement vers : ${s.name}`);

        // 2. Appel de loadSymbol
        // On ne met pas "await" devant loadSymbol car c'est une fonction de flux (WS)
        // mais on utilise .catch pour attraper les erreurs d'initialisation
        loadSymbol(s.symbol, currentInterval, currentChartType)
          .then(() => {
            console.log(`Commande de chargement envoyée pour ${s.symbol}`);
          })
          .catch(error => {
            console.error("Erreur critique lors du basculement :", error);
          });
      });

      symbolList.appendChild(el);
    });
  }

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

    // CRÉATION DU NOUVEAU GRAPHIQUE
    chart = LightweightCharts.createChart(container, {
      layout: {
        textColor: "#333",
        background: { type: "solid", color: "#fff" },
      },
      grid: {
        vertLines: { color: "#f0f0f0" },
        horzLines: { color: "#f0f0f0" }
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
        // barSpacing: 10 // Optionnel: pour aérer les 300 ticks
      }
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
        upColor: "#26a69a", borderUpColor: "#26a69a", wickUpColor: "#26a69a",
        downColor: "#ef5350", borderDownColor: "#ef5350", wickDownColor: "#ef5350",
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
      default: return 86400;
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
          subscribe: 1,
          end: "latest",
          count: 1000,
          granularity: convertTF(interval),
          style: "candles"
        } : {
          ticks_history: symbol,
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

      // A. Gestion de l'HISTORIQUE (Tableau de bougies)
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
          }
        }
      }

      // B. Gestion du FLUX TEMPS RÉEL (Une seule barre à la fois)
      if (msg.msg_type === "ohlc") {
        const ohlc = msg.ohlc;
        const lastBar = normalize(ohlc);

        if (lastBar && isWsInitialized) {
          // Mise à jour de Lightweight Charts (gère seul le remplacement ou l'ajout)
          currentSeries.update(lastBar);

          // Mise à jour du cache local pour vos indicateurs (ZigZag, etc.)
          if (cache.length > 0) {
            const lastCacheIndex = cache.length - 1;

            if (cache[lastCacheIndex].time === lastBar.time) {
              // Même bougie (en cours de formation) : on remplace
              cache[lastCacheIndex] = lastBar;
            } else {
              // Nouvelle bougie : on ajoute
              cache.push(lastBar);
              if (cache.length > 1000) cache.shift();
            }
          }

          // Mise à jour et rendu des indicateurs sur la dernière barre
          updateIndicatorData(lastBar.time, lastBar);
          renderIndicators();
        }
      }

      // 3. Gestion des données Ticks (Area/Line)
      if (msg.msg_type === "history" || msg.msg_type === "tick") {
        handleTickData(msg);
        // Note: handleTickData doit appeler renderIndicators() en interne
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

        // 3️⃣ MISE À JOUR DU COMPTEUR PNL GLOBAL
        updateGlobalPnL();
        updateTradeTable();
        updateDonutCharts();
        Openpositionlines(currentSeries);
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

  // === LIGNES DES CONTRATS OUVERTS (avec proposal_open_contract) ===
  function Openpositionlines(currentSeries) {
    // Éviter les doublons de connexion
    if (wsOpenLines && (wsOpenLines.readyState === WebSocket.OPEN || wsOpenLines.readyState === WebSocket.CONNECTING)) {
      return;
    }

    wsOpenLines = new WebSocket(WS_URL);

    wsOpenLines.onopen = () => {
      wsOpenLines.send(JSON.stringify({ authorize: TOKEN }));
    };

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
        const entryPrice = parseFloat(c.entry_tick_display_value || c.buy_price);
        const profit = parseFloat(c.profit || 0);
        if (isNaN(entryPrice)) return;

        // Style dynamique selon le profit
        const isWin = profit >= 0;
        const color = isWin ? "#00ff80" : "#ff4d4d";
        const lineStyle = isWin ? LightweightCharts.LineStyle.Solid : LightweightCharts.LineStyle.Dashed;

        // Label avec Bouton X simulé et Profit
        const labelText = `${c.contract_type} | ${isWin ? '+' : ''}${profit.toFixed(2)} ${CURRENCY.toString()}`;

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
    }
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

  reverseBtn.onclick = () => {
    console.log("🔄 Exécution du Reverse...");
    reverseFunction();
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

    const deleteSelectedBtn = document.getElementById("panicCloseAll");
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

  function updateDonutCharts() {
    const profitPath = document.getElementById("circle-profit-path");
    const lossPath = document.getElementById("circle-loss-path");
    const profitText = document.getElementById("profit-percent-text");
    const lossText = document.getElementById("loss-percent-text");
    const profitValLabel = document.getElementById("profitvalue");
    const lossValLabel = document.getElementById("lossvalue");

    if (!profitPath || !lossPath) return;

    let totalProfitSum = 0;
    let totalLossSum = 0;

    // 1. Calculer les sommes séparées
    Object.values(activeContracts).forEach(contract => {
      const pnl = parseFloat(contract.profit || 0);
      if (pnl > 0) {
        totalProfitSum += pnl;
      } else if (pnl < 0) {
        totalLossSum += Math.abs(pnl); // On prend la valeur absolue pour le calcul
      }
    });

    const combinedTotal = totalProfitSum + totalLossSum;

    // 2. Calculer les pourcentages
    let profitPercent = 0;
    let lossPercent = 0;

    if (combinedTotal > 0) {
      profitPercent = Math.round((totalProfitSum / combinedTotal) * 100);
      lossPercent = Math.round((totalLossSum / combinedTotal) * 100);
    }

    // 3. Mettre à jour les cercles (SVG stroke-dasharray)
    // Format : "pourcentage, 100"
    profitPath.setAttribute("stroke-dasharray", `${profitPercent}, 100`);
    lossPath.setAttribute("stroke-dasharray", `${lossPercent}, 100`);

    // 4. Mettre à jour les textes
    profitText.textContent = `${profitPercent}%`;
    lossText.textContent = `${lossPercent}%`;

    profitValLabel.textContent = totalProfitSum.toFixed(2);
    lossValLabel.textContent = totalLossSum.toFixed(2);
  }

  function updateTradeTable() {
    const tbody = document.getElementById("autoTradeBody");
    const totalOpenSpan = document.getElementById("totalOpenContracts");
    const totalFloatingSpan = document.getElementById("totalFloatingProfit");

    if (!tbody) return;

    // 1. On vide le tableau avant de le reconstruire
    tbody.innerHTML = "";

    let totalProfit = 0;
    const activeIds = Object.keys(activeContracts);

    // 2. On boucle sur chaque contrat actif
    activeIds.forEach(id => {
      const contract = activeContracts[id];
      const profit = parseFloat(contract.profit || 0);
      totalProfit += profit;

      // Définition des classes de couleur
      const profitClass = profit >= 0 ? "text-success" : "text-danger";
      const typeClass = contract.type.toLowerCase().includes('buy') ||
        contract.type.toLowerCase().includes('long') ||
        contract.type.toLowerCase().includes('call') ? "type-buy" : "type-sell";

      // 3. Création de la ligne (Notez l'ID row-${id})
      const row = document.createElement("tr");
      row.id = `row-${id}`;

      row.innerHTML = `
            <td><input type="checkbox" class="row-checkbox" data-id="${id}"></td>
            <td>${contract.time || '--:--'}</td>
            <td style="font-family: monospace; font-size: 0.8rem; color: #64748b;">#${id.slice(-6)}</td>
            <td><strong>${contract.symbol}</strong></td>
            <td><span class="badge ${typeClass}">${contract.type}</span></td>
            <td>${parseFloat(contract.stake || 0).toFixed(2)}</td>
            <td>${contract.multiplier ? 'x' + contract.multiplier : '-'}</td>
            <td>${parseFloat(contract.entry || 0).toFixed(5)}</td>
            <td style="color: #10b981;">${contract.tp || '-'}</td>
            <td style="color: #ef4444;">${contract.sl || '-'}</td>
            <td class="${profitClass}" style="font-weight: 800; font-size: 0.95rem;">
                ${profit.toFixed(2)}
            </td>
            <td>
                <button class="action-close" data-contract-id="${id}" title="Fermer la position">✖</button>
            </td>
        `;

      tbody.appendChild(row);
    });

    // 4. Mise à jour des compteurs du pied de tableau
    if (totalOpenSpan) {
      totalOpenSpan.innerText = activeIds.length;
    }

    if (totalFloatingSpan) {
      totalFloatingSpan.innerText = `${totalProfit.toFixed(2)} USD`;

      // Change la couleur du total global
      if (totalProfit > 0) {
        totalFloatingSpan.className = "total-positive"; // Vert
      } else if (totalProfit < 0) {
        totalFloatingSpan.className = "total-negative"; // Rouge
      } else {
        totalFloatingSpan.className = "total-neutral";  // Gris
      }
    }
  }

  // DELETE SELECTED ROWS
  function deleteSelectedRows() {
    const selectedCheckboxes = document.querySelectorAll('.rowSelect:checked');

    if (selectedCheckboxes.length === 0) {
      alert("Aucun contrat sélectionné.");
      return;
    }

    const confirmMsg = `Êtes-vous sûr de vouloir clôturer ces ${selectedCheckboxes.length} positions ?`;
    if (confirm(confirmMsg)) {
      selectedCheckboxes.forEach(cb => {
        const contractId = cb.value;
        // Appelle votre fonction de clôture individuelle
        if (typeof closeSingleContract === 'function') {
          closeSingleContract(contractId);
        }
      });

      // Décoche la case "Tout sélectionner" si elle existe
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

      // 3. Feedback visuel immédiat sur la ligne du tableau
      const tr = document.querySelector(`tr[data-contract="${id}"]`);
      if (tr) {
        const btn = tr.querySelector('.close-btn');
        if (btn) {
          btn.disabled = true;
          btn.innerHTML = `<span class="spinner"></span> Closing...`;
          btn.style.opacity = "0.6";
        }
        // On ajoute une classe pour griser légèrement la ligne en attendant la confirmation
        tr.style.backgroundColor = "rgba(241, 245, 249, 0.5)";
      }

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
    if (!tbody) return;

    // On récupère toutes les lignes de la table
    const rows = tbody.querySelectorAll("tr");

    if (rows.length === 0) {
      console.log("Aucune position à fermer.");
      return;
    }

    const confirmPanic = confirm(`🚨 ALERTE URGENCE 🚨\nVoulez-vous fermer immédiatement les ${rows.length} positions ouvertes ?`);

    if (confirmPanic) {
      console.warn("--- DÉCLENCHEMENT PANIC CLOSE ---");

      rows.forEach(row => {
        // On récupère l'ID du contrat stocké dans l'attribut data-contract
        const contractId = row.dataset.contract;
        if (contractId) {
          closeSingleContract(contractId);
        }
      });

      // Optionnel : désactiver le bouton panic pour éviter les doubles clics
      const panicBtn = document.getElementById("panicCloseAll");
      if (panicBtn) {
        panicBtn.disabled = true;
        panicBtn.textContent = "⌛ Closing All...";
        setTimeout(() => {
          panicBtn.disabled = false;
          panicBtn.textContent = "🚨 Emergency Close All";
        }, 3000);
      }
    }
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
    if (!autoTradeBody) return;

    const contractId = c.contract_id;
    let tr = document.getElementById(`row-${contractId}`) || autoTradeBody.querySelector(`[data-contract='${contractId}']`);

    // --- CAS A : CONTRAT FERMÉ (SOLD) ---
    if (c.is_sold) {
      const alreadyInHistory = closedTradesHistory.some(t => t.ID === contractId);
      if (!alreadyInHistory) {
        closedTradesHistory.push({
          Time: new Date((c.date_start || Date.now() / 1000) * 1000).toLocaleString(),
          ID: contractId,
          Symbol: c.underlying || c.symbol || "N/A",
          Type: c.contract_type,
          Stake: c.buy_price,
          Profit: (c.profit || 0).toFixed(2),
          Status: "Closed"
        });
      }

      if (tr) {
        tr.style.opacity = '0';
        tr.style.transform = 'translateX(20px)';
        setTimeout(() => {
          tr.remove();
          updateTotalStats(); // Mise à jour après suppression
        }, 300);
      }
      return;
    }

    // --- CAS B : CONTRAT OUVERT (CRÉATION OU MISE À JOUR) ---
    const profitVal = parseFloat(c.profit || 0);
    const isPositive = profitVal >= 0;
    const profitClass = isPositive ? "profit-positive" : "profit-negative";
    const formattedProfit = (isPositive ? "+" : "") + profitVal.toFixed(2);

    if (!tr) {
      // 1. CRÉATION
      tr = document.createElement("tr");
      tr.id = `row-${contractId}`;
      tr.dataset.contract = contractId;
      tr.style.transition = "all 0.3s ease";

      if (typeof injectRowHTML === 'function') {
        injectRowHTML(tr, c, profitClass, c.contract_type, formattedProfit);
      } else {
        tr.innerHTML = `
                <td><input type="checkbox" class="rowSelect" value="${contractId}"></td>
                <td>${new Date().toLocaleTimeString()}</td>
                <td>${contractId}</td>
                <td>${c.display_name || c.underlying}</td>
                <td>${c.contract_type}</td>
                <td>${c.buy_price}</td>
                <td>${c.multiplier || '-'}</td>
                <td>${c.entry_tick_display_value || '-'}</td>
                <td>${c.limit_order?.take_profit?.order_amount || '-'}</td>
                <td>${c.limit_order?.stop_loss?.order_amount || '-'}</td>
                <td id="profit-${contractId}" class="${profitClass}">${formattedProfit}</td>
                <td><button class="btn-close action-close" data-contract-id="${contractId}">✖</button></td>
            `;
      }
      autoTradeBody.prepend(tr);
    } else {
      // 2. MISE À JOUR
      const profitCell = document.getElementById(`profit-${contractId}`);
      if (profitCell && profitCell.textContent !== formattedProfit) {
        profitCell.textContent = formattedProfit;
        profitCell.className = profitClass;
      }
    }

    // --- TRÈS IMPORTANT : On rafraîchit les stats et les cercles à chaque tic ---
    updateTotalStats();
  }

  /**
 * Envoie un ordre de vente pour un contrat spécifique
 * @param {string|number} contractId - L'ID du contrat à clôturer
 */
  function closeSingleContract(contractId) {
    if (!contractId) return;

    // 1. Récupération de la ligne et du bouton
    const row = document.getElementById(`row-${contractId}`);
    // On utilise '.action-close' pour être cohérent avec votre listener
    const btn = row ? row.querySelector('.action-close') : null;

    if (btn) {
      btn.innerHTML = "⏳";
      btn.disabled = true;
      btn.style.opacity = "0.5";
    }

    // 2. Préparation de la requête (Format standard API Trading)
    const request = {
      sell: contractId,
      price: 0 // Marché
    };

    // 3. Envoi via WebSocket
    if (window.ws && window.ws.readyState === WebSocket.OPEN) {
      window.ws.send(JSON.stringify(request));
      console.log(`📤 Requête envoyée pour : ${contractId}`);
    } else {
      alert("Erreur : Connexion perdue.");
      if (btn) {
        btn.innerHTML = "✖";
        btn.disabled = false;
        btn.style.opacity = "1";
      }
    }
  }

  /**
 * Calcule les statistiques globales en scannant le tableau et déclenche la mise à jour des graphiques
 */
  function updateTotalStats() {
    const rows = document.querySelectorAll("#autoTradeBody tr");
    const totalProfitSpan = document.getElementById("totalFloatingProfit");
    const totalCountSpan = document.getElementById("totalOpenContracts");

    let totalProfit = 0;
    const count = rows.length;

    // 1. Parcours des lignes pour calculer le profit flottant total
    rows.forEach(row => {
      const pCell = row.querySelector('[id^="profit-"]');
      if (pCell) {
        // Nettoyage précis : on ne garde que le signe moins, les chiffres et le point décimal
        const val = parseFloat(pCell.textContent.replace(/[^-0-9.]/g, '')) || 0;
        totalProfit += val;
      }
    });

    // 2. Mise à jour du compteur de contrats ouverts
    if (totalCountSpan) {
      totalCountSpan.textContent = count;
    }

    // 3. Mise à jour de l'affichage du profit total
    if (totalProfitSpan) {
      const currency = typeof CURRENCY !== 'undefined' ? CURRENCY : 'USD';
      const sign = totalProfit >= 0 ? "+" : "";

      // Injection du texte avec mise en forme
      totalProfitSpan.textContent = `${sign}${totalProfit.toFixed(2)} ${currency}`;

      // Gestion dynamique des classes CSS pour les couleurs
      // On retire les anciennes classes pour éviter les conflits
      totalProfitSpan.classList.remove('total-pos', 'total-neg', 'total-neutral');

      if (totalProfit > 0) {
        totalProfitSpan.classList.add('total-pos');
      } else if (totalProfit < 0) {
        totalProfitSpan.classList.add('total-neg');
      } else {
        totalProfitSpan.classList.add('total-neutral');
      }
    }

    // 4. SYNCHRONISATION : On appelle les graphiques circulaires pour qu'ils s'ajustent
    if (typeof updateCircularCharts === 'function') {
      updateCircularCharts();
    }
  }

  /**
  * Synchronise les graphiques circulaires SVG avec les données réelles du tableau
  */
  function updateCircularCharts() {
    // 1. Sélection des lignes du corps du tableau uniquement
    const rows = document.querySelectorAll("#autoTradeBody tr");

    let countProfit = 0;
    let countLoss = 0;
    let totalProfitVal = 0;
    let totalLossVal = 0;

    // 2. Analyse des lignes pour extraire les données
    rows.forEach(row => {
      // On cherche la cellule de profit via son ID (format : profit-12345)
      const profitCell = row.querySelector('[id^="profit-"]');

      if (profitCell) {
        // Nettoyage robuste du texte (garde uniquement chiffres, points et signes moins)
        const rawText = profitCell.textContent.replace(/[^+-.0-9]/g, '');
        const val = parseFloat(rawText);

        if (!isNaN(val)) {
          if (val >= 0) {
            countProfit++;
            totalProfitVal += val;
          } else {
            countLoss++;
            totalLossVal += Math.abs(val); // On stocke la perte en valeur absolue
          }
        }
      }
    });

    const totalTrades = countProfit + countLoss;

    // 3. Calcul des taux (Win Rate / Loss Rate)
    const winRate = totalTrades > 0 ? (countProfit / totalTrades) * 100 : 0;
    const lossRate = totalTrades > 0 ? (countLoss / totalTrades) * 100 : 0;
    const currency = typeof CURRENCY !== 'undefined' ? CURRENCY : 'USD';

    // 4. Mise à jour visuelle des éléments

    // --- Jauge PROFIT ---
    updateCircleElement('circle-profit-path', 'profit-percent-text', winRate);
    const pValElem = document.getElementById('profitvalue');
    if (pValElem) {
      pValElem.innerHTML = `${totalProfitVal.toFixed(2)} <span class="currency">${currency}</span>`;
    }

    // --- Jauge LOSS ---
    updateCircleElement('circle-loss-path', 'loss-percent-text', lossRate);
    const lValElem = document.getElementById('lossvalue');
    if (lValElem) {
      lValElem.innerHTML = `${totalLossVal.toFixed(2)} <span class="currency">${currency}</span>`;
    }

    // --- Jauge GLOBAL P/L (Net) ---
    // On utilise le Win Rate pour animer le cercle global
    updateCircleElement('circle-pl-path', 'pl-percent-text', winRate);

    const netPL = totalProfitVal - totalLossVal;
    const plValElem = document.getElementById('plvalue');
    if (plValElem) {
      const color = netPL >= 0 ? "#10b981" : "#ef4444";
      const sign = netPL >= 0 ? "+" : "";
      plValElem.innerHTML = `${sign}${netPL.toFixed(2)} <span class="currency">${currency}</span>`;
      plValElem.style.color = color;
    }
  }

  /**
 * Anime un arc de cercle SVG et met à jour son texte central
 */
  function updateCircleElement(pathId, textId, percentage) {
    const path = document.getElementById(pathId);
    const text = document.getElementById(textId);

    // 1. Sécurité : On vérifie si le pourcentage est un nombre valide
    const validPercent = isNaN(percentage) ? 0 : percentage;

    if (path) {
      // Bloque entre 0 et 100 pour éviter les bugs d'affichage SVG (ex: traits qui dépassent)
      const safePercent = Math.min(Math.max(validPercent, 0), 100);

      // Mise à jour de l'attribut stroke-dasharray
      // Le format est : "longueur_du_trait, longueur_du_vide"
      // On utilise toFixed(1) pour une précision visuelle fluide sans surcharger le DOM
      path.setAttribute('stroke-dasharray', `${safePercent.toFixed(1)}, 100`);
    }

    if (text) {
      // On utilise Math.round pour éviter d'afficher des décimales dans le petit texte central
      text.textContent = `${Math.round(validPercent)}%`;
    }
  }

  /**
 * Action pour le bouton Export CSV
 */
  function downloadHistoryCSV() {
    // 1. Récupérer toutes les lignes du tableau (header + corps)
    const table = document.getElementById("autoTradeTable");
    if (!table) return alert("Tableau introuvable.");

    const rows = Array.from(table.querySelectorAll("tr"));

    // 2. Transformer les lignes en format CSV
    const csvContent = rows.map(row => {
      const cells = Array.from(row.querySelectorAll("th, td"));
      return cells.map(cell => {
        // Nettoyage : on enlève les sauts de ligne et on gère les virgules
        let data = cell.innerText.replace(/\n/g, ' ').trim();
        // Si la donnée contient une virgule, on l'entoure de guillemets
        return data.includes(',') ? `"${data}"` : data;
      }).join(",");
    }).join("\n");

    // 3. Créer le Blob (le fichier virtuel)
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);

    // 4. Créer un lien invisible pour déclencher le téléchargement
    const link = document.createElement("a");
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

    link.setAttribute("href", url);
    link.setAttribute("download", `trading_report_${timestamp}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log("📊 Rapport CSV exporté avec succès.");
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
          if (typeof updateTradeTable === 'function' && typeof updateDonutCharts === 'function') {
            updateDonutCharts()
            updateTradeTable();
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

  // ✅ Initialisation du tableau HTML
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

  /* contractsPanelToggle.addEventListener('click', (event) => {
    // 1. On vérifie si l'élément cliqué est le bouton de bascule
    if (event.target && event.target.id === 'contractsPanelToggle') {
      const toggleBtn = event.target;
      const panel = document.getElementById('contractsPanel');

      if (panel) {
        // Alterne la classe active
        const isActive = panel.classList.toggle('active');

        // Mise à jour du texte et du style du bouton
        if (isActive) {
          toggleBtn.textContent = "🔼 Hide Open Contracts";
          toggleBtn.classList.add('btn-active');

          // Calcul immédiat des statistiques à l'ouverture
          if (typeof updateTotalStats === 'function') {
            updateTotalStats();
          }
        } else {
          toggleBtn.textContent = "📄 Show Open Contracts";
          toggleBtn.classList.remove('btn-active');
        }
      }
    }
  }); */

  document.getElementById("contractsPanelToggle").addEventListener("click", function () {
    const panel = document.getElementById("contractsPanel");

    if (panel.style.display === "none" || panel.style.display === "") {
      panel.style.display = "flex";

      // On injecte la structure de la table
      initTable();

      // ON REMPLIT IMMÉDIATEMENT AVEC LES DONNÉES
      updateTradeTable();
      updateDonutCharts();

      this.innerText = "📄 Hide Open Contracts";
    } else {
      panel.style.display = "none";
      this.innerText = "📄 Show Open Contracts";
    }
  });

  // Plus spécifique, donc légèrement plus performant
  document.getElementById("contractsPanel").addEventListener('click', (event) => {
    const closeBtn = event.target.closest('.action-close');
    if (closeBtn) {
      const id = closeBtn.getAttribute('data-contract-id');
      if (typeof closeSingleContract === 'function') {
        closeSingleContract(id);
      }
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
  initHistoricalTable();
  inithistoricalchart();

  window.onload = async () => {
    if (!currentSymbol) return;
    if (currentChartType !== "candlestick") return;
    await loadSymbol(currentSymbol, currentInterval, currentChartType);
  };

  // Simulation : mise à jour toutes les 2 secondes
  setInterval(() => {
    if (connectBtn.textContent !== "Connect") {
      // Subscribing Tables  S
      connectDeriv_table();
    }
  }, 300);

  // Gestion du "Select All"    
  /* const selectAll = document.getElementById("selectAll");
  selectAll.addEventListener("change", () => {
    document.querySelectorAll(".rowSelect").forEach(cb => {
      cb.checked = selectAll.checked;
    });
  }); */

  // Supprimer les lignes sélectionnées  
  /* document.getElementById("deleteSelected").addEventListener("click", () => {
    document.querySelectorAll(".rowSelect:checked").forEach(cb => {
      cb.closest("tr").remove();
    });
    selectAll.checked = false;  
  }); */

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

  // -------------------------------------------------------------
  // 1. Quand on ouvre la fenêtre, on initialise le WS + authorize
  // -------------------------------------------------------------
  openCashierBtn.addEventListener("click", () => {
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
