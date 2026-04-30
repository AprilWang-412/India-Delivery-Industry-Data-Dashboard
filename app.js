const DATA_URL = "data/dashboard.json";
const AUTO_REFRESH_MS = 5 * 60 * 1000;

function el(id) {
  return document.getElementById(id);
}

function setStatus(source, ok) {
  const now = new Date().toLocaleString("en-GB", { hour12: false });
  const status = ok ? "Live" : "Fallback";
  el("meta-runtime-status").textContent = `${status} (${source}) · ${now}`;
}

function renderList(targetId, items) {
  const target = el(targetId);
  if (!target) return;
  target.innerHTML = "";
  items.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    target.appendChild(li);
  });
}

function renderDriverList(targetId, items) {
  const target = el(targetId);
  if (!target) return;
  target.innerHTML = "";
  items.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="label">${item.label}</span><span class="value">${item.value}</span>`;
    target.appendChild(li);
  });
}

function renderRiskSignals(risk) {
  const activeItems = risk.items.filter(i => i.status === "active");
  const closedItems = risk.items.filter(i => i.status === "closed");
  
  el("risk-active-count").textContent = String(activeItems.length);
  el("risk-summary").textContent = `${risk.new_this_week} new this week · ${closedItems.length} closed`;

  const log = el("risk-log");
  log.innerHTML = "";
  risk.items.forEach(item => {
    const li = document.createElement("li");
    if (item.status === "closed") li.classList.add("closed");
    li.innerHTML = `<span>${item.date}</span> ${item.message}`;
    log.appendChild(li);
  });
}

function renderCompanyComparison(data) {
  const table = el("company-comparison");
  if (!table) return;
  
  const headers = ["Metric", "Blinkit (Zomato)", "Swiggy", "Zepto"];
  const thead = document.createElement("thead");
  const tr = document.createElement("tr");
  headers.forEach(h => {
    const th = document.createElement("th");
    th.textContent = h;
    tr.appendChild(th);
  });
  thead.appendChild(tr);
  table.innerHTML = "";
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  data.forEach(row => {
    const tr = document.createElement("tr");
    Object.values(row).forEach(val => {
      const td = document.createElement("td");
      td.textContent = val;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
}

function renderData(data) {
  el("meta-last-refresh").textContent = data.meta.last_refresh;
  el("meta-refresh-cadence").textContent = data.meta.refresh_cadence;

  el("kpi-mau-value").textContent = data.kpis.mau.value;
  el("kpi-mau-delta").textContent = data.kpis.mau.delta;
  el("kpi-mau-delta").className = data.kpis.mau.delta.includes("+") ? "delta up" : "delta";

  el("kpi-dau-value").textContent = data.kpis.dau.value;
  el("kpi-dau-delta").textContent = data.kpis.dau.delta;
  el("kpi-dau-delta").className = data.kpis.dau.delta.includes("+") ? "delta up" : "delta";

  el("kpi-stickiness-value").textContent = data.kpis.dau_mau.value;
  el("kpi-stickiness-delta").textContent = data.kpis.dau_mau.delta;
  el("kpi-stickiness-delta").className = data.kpis.dau_mau.delta.includes("+") ? "delta up" : "delta";

  renderRiskSignals(data.risk_signals);
  renderDriverList("growth-drivers", data.growth_drivers);
  renderDriverList("decline-drivers", data.decline_drivers);

  renderList("consumer-themes", data.consumer.top_themes);
  renderList("consumer-blinkit", data.consumer.blinkit);
  renderList("consumer-instamart", data.consumer.instamart);
  renderList("consumer-zepto", data.consumer.zepto);

  const volumeList = el("consumer-volume");
  volumeList.innerHTML = "";
  Object.entries(data.consumer.volume).forEach(([key, val]) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${key}</span><strong>${val}</strong>`;
    volumeList.appendChild(li);
  });

  const sentimentDiv = el("consumer-sentiment");
  sentimentDiv.innerHTML = `
    <span class="pos" style="width: ${data.consumer.sentiment.positive}%">Positive ${data.consumer.sentiment.positive}%</span>
    <span class="neu" style="width: ${data.consumer.sentiment.neutral}%">Neutral ${data.consumer.sentiment.neutral}%</span>
    <span class="neg" style="width: ${data.consumer.sentiment.negative}%">Negative ${data.consumer.sentiment.negative}%</span>
  `;

  const merchantSentiment = el("merchant-sentiment");
  merchantSentiment.innerHTML = "";
  Object.entries(data.merchant.sentiment).forEach(([key, val]) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${key}</span><strong>${val}</strong>`;
    merchantSentiment.appendChild(li);
  });

  const merchantPain = el("merchant-pain");
  merchantPain.innerHTML = "";
  Object.entries(data.merchant.pain_points).forEach(([key, val]) => {
    const p = document.createElement("p");
    p.innerHTML = `<span>${key}</span><strong>${val}</strong>`;
    merchantPain.appendChild(p);
  });

  renderList("merchant-blinkit", data.merchant.blinkit);
  renderList("merchant-swiggy", data.merchant.swiggy);
  renderList("merchant-zepto", data.merchant.zepto);

  const driverIncome = el("driver-income");
  driverIncome.innerHTML = "";
  Object.entries(data.driver.income_satisfaction).forEach(([key, val]) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${key}</span><strong>${val}</strong>`;
    driverIncome.appendChild(li);
  });

  const driverVolatility = el("driver-volatility");
  driverVolatility.innerHTML = "";
  Object.entries(data.driver.incentive_volatility).forEach(([key, val]) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${key}</span><strong>${val}</strong>`;
    driverVolatility.appendChild(li);
  });

  renderList("driver-alerts", data.driver.alerts);
  renderList("driver-blinkit", data.driver.blinkit);
  renderList("driver-swiggy", data.driver.swiggy);
  renderList("driver-zepto", data.driver.zepto);

  renderCompanyComparison(data.company_comparison);

  const eventLog = el("india-event-log");
  eventLog.innerHTML = "";
  data.narrative_events.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${item.date}</span> [${item.tag}] ${item.message}`;
    eventLog.appendChild(li);
  });

  renderList("methodology-sources", data.methodology.sources);
  renderList("methodology-log", data.methodology.update_log);
}

async function fetchAndRender() {
  try {
    const response = await fetch(`${DATA_URL}?t=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    renderData(data);
    setStatus("live-json", true);
  } catch (error) {
    console.warn("Fetch failed; using fallback data.", error);
    if (window.FALLBACK_DATA) {
      renderData(window.FALLBACK_DATA);
      setStatus("inline-fallback", false);
    }
  }
}

fetchAndRender();
setInterval(fetchAndRender, AUTO_REFRESH_MS);
