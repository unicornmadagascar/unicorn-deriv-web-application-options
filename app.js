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
  let rocProposal = null;
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
  let candleSeries;
  let currentChartType = "candlestick"; // par défaut
  let currentInterval = "1 minute";  // par défaut

  // --- NEW: current symbol & pending subscribe ---
  let currentSymbol = "cryBTCUSD"; // symbole par défaut
  let pendingSubscribe = null;
  let authorized = false;      
  // Exemple de données

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
        count: 430,
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
    if (ws) ws.close();

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

          if (!bar) return;  
   
          const last = candles[candles.length - 1];

          if (!last || last.time !== openTime) {
             // Nouvelle bougie
             candles.push(bar);
             currentSeries.update(bar);
             console.log("🟢 Nouvelle bougie :", bar);
          } else {
             // Mise à jour de la dernière bougie
             candles[candles.length - 1] = bar;
             currentSeries.update(bar);
          }
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
    if (ws) ws.close();

    if (!symbol) return;
    
    if (currentChartType !== "candlestick") return;

    currentSymbol = symbol;
    initChart(currentChartType);
    console.log("Connexion...");
   
    ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log("Connecté");
      ws.send(JSON.stringify(Payloadforsubscription(currentSymbol,currentInterval,currentChartType)));
      setInterval(() => ws.send(JSON.stringify({ ping:1 })), 60000);
    };

    ws.onmessage = ({ data }) => {
      let msg = {};
      try { msg = JSON.parse(data); } catch(e){ return; }
   
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

      if (msg.msg_type === "error") {
        console.error("Erreur WS:", msg);   
        console.log("Erreur réseau ou payload");
      }   
    };

    ws.onclose = () => console.log("Déconnecté");
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
    if (wspl) { wspl.close(); wspl = null; }

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
    };

    wsOpenLines.onerror = (e) => console.log("⚠️ WS error:", e);
    wsOpenLines.onclose = () => console.log("❌ WS closed for open lines");
  }

  
  function RocstartAutomation() {
    
    if (!currentSymbol) return;

    const symbolPrefix = currentSymbol.slice(0, 6);

    function connectWebSocket() {
      if (wsROC) {wsROC.close(); wsROC = null;}
      
      wsROC = new WebSocket(WS_URL);
      console.log("🟢 WebSocket ROC connecté");
      wsROC.onopen=()=>{ wsROC.send(JSON.stringify({ authorize: TOKEN })); };   
      wsROC.onmessage = (msg) => handleMessage(JSON.parse(msg.data));   
      wsROC.onclose = () => { setTimeout(connectWebSocket, 500); };      
      wsROC.onerror = (err) => { console.error("WebSocket error:", err); wsROC.close(); wsROC = null; setTimeout(connectWebSocket, 500); };  
    }

    function handleMessage(data) {
      switch (data.msg_type) {
        case "authorize":
          wsROC.send(JSON.stringify({ ticks: currentSymbol, subscribe: 1 }));
          wsROC.send(JSON.stringify({ proposal_open_contract: 1, subscribe: 1 }));
          wsROC.send(JSON.stringify({ portfolio: 1 }));
          break;

        case "portfolio":   
          rocContracts = data.portfolio.contracts;    
          break;

        case "proposal_open_contract":
          rocProposal = data.proposal_open_contract;
          break;

        case "tick":
          handleTicks(data.tick);
          break;
      }
    }  

    function handleTicks(tick) {
      const symbolPrefix = currentSymbol.slice(0, 6);
      const price = parseFloat(tick.quote);
      if (currentChartType !== "candlestick") {
         tickHistory__.push(price);
         if (tickHistory__.length >= 21) {
           const currentPrice = tickHistory__[tickHistory__.length - 1];
           const pastPrice = tickHistory__[tickHistory__.length - 21];
           const rocTick = 100 * (currentPrice - pastPrice) / pastPrice;

           console.log("ROC (Tick) :", rocTick.toFixed(4));

           if (["cryBTC", "frxXAU"].includes(symbolPrefix)) {

              if (rocTick > 0.01) {
                 handleSignal("BUY");
              } else if (rocTick < -0.01) {
                 handleSignal("SELL");
              }
           }
         }
       }
       else if (currentChartType === "candlestick") 
       {
         closePrice = price;
         candleHistory__.push(closePrice);
          if (candleHistory__.length >= 21) {
            const currentClose = candleHistory__[candleHistory__.length - 1];
            const pastClose = candleHistory__[candleHistory__.length - 21];
            const rocCandle = 100 * (currentClose - pastClose) / pastClose;

            console.log("ROC (Candles) :", rocCandle.toFixed(4));

            if (["cryBTC", "frxXAU"].includes(symbolPrefix)) {

              if (rocCandle > 0.01) {
                 handleSignal("BUY");
              } else if (rocCandle < -0.01) {
                 handleSignal("SELL");
              }
            }
          }
       }

       if (tickHistory__.length > MAX_HISTORY || candleHistory__.length > MAX_HISTORY) {
          tickHistory__.splice(0,3); // enlever l'élément le plus ancien
          candleHistory__.splice(0, 50);
       }
    }

    function handleSignal(direction) {
      const oppositeType = direction === "BUY" ? "MULTDOWN" : "MULTUP";
      const mainType = direction === "BUY" ? "MULTUP" : "MULTDOWN";

      // 1. Fermer les contrats opposés
      rocContracts
        .filter(c => c.symbol === currentSymbol && c.contract_type === oppositeType)
        .forEach(c => {
          console.log("🛑 Fermeture contrat", oppositeType);
          wsROC.send(JSON.stringify({ sell: c.contract_id, price: 0 }));
        });

      // 2. Vérifier si un contrat actif existe avant d'ouvrir
      if (rocProposal?.contract_id) {
        console.log("⏸️ Contrat déjà actif, attente...");
        return;
      }

      // 3. Ouvrir un nouveau contrat
      const stake = parseFloat(stakeInput.value) || 1;
      const multiplier = parseInt(multiplierInput.value) || 40;
      const repeat = direction === "BUY"
        ? (parseInt(buyNumber.value) || 1)
        : (parseInt(sellNumber.value) || 1);

      console.log(`📤 Ouverture d’un contrat ${direction} (${mainType})`);

      if ((typeof multiplier !== "number" && multiplier === "") || (typeof stake !== "number" && stake === "") || (typeof repeat !== "number" && repeat === "")) {
          console.error("Valeur de multiplicateur invalide. Veuillez vérifier l'entrée.");
          return;
      }

      for (let i = 0; i < repeat; i++) {
        wsROC.send(JSON.stringify({
          buy: 1,
          price: stake.toFixed(2),
          parameters: {
            contract_type: mainType,
            symbol: currentSymbol,
            currency: "USD",
            basis: "stake",
            amount: stake.toFixed(2),
            multiplier: multiplier,
          }
        }));
      }
    }

    // Démarrage de la connexion WS
    if (!wsROC || wsROC.readyState > 1) {
      connectWebSocket();
    }
  }

  function RocstopAutomation() {
    if (wsROC  && wsROC.readyState === WebSocket.OPEN) {
       // Envoyer unsubscribe avant de fermer
       wsROC.send(JSON.stringify({ forget_all: "ticks" }));
       wsROC.close();
    }
  }

  function startAutomation() {

    if (!currentSymbol) return;

    const symbol_test = currentSymbol.slice(0,3);

    if (wsAutomation === null)
    {
      wsAutomation = new WebSocket(WS_URL);
      wsAutomation.onopen=()=>{ wsAutomation.send(JSON.stringify({ authorize: TOKEN })); };
    }

    if (wsAutomation && (wsAutomation.readyState === WebSocket.OPEN || wsAutomation.readyState === WebSocket.CONNECTING))
    {
     wsAutomation.onopen=()=>{ wsAutomation.send(JSON.stringify({ authorize: TOKEN })); };
    }

    if (wsAutomation && (wsAutomation.readyState === WebSocket.CLOSED || wsAutomation.readyState === WebSocket.CLOSING))
    {
      wsAutomation = null;
      wsAutomation = new WebSocket(WS_URL);
      wsAutomation.onopen=()=>{ wsAutomation.send(JSON.stringify({ authorize: TOKEN })); };
    }

    wsAutomation.onmessage = (msg) => {
        const data = JSON.parse(msg.data);

        // Autorisation réussie → abonnement aux ticks
        if (data.msg_type === "authorize") {
         wsAutomation.send(JSON.stringify({ ticks: currentSymbol, subscribe: 1 }));
         wsAutomation.send(JSON.stringify({ proposal_open_contract: 1, subscribe: 1 }));
         wsAutomation.send(JSON.stringify({ portfolio: 1 }));
        }

        if (data.msg_type === "portfolio") 
        {
           contracts = data.portfolio.contracts;
           console.log("Contracts :", contracts);
           return;
        }   

        if (data.msg_type === "proposal_open_contract") 
        {
           proposal__ = data.proposal_open_contract;
           console.log("Proposal :", proposal__);   
           return;
        } 
        
        if (data.msg_type === "tick")   
        {
           const price = parseFloat(data.tick.quote);
           tickHistory__arr.push(price);
           if (it >= 3 && tickHistory__arr.length > 3) // garder seulement les 3 derniers ticks
           {  
              Tick_arr.length = 3;
              Tick_arr = tickHistory__arr.slice(-3);
              
              // On peut aussi normaliser avec la moyenne
              const mean = (Tick_arr[0] + Tick_arr[1] + Tick_arr[2]) / 3;
              Dispersion = ecartType(Tick_arr);
              if (Dispersion !==0)
              {
               const delta = (Tick_arr[2] - mean) / Dispersion; // variation relative
               // Application de la sigmoïde
               signal = (1 - 1 / (1 + Math.exp(-delta)));
               console.log(`📈 Signal : ${signal.toFixed(6)}`);

               if (symbol_test === "BOO")  
               {
                if (signal < 0.37)
                {
                  // Filtrer les contrats SELL (Boom/Crash → MULTDOWN)
                  contracts
                     .filter(c => c.symbol === currentSymbol && c.contract_type === "MULTDOWN")
                     .forEach(c => {
                        wsAutomation.send(JSON.stringify({ sell: c.contract_id, price: 0 }));
                     });

                  if (proposal__.contract_id) return;
                 
                  console.log("📤 Ouverture d'un nouveau contrat BUY...");
                 
                  const stake = parseFloat(stakeInput.value) || 1;
                  const multiplier = parseInt(multiplierInput.value)||50;
                  numb_ = parseInt(buyNumber.value) || 1;
                  
                  if ((typeof multiplier !== "number" && multiplier === "") || (typeof stake !== "number" && stake === "") || (typeof numb_ !== "number" && numb_ === "")) {
                     console.error("Valeur de multiplicateur invalide. Veuillez vérifier l'entrée.");
                     return;
                  }

                  for (let i=0;i < numb_; i++)
                  {
                    wsAutomation.send(JSON.stringify({
                          buy: 1,
                          price: stake.toFixed(2),
                          parameters: {
                            contract_type: "MULTUP",
                            symbol: currentSymbol,
                            currency: "USD",
                            basis: "stake",
                            amount: stake.toFixed(2),
                            multiplier: multiplier,
                         }
                       }
                    ));
                  }
                  setTimeout(() => {     
                  },5000);
                }
                else
                {
                  // Filtrer les contrats BUY (ex: CALL, RISE, ou basés sur ton type)
                  contracts
                     .filter(c => c.symbol === currentSymbol && c.contract_type === "MULTUP")
                     .forEach(c => {
                        wsAutomation.send(JSON.stringify({ sell: c.contract_id, price: 0 }));
                     });

                  if (proposal__.contract_id) return;
                  
                  console.log("📤 Ouverture d'un nouveau contrat SELL...");
                  const stake = parseFloat(stakeInput.value) || 1;
                  const multiplier = parseInt(multiplierInput.value)||40;
                  numb_ = parseInt(sellNumber.value) || 1;

                  if ((typeof multiplier !== "number" && multiplier === "") || (typeof stake !== "number" && stake === "") || (typeof numb_ !== "number" && numb_ === "")) {
                     console.error("Valeur de multiplicateur invalide. Veuillez vérifier l'entrée.");
                     return;
                  }

                  for (let i=0;i < numb_; i++)
                  {
                    wsAutomation.send(JSON.stringify({
                           buy: 1,
                           price: stake.toFixed(2),
                           parameters: {
                             contract_type: "MULTDOWN",
                             symbol: currentSymbol,
                             currency: "USD",
                             basis: "stake",
                             amount: stake.toFixed(2),
                             multiplier: multiplier,
                           }
                        }
                    ));
                  }
                }
               }
               else if (symbol_test === "CRA")
               {
                 if (signal > 0.75)
                 {
                  // Filtrer les contrats BUY (ex: CALL, RISE, ou basés sur ton type)
                  contracts
                     .filter(c => c.symbol === currentSymbol && c.contract_type === "MULTUP")
                     .forEach(c => {
                        wsAutomation.send(JSON.stringify({ sell: c.contract_id, price: 0 }));
                     });

                  if (proposal__.contract_id) return;

                  console.log("📤 Ouverture d'un nouveau contrat SELL...");
                  const stake = parseFloat(stakeInput.value) || 1;
                  const multiplier = parseInt(multiplierInput.value)||40;
                  numb_ = parseInt(sellNumber.value) || 1;

                  if ((typeof multiplier !== "number" && multiplier === "") || (typeof stake !== "number" && stake === "") || (typeof numb_ !== "number" && numb_ === "")) {
                     console.error("Valeur de multiplicateur invalide. Veuillez vérifier l'entrée.");
                     return;
                  }

                  for (let i=0;i < numb_; i++)
                  {
                    wsAutomation.send(JSON.stringify({
                           buy: 1,
                           price: stake.toFixed(2),
                           parameters: {
                             contract_type: "MULTDOWN",
                             symbol: currentSymbol,
                             currency: "USD",
                             basis: "stake",
                             amount: stake.toFixed(2),
                             multiplier: multiplier,
                           }
                        }
                    ));
                  }
                  setTimeout(() => {
                  },5000);
                 }
                 else
                 {
                  // Filtrer les contrats SELL (Boom/Crash → MULTDOWN)
                  contracts
                     .filter(c => c.symbol === currentSymbol && c.contract_type === "MULTDOWN")
                     .forEach(c => {
                        wsAutomation.send(JSON.stringify({ sell: c.contract_id, price: 0 }));
                     });

                  if (proposal__.contract_id) return;

                  console.log("📤 Ouverture d'un nouveau contrat BUY...");
                  const stake = parseFloat(stakeInput.value) || 1;
                  const multiplier = parseInt(multiplierInput.value)||50;
                  numb_ = parseInt(buyNumber.value) || 1;

                  if ((typeof multiplier !== "number" && multiplier === "") || (typeof stake !== "number" && stake === "") || (typeof numb_ !== "number" && numb_ === "")) {
                     console.error("Valeur de multiplicateur invalide. Veuillez vérifier l'entrée.");
                     return;
                  }

                  for (let i=0;i < numb_; i++)
                   {
                     wsAutomation.send(JSON.stringify({
                           buy: 1,
                           price: stake.toFixed(2),
                           parameters: {
                             contract_type: "MULTUP",
                             symbol: currentSymbol,
                             currency: "USD",
                             basis: "stake",
                             amount: stake.toFixed(2),
                             multiplier: multiplier,
                           }
                        }
                     ));
                   }
                 }
               }
             }
           }   // if (it)
        }  

        if (tickHistory__arr.length > 700)    
        {
         tickHistory__arr.splice(0,100);
        }
    };   

    wsAutomation.onclose = () => {
      console.log("Disconnected");
      setTimeout(startAutomation, 500);
    };

    wsAutomation.onerror = (err) => {
      console.error("WebSocket error:", err);
      wsAutomation.close();
      wsAutomation = null;
      setTimeout(startAutomation, 500);
    };
  }

  function stopAutomation() {
    if (wsAutomation  && wsAutomation.readyState === WebSocket.OPEN) {
       // Envoyer unsubscribe avant de fermer
       wsAutomation.send(JSON.stringify({ forget_all: "ticks" }));
       wsAutomation.close();
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

    if(wsContracts && wsContracts.readyState===WebSocket.OPEN){
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
      };
      
      const numb_ = type === BUY ? parseInt(buyNumber.value) || 1
                                 : parseInt(sellNumber.value) || 1;

      for (let i=0;i < numb_; i++)
       {
         wsContracts.send(JSON.stringify(payload));
       }
    }  
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
    
    wsplContracts.onclose=()=>{ console.log("Disconnected"); console.log("WS closed"); };
    wsplContracts.onerror=e=>{ console.log("WS error "+JSON.stringify(e)); };
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
          console.log("✅ Authorized successfully :", data.authorize.loginid);
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
      BCtoggleAutomationBtn.textContent = "Stop BC Automation";
      BCtoggleAutomationBtn.style.background = "linear-gradient(90deg,#f44336,#e57373)";
      BCtoggleAutomationBtn.style.color = "white";
      BCautomationRunning = true;
      BCtoggleAutomationBtn.disabled = true;
    } else {
      BCtoggleAutomationBtn.textContent = "Launch BC Automation";
      BCtoggleAutomationBtn.style.background = "white";  
      BCtoggleAutomationBtn.style.color = "gray"; 
      BCautomationRunning = false;  
      BCtoggleAutomationBtn.disabled = false;
    }
  });

  // === Automation Toggle ===
  const ROCtoggleAutomationBtn = document.getElementById("ROCtoggleAutomation");
  ROCtoggleAutomationBtn.addEventListener("click", () => {
    ROCautomationRunning = !ROCautomationRunning;
    if (ROCautomationRunning) {
      ROCtoggleAutomationBtn.textContent = "Stop ROC Automation";
      ROCtoggleAutomationBtn.style.background = "linear-gradient(90deg,#f44336,#e57373)";
      ROCtoggleAutomationBtn.style.color = "white";
      ROCautomationRunning = true;
      ROCtoggleAutomationBtn.disabled = true;
    } else {
      ROCtoggleAutomationBtn.textContent = "Launch ROC Automation";
      ROCtoggleAutomationBtn.style.background = "white";
      ROCtoggleAutomationBtn.style.color = "gray";
      ROCautomationRunning = false;
      ROCtoggleAutomationBtn.disabled = false;
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

  // BC Automation
  setInterval(() => {
    if (BCtoggleAutomationBtn.textContent.trim()==="Stop BC Automation")
    {
     startAutomation();  
    }
    else if (BCtoggleAutomationBtn.textContent.trim()==="Launch BC Automation")
    {
     stopAutomation();   
    }
  },500);
  
  // ROC Automation
  setInterval(() => {
    if (ROCtoggleAutomationBtn.textContent.trim()==="Stop ROC Automation")
    {
     RocstartAutomation();
    }
    else if (ROCtoggleAutomationBtn.textContent.trim()==="Launch ROC Automation")
    {
     RocstopAutomation();
    }
  },500);
});
