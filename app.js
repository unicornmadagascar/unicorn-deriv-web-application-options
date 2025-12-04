document.addEventListener("DOMContentLoaded", () => {
  const APP_ID = 109310;
  //const TOKEN = "n04kyiO7gVSyQuA";
  // 🔧 Nom de la clé utilisée dans localStorage
  const STORAGE_KEY = "deriv_accounts";
  const WS_URL = `wss://ws.derivws.com/websockets/v3?app_id=${APP_ID}`;

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

  let totalPL = 0; // cumul des profits et pertes
  let BCautomationRunning = false;
  let ROCautomationRunning = false;
  let IAautomationRunning = false;
  let smoothVol = 0;
  let smoothTrend = 0;
  let ws=null;
  let connection = null;
  let wsContracts_reverse = null;
  let wsROC = null;   
  let ws_calendar = null;
  let wsContracts__close = null;
  let wsContracts_winning = null;   
  let wsAutomation_sell = null;
  let wsAutomation_buy = null;
  let wsAutomation_close = null;
  let connection_ws = null;   
  let connection_ws_htx = null;
  let wshistorical = null;
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
  let signal;
  let signal__;
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
  let tickHistory = [];
  let tickHistory__ = [];
  let tickHistory__arr = [];   
  let tickHistory__bc = [];
  let candleHistory__ = [];
  let closePrice; 
  let tickHistory4openpricelines = [];
  const priceLines4openlines = {}; // Stocke les lignes actives (clé = contract_id)
  let Tick_arr = [];
  // Historique de profits
  let profitHistory = [];
  const contractsData = {}; // stockage des contrats {id: {profits: [], infos: {…}}}
  let portfolioReceived = false;
  let existingContract = false;
  let contractSymbol;  
  let contracts = [];
  let roccontracts = [];
  let rocContracts = [];
  let bcContracts = [];
  let rocProposal = null;
  let AIProposal = null;
  let AIContracts = null;
  let wsAI = null;
  let contracttype__ = "";
  let contractid__;
  const MAX_HISTORY = 500; // max taille du buffer
  let proposal__ = [];
  let rocproposal__ = [];
  let transactions__ = [];
  let structresponse = [];
  let datapercent = {};
  let response;
  let style_type = "ticks";
  let candlesData = [];
  let candlesCache = [];
  let cache = [];
  //------
  let multiplier = 40;
  let stake = 1;  
  let buyNum = 1;
  let sellNum = 1;   
  let tp_contract = 0;
  let sl_contract = 0;
  //------
  let currentChartType = "candlestick"; // par défaut
  let currentInterval = "1 minute";  // par défaut

  // --- NEW: current symbol & pending subscribe ---
  let currentSymbol = "cryBTCUSD"; // symbole par défaut
  let pendingSubscribe = null; 
  let authorized = false;  
  /* =============================
   Configuration (tweakable)  
  ============================= */
  const SMOOTH_PERIOD = 250;       // EMA smoothed period
  const WINDOW_SIZE = 30;          // nb de timesteps passés observés par LSTM (16..32 good)
  const FEATURES = 1;              // ici on n'utilise que l'EMA par timestep (peut étendre)
  const LSTM_UNITS = 32;           // unités LSTM (perf / précision tradeoff)
  const DENSE_UNITS = 16;
  const LEARNING_RATE = 0.001;
  const BATCH_SIZE = 8;
  const RE_TRAIN_EVERY_MS = 12_000; // ré-entraîner toutes les X ms si on a des nouvelles fenêtres
  const MIN_WINDOWS_TO_TRAIN = 8;   // garder petit pour training online
  const PREDICT_INTERVAL_MS = 500;  // fréquence prédiction (ou déclenchée sur tick)
  const MAX_BUFFER = 1000;          // taille max buffer EMA

  const emaBuffer = [];            // oldest ... newest
  const windowDataset = [];        // stores windows (arrays) for training
  let model = null;
  let isTraining = false;
  let lastPredTime = 0;
  // previousMomentum is kept across ticks for derivative calc
  let previousMomentum = 0;
  let smoothEMA = null;
  //---- BC MODEL ////////////////////////
  let prices__ = [];
  let lastProb = null;
  let probsNew = [];
  let ProbTick = [];
  let candles__ = [];

  const SYMBOLS = [
    { symbol: "BOOM1000", name: "Boom 1000" },    
    { symbol: "CRASH1000", name: "Crash 1000" },    
    { symbol: "BOOM500", name: "Boom 500" },
    { symbol: "CRASH500", name: "Crash 500" },     
    { symbol: "BOOM900", name: "Boom 900" },      
    { symbol: "CRASH900", name: "Crash 900" },
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
    symbolList.innerHTML = "";

    SYMBOLS.forEach(s => {   
      const el = document.createElement("div");
      el.className = "symbol-item";
      el.textContent = s.name;
      el.dataset.symbol = s.symbol;

      el.addEventListener("click", () => {

      // retire la sélection sur tous les symboles
      document.querySelectorAll("#symbolList .symbol-item")
        .forEach(item => item.classList.remove("selected"));

        // ajoute la sélection
        el.classList.add("selected");

        if (!s.symbol) return;

        // appel de la fonction connect/subscribe selon le type de chart
        if (currentChartType === "candlestick") {
          connect(s.symbol, currentInterval, currentChartType);
        } else {
          subscribeSymbol(s.symbol, currentChartType);
        }
      });

      symbolList.appendChild(el);
    });
  }
  
  // --- INIT CHART ---
  function initChart(currentChartType) {
    try { if (chart) chart.remove(); } catch (e) {}          
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

  function styleType(currentChartType)
  {
   if (!currentChartType || currentChartType===null) return;

   if ((currentChartType === "candlestick" || currentChartType === "hollow" || currentChartType === "ohlc")) {style_type = "candles";}
   else {style_type = "ticks";}
    
   return style_type;
  }

  function Payloadforsubscription(currentSymbol,currentInterval,currentChartType)
  {
   if (!currentSymbol || currentSymbol===null) return;   

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

  function convertTF(currentInterval)  
  {
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

  function connect(symbol,currentInterval,currentChartType) {

    if (ws) { ws.close(); ws = null; }

    if (!symbol) return;

    if (currentChartType !== "candlestick") return;

    currentSymbol = symbol;   
    initChart(currentChartType);     
    console.log("Connexion...");      

    ws = new WebSocket(WS_URL);
    
    ws.onopen = () => {   
      console.log("Connecté");
      ws.send(JSON.stringify(Payloadforsubscription(currentSymbol,currentInterval,currentChartType)));
    };

    ws.onmessage = ({ data }) => {  
       const msg = JSON.parse(data);
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

       if (msg.msg_type === "ohlc" && msg.ohlc) {
          const o = msg.ohlc;
          const openTime = Number(o.open_time);  // time of the current candle
          const bar = {
              time: openTime,
              open: Number(o.open),
              high: Number(o.high),
              low: Number(o.low),   
              close: Number(o.close),
          };

          if (!bar || candles === null || candles === undefined) return;   
     
          const last = candles[candles.length - 1];
   
          if (!last || last.time !== openTime) {
             // Nouvelle bougie
             candles.push(bar);
             currentSeries.update(bar);
          } else {
             // Mise à jour de la dernière bougie
             candles[candles.length - 1] = bar;
             currentSeries.update(bar);
          }
        }

        if (data.ping && data.msg_type === "ping")
        {
          ws.send(JSON.stringify({ ping: 1 }));
        }

        Openpositionlines(currentSeries);
    };

    ws.onclose = () => console.log("Déconnecté");
    ws.onerror = (e) => {
      console.error("WS Error:", e);
      console.log("Erreur WebSocket");
    };
  }
      
  function connectInit(symbol,currentInterval,currentChartType) {

    if (!symbol) return;
    
    if (currentChartType !== "candlestick") return;

    currentSymbol = symbol;
    initChart(currentChartType);
    console.log("Connexion...");
   
    if (ws === null) {
      ws = new WebSocket(WS_URL);
      ws.onopen=()=>{ ws.send(JSON.stringify({ authorize: TOKEN })); };
    }

    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
      ws.onopen=()=>{ ws.send(JSON.stringify({ authorize: TOKEN })); };  
    }

    if (ws && (ws.readyState === WebSocket.CLOSED || ws.readyState === WebSocket.CLOSING)) {
      ws = new WebSocket(WS_URL);   
      ws.onopen=()=>{ ws.send(JSON.stringify({ authorize: TOKEN })); };      
    }

    ws.onclose = () => {setTimeout(connectInit,500);};

    ws.onmessage = ({ data }) => {
      let msg = {};
      try { msg = JSON.parse(data); } catch(e){ return; }

      if (msg.msg_type === "authorize" && msg.authorize) {
        console.log("Connecté");
        ws.send(JSON.stringify(Payloadforsubscription(currentSymbol,currentInterval,currentChartType)));
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
        const bar = bars[bars.length-1];
        const last = cache[cache.length-1];
        if (last && last.time === bar.time) {
          cache[cache.length-1] = bar;
          currentSeries.update(bar);
        } else {
          cache.push(bar);
          currentSeries.update(bar);
        }
      }

      if (data.msg_type === "ping")
      {
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

  // --- SUBSCRIBE SYMBOL ---
  function subscribeSymbol(symbol, currentChartType) {    
    if (wspl === null) {
      pendingSubscribe = symbol;
      return;
    }

    if (currentChartType === "candlestick") return;

    currentSymbol = symbol;
    initChart(currentChartType);

    if (!wspl || wspl.readyState === WebSocket.CLOSED) {
      pendingSubscribe = symbol;      
      connectDeriv();  
    }        

    if (wspl && wspl.readyState === WebSocket.OPEN && authorized) {             
      
      wspl.send(JSON.stringify({ forget_all: "ticks" }));            
      wspl.send(JSON.stringify({ticks : currentSymbol, subscribe: 1}));              
                
    }   
  }  

  // --- CONNECT DERIV ---
  function connectDeriv() {

    if (wspl === null) {
      wspl = new WebSocket(WS_URL);
      wspl.onopen=()=>{ wspl.send(JSON.stringify({ authorize: TOKEN })); };
    }

    if (wspl && (wspl.readyState === WebSocket.OPEN || wspl.readyState === WebSocket.CONNECTING)) {
      wspl.onopen=()=>{ wspl.send(JSON.stringify({ authorize: TOKEN })); };
    }

    if (wspl && (wspl.readyState === WebSocket.CLOSED || wspl.readyState === WebSocket.CLOSING)) {
      wspl = new WebSocket(WS_URL);
      wspl.onopen=()=>{ wspl.send(JSON.stringify({ authorize: TOKEN })); };    
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
  
          displaySymbols(currentInterval,currentChartType);    
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

        if (data.ping && data.msg_type === "ping")
        {
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
      if (wspl && wspl.readyState === WebSocket.OPEN)
      {
        wspl.send(JSON.stringify({ forget_all: ["candles","ticks"] }));
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
    if (recentChanges.length > 60) recentChanges.splice(0,1);

    // update chartData and series   
    if (!currentSeries || !chart) return;
  
    const point = { time: epoch, value: quote };
     
    // if first data point, setData with small array to initialize
    if (!chartData.length) {
      chartData.push(point);   
      if (chartData.length > 600) chartData.splice(0,1);    
      try {
        currentSeries.setData(chartData);     
      } catch (e) {
        // fallback: try update
        try { currentSeries.update(point); } catch (err) {}   
      }
    } else {
      // append and update
      chartData.push(point);
      if (chartData.length > 600) chartData.shift();      

      // Prefer update (faster); fallback to setData if update throws
      try {
        currentSeries.update(point);
      } catch (e) {
        try { currentSeries.setData(chartData); } catch (err) {}
      }
    }

    // try to auto-fit time scale (safe)
    try { chart.timeScale().fitContent(); } catch (e) {}      
    
    Openpositionlines(currentSeries);  
  }

  // === LIGNES DES CONTRATS OUVERTS (avec proposal_open_contract) ===
  function Openpositionlines(currentSeries) {

    if (wsOpenLines === null)
    {
     wsOpenLines = new WebSocket(WS_URL);
     wsOpenLines.onopen=()=>{ wsOpenLines.send(JSON.stringify({ authorize: TOKEN })); };
    }
  
    if (wsOpenLines && (wsOpenLines.readyState === WebSocket.OPEN || wsOpenLines.readyState === WebSocket.CONNECTING))
    {
     wsOpenLines.onopen=()=>{ wsOpenLines.send(JSON.stringify({ authorize: TOKEN })); };
    }

    if (wsOpenLines && (wsOpenLines.readyState === WebSocket.CLOSED || wsOpenLines.readyState === WebSocket.CLOSING))
    {
      wsOpenLines = new WebSocket(WS_URL);
      wsOpenLines.onopen=()=>{ wsOpenLines.send(JSON.stringify({ authorize: TOKEN })); };
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
            try { currentSeries.removePriceLine(priceLines4openlines[id]); } catch {}
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

      if (data.ping && data.msg_type === "ping")
      { 
       wsOpenLines.send(JSON.stringify({ ping: 1 }));
      }
    };

    wsOpenLines.onerror = (e) => console.log("⚠️ WS error:", e);
    wsOpenLines.onclose = () => console.log("❌ WS closed for open lines");
  }


   // ---------- AI module corrected (replace previous functions with this block) ----------

   function AI() {
     // MODULE-SCOPE variables (shared by inner functions)
     let model = null;
     let wsAI = window.wsAI || null; // conserve wsAI si défini ailleurs
     let smoothEMA = null;
     let previousMomentum = 0;
     const emaBuffer = window.emaBuffer || []; // si tu avais déjà une variable globale
     const windowDataset = window.windowDataset || [];
     let isTraining = false;
     let lastPredTime = 0;
     // Assure-toi que ces constantes existent globalement : SMOOTH_PERIOD, WINDOW_SIZE, FEATURES, LSTM_UNITS, DENSE_UNITS, LEARNING_RATE, BATCH_SIZE, MIN_WINDOWS_TO_TRAIN, MAX_BUFFER, RE_TRAIN_EVERY_MS, TOKEN, WS_URL, currentSymbol, currentInterval, currentChartType, stakeInput, multiplierInput, buyNumber, sellNumber, Openpositionlines, AIContracts, AIProposal, etc.

  /*******************************************************************************************
   *  CONNECT WEBSOCKET
   *******************************************************************************************/
    function AI_connectWebSocket() {
      try {
        if (!wsAI || wsAI.readyState > 1) {
          wsAI = new WebSocket(WS_URL);
        }

        wsAI.onopen = () => {
          try {
            wsAI.send(JSON.stringify({ authorize: TOKEN }));
          } catch (e) { console.warn('wsAI send authorize failed', e); }
        };

        wsAI.onmessage = (msg) => {
          try {
            const data = JSON.parse(msg.data);
            AI_handleMessage(data);
          } catch (e) {
            console.error('WS message parse error', e);
          }
        };

        wsAI.onclose = () => {
          // reconnect after short delay
          setTimeout(() => AI_connectWebSocket(), 500);
        };

        wsAI.onerror = (err) => {
          console.error("WebSocket error:", err);
          try { wsAI.close(); } catch(e) {}
            wsAI = null;
            setTimeout(() => AI_connectWebSocket(), 500);
        };
      } catch (e) {
        console.error('AI_connectWebSocket error', e);
      }
    }

  /*******************************************************************************************
   *  ANALYSIS / EMA LISSÉE
   *******************************************************************************************/
    function initSmoothedEMA(initialPrice) {
       smoothEMA = initialPrice;
    }

    function updateSmoothedEMA(price) {
      if (smoothEMA === null) initSmoothedEMA(price);
      smoothEMA = smoothEMA + (price - smoothEMA) / SMOOTH_PERIOD;
      return smoothEMA;
    }

  /*******************************************************************************************
   *  COMPUTE HARMONIC
   *******************************************************************************************/
    function computeHarmonicFromEMA(emaNow, emaPrev, Beta = 0.05, Omega0 = 0.001, dt = 1) {
       const momentum = (emaNow - emaPrev) / dt;
       const acceleration = (momentum - previousMomentum) / dt;
       previousMomentum = momentum;
       const deviation = 0; // emaNow - emaNow is always 0 for smoothed EMA
       const osc = acceleration + 2 * Beta * momentum + (Omega0 * Omega0) * deviation;
       return { osc, momentum, acceleration, deviation };
    }

  /*******************************************************************************************
   *  BUILD WINDOWS / PUSH EMA
   *******************************************************************************************/
    function pushEMA(ema) {
       emaBuffer.push(ema);
       if (emaBuffer.length > MAX_BUFFER) emaBuffer.shift();
   
       if (emaBuffer.length >= WINDOW_SIZE + 1) {
          const startIdx = emaBuffer.length - 1 - WINDOW_SIZE;
          const inputWindow = emaBuffer.slice(startIdx, startIdx + WINDOW_SIZE);
          const emaPrev = emaBuffer[emaBuffer.length - 2];
          const emaNow = emaBuffer[emaBuffer.length - 1];
          const { osc } = computeHarmonicFromEMA(emaNow, emaPrev);
          windowDataset.push({ x: inputWindow.slice(), y: osc });
          if (windowDataset.length > 2000) windowDataset.shift();

          // light logging every 50 windows to avoid spam
          if (windowDataset.length % 50 === 0) {
            console.log('pushEMA: windowDataset length =', windowDataset.length, 'emaBuffer =', emaBuffer.length);
          }
       }
    }

  /*******************************************************************************************
   *  BUILD LSTM MODEL
   *******************************************************************************************/
    async function buildLSTMModel(windowSize = WINDOW_SIZE, features = FEATURES) {
       try {
          await tf.ready();

          // Dispose previous safely
          if (model && typeof model.dispose === 'function') {
            try { model.dispose(); } catch (e) { console.warn('dispose error', e); }
            model = null;
          }

          const m = tf.sequential();
          m.add(tf.layers.lstm({
             units: LSTM_UNITS,
             inputShape: [windowSize, features],
             recurrentInitializer: 'glorotUniform',
             kernelInitializer: 'glorotUniform',
             recurrentActivation: 'sigmoid'
          }));
          m.add(tf.layers.dense({ units: DENSE_UNITS, activation: 'relu' }));
          m.add(tf.layers.dense({ units: 1, activation: 'linear' }));

          const opt = tf.train.adam(LEARNING_RATE);
          m.compile({ optimizer: opt, loss: 'meanSquaredError' });

          console.log('LSTM model built:');
          m.summary();

          model = m;
          return model;
      } catch (e) {
          console.error('buildLSTMModel error', e);
          throw e;
      }
    }

  /*******************************************************************************************
   *  SAMPLE BATCH
   *******************************************************************************************/
    function sampleTrainingBatch(batchSize = BATCH_SIZE) {
      try {
         if (windowDataset.length < MIN_WINDOWS_TO_TRAIN) return null;
         const n = Math.min(batchSize, windowDataset.length);
         const xs = [];
         const ys = [];
         for (let i = 0; i < n; i++) {
            const idx = Math.floor(Math.random() * windowDataset.length);
            xs.push(windowDataset[idx].x.map(v => [v]));
            ys.push([windowDataset[idx].y]);
         }
         const Xt = tf.tensor3d(xs, [n, WINDOW_SIZE, FEATURES]);
         const yt = tf.tensor2d(ys, [n, 1]);
         return { Xt, yt };
      } catch (e) {
         console.error('sampleTrainingBatch error', e);
         return null;
      }
    }

  /*******************************************************************************************
   *  ONLINE TRAIN STEP (safe)
   *******************************************************************************************/
   async function onlineTrainStep() {
     if (!model) {
       // console.warn('onlineTrainStep: no model yet');
       return;
     }
     if (isTraining) {
        // already running
        return;
     }
     const batch = sampleTrainingBatch();
     if (!batch) return;
     isTraining = true;
     try {
       console.log('onlineTrainStep: start training on', batch.Xt.shape[0], 'samples');
       await model.fit(batch.Xt, batch.yt, {
         epochs: 2,
         batchSize: Math.min(8, batch.Xt.shape[0]),
         shuffle: true,
         verbose: 0
       });
       console.log('onlineTrainStep: training done');
     } catch (err) {
       console.error('Train error', err);
     } finally {
       try { batch.Xt.dispose(); batch.yt.dispose(); } catch (e) { console.warn('dispose error', e); }
        isTraining = false;
     }
   }

  /*******************************************************************************************
   *  PREDICTION
   *******************************************************************************************/
   function predictOscillatorFromBuffer() {
     try {
       if (!model) return null;
       if (emaBuffer.length < WINDOW_SIZE) return null;
       const seq = emaBuffer.slice(-WINDOW_SIZE).map(v => [v]);
       return tf.tidy(() => {
         const input = tf.tensor3d([seq], [1, WINDOW_SIZE, FEATURES]);
         const out = model.predict(input);
         const val = out.dataSync()[0];
         return val;
       });
     } catch (e) {
       console.error('predictOscillatorFromBuffer error', e);
       return null;
     }
    }

  /*******************************************************************************************
   *  PROCESS TICK (safe)
   *******************************************************************************************/
    async function processTick(rawPrice) {
      try {
         const ema = updateSmoothedEMA(rawPrice);
         pushEMA(ema);

         const now = Date.now();
         if (now - lastPredTime >= RE_TRAIN_EVERY_MS) {
            lastPredTime = now;
            // fire and forget (training handles isTraining)
            onlineTrainStep().catch(e => console.error('onlineTrainStep failed:', e));
         }

         const pred = predictOscillatorFromBuffer();
         return { ema, prediction: pred };
      } catch (err) {
         console.error('processTick error', err);
         return { ema: null, prediction: null };
      }
    }

  /*******************************************************************************************
   *  INIT LSTM HARMONIC
   *******************************************************************************************/
  async function initLSTMHarmonic() {
    try {
      await buildLSTMModel();
      console.log('model exists?', !!model);
      console.log('layers count:', model ? model.layers.length : 'no model');

      // start WS only after model built
      if (!wsAI || wsAI.readyState > 1) {
        AI_connectWebSocket();
      }
    } catch (e) {
      console.error('initLSTMHarmonic error', e);
    }
  }

  /*******************************************************************************************
   *  CONTRACT DECISION
   *******************************************************************************************/
  function Contractfunction(prediction) {
    if (prediction !== null) {
      console.log("Prediction :" + prediction);
      const upThreshold = 0.0005, downThreshold = -0.0005;
      if (prediction > upThreshold) {  
        AI_handleSignal("BUY");
      } else if (prediction < downThreshold) {
        AI_handleSignal("SELL");   
      }
    }
  }

  /*******************************************************************************************
   *  MESSAGE HANDLER (uses closure model & wsAI)
   *******************************************************************************************/
  function AI_handleMessage(data) {
    try {
      switch (data.msg_type) {
        case "authorize":
          try {
            wsAI.send(JSON.stringify(Payloadforsubscription(currentSymbol, currentInterval, currentChartType)));
            wsAI.send(JSON.stringify({ proposal_open_contract: 1, subscribe: 1 }));
            wsAI.send(JSON.stringify({ portfolio: 1 }));
          } catch (e) { console.warn('authorize send failed', e); }
          break;

        case "portfolio":
          AIContracts = data.portfolio?.contracts || [];
          break;

        case "proposal_open_contract":
          if (data.proposal_open_contract) AIProposal = data.proposal_open_contract;
          break;

        case "tick":
          (async () => {
            try {
              const price = parseFloat(data.tick.quote);
              const { ema, prediction } = await processTick(price);
              Contractfunction(prediction);
            } catch (e) {
              console.error('tick handler error', e);
            }
          })();
          break;

        case "candles":
          const cd = data.candles || [];
          candles__ = cd.map(c => ({
            time: Number(c.epoch),
            open: Number(c.open),
            high: Number(c.high),
            low: Number(c.low),
            close: Number(c.close),
          }));
          break;

        case "ohlc":
          (async () => {
            try {
              const o = data.ohlc;
              const openTime = Number(o.open_time);
              const bar = {
                time: openTime,
                open: Number(o.open),
                high: Number(o.high),
                low: Number(o.low),
                close: Number(o.close),
              };
              if (!bar || !candles__) return;
              const last = candles__[candles__.length - 1];
              if (!last || last.time !== openTime) candles__.push(bar);
              else candles__[candles__.length - 1] = bar;

              const { ema: ema_, prediction: prediction_ } = await processTick(bar.close);
              Contractfunction(prediction_);
            } catch (e) {
              console.error('ohlc handler error', e);
            }
          })();
          break;

        case "ping":
          try { wsAI.send(JSON.stringify({ ping: 1 })); } catch (e) { }
          break;
      }
    } catch (e) {
      console.error('AI_handleMessage error', e);
    }
  }

  /*******************************************************************************************
   *  SIGNAL / ORDER (intact)
   *******************************************************************************************/
  function AI_handleSignal(direction) {
    const oppositeType = direction === "BUY" ? "MULTDOWN" : "MULTUP";
    const mainType = direction === "BUY" ? "MULTUP" : "MULTDOWN";

    // close opposite contracts
    AIContracts
      .filter(c => c.symbol === currentSymbol && c.contract_type === oppositeType)
      .forEach(c => {
        try { wsAI.send(JSON.stringify({ sell: c.contract_id, price: 0 })); } catch (e) { }
      });

    // if a contract active exists, skip
    if (AIProposal?.contract_id) return;

    const stake = parseFloat(stakeInput.value) || 1;
    const multiplier = parseInt(multiplierInput.value) || 40;
    const repeat = direction === "BUY"
      ? (parseInt(buyNumber.value) || 1)
      : (parseInt(sellNumber.value) || 1);

    if ((typeof multiplier !== "number" && multiplier === "") || (typeof stake !== "number" && stake === "") || (typeof repeat !== "number" && repeat === "")) {
      return;
    }

    for (let i = 0; i < repeat; i++) {
      try {
        wsAI.send(JSON.stringify({
          buy: 1,
          price: stake.toFixed(2),
          parameters: {
            contract_type: mainType,
            symbol: currentSymbol,
            currency: CURRENCY.toString(),
            basis: "stake",
            amount: stake.toFixed(2),
            multiplier: multiplier,
          }
        }));
      } catch (e) { console.warn('buy send failed', e); }
    }

    Openpositionlines(currentSeries);
  }

  // expose public API minimal
    return {
      initLSTMHarmonic,
      processTick,
      predictOscillatorFromBuffer,
      AI_connectWebSocket,
      AI_handleSignal,
      debugState: function () {
        try {
          console.log('--- DEBUG STATE ---');
          console.log('emaBuffer.length =', emaBuffer.length);
          console.log('windowDataset.length =', windowDataset.length);
          console.log('isTraining =', !!isTraining);
          console.log('model exists =', !!model);
          if (model) console.log('model.layers =', model.layers.length);
          if (typeof tf !== 'undefined') console.log('tf.memory():', tf.memory());
          console.log('lastPredTime =', lastPredTime);
          console.log('RE_TRAIN_EVERY_MS =', RE_TRAIN_EVERY_MS);
          console.log('--------------------');
        } catch (e) { console.error('debugState error', e); }
      }
    };
  } // end AI()


  function stop() {
    if (wsAI && wsAI.readyState === WebSocket.OPEN) {
      wsAI.send(JSON.stringify({ forget_all: ["candles", "ticks"] }));
      wsAI.close();
      wsAI = null;
     }
  }
  
  function startAutomation() {

    // ------------------------------------------------------------
    // VARIABLES GLOBALES INTERNES
    // ------------------------------------------------------------
    let wsAutomation = null;
    let model = null;
    let prices__ = [];
    let candles__ = [];
    let bcContracts = [];
    let lastProb = null;

    // Vos variables externes doivent exister :
    // currentSymbol, currentInterval, currentChartType, stakeInput,
    // multiplierInput, buyNumber, sellNumber, CURRENCY


    // ------------------------------------------------------------
    // WEBSOCKET
    // ------------------------------------------------------------

    function BC_ConnectWebsocket() {
      try {

        if (!wsAutomation || wsAutomation.readyState === WebSocket.CLOSED) {
          wsAutomation = new WebSocket(WS_URL);

          wsAutomation.onopen = () => {
            wsAutomation.send(JSON.stringify({ authorize: TOKEN }));
          };
        }

        wsAutomation.onclose = () => {
          wsAutomation = null;
          setTimeout(BC_ConnectWebsocket, 300);
        };

        wsAutomation.onerror = () => {
          try { wsAutomation.close(); } catch(e){}
          wsAutomation = null;
          setTimeout(BC_ConnectWebsocket, 300);
        };

        wsAutomation.onmessage = (msg) => {
          BC_handleMessage(JSON.parse(msg.data));
        };

      } catch (err) {
        console.error("WS Error:", err);
        setTimeout(BC_ConnectWebsocket, 300);
      }
    }
    
   // ------------------------------------------------------------
   // CLOSE ALL CONTRACTS
   // ------------------------------------------------------------
    function closeAllContracts() {

      if (wsAutomation_close === null)
      {
       wsAutomation_close  = new WebSocket(WS_URL);
       wsAutomation_close.onopen=()=>{ wsAutomation_close.send(JSON.stringify({ authorize: TOKEN })); };
      }
  
      if (wsAutomation_close  && (wsAutomation_close.readyState === WebSocket.OPEN || wsAutomation_close.readyState === WebSocket.CONNECTING))
      {
       wsAutomation_close.onopen=()=>{ wsAutomation_close.send(JSON.stringify({ authorize: TOKEN })); };
      }

      if (wsAutomation_close && (wsAutomation_close.readyState === WebSocket.CLOSED || wsAutomation_close.readyState === WebSocket.CLOSING))
      {
       wsAutomation_close = new WebSocket(WS_URL);
       wsAutomation_close.onopen=()=>{ wsAutomation_close.send(JSON.stringify({ authorize: TOKEN })); };
      }

      wsAutomation_close.onclose = () => { setTimeout(closeAllContracts,500); };   
      wsAutomation_close.onmessage = (e) => {
        const data = JSON.parse(e.data);

        // Autorisé → demander la liste des contrats
        if (data.authorize) {
            wsAutomation_close.send(JSON.stringify({ portfolio: 1 }));
        }

        // Liste des contrats ouverts reçue
        if (data.portfolio) {
            const list = data.portfolio.contracts;

            if (list === undefined || list === null || list.length === 0) {
               return;
            }

            // Fermer chaque contrat (prix marché)
            for (let c of list) {
                wsAutomation_close.send(JSON.stringify({
                    sell: c.contract_id,
                    price: 0
                }));
            }
        }

        // Confirmation d’un contrat fermé 
        if (data.sell) {
            console.log("Fermé :", data.sell.contract_id);
        }
      };
    }

   // ------------------------------------------------------------
   // MESSAGE HANDLER
   // ------------------------------------------------------------
   function BC_handleMessage(data) {
      try {
        switch(data.msg_type) {

          case "authorize":
            wsAutomation.send(JSON.stringify(Payloadforsubscription(
              currentSymbol, 
              currentInterval,
              currentChartType
            )));
            wsAutomation.send(JSON.stringify({ proposal_open_contract: 1, subscribe: 1 }));
            wsAutomation.send(JSON.stringify({ portfolio: 1 }));
            break;


          case "portfolio":
            bcContracts = data.portfolio?.contracts || [];
            break;


          case "proposal_open_contract":
            proposal__ = data.proposal_open_contract;
            break;


          case "tick":
            const price = parseFloat(data.tick.quote);
            if (!isNaN(price)) onNewTick(price);
            break;


          case "candles":
            candles__ = (data.candles || []).map(c => ({
              time: Number(c.epoch),
              open: Number(c.open),
              high: Number(c.high),
              low: Number(c.low),
              close: Number(c.close)
            }));
            break;


          case "ohlc":
            const o = data.ohlc;
            const bar = {
              time: Number(o.open_time),
              open: Number(o.open),
              high: Number(o.high),
              low: Number(o.low),
              close: Number(o.close)
            };

            if (!candles__.length || candles__[candles__.length-1].time !== bar.time)
            candles__.push(bar);
            else
              candles__[candles__.length-1] = bar;
            
            if (!isNaN(bar.close)) onNewTick(bar.close);
            break;


          case "ping":
            wsAutomation.send(JSON.stringify({ ping: 1 }));
            break;
        }
 
      } catch (err) {   
        console.error("handleMessage error:", err);
      }
    }


    // ------------------------------------------------------------
    // SIGNAL + TRADE MANAGEMENT
    // ------------------------------------------------------------
    function BC_handleSignal(direction) {
      const oppositeType = direction === "BUY" ? "MULTDOWN" : "MULTUP";
      const mainType = direction === "BUY" ? "MULTUP" : "MULTDOWN";

      // fermer les trades opposés
      bcContracts
        .filter(c => c.symbol === currentSymbol && c.contract_type === oppositeType)
        .forEach(c => {
          try {
            wsAutomation.send(JSON.stringify({ sell: c.contract_id, price: 0 }));
          } catch(e){}
        });

      // si un trade actif → rien
      if (proposal__?.contract_id) return;

      const stake = Number(stakeInput.value) || 1;   
      const multiplier = Number(multiplierInput.value) || 40;
      const repeat = direction === "BUY"
          ? Number(buyNumber.value) || 1
          : Number(sellNumber.value) || 1;  

      for (let i = 0; i < repeat; i++) {   
        try {
          wsAutomation.send(JSON.stringify({
            buy: 1,
            price: stake.toFixed(2),
            parameters: {
              contract_type: mainType,
              symbol: currentSymbol,
              currency: CURRENCY,
              basis: "stake",
              amount: stake.toFixed(2),
              multiplier: multiplier
            }
          }));
        } catch(e){
          console.warn("Trade send failed:", e);
        }
      }

      Openpositionlines(currentSeries);
    }

 
    // ------------------------------------------------------------
    // IA MODEL TCN
    // ------------------------------------------------------------
    async function createTCNModel() {
      await tf.ready();

      if (model && model.dispose) {
        try { model.dispose(); } catch(e){}
      }

      const m = tf.sequential();

      m.add(tf.layers.conv1d({  
        filters: 8,
        kernelSize: 3,
        activation: "relu",
        inputShape: [20, 1]
      }));

      m.add(tf.layers.flatten());
  
      m.add(tf.layers.dense({
        units: 1,
        activation: "sigmoid"
      }));
    
     m.compile({
        optimizer: tf.train.adam(0.001),
        loss: "binaryCrossentropy"
      });

      model = m;
      return model;
    }


    // ------------------------------------------------------------
    // PREPARE INPUT (20 derniers prix)
    // ------------------------------------------------------------
    function prepareInput(prices) {

      if (!Array.isArray(prices) || prices.length < 20) return null;

      let seq = prices.slice(-20).map(v => Number(v));  

      // Validation
      if (seq.some(v => !isFinite(v))) {
          console.error("Invalid sequence:", seq);
          return null;
      }

      const mean = seq.reduce((a,b)=>a+b,0) / seq.length;
      const variance = seq.reduce((s,x)=>s+(x-mean)**2,0) / seq.length;
      const std = Math.sqrt(variance) || 1;

      const normalized = seq.map(v => (v - mean) / std);

      if (normalized.some(v => !isFinite(v))) {
          console.error("Normalization error:", normalized);
          return null;
      }

      try {
          // reshape → [20][1]
          const arr = normalized.map(v => [v]);

          // final reshape → [1,20,1]
          return tf.tensor3d([arr], [1, 20, 1]);

      } catch (err) {
          console.error("tensor3d creation failed:", err, "input:", normalized);
          return null;
      }
    }


    // ------------------------------------------------------------
    // PREDICTION
    // ------------------------------------------------------------
    async function predictWeakSignal(model, prices) {
      if (!model) return null;

      const input = prepareInput(prices);
      if (!input) return null;

      try {
          const out = await model.predict(input).data();
          input.dispose();
          return out[0];
      } catch (err) {
          console.error("predictWeakSignal error:", err);
          input.dispose();
          return null;
      }
    }


    // ------------------------------------------------------------
    // DÉCISION BUY/SELL
    // ------------------------------------------------------------
    async function decisionWeakTrend(model, prices, tolerance = 0.0012) {
      const prob = await predictWeakSignal(model, prices);
      if (prob === null) return { action: "WAIT", prob: 0 };

      const amplitude_gap = 0.55 - 0.40;
      const amplitude_seq =  Math.abs(0.55 - prob);
      const binary = amplitude_seq <= (amplitude_gap + tolerance) ? 0 : 1;
    
      const symbol_test = currentSymbol.slice(0,3);
      if (!["BOO","CRA"].includes(symbol_test)) return;

      const digit = parseInt((prob*10).toString().slice(0,1));  

      if (symbol_test === "BOO") {
         if (binary === 1) action = "BUY";
         else action = "SELL";
      }
      else if (symbol_test === "CRA"){  
         if (binary==1) action = "SELL";
         else action = "BUY";    
      }  
  
      return { action, prob };  
    }       

   
    // ------------------------------------------------------------
    // TICK HANDLER
    // ------------------------------------------------------------
    async function onNewTick(price) {
      prices__.push(price);
      if (prices__.length > 500) prices__.shift();

      const symbol_test = currentSymbol.slice(0,3);
      if (!["BOO","CRA"].includes(symbol_test)) return;

      const signal = await decisionWeakTrend(model, prices__);   

      console.log("Decision:", signal);
      
      if (symbol_test === "BOO") {
         if (signal.action === "BUY") setTimeout(()=> {BC_handleSignal("BUY");},10000);
         else if (signal.action === "SELL") closeAllContracts();    
      } else if (symbol_test === "CRA") {
         if (signal.action === "SELL") setTimeout(()=> {BC_handleSignal("SELL");},10000);
         else if (signal.action === "BUY") closeAllContracts();    
      } 
    }   

   
    // ------------------------------------------------------------
    // INIT
    // ------------------------------------------------------------
    async function initTCNModel() {
      model = await createTCNModel();
      console.log("✔️ Model created | Layers:", model.layers.length);

      if (!wsAutomation || wsAutomation.readyState > 1) {
        BC_ConnectWebsocket();
      }
    }   


    // ------------------------------------------------------------
    // RETURN PUBLIC API
    // ------------------------------------------------------------
    return { initTCNModel };
  }


  function stopAutomation() {   
    if (wsAutomation  && wsAutomation.readyState === WebSocket.OPEN) {  
       // Envoyer unsubscribe avant de fermer
       wsAutomation.send(JSON.stringify({ forget_all: ["Candles","ticks"] }));
       wsAutomation.close();
       wsAutomation = null;   
    }   
  }

  // Fonction pour calculer l’écart-type (population)    
  function ecartType(values) {
    if (values.length === 0) return 0;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.map(x => (x - mean) ** 2).reduce((a, b) => a + b, 0) / values.length;
       
    return Math.sqrt(variance);
  }

  buyBtn.onclick=()=>executeTrade("BUY");
  sellBtn.onclick=()=>executeTrade("SELL");
  reverseBtn.onclick=()=>{
    console.log("Reversing positions...");
    reversefunction();
  }

  function reversefunction(){
    if (wsContracts_reverse) { wsContracts_reverse.close(); wsContracts_reverse = null; }

    console.log("Reversing positions...");
   
    wsContracts_reverse = new WebSocket(WS_URL);
    wsContracts_reverse.onopen=()=>{ wsContracts_reverse.send(JSON.stringify({ authorize: TOKEN })); };

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
  function executeTrade(type){
    if (wsContracts) {wsContracts.close(); wsContracts = null;}

    wsContracts = new WebSocket(WS_URL);
    wsContracts.onopen=()=>{ wsContracts.send(JSON.stringify({ authorize: TOKEN })); };

    wsContracts.onmessage = (msg) => {
       const data = JSON.parse(msg.data);
       if (data.authorize && data.msg_type === "authorize")
       {
        const payload = {
          buy: 1,   
          price: stake.toFixed(2),
          parameters: {  
            contract_type: type==="BUY"?"MULTUP":"MULTDOWN",
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

        for (let i=0;i < numb_; i++){
          wsContracts.send(JSON.stringify(payload));
        }
      }

      if (data.ping && data.msg_type === "ping")
      {
       wsContracts.send(JSON.stringify({ ping: 1}));
      }
    };
  }

  closewinning.onclick=()=>{
    if (wsContracts_winning) { wsContracts_winning.close(); wsContracts_winning = null; }

    console.log("Closing all profitable trades...");

    wsContracts_winning = new WebSocket(WS_URL);
    wsContracts_winning.onopen=()=>{ wsContracts_winning.send(JSON.stringify({ authorize: TOKEN })); };
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
         const contracts = data.portfolio.contracts;
         console.log("📊 Found " + contracts.length + " active contracts.");

         contracts.forEach((contract,i) => {
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

closeAll.onclick=()=>{
    if (wsContracts__close) { wsContracts__close.close(); wsContracts__close = null; }

    console.log("Closing all trades...");

    wsContracts__close = new WebSocket(WS_URL);
    wsContracts__close.onopen=()=>{ wsContracts__close.send(JSON.stringify({ authorize: TOKEN })); };
    wsContracts__close.onclose=()=>{ console.log("Disconnected"); console.log("WS closed"); };
    wsContracts__close.onerror=e=>{ console.log("WS error "+JSON.stringify(e)); };
    wsContracts__close.onmessage = (msg) => {
       const data = JSON.parse(msg.data);

       // 2️⃣ Quand autorisé, on demande le portefeuille
       if (data.msg_type === 'authorize') {
           wsContracts__close.send(JSON.stringify({ portfolio: 1 }));
       }

       // 3️⃣ Quand on reçoit les contrats ouverts
       if (data.msg_type === 'portfolio') {
          const contracts = data.portfolio.contracts;
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

  // Table
  function initTable()
  {
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
     wsplContracts.send(JSON.stringify({ proposal_open_contract: 1, contract_id : contract_id, subscribe: 1 }));
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
        <td>${trade.profit}</td>
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

    if (wsplContracts === null)
    {
     wsplContracts = new WebSocket(WS_URL);  
     wsplContracts.onopen=()=>{ wsplContracts.send(JSON.stringify({ authorize: TOKEN })); };
    }
  
    if (wsplContracts && (wsplContracts.readyState === WebSocket.OPEN || wsplContracts.readyState === WebSocket.CONNECTING))
    {
     wsplContracts.onopen=()=>{ wsplContracts.send(JSON.stringify({ authorize: TOKEN })); };  
    }

    if (wsplContracts && (wsplContracts.readyState === WebSocket.CLOSED || wsplContracts.readyState === WebSocket.CLOSING))
    {     
      wsplContracts = new WebSocket(WS_URL);  
      wsplContracts.onopen=()=>{ wsplContracts.send(JSON.stringify({ authorize: TOKEN })); };
    }
    
    wsplContracts.onclose=()=>{ console.log("Disconnected"); console.log("WS closed"); setTimeout(connectDeriv_table,300); };
    wsplContracts.onerror=e=>{ console.log("WS error "+JSON.stringify(e)); wsplContracts.close(); wsplContracts = null; setTimeout(connectDeriv_table,300); };
    wsplContracts.onmessage=msg=>{
      const data=JSON.parse(msg.data);   
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
  
  // 🔹 Nettoyer l’URL après extraction
  function cleanURL() {
    window.history.replaceState({}, document.title, window.location.pathname);   
  }

  // 🔹 Initialisation principale
  function initDerivAccountManager() {
    const newAccounts = getAllAccountsFromURL();

    if (newAccounts.length > 0) {
       console.log("✅ Comptes détectés :", newAccounts);
       mergeAccounts(newAccounts);
       //cleanURL();
    }

    populateAccountCombo();
 }

 function initHistoricalTable()
  {
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

   if (connection===null)
   {
    connection = new WebSocket(WS_URL);
    connection.onopen = () => {
       connection.send(JSON.stringify({ authorize: TOKEN }));
    };
   }
   
   if (connection && (connection.readyState === WebSocket.OPEN || connection.readyState === WebSocket.CONNECTING))
   {
    connection.onopen=()=>{ connection.send(JSON.stringify({ authorize: TOKEN })); };
   }

   if (connection && (connection.readyState === WebSocket.CLOSED || connection.readyState === WebSocket.CLOSING))
   {
    connection = new WebSocket(WS_URL);
    connection.onopen=()=>{ connection.send(JSON.stringify({ authorize: TOKEN })); };
   }
    
   connection.onclose=()=>{ console.log("Disconnected"); console.log("WS closed"); };
   connection.onerror=e=>{ console.log("WS error "+JSON.stringify(e)); };
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
     sort : "DESC"
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

 function GetProfitConnection()
 {
  const startInput = document.getElementById("startDate").value;
  const endInput = document.getElementById("endDate").value;

  if (connection_ws===null)
   {
    connection_ws = new WebSocket(WS_URL);
    connection_ws.onopen = () => {
       connection_ws.send(JSON.stringify({ authorize: TOKEN }));
    };
   }
   
   if (connection_ws && (connection_ws.readyState === WebSocket.OPEN || connection_ws.readyState === WebSocket.CONNECTING))
   {
    connection_ws.onopen=()=>{ connection_ws.send(JSON.stringify({ authorize: TOKEN })); };
   }

   if (connection_ws && (connection_ws.readyState === WebSocket.CLOSED || connection_ws.readyState === WebSocket.CLOSING))
   {
    connection_ws = new WebSocket(WS_URL);
    connection_ws.onopen=()=>{ connection_ws.send(JSON.stringify({ authorize: TOKEN })); };
   }
    
   connection_ws.onclose=()=>{ console.log("Disconnected"); console.log("WS closed"); };
   connection_ws.onerror=e=>{ console.log("WS error "+JSON.stringify(e)); };
   connection_ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);

      if (data.msg_type === "authorize")
      {
       connection_ws.send(JSON.stringify({
          profit_table: 1,
          description: 1,
          date_from: startInput.toString(),
          date_to: endInput.toString(),   
          limit: 500,
           sort : "DESC"
       }));
      }

       // Quand on reçoit la profit_table
     if (data.msg_type === "profit_table") {     
        structresponse =  getProfitStats(data);
        // Animation simultanée des cercles et des chiffres 
        profitvalue.textContent = " " + structresponse.totalProfitPrice__+ " " + CURRENCY.toString() ;
        lossvalue.textContent = " " + structresponse.totalLossPrice__+ " " + CURRENCY.toString() ;
        
        if (structresponse.totalPNLprice__ > 0)
        {
          plvalue.style.color = "#10b981";
          plvalue.textContent = " " + structresponse.totalPNLprice__+ " " + CURRENCY.toString() ; 
        }
       else
       {
         plvalue.style.color = "#ff4d4d";
         plvalue.textContent = " " + structresponse.totalPNLprice__+ " " + CURRENCY.toString() ; 
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
     lineColor: "rgba(189, 6, 221, 1)",
     lineWidth: 2,
     topColor: "rgba(189, 6, 221, 0.35)",
     bottomColor: "rgba(189, 6, 221, 0.0)",
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
    if (profit > 0) 
    {
      wins++;
      totalprofitprice += profit;
    }
    else if (profit < 0)
    {
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
 function updateCalendarTable(events) {
  const body = document.getElementById("calendarBody");
  if (!body) return;  

  displayedEvents = events; // On garde la liste affichée pour le tri
  let rows = "";

  events.forEach(e => {
    const actual = e.actual?.display_value || "-";
    const previous = e.previous?.display_value  || "-";
    const forecast = e.forecast?.display_value  || "-";
    const revision = e.revision?.display_value || "-";
    const impactValue = e.impact ?? "-";
    const releaseDate = e.release_date
      ? new Date(e.release_date * 1000).toLocaleString()
      : "-";
    const currency = e.currency || "-";
    const indicator = e.event_name || "-";

    // 🎨 Couleur selon l'impact
    let impactColor = "gray";
    if (impactValue >= 4) impactColor = "#ff4444";       // fort impact → rouge
    else if (impactValue >= 2) impactColor = "#ffaa00";  // moyen → orange
    else if (impactValue > 0) impactColor = "#22cc22";   // faible → vert
    const impactClass = `impact-${Math.min(Math.max(impactValue, 1), 5)}`;

    rows += `
      <tr>
        <td><input type="checkbox"></td>
        <td data-sort="${e.release_date || 0}">${releaseDate}</td>
        <td>${GetCountrycode(currency).toString()}</td>
        <td>${GetCountryname(currency).toString()}</td>   
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
        “No events found for this period.”
     </td></tr>`;

  attachSortHandlers(); // On attache les événements de tri après mise à jour
}

function GetCountryname(currency)
 {
   for (let i = 0; i < 9; i++)
    {
      if (currency === "EUR")
       {
          response = "Europe (EU)";
          break;
       }
      else if (currency === "USD")
       {
          response = "United States (US)";
          break;
       }
      else if (currency === "CAD")
       {
          response = "Canada (CA)";
          break;
       }
      else if (currency === "AUD")
       {
          response = "Australia (AU)";
          break;
       }
      else if (currency === "JPY")
       {
          response = "Japan (JP)";
          break;
       }
      else if (currency === "CNY")
       {
          response = "China (CN)";
          break;
       }
      else if (currency === "GBP")
       {
          response = "United-Kingdom (GB)";
          break;
       }
      else if (currency === "MXN")
       {
          response = "Mexico (MX)";
          break;
       }
      else if (currency === "CHF")
       {
          response = "Switzerland (CH)";
          break;
       }
    }
    
   return(response);
 }

 function GetCountrycode(currency)
 {
   for (let i = 0; i < 9; i++)
    {
      if (currency === "EUR")
       {
          response = "EU";
          break;
       }
      else if (currency === "USD")
       {
          response = "US";
          break;
       }
      else if (currency === "CAD")
       {
          response = "CA";
          break;
       }
      else if (currency === "AUD")
       {
          response = "AU";
          break;
       }
      else if (currency === "JPY")
       {
          response = "JP";
          break;
       }
      else if (currency === "CNY")
       {
          response = "CN";
          break;
       }
      else if (currency === "GBP")
       {
          response = "GB";
          break;
       }
      else if (currency === "MXN")
       {
          response = "MX";
          break;
       }
      else if (currency === "CHF")
       {
          response = "CH";
          break;
       }
    }
    
   return(response);
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

        if (data.msg_type === "get_settings")
        {
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
  const BCtoggleAutomationBtn = document.getElementById("toggleAutomation");
  BCtoggleAutomationBtn.addEventListener("click", () => {
    BCautomationRunning = !BCautomationRunning;
    if (BCautomationRunning) {
      BCtoggleAutomationBtn.textContent = "Stop Automation";
      BCtoggleAutomationBtn.style.background = "linear-gradient(90deg,#f44336,#e57373)";
      BCtoggleAutomationBtn.style.color = "white";
      BCautomationRunning = true; 
      // ---------- Create and start AI instance ----------
      const bc = startAutomation();  
      bc.initTCNModel(); // call once
      // optionally: ai.BC_connectWebSocket(); // already called inside init if needed
      IAtoggleAutomationBtn.disabled = false;
    } else {
      BCtoggleAutomationBtn.textContent = "Launch Automation";
      BCtoggleAutomationBtn.style.background = "white";  
      BCtoggleAutomationBtn.style.color = "gray"; 
      BCautomationRunning = false;  
      setTimeout(stopAutomation,2000);
      IAtoggleAutomationBtn.disabled = false;
    }   
  });

   // === Automation Toggle ===
  const IAtoggleAutomationBtn = document.getElementById("IAtoggleAutomation");   
  IAtoggleAutomationBtn.addEventListener("click", () => {
    IAautomationRunning = !IAautomationRunning;
    if (IAautomationRunning) {   
      IAtoggleAutomationBtn.textContent = "Stop IA Automation";
      IAtoggleAutomationBtn.style.background = "linear-gradient(90deg,#f44336,#e57373)";
      IAtoggleAutomationBtn.style.color = "white";
      IAautomationRunning = true;
      // ---------- Create and start AI instance ----------
      const ai = AI();
      ai.initLSTMHarmonic(); // call once
      // optionally: ai.AI_connectWebSocket(); // already called inside init if needed
      BCtoggleAutomationBtn.disabled = true;
    } else {
      IAtoggleAutomationBtn.textContent = "Launch IA Automation";
      IAtoggleAutomationBtn.style.background = "white";  
      IAtoggleAutomationBtn.style.color = "gray";        
      IAautomationRunning = false;  
      setTimeout(stop,2000);
      BCtoggleAutomationBtn.disabled = false;
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
      displaySymbols(currentInterval,currentChartType);   
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
  displaySymbols(currentInterval,currentChartType);   
  initChart(currentChartType);
  initTable();
  initHistoricalTable();      
  inihistoricalchart();   
   
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
  (function initDates(){
    const today = new Date();
    const start = new Date(today); start.setDate(today.getDate()-3);
    const end = new Date(today); end.setDate(today.getDate()+3);   
    document.getElementById('startDate').value = start.toISOString().slice(0,10);
    document.getElementById('endDate').value = end.toISOString().slice(0,10);
  })();

  window.addEventListener('beforeunload', () => { try { if (ws) ws.close(); } catch (e) {} });
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
    btn.addEventListener("click", e => {
      currentChartType = e.target.dataset.type.trim();   
      console.log("Current Chart Type : " +currentChartType);     
      if (!currentSymbol) return;
      if (currentChartType === "candlestick") {
        wspl.send(JSON.stringify( { forget_all: ["candles","ticks"] } )); // oublie l'ancien symbole
        connect(currentSymbol, currentInterval, currentChartType);
      } else {
        ws.send(JSON.stringify( { forget_all: ["candles","ticks"] } )); // oublie l'ancien symbole
        subscribeSymbol(currentSymbol, currentChartType);
      }  
    });
  });  

  // === Changement d’intervalle ===
  document.querySelectorAll(".interval-btn").forEach(btn => {
      btn.addEventListener("click", e => {   
     // Récupère le texte du bouton (ex: "1 minute")
     currentInterval = e.target.textContent.trim();
     if (!currentSymbol) return;
     if (currentChartType === "candlestick") {
       connect(currentSymbol, currentInterval, currentChartType);
     } else {
       subscribeSymbol(currentSymbol, currentChartType);
     }
     console.log("⏱️ Current Interval:", currentInterval);

     // Supprime la classe active sur tous les boutons
     document.querySelectorAll(".interval-btn").forEach(b => b.classList.remove("active"));
     // Ajoute la classe active au bouton cliqué    
     e.target.classList.add("active");   
    });
  });

  // === Changement de symbole  ===
  document.querySelectorAll(".symbol-item").forEach(btn => {   
    btn.addEventListener("click", e => {
      currentSymbol = e.target.dataset.symbol.trim();
      if (!currentSymbol) return;
      if (currentChartType === "candlestick") {
        connect(currentSymbol, currentInterval, currentChartType);
      } else {
        subscribeSymbol(currentSymbol, currentChartType);
      }
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
  
  window.onload = () => {
       if (!currentSymbol) return;
       if (currentChartType !== "candlestick") return;
       connectInit(currentSymbol, currentInterval, currentChartType);
  };

  // Simulation : mise à jour toutes les 2 secondes
  setInterval(() => {   
    if (connectBtn.textContent !== "Connect") {   
      // Subscribing Tables
      connectDeriv_table();
    }
  }, 300);

  // Ouvrir popup
  document.getElementById('ROCtoggleAutomation').addEventListener('click', () => {
    const overlay = document.getElementById('aiPopupOverlay');
    overlay.classList.add('show');
    setTimeout(() => document.getElementById('aiPopupHighInput').focus(), 100);
  });


  // Fermer popup si on clique sur le fond
  document.getElementById('aiPopupOverlay').addEventListener('click', () => {
    document.getElementById('aiPopupOverlay').classList.remove('show');
  });


  // Annuler
  document.getElementById('aiPopupCancel').addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('aiPopupOverlay').classList.remove('show');
  });


  // Valider
  document.getElementById('aiPopupValidate').addEventListener('click', (e) => {
    e.stopPropagation();

    const h = parseFloat(document.getElementById('aiPopupHighInput').value);
    const l = parseFloat(document.getElementById('aiPopupLowInput').value);

    if (Number.isNaN(h) || Number.isNaN(l)) {
        alert('Veuillez entrer des nombres valides entre 0 et 1.');
        return;
    }

    if (l < 0 || l > 1 || h < 0 || h > 1) {
        alert('Les valeurs doivent être entre 0.0 et 1.0');
        return;
    }

    if (l > h) {
        alert('La lower tolerance doit être ≤ high probability.');
        return;
    }

    // Appliquer ou envoyer où tu veux
    document.getElementById('aiPopupHighDisplay').textContent = h.toFixed(3);
    document.getElementById('aiPopupLowDisplay').textContent = l.toFixed(3);

    // fermer
    document.getElementById('aiPopupOverlay').classList.remove('show');  

    console.log("Applied values:", { high: h, low: l });
  });


  // Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.getElementById('aiPopupOverlay').classList.remove('show');
    }
  });
  
});
