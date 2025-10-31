document.addEventListener("DOMContentLoaded", () => {
  const APP_ID = 109310;
  const TOKEN = "n04kyiO7gVSyQuA";
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
  const buyNum = document.getElementById("buyNumberInput");
  const sellNum = document.getElementById("sellNumberInput");
  const contractsPanelToggle = document.getElementById("contractsPanelToggle");
  const contractsPanel = document.getElementById("contractsPanel");
  const autoHistoryList = document.getElementById("autoHistoryList");
 
  let totalPL = 0; // cumul des profits et pertes
  let automationRunning = false;
  let smoothVol = 0;
  let smoothTrend = 0;
  let ws = null;
  let wsAutomation = null;
  let wsContracts = null;
  let chart = null;
  let areaSeries = null;
  let chartData = [];
  let lastPrices = {};
  let recentChanges = [];
  let signal;
  let signal__;
  let Dispersion;
  // Historique local des ticks
  let tickHistory = [];
  // Historique de profits
  let profitHistory = [];
  const contractsData = {}; // stockage des contrats {id: {profits: [], infos: {…}}}
  let contracts = {};
  let portfolioReceived = false;

  // --- NEW: current symbol & pending subscribe ---
  let currentSymbol = null;
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
    { symbol: "R_100", name: "VIX 100" },
    { symbol: "R_75", name: "VIX 75" },
    { symbol: "R_50", name: "VIX 50" },
    { symbol: "R_25", name: "VIX 25" },
    { symbol: "R_10", name: "VIX 10" }
  ];

  const fmt = n => Number(n).toFixed(2);
  const safe = v => (typeof v === "number" && !isNaN(v)) ? v : 0;

  // --- SYMBOLS ---
  function displaySymbols() {
    symbolList.innerHTML = "";
    SYMBOLS.forEach(s => {
      const el = document.createElement("div");
      el.className = "symbol-item";
      el.textContent = s.name;
      el.dataset.symbol = s.symbol;
      el.addEventListener("click", () => subscribeSymbol(s.symbol));
      symbolList.appendChild(el);
    });
  }

  // --- CHART INIT ---
  function initChart() {
    try { if (chart) chart.remove(); } catch (e) {}
    chartInner.innerHTML = "";

    chart = LightweightCharts.createChart(chartInner, {
      layout: { textColor: "#333", background: { type: "solid", color: "#fff" } },
      timeScale: { timeVisible: true, secondsVisible: true }
    });

    // use addAreaSeries (works with standalone bundle)
    areaSeries = chart.addAreaSeries({
      lineColor: "#2962FF",
      topColor: "rgba(41,98,255,0.28)",
      bottomColor: "rgba(41,98,255,0.05)",
      lineWidth: 2
    });

    chartData = [];
    recentChanges = [];
    lastPrices = {};

    positionGauges();
  }

  // --- GAUGES ---
  function positionGauges() {
    let gaugesContainer = document.getElementById("gaugesContainer");
    if (!gaugesContainer) {
      gaugesContainer = document.createElement("div");
      gaugesContainer.id = "gaugesContainer";
      gaugesContainer.style.position = "absolute";
      gaugesContainer.style.top = "10px";
      gaugesContainer.style.left = "10px";
      gaugesContainer.style.display = "flex";
      gaugesContainer.style.gap = "20px";
      gaugesContainer.style.zIndex = "12";
      chartInner.style.position = "relative";
      chartInner.appendChild(gaugesContainer);

      appendGauge(gaugesContainer, volGauge, "Volatility");
      appendGauge(gaugesContainer, trendGauge, "Tendance");
      appendGauge(gaugesContainer, probGauge, "Probabilité");
      appendGauge(gaugesContainer, plGauge, "P/L Live");
    }
  }

  function appendGauge(container, gaugeDiv, labelText) {
    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.alignItems = "center";
    wrapper.style.width = "140px";
    wrapper.style.pointerEvents = "none";

    const content = document.createElement("div");
    content.style.width = "100%";
    content.appendChild(gaugeDiv);
    wrapper.appendChild(content);

    const label = document.createElement("div");
    label.textContent = labelText;
    label.style.fontSize = "13px";
    label.style.fontWeight = "600";
    label.style.textAlign = "center";
    label.style.marginTop = "6px";
    label.style.pointerEvents = "none";
    wrapper.appendChild(label);

    container.appendChild(wrapper);
  }

  // --- CONNECT DERIV ---
  function connectDeriv() {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.close();
      ws = null;
      authorized = false;
      connectBtn.textContent = "Se connecter";
      accountInfo.textContent = "";
      return;
    }

    ws = new WebSocket(WS_URL);
    connectBtn.textContent = "Connecting...";
    accountInfo.textContent = "Connecting...";

    ws.onopen = () => {
      // send authorize
      ws.send(JSON.stringify({ authorize: TOKEN }));
    };

    ws.onmessage = (evt) => {
      try {
        const data = JSON.parse(evt.data);

        // authorize response
        if (data.msg_type === "authorize" && data.authorize) {
          authorized = true;
          const acc = data.authorize.loginid;
          const bal = data.authorize.balance;
          const currency = data.authorize.currency || "";
          connectBtn.textContent = "Disconnect";
          accountInfo.textContent = `Account: ${acc} | Balance: ${Number(bal).toFixed(2)} ${currency}`;

          // subscribe balance updates
          ws.send(JSON.stringify({ balance: 1, subscribe: 1 }));

          // if there was a pending subscribe requested earlier, do it now
          if (pendingSubscribe) {
            // small delay to ensure WS state consistent
            setTimeout(() => {
              if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ forget_all: "ticks" }));
                ws.send(JSON.stringify({ ticks: pendingSubscribe }));
                currentSymbol = pendingSubscribe;
                pendingSubscribe = null;
              }
            }, 300);
          }

          displaySymbols();
          return;
        }

        // balance update
        if (data.msg_type === "balance" && data.balance) {
          const b = data.balance;
          accountInfo.textContent = `Account: ${b.loginid} | Balance: ${Number(b.balance).toFixed(2)} ${b.currency}`;
          return;
        }

        // tick handling
        if (data.msg_type === "tick" && data.tick) {
          handleTick(data.tick);
          return;
        }

        // other messages are ignored here
      } catch (err) {
        console.error("WS parse err", err);
      }
    };

    ws.onclose = () => {
      connectBtn.textContent = "Se connecter";
      accountInfo.textContent = "";
      ws = null;
      authorized = false;
    };

    ws.onerror = (e) => {
      console.error("WS error", e);
    };
  }

  function startAutomation() {
    if (wsAutomation && wsAutomation.readyState === WebSocket.OPEN) {
      return wsAutomation;
    }

    if (currentSymbol === null) {
      console.log("Please select a symbol first.");
      return wsAutomation;
    }

    wsAutomation = new WebSocket(WS_URL);

    wsAutomation.onopen = () => {
      console.log("✅ Connecté au WebSocket Deriv");
      wsAutomation.send(JSON.stringify({ authorize: TOKEN }));
    };

    wsAutomation.onmessage = (msg) => {
      const data = JSON.parse(msg.data);

      // Autorisation réussie → abonnement aux ticks
      if (data.authorize) {
         console.log("🔑 Autorisé, abonnement aux ticks...");
         wsAutomation.send(JSON.stringify({ ticks: currentSymbol, subscribe: 1 }));
      }

      // Sauvegarder l'ID d'abonnement
      if (data.subscription && data.subscription.id) {
         tickSubscriptionId = data.subscription.id;
         console.log("🆔 ID abonnement:", tickSubscriptionId);
      }

      // Quand un tick arrive
      if (data.tick) {
         const price = parseFloat(data.tick.quote);
         const time = new Date(data.tick.epoch * 1000).toLocaleTimeString();

         tickHistory.push(price);
         if (tickHistory.length > 3) tickHistory.shift(); // garder seulement les 3 derniers ticks

         //console.clear();
         //console.log(`🕒 Tick reçu à ${time} | Prix : ${price}`);

         if (tickHistory.length === 3) {
            // Calcul sur le vecteur des 3 derniers ticks
            const [p1, p2, p3] = tickHistory;

           // Exemple de "variation moyenne" locale
           const variation = (p3 - p1) / 3; 
           
           // On peut aussi normaliser avec la moyenne
           const mean = (p1 + p2 + p3) / 3;
           Dispersion = ecartType(tickHistory);
           if (Dispersion !==0)
           {
            const delta = (p3 - mean) / Dispersion; // variation relative
            // Application de la sigmoïde
            signal = sigmoid(delta); // delta*10 ou 10 = facteur de sensibilité

            //console.log(`📊 Derniers ticks : ${tickHistory.map(x => x.toFixed(3)).join(", ")}`);
            //console.log(`⚙️ Variation moyenne : ${variation.toFixed(6)}`);
            console.log(`📈 Sigmoid : ${signal.toFixed(6)}`);
           }
         }
      }
    };

    ws.onclose = () => {
      console.log("Disconnected");
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };
  }

  function stopAutomation() {
    if (wsAutomation  && wsAutomation.readyState === WebSocket.OPEN) {
       // Envoyer unsubscribe avant de fermer
       wsAutomation.send(JSON.stringify({ forget_all: "ticks" }));
       wsAutomation.close();
    }
  }

  function sigmoid(x) {
    return (1 - 1 / (1 + Math.exp(-x)));
  }

  // Fonction pour calculer l’écart-type (population)
  function ecartType(values) {
    if (values.length === 0) return 0;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.map(x => (x - mean) ** 2).reduce((a, b) => a + b, 0) / values.length;
       
    return Math.sqrt(variance);
  }

  // --- SUBSCRIBE SYMBOL ---
  function subscribeSymbol(symbol) {
    // set desired symbol and reinit chart immediately
    currentSymbol = symbol;
    initChart(); // reinit chart so areaSeries exists before ticks arrive

    // if WS not ready, set pendingSubscribe and open connection
    if (!ws || ws.readyState !== WebSocket.OPEN || !authorized) {
      pendingSubscribe = symbol;
      if (!ws || ws.readyState === WebSocket.CLOSED) {
        connectDeriv();
      }
      // we'll actually send subscription after authorize in ws.onmessage
      return;
    }

    // WS open and authorized -> subscribe now
    try {
      ws.send(JSON.stringify({ forget_all: "ticks" }));
      ws.send(JSON.stringify({ ticks: symbol }));
    } catch (e) {
      // fallback: queue for after authorize
      pendingSubscribe = symbol;
      console.warn("Failed to send subscribe immediately, queued", e);
    }
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
    if (recentChanges.length > 60) recentChanges.shift();

    updateCircularGauges();

    // update chartData and series
    if (!areaSeries || !chart) return;

    const point = { time: epoch, value: quote };

    // if first data point, setData with small array to initialize
    if (!chartData.length) {
      chartData.push(point);
      try {
        areaSeries.setData(chartData);
      } catch (e) {
        // fallback: try update
        try { areaSeries.update(point); } catch (err) {}
      }
    } else {
      // append and update
      chartData.push(point);
      if (chartData.length > 600) chartData.shift();

      // Prefer update (faster); fallback to setData if update throws
      try {
        areaSeries.update(point);
      } catch (e) {
        try { areaSeries.setData(chartData); } catch (err) {}
      }
    }

    // try to auto-fit time scale (safe)
    try { chart.timeScale().fitContent(); } catch (e) {}
  }

  // --- GAUGES UPDATE ---
  function updateCircularGauges() {
    if (!recentChanges.length) return;
    const mean = recentChanges.reduce((a, b) => a + b, 0) / recentChanges.length;
    const variance = recentChanges.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / recentChanges.length;
    const stdDev = Math.sqrt(variance);
    const volProb = Math.min(100, (stdDev / 0.07) * 100);

    const sum = recentChanges.reduce((a, b) => a + b, 0);
    const trendRaw = Math.min(100, Math.abs(sum) * 1000);

    const pos = recentChanges.filter(v => v > 0).length;
    const neg = recentChanges.filter(v => v < 0).length;
    const dominant = Math.max(pos, neg);
    const prob = recentChanges.length ? Math.round((dominant / recentChanges.length) * 100) : 50;

    const alpha = 0.25; // smoother
    smoothVol = smoothVol === 0 ? volProb : smoothVol + alpha * (volProb - smoothVol);
    smoothTrend = smoothTrend === 0 ? trendRaw : smoothTrend + alpha * (trendRaw - smoothTrend);

    drawCircularGauge(volGauge, smoothVol, "#ff9800");
    drawCircularGauge(trendGauge, smoothTrend, "#2962FF");
    drawCircularGauge(probGauge, prob, "#4caf50");
    
  }

  // --- DRAW GAUGE ---
  function drawCircularGauge(container, value, color) {
    const size = 110;
    container.style.width = size + "px";
    container.style.height = (size + 28) + "px";

    let canvas = container.querySelector("canvas");
    let pct = container.querySelector(".gauge-percent");
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      canvas.style.display = "block";
      canvas.style.margin = "0 auto";
      canvas.style.pointerEvents = "none";
      container.innerHTML = "";
      container.appendChild(canvas);

      pct = document.createElement("div");
      pct.className = "gauge-percent";
      pct.style.textAlign = "center";
      pct.style.marginTop = "-92px";
      pct.style.fontSize = "16px";
      pct.style.fontWeight = "700";
      pct.style.color = "#222";
      pct.style.pointerEvents = "none";
      container.appendChild(pct);
    }

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, size, size);
    const center = size / 2;
    const radius = size / 2 - 8;
    const start = -Math.PI / 2;
    const end = start + (Math.min(value, 100) / 100) * 2 * Math.PI;

    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "#eee";
    ctx.lineWidth = 8;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(center, center, radius, start, end);
    ctx.strokeStyle = color;
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.stroke();

    pct.textContent = `${Math.round(value)}%`;
  }

  function updatePLGauge(plValue) {
    // On garde une moyenne lissée
    totalPL = plValue;   

    // Couleur dynamique : vert si positif, rouge si négatif
    const color = totalPL >= 0 ? "#4caf50" : "#f44336";
    const deg = Math.min(360, Math.abs(totalPL) * 3.6); // 100 = 360°
    
    plGauge.style.background = `conic-gradient(${color} ${deg}deg, #ddd ${deg}deg)`;
    plGauge.querySelector("span").textContent = `${totalPL >= 0 ? "+" : ""}${totalPL.toFixed(2)}$`;
  }

  // === P/L LIVE FUNCTION ===
  function contractentry(onUpdate) {
   let authorized = false;
   let portfolioReceived = false;
   let contracts = {};

   let ws = new WebSocket(WS_URL);
  
   if (!TOKEN) {
     console.log("Please, verify your token, and try again.");
     return;
   }

   ws.onopen = () => {
    ws.send(JSON.stringify({ authorize: TOKEN }));
   };

   ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);

    // Étape 1️⃣ : autorisation OK → on demande le portefeuille
    if (data.msg_type === "authorize" && !authorized) {
      authorized = true;
      ws.send(JSON.stringify({ portfolio: 1 }));
    }

    // Étape 2️⃣ : réception du portefeuille (liste des contrats ouverts)
    if (data.msg_type === "portfolio" && data.portfolio) {
      portfolioReceived = true;

      const contractsList = data.portfolio.contracts || [];
      if (contractsList.length === 0) {
        if (typeof onUpdate === "function") onUpdate(0);
        return;
      }

      for (const c of contractsList) {
        contracts[c.contract_id] = 0;

        // On s’abonne en continu à chaque contrat ouvert
        ws.send(JSON.stringify({
          proposal_open_contract: 1,
          contract_id: c.contract_id,
          subscribe: 1
        }));
      }
    }

    // Étape 3️⃣ : réception des updates tick par tick
    if (data.msg_type === "proposal_open_contract" && data.proposal_open_contract) {
      const poc = data.proposal_open_contract;

      // Vérifie que le contrat est encore actif
      if (poc.is_expired || poc.is_sold) {
        delete contracts[poc.contract_id];
      } else {
        contracts[poc.contract_id] = parseFloat(poc.profit);
      }

      // Calcule le P/L total
      const totalPL = Object.values(contracts).reduce((a, b) => a + b, 0);

      // Callback → gauge mis à jour à chaque tick
      if (typeof onUpdate === "function") onUpdate(totalPL);
    }
   };

   ws.onerror = (err) => console.error("WebSocket error:", err);
   ws.onclose = () => console.log("Disconnected from Deriv WebSocket.");

   return totalPL;
  }

  // Initialisation
  function initPLGauge() {
    const gauge__ = document.getElementById("plGauge");
    if (!gauge__) return;
    updatePLGauge(0);
  }

  buyBtn.onclick=()=>executeTrade("BUY");
  sellBtn.onclick=()=>executeTrade("SELL");

  //--- Trades (New)
  function executeTrade(type){
    const stake=parseFloat(stakeInput.value)||1;
    const multiplier=parseInt(multiplierInput.value)||100;
    const tp_contract = Number(takeProfitInput.value)||0;
    const sl_contract = Number(stopLossInput.value)||0;

    if(authorized && ws&& ws.readyState===WebSocket.OPEN){
       const payload = {
        buy: 1,
        price: stake.toFixed(2),
        parameters: {
          contract_type: type==="BUY"?"MULTUP":"MULTDOWN",
          symbol: currentSymbol,
          currency: "USD",
          basis: "stake",
          amount: stake.toFixed(2),
          multiplier: multiplier,
          //limit_order: { take_profit: 150, stop_loss: 130 }
        }
      };

      if (type === "BUY")
       {
        numb_ = parseInt(buyNum.value)||1;
       }
      else if (type === "SELL")
       {
        numb_ = parseInt(sellNum.value)||1;
       }

      for (let i=0;i < numb_; i++)
       {
         ws.send(JSON.stringify(payload));
       }
    }

    wsContracts = null;
  }

  closewinning.onclick=()=>{

    console.log("Closing all profitable trades...");

    const wsCloseWinning = new WebSocket(WS_URL);
    
    wsCloseWinning.onopen = () => {
      wsCloseWinning.send(JSON.stringify({ authorize: TOKEN }));
    };

    wsCloseWinning.onerror = (e) => {
      console.log("❌ WS Error: " + JSON.stringify(e));
    };

    wsCloseWinning.onmessage = (msg) => {
       const data = JSON.parse(msg.data);

      // Authorization successful
      if (data.msg_type === "authorize") {
         console.log("✅ Authorized successfully. Fetching portfolio...");
         wsCloseWinning.send(JSON.stringify({ portfolio: 1 }));
      }

      // Portfolio received
      if (data.msg_type === "portfolio" && data.portfolio?.contracts?.length > 0) {
         const contracts = data.portfolio.contracts;
         console.log("📊 Found " + contracts.length + " active contracts.");

         contracts.forEach((contract,i) => {
         setTimeout(() => {
            wsCloseWinning.send(
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

        wsCloseWinning.send(
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
  
    const wsCloseAll = new WebSocket(WS_URL);
    
    wsCloseAll.onopen=()=>{ wsCloseAll.send(JSON.stringify({ authorize: TOKEN })); };
    wsCloseAll.onclose=()=>{ console.log("Disconnected"); console.log("WS closed"); };
    wsCloseAll.onerror=e=>{ console.log("WS error "+JSON.stringify(e)); };
    wsCloseAll.onmessage=msg=>{
    const data=JSON.parse(msg.data);
    if(data.msg_type==="authorize")
     {
        if(!data.authorize?.loginid){ console.log("Token not authorized"); return; }
        authorized=true; 
        console.log("connection Authorized.");

        if(authorized && wsCloseAll && wsCloseAll.readyState===WebSocket.OPEN)
        {
           const portfoliopayload = { portfolio : 1};
           console.log('The request is open...');
           console.log('Request in process...');   

           wsCloseAll.send(JSON.stringify(portfoliopayload));
       
           wsCloseAll.onmessage = msg => {
           const data = JSON.parse(msg.data);
           if (data.msg_type === "portfolio" && data.portfolio?.contracts?.length > 0)
            {
             const contracts = data.portfolio.contracts;
             console.log('Found '+ contracts.length + ' active contracts - close all...');   
             for (const contract of contracts)
              {
               console.log('Closing contract '+ contract.contract_id + '(' + contract.contract_type + ')');
               wsCloseAll.send(JSON.stringify({
                 "sell": contract.contract_id,
                 "price": 0
               }));
             }
            }
            
            if (contracts.length === 0)
            {
              console.log('No active contracts found.');
            }
          };
        } 
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
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ portfolio: 1 }));
    }
  }

  // --- 🔄 S’abonne aux détails d’un contrat
  function subscribeContractDetails(contract_id) {
     ws.send(JSON.stringify({ proposal_open_contract: 1, contract_id : contract_id, subscribe: 1 }));
  }

  // --- 💰 Ferme un contrat
  function closeContract(contract_id) {
    ws.send(JSON.stringify({ sell: contract_id.trim(), price: 0 }));
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
      type: c.is_buy ? "BUY" : "SELL",
      stake: c.buy_price || 0,
      multiplier: c.multiplier || "-",
      entry_spot: c.entry_tick ?? "-",
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
        <td class="${trade.type === "BUY" ? "buy" : "sell"}">${trade.type}</td>
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
      tr.cells[9].textContent = trade.profit;
    }
  }

   // --- 🧱 Connexion WebSocket
  function connectDeriv() {
    //if (wsContracts && wsContracts.readyState === WebSocket.OPEN)
    //  wsContracts.close();  
    //  return wsContracts;

    wsContracts = new WebSocket(WS_URL);
     
    wsContracts.onopen=()=>{ wsContracts.send(JSON.stringify({ authorize: TOKEN })); };
    wsContracts.onclose=()=>{ console.log("Disconnected"); console.log("WS closed"); };
    wsContracts.onerror=e=>{ console.log("WS error "+JSON.stringify(e)); };
    wsContracts.onmessage=msg=>{
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

    wsContracts.onerror = (err) => console.error("❌ WebSocket error:", err);
    wsContracts.onclose = () => console.log("🔴 Disconnected");
  }

  contractsPanelToggle.addEventListener("click", () => {
  if (!contractsPanel.classList.contains("active")) {   
    contractsPanel.style.display = "flex";
    const contentHeight = contractsPanel.scrollHeight + "px";  
    contractsPanel.style.height = contentHeight;
    contractsPanel.classList.add("active");
    contractsPanelToggle.textContent = "📁 Hide Contracts";
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
  const toggleAutomationBtn = document.getElementById("toggleAutomation");
  toggleAutomationBtn.addEventListener("click", () => {
    automationRunning = !automationRunning;
    if (automationRunning) {
      toggleAutomationBtn.textContent = "Stop Automation";
      toggleAutomationBtn.style.background = "linear-gradient(90deg,#f44336,#e57373)";
      toggleAutomationBtn.style.color = "white";
      startAutomation();
    } else {
      toggleAutomationBtn.textContent = "Launch Automation";
      toggleAutomationBtn.style.background = "white";
      toggleAutomationBtn.style.color = "gray";
      stopAutomation();
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
    connectDeriv();
    displaySymbols();
  });

  // startup
  displaySymbols();
  initChart();
  initPLGauge();
  initTable();
 // Ajoute les trades de test
  //trades__.forEach(addTradeRow);

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

  // Supprimer une ligne individuelle
  autoTradeBody.addEventListener("click", (e) => {
    if (e.target.classList.contains("deleteRowBtn")) {
      e.target.closest("tr").remove();
    }
  });

  // resize handling
  window.addEventListener("resize", () => {
    try { positionGauges(); } catch (e) {}
    if (chart) {
      try { chart.resize(chartInner.clientWidth, chartInner.clientHeight); } catch (e) {}
    }
  });
  
  // Simulation : mise à jour toutes les 2 secondes
  setInterval(() => {
      contractentry(totalPL => {
        updatePLGauge(totalPL);
      });
  }, 1000);
  
  // Subscribing Tables
  setInterval(() => {
      connectDeriv();
  }, 1000);
});
