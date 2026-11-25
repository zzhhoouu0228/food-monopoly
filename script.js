// 1. 8x8 環狀 28 格（20 間淡江店家 + 4 角落 + 四邊中段各 1 格機會/命運，彼此間隔 7 格）
const boardData = [
  // 右下角落：起點 GO
  { id: 0, name: "起點 GO", icon: "🚩", type: "special", side: "corner", isGo: true, grid: "8 / 8" },

  // 下排（由右往左，共 6 格）
  { id: 1, name: "欣宏牛肉麵", icon: "🍜", type: "restaurant", side: "bottom", color: "#8b5a2b", grid: "8 / 7" },
  { id: 2, name: "樂之屋", icon: "🍱", type: "restaurant", side: "bottom", color: "#8b5a2b", grid: "8 / 6" },
  { id: 3, name: "機會", icon: "❓", type: "chance", side: "bottom", grid: "8 / 5" },
  { id: 4, name: "滷獲至飽", icon: "🍲", type: "restaurant", side: "bottom", color: "#8b5a2b", grid: "8 / 4" },
  { id: 5, name: "丐幫滷味", icon: "🍢", type: "restaurant", side: "bottom", color: "#38bdf8", grid: "8 / 3" },
  { id: 6, name: "海盜灣漢堡", icon: "🍔", type: "restaurant", side: "bottom", color: "#38bdf8", grid: "8 / 2" },

  // 左下角落
  { id: 7, name: "大學城廣場", icon: "🤤", type: "special", side: "corner", grid: "8 / 1" },

  // 左排（由下往上，共 6 格）
  { id: 8, name: "eat 窩", icon: "🍝", type: "restaurant", side: "left", color: "#38bdf8", grid: "7 / 1" },
  { id: 9, name: "滄洲燒臘飯", icon: "🍖", type: "restaurant", side: "left", color: "#ec4899", grid: "6 / 1" },
  { id: 10, name: "命運", icon: "🔮", type: "fate", side: "left", grid: "5 / 1" },
  { id: 11, name: "八方雲集", icon: "🥟", type: "restaurant", side: "left", color: "#ec4899", grid: "4 / 1" },
  { id: 12, name: "三顧茅廬", icon: "🌶️", type: "restaurant", side: "left", color: "#ec4899", grid: "3 / 1" },
  { id: 13, name: "水源街炒飯", icon: "🍳", type: "restaurant", side: "left", color: "#f97316", grid: "2 / 1" },

  // 左上角落
  { id: 14, name: "i 珍食", icon: "🍙", type: "special", side: "corner", grid: "1 / 1" },

  // 上排（由左往右，共 6 格）
  { id: 15, name: "牛狀元牛排", icon: "🥩", type: "restaurant", side: "top", color: "#f97316", grid: "1 / 2" },
  { id: 16, name: "無名煎餃", icon: "🥟", type: "restaurant", side: "top", color: "#f97316", grid: "1 / 3" },
  { id: 17, name: "機會", icon: "❓", type: "chance", side: "top", grid: "1 / 4" },
  { id: 18, name: "大塊雞排", icon: "🍗", type: "restaurant", side: "top", color: "#ef4444", grid: "1 / 5" },
  { id: 19, name: "淡大麥當勞", icon: "🍟", type: "restaurant", side: "top", color: "#ef4444", grid: "1 / 6" },
  { id: 20, name: "孫東寶牛排", icon: "🥩", type: "restaurant", side: "top", color: "#ef4444", grid: "1 / 7" },

  // 右上角落
  { id: 21, name: "英專路夜市", icon: "🏮", type: "special", side: "corner", grid: "1 / 8" },

  // 右排（由上往下，共 6 格）
  { id: 22, name: "黑殿排骨飯", icon: "🍛", type: "restaurant", side: "right", color: "#eab308", grid: "2 / 8" },
  { id: 23, name: "文化阿給", icon: "🥡", type: "restaurant", side: "right", color: "#eab308", grid: "3 / 8" },
  { id: 24, name: "命運", icon: "🔮", type: "fate", side: "right", grid: "4 / 8" },
  { id: 25, name: "北新路咖哩", icon: "🍛", type: "restaurant", side: "right", color: "#10b981", grid: "5 / 8" },
  { id: 26, name: "喜相逢快餐", icon: "🍱", type: "restaurant", side: "right", color: "#10b981", grid: "6 / 8" },
  { id: 27, name: "源味滷肉飯", icon: "🍚", type: "restaurant", side: "right", color: "#10b981", grid: "7 / 8" }
];

// 機會卡庫（抽完後一定會繼續移動或再骰一次選出餐廳）
const chanceCards = [
  {
    icon: "🚀",
    title: "練球順風快步走",
    desc: "今天體能狀態極佳！棋子自動再往前推進 2 格決定餐廳！",
    moveSteps: 2,
    actionText: "⚡ 前進 2 格"
  },
  {
    icon: "🥤",
    title: "飲料加碼大對決",
    desc: "本輪同桌一起猜拳，最輸的人請大家喝飲料！接下任務後繼續擲骰決定要吃哪間店！",
    keepTurnTask: "🥤 猜拳輸家請喝飲料"
  },
  {
    icon: "👑",
    title: "今日晚餐總召權",
    desc: "獲得「指定鄰居權」！請直接從下方選擇【前一格】或【後一格】的餐廳開吃！",
    chooseNeighbor: true
  },
  {
    icon: "🎲",
    title: "命運重抽通行證",
    desc: "獲得一次無條件免費重擲骰子的機會，繼續骰出你的晚餐吧！",
    reroll: true,
    actionText: "🎲 立即再骰一次"
  },
  {
    icon: "🥟",
    title: "小菜升級特權",
    desc: "今天點餐可任選一道小菜或湯品，由同桌猜拳最輸的人買單！接著擲骰決定餐廳！",
    keepTurnTask: "🥟 猜拳輸家請小菜"
  }
];

// 命運卡庫（抽完後一定會繼續移動或再骰一次選出餐廳）
const fateCards = [
  {
    icon: "⏪",
    title: "球拍忘在球場啦！",
    desc: "折返跑回球場拿裝備！棋子往後退 2 格決定餐廳！",
    moveSteps: -2,
    actionText: "🏃 往後退 2 格"
  },
  {
    icon: "💸",
    title: "月底吃土警戒線",
    desc: "本餐個人預算限制在 100 元以內，點超過的人要幫大家拿餐具！接下任務後繼續擲骰選餐廳！",
    keepTurnTask: "💸 個人預算百元內"
  },
  {
    icon: "⚡",
    title: "肚子餓到狂奔",
    desc: "練完球血糖過低！棋子直接往前衝刺 3 格搶位子！",
    moveSteps: 3,
    actionText: "⚡ 衝刺 3 格"
  },
  {
    icon: "🌶️",
    title: "嗜辣勇者試煉",
    desc: "今天的餐點或沾醬必須加辣（至少微辣）！接下任務後繼續擲骰決定餐廳！",
    keepTurnTask: "🌶️ 餐點必須加辣"
  },
  {
    icon: "🤝",
    title: "共享美食家任務",
    desc: "必須與右邊的隊友點不同的主餐並交換試吃！接下任務後繼續擲骰決定餐廳！",
    keepTurnTask: "🤝 與隊友交換試吃"
  }
];

const REVIEWS_KEY = "tku_food_monopoly_reviews_v1";
const GAME_STATE_KEY = "tku_food_monopoly_state_v4";
const playerColors = ["#ef4444", "#2563eb", "#059669", "#7c3aed"];

function createDefaultPlayers() {
  return [
    { id: 0, name: "玩家 1", color: playerColors[0], pos: 0 },
    { id: 1, name: "玩家 2", color: playerColors[1], pos: 0 }
  ];
}

let players = createDefaultPlayers();
let currentPlayerIdx = 0;
let reviewRecords = [];
let activeTab = "store";
let selectedStoreId = "all";
let isMoving = false;
let rollCounter = 0;
let posBeforeRoll = 0;
let pendingEventEffect = null;
let activePlayerTasks = {};

function loadAllData() {
  try {
    const rawReviews = localStorage.getItem(REVIEWS_KEY);
    if (rawReviews) {
      const parsed = JSON.parse(rawReviews);
      if (Array.isArray(parsed)) {
        reviewRecords = parsed.map(rec => {
          const matchedTile = boardData.find(t => t.type === "restaurant" && t.name === rec.storeName);
          if (matchedTile) rec.tileId = matchedTile.id;
          return rec;
        });
      }
    }

    const rawState = localStorage.getItem(GAME_STATE_KEY);
    if (rawState) {
      const state = JSON.parse(rawState);
      if (Array.isArray(state.players) && state.players.length >= 1) {
        players = state.players.map((p, idx) => ({
          id: typeof p.id === "number" ? p.id : idx,
          name: p.name || `玩家 ${idx + 1}`,
          color: p.color || playerColors[idx % playerColors.length],
          pos: typeof p.pos === "number" && p.pos >= 0 && p.pos < boardData.length ? p.pos : 0
        }));
      }
      if (typeof state.currentPlayerIdx === "number" && state.currentPlayerIdx >= 0 && state.currentPlayerIdx < players.length) {
        currentPlayerIdx = state.currentPlayerIdx;
      }
    }
  } catch (e) {
    console.warn("讀取存檔失敗，使用預設狀態", e);
  }
}

function saveReviews() {
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviewRecords));
}

function saveGameState() {
  localStorage.setItem(GAME_STATE_KEY, JSON.stringify({ players, currentPlayerIdx }));
}

// 彩帶特效
const fxCanvas = document.getElementById("fx-canvas");
const fxCtx = fxCanvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  fxCanvas.width = window.innerWidth;
  fxCanvas.height = window.innerHeight;
}
window.addEventListener("resize", () => {
  resizeCanvas();
  positionAllTokens(false);
});
resizeCanvas();

function launchConfetti() {
  const colors = ["#ef4444", "#10b981", "#3b82f6", "#eab308", "#ec4899"];
  for (let i = 0; i < 65; i++) {
    particles.push({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.7) * 16,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 1
    });
  }
}

function animateConfetti() {
  fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
  particles.forEach((p, idx) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.35;
    p.life -= 0.018;
    fxCtx.globalAlpha = Math.max(0, p.life);
    fxCtx.fillStyle = p.color;
    fxCtx.fillRect(p.x, p.y, p.size, p.size);
    if (p.life <= 0) particles.splice(idx, 1);
  });
  requestAnimationFrame(animateConfetti);
}
animateConfetti();

// 3D 六面骰角度
const faceRotations = {
  1: { x: 0, y: 0 },
  2: { x: -90, y: 0 },
  3: { x: 0, y: -90 },
  4: { x: 0, y: 90 },
  5: { x: 90, y: 0 },
  6: { x: 0, y: 180 }
};

function initGame() {
  const boardEl = document.getElementById("board");
  boardEl.querySelectorAll(".tile").forEach(el => el.remove());

  const selectEl = document.getElementById("category-select");
  const modalSelectEl = document.getElementById("review-store-select");
  selectEl.innerHTML = `<option value="all">🌟 全部淡江店家評論</option>`;
  modalSelectEl.innerHTML = "";

  boardData.forEach(tile => {
    const div = document.createElement("div");
    let extraClass = "";
    if (tile.isGo) extraClass = "corner-go";
    if (tile.type === "chance") extraClass = "tile-chance";
    if (tile.type === "fate") extraClass = "tile-fate";

    div.className = `tile side-${tile.side} ${extraClass}`.trim();
    div.id = `tile-${tile.id}`;
    div.style.gridArea = tile.grid;

    if (tile.type === "restaurant") {
      div.style.cursor = "pointer";
      div.title = `點擊查看「${tile.name}」的點餐攻略`;
      div.innerHTML = `
        <div class="tile-color-bar" style="background:${tile.color}"></div>
        <div class="tile-body">
          <div class="tile-icon">${tile.icon}</div>
          <div class="tile-name">${tile.name}</div>
        </div>
      `;
      div.addEventListener("click", () => switchToStoreReviews(String(tile.id)));

      const opt1 = document.createElement("option");
      opt1.value = String(tile.id);
      opt1.textContent = `${tile.icon} ${tile.name}`;
      selectEl.appendChild(opt1);

      const opt2 = document.createElement("option");
      opt2.value = String(tile.id);
      opt2.textContent = `${tile.icon} ${tile.name}`;
      modalSelectEl.appendChild(opt2);
    } else {
      div.innerHTML = `
        <div class="tile-body">
          <div class="tile-icon">${tile.icon}</div>
          <div class="tile-name">${tile.name}</div>
          ${tile.isGo ? `<span class="go-arrow">←</span>` : ""}
        </div>
      `;
    }

    boardEl.appendChild(div);
  });

  renderPlayerStatus();
  renderTokens();
  updateTurnBanner();
  renderWall();
}

function updateTurnBanner() {
  const player = players[currentPlayerIdx];
  const task = activePlayerTasks[player.id];
  const bannerEl = document.getElementById("dice-result");
  bannerEl.textContent = task
    ? `輪到 ${player.name}（${task}）`
    : `輪到 ${player.name}`;
}

function renderPlayerStatus() {
  const statusEl = document.getElementById("player-status");
  statusEl.innerHTML = players.map((p, idx) => `
    <span class="player-pill ${idx === currentPlayerIdx ? "active" : ""}" 
          style="background:${p.color}" 
          data-idx="${idx}"
          title="點擊修改「${escapeHTML(p.name)}」的名稱">
      ${escapeHTML(p.name)}
    </span>
  `).join("");

  statusEl.querySelectorAll(".player-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      const idx = Number(pill.dataset.idx);
      const newName = prompt("輸入新的玩家名稱：", players[idx].name);
      if (newName && newName.trim()) {
        players[idx].name = newName.trim().slice(0, 10);
        saveGameState();
        renderPlayerStatus();
        updateTurnBanner();
      }
    });
  });
}

function renderTokens() {
  const layer = document.getElementById("token-layer");
  layer.innerHTML = "";
  players.forEach((p, idx) => {
    const token = document.createElement("div");
    token.className = "player-token";
    token.id = `token-${p.id}`;
    token.style.backgroundColor = p.color;
    token.textContent = `P${idx + 1}`;
    layer.appendChild(token);
  });
  positionAllTokens(false);
}

function positionAllTokens(animateHop = false) {
  const baseOffsets = [
    { x: -1, y: -1 },
    { x: 1, y: -1 },
    { x: -1, y: 1 },
    { x: 1, y: 1 }
  ];

  players.forEach((p, idx) => {
    const tileEl = document.getElementById(`tile-${p.pos}`);
    const tokenEl = document.getElementById(`token-${p.id}`);
    if (!tileEl || !tokenEl) return;

    const spread = Math.min(tileEl.offsetWidth, tileEl.offsetHeight) * 0.2;
    const centerX = tileEl.offsetLeft + tileEl.offsetWidth / 2 + baseOffsets[idx].x * spread;
    const centerY = tileEl.offsetTop + tileEl.offsetHeight / 2 + baseOffsets[idx].y * spread;

    tokenEl.style.left = `${centerX}px`;
    tokenEl.style.top = `${centerY}px`;

    if (animateHop && idx === currentPlayerIdx) {
      tokenEl.classList.remove("hopping");
      void tokenEl.offsetWidth;
      tokenEl.classList.add("hopping");
    }
  });
}

// 擲骰與移動
const rollBtn = document.getElementById("roll-btn");
rollBtn.addEventListener("click", async () => {
  if (isMoving) return;
  isMoving = true;
  rollBtn.disabled = true;
  rollCounter++;

  const player = players[currentPlayerIdx];
  posBeforeRoll = player.pos;

  const steps = Math.floor(Math.random() * 6) + 1;
  spin3DDice("cube-1", steps, rollCounter);

  document.getElementById("dice-result").textContent = `${player.name} 擲出 ${steps} 點！`;

  await new Promise(r => setTimeout(r, 900));
  await movePlayerSteps(player, steps);
  handleLanding(player);
});

function spin3DDice(cubeId, targetFace, spinSeed) {
  const cube = document.getElementById(cubeId);
  const rot = faceRotations[targetFace];
  const extraSpins = spinSeed % 2 === 0 ? 720 : 1080;
  cube.style.transform = `rotateX(${rot.x + extraSpins}deg) rotateY(${rot.y + extraSpins}deg)`;
}

async function movePlayerSteps(player, steps) {
  const stepDir = steps >= 0 ? 1 : -1;
  const absSteps = Math.abs(steps);

  for (let i = 0; i < absSteps; i++) {
    player.pos = (player.pos + stepDir + boardData.length) % boardData.length;
    positionAllTokens(true);
    await new Promise(r => setTimeout(r, 220));
  }

  const landedTile = document.getElementById(`tile-${player.pos}`);
  if (landedTile) {
    landedTile.classList.remove("tile-landed");
    void landedTile.offsetWidth;
    landedTile.classList.add("tile-landed");
  }
}

// 踩點事件處理（確保機會/命運之後一定能繼續決定餐廳）
function handleLanding(player) {
  const tile = boardData[player.pos];
  const badgeEl = document.getElementById("decision-badge");
  const previewEl = document.getElementById("decision-preview");
  const rerollBtn = document.getElementById("reroll-btn");
  const eventActionBtn = document.getElementById("event-action-btn");
  const confirmBtn = document.getElementById("confirm-eat-btn");
  const actionsEl = document.querySelector("#decision-modal .modal-actions");

  actionsEl.querySelectorAll(".dynamic-event-btn").forEach(btn => btn.remove());
  badgeEl.className = "badge";
  rerollBtn.classList.remove("hidden");
  eventActionBtn.classList.add("hidden");
  confirmBtn.classList.remove("hidden");
  pendingEventEffect = null;

  const activeTask = activePlayerTasks[player.id];

  if (tile.type === "restaurant") {
    switchToStoreReviews(String(tile.id));
    document.getElementById("decision-hero").textContent = tile.icon;
    badgeEl.textContent = `🎯 ${player.name} 抽中今日晚餐`;
    document.getElementById("decision-title").textContent = tile.name;
    document.getElementById("decision-desc").textContent = activeTask
      ? `別忘了身上任務【${activeTask}】！看看隊友推薦點什麼就出發！`
      : "路上先看看隊友推薦點什麼，確認後就出發開吃！";
    confirmBtn.textContent = "🎉 就吃這家！（換下一位）";

    const storeReviews = reviewRecords.filter(r => String(r.tileId) === String(tile.id));
    if (storeReviews.length > 0) {
      const avg = (storeReviews.reduce((s, r) => s + Number(r.score), 0) / storeReviews.length).toFixed(1);
      const topList = [...storeReviews]
        .sort((a, b) => (b.likes || 0) - (a.likes || 0) || b.score - a.score)
        .slice(0, 3)
        .map(r => `
          <div class="preview-item">
            <strong>⭐ ${r.score}分（${escapeHTML(r.playerName)}）</strong>：${escapeHTML(r.reason)}
          </div>
        `).join("");

      previewEl.innerHTML = `
        <div class="preview-header">
          <span>📋 隊友點餐攻略</span>
          <span>平均 ⭐ ${avg} / 5.0（${storeReviews.length} 則）</span>
        </div>
        ${topList}
      `;
    } else {
      previewEl.innerHTML = `
        <div class="preview-empty">
          🍽️ 這間店目前還沒有評論紀錄，吃完記得點右側「✍️ 寫評論」搶下首評！
        </div>
      `;
    }
    previewEl.classList.remove("hidden");
  } else if (tile.type === "chance" || tile.type === "fate") {
    const isChance = tile.type === "chance";
    const deck = isChance ? chanceCards : fateCards;
    const card = deck[Math.floor(Math.random() * deck.length)];

    document.getElementById("decision-hero").textContent = card.icon;
    badgeEl.textContent = isChance ? `❓ ${player.name} 抽中【機會卡】` : `🔮 ${player.name} 抽中【命運卡】`;
    badgeEl.classList.add(isChance ? "chance-badge" : "fate-badge");
    document.getElementById("decision-title").textContent = card.title;
    document.getElementById("decision-desc").textContent = card.desc;
    previewEl.classList.add("hidden");

    rerollBtn.classList.add("hidden");
    confirmBtn.classList.add("hidden");

    if (card.chooseNeighbor) {
      const prevIdx = (player.pos - 1 + boardData.length) % boardData.length;
      const nextIdx = (player.pos + 1) % boardData.length;
      const prevTile = boardData[prevIdx];
      const nextTile = boardData[nextIdx];

      const prevBtn = document.createElement("button");
      prevBtn.type = "button";
      prevBtn.className = "roll-btn dynamic-event-btn";
      prevBtn.textContent = `⬅️ ${prevTile.icon} ${prevTile.name}`;
      prevBtn.addEventListener("click", async () => {
        document.getElementById("decision-modal").classList.add("hidden");
        await movePlayerSteps(player, -1);
        handleLanding(player);
      });

      const nextBtn = document.createElement("button");
      nextBtn.type = "button";
      nextBtn.className = "roll-btn dynamic-event-btn";
      nextBtn.textContent = `➡️ ${nextTile.icon} ${nextTile.name}`;
      nextBtn.addEventListener("click", async () => {
        document.getElementById("decision-modal").classList.add("hidden");
        await movePlayerSteps(player, 1);
        handleLanding(player);
      });

      actionsEl.appendChild(prevBtn);
      actionsEl.appendChild(nextBtn);
    } else {
      pendingEventEffect = card;
      eventActionBtn.textContent = card.actionText || "🎲 接下任務，繼續擲骰選餐廳！";
      eventActionBtn.classList.remove("hidden");
    }
  } else {
    document.getElementById("decision-hero").textContent = tile.icon;
    badgeEl.textContent = "✨ 自由美食特區";
    document.getElementById("decision-title").textContent = tile.name;
    document.getElementById("decision-desc").textContent = activeTask
      ? `恭喜 ${player.name} 獲得自由選擇權！記得搭配身上任務【${activeTask}】在周邊挑一間吃！`
      : `恭喜 ${player.name} 獲得「自由選擇權」，今天在【${tile.name}】周邊隨意挑一間吃！`;
    confirmBtn.textContent = "🎉 就吃這區！（換下一位）";
    previewEl.classList.add("hidden");
  }

  document.getElementById("decision-modal").classList.remove("hidden");
}

// 執行機會/命運的效果（移動、重擲或接下任務後繼續由同一位玩家擲骰）
document.getElementById("event-action-btn").addEventListener("click", async () => {
  const effect = pendingEventEffect;
  document.getElementById("decision-modal").classList.add("hidden");
  if (!effect) return;

  const player = players[currentPlayerIdx];

  if (effect.reroll) {
    isMoving = false;
    rollBtn.disabled = false;
    document.getElementById("dice-result").textContent = `${player.name} 獲得免費重擲，再骰一次選餐廳！`;
    return;
  }

  if (effect.keepTurnTask) {
    activePlayerTasks[player.id] = effect.keepTurnTask;
    isMoving = false;
    rollBtn.disabled = false;
    updateTurnBanner();
    return;
  }

  if (typeof effect.moveSteps === "number") {
    const dirText = effect.moveSteps > 0 ? `前進 ${effect.moveSteps} 格` : `後退 ${Math.abs(effect.moveSteps)} 格`;
    document.getElementById("dice-result").textContent = `${player.name} ${dirText}！`;
    await movePlayerSteps(player, effect.moveSteps);
    handleLanding(player);
  }
});

document.getElementById("confirm-eat-btn").addEventListener("click", () => {
  const player = players[currentPlayerIdx];
  delete activePlayerTasks[player.id];

  document.getElementById("decision-modal").classList.add("hidden");
  launchConfetti();
  currentPlayerIdx = (currentPlayerIdx + 1) % players.length;
  isMoving = false;
  rollBtn.disabled = false;
  renderPlayerStatus();
  updateTurnBanner();
  saveGameState();
});

document.getElementById("reroll-btn").addEventListener("click", () => {
  const player = players[currentPlayerIdx];
  player.pos = posBeforeRoll;
  positionAllTokens(false);
  document.getElementById("decision-modal").classList.add("hidden");
  isMoving = false;
  rollBtn.disabled = false;
  updateTurnBanner();
});

// 評論牆 CRUD
const reviewModal = document.getElementById("review-modal");
const reviewForm = document.getElementById("review-form");

document.getElementById("open-review-btn").addEventListener("click", () => {
  document.getElementById("edit-record-id").value = "";
  document.getElementById("review-modal-title").textContent = "新增店家評論";
  reviewForm.reset();
  document.getElementById("food-score").value = "5";

  const firstRestaurant = boardData.find(t => t.type === "restaurant");
  const defaultStore = selectedStoreId !== "all" ? selectedStoreId : String(firstRestaurant.id);
  document.getElementById("review-store-select").value = defaultStore;
  reviewModal.classList.remove("hidden");
});

document.getElementById("cancel-review-btn").addEventListener("click", () => {
  reviewModal.classList.add("hidden");
});

reviewForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const editId = document.getElementById("edit-record-id").value;
  const storeId = Number(document.getElementById("review-store-select").value);
  const tile = boardData.find(t => t.id === storeId);
  const score = Number(document.getElementById("food-score").value);
  const reason = document.getElementById("food-comment").value.trim();

  const authorIdx = (currentPlayerIdx - 1 + players.length) % players.length;
  const author = players[authorIdx];

  if (editId) {
    const target = reviewRecords.find(r => String(r.id) === String(editId));
    if (target) {
      target.tileId = tile.id;
      target.storeName = tile.name;
      target.storeIcon = tile.icon;
      target.score = score;
      target.reason = reason;
    }
  } else {
    reviewRecords.unshift({
      id: Date.now(),
      tileId: tile.id,
      storeName: tile.name,
      storeIcon: tile.icon,
      score,
      reason,
      playerName: author.name,
      playerColor: author.color,
      likes: 1,
      timestamp: new Date().toLocaleDateString("zh-TW", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })
    });
    launchConfetti();
  }

  saveReviews();
  reviewModal.classList.add("hidden");
  switchToStoreReviews(String(tile.id));
});

window.editRecord = function (recordId) {
  const target = reviewRecords.find(r => r.id === recordId);
  if (!target) return;
  document.getElementById("edit-record-id").value = String(target.id);
  document.getElementById("review-modal-title").textContent = "編輯店家評論";
  document.getElementById("review-store-select").value = String(target.tileId);
  document.getElementById("food-score").value = String(target.score);
  document.getElementById("food-comment").value = target.reason;
  reviewModal.classList.remove("hidden");
};

window.deleteRecord = function (recordId) {
  if (!confirm("確定要刪除這則評論嗎？")) return;
  reviewRecords = reviewRecords.filter(r => r.id !== recordId);
  saveReviews();
  renderWall();
};

window.upvoteRecord = function (recordId) {
  const target = reviewRecords.find(r => r.id === recordId);
  if (target) {
    target.likes = (target.likes || 0) + 1;
    saveReviews();
    renderWall();
  }
};

function switchToStoreReviews(storeId) {
  activeTab = "store";
  selectedStoreId = storeId;
  document.getElementById("tab-store").classList.add("active");
  document.getElementById("tab-all").classList.remove("active");
  document.getElementById("category-bar").classList.remove("hidden");
  document.getElementById("category-select").value = storeId;
  renderWall();
}

function renderStars(score) {
  const s = Math.max(1, Math.min(5, Number(score) || 5));
  return "⭐".repeat(s) + `<span class="score-num">${s}.0 分</span>`;
}

function renderWall() {
  const feedList = document.getElementById("feed-list");
  const titleEl = document.getElementById("wall-title");
  const subtitleEl = document.getElementById("wall-subtitle");
  const countBadge = document.getElementById("checkin-count");
  const summaryEl = document.getElementById("store-summary");

  document.querySelectorAll(".tile").forEach(el => el.classList.remove("selected-tile"));

  let filteredRecords = reviewRecords;

  if (activeTab === "store" && selectedStoreId !== "all") {
    const tileEl = document.getElementById(`tile-${selectedStoreId}`);
    if (tileEl) tileEl.classList.add("selected-tile");

    const tile = boardData.find(t => String(t.id) === String(selectedStoreId));
    filteredRecords = reviewRecords.filter(r => String(r.tileId) === String(selectedStoreId));

    if (tile) {
      titleEl.textContent = `${tile.icon} ${tile.name}`;
      subtitleEl.textContent = `查看大家給「${tile.name}」的推薦菜色與評分`;
    }

    if (filteredRecords.length > 0) {
      const avg = (filteredRecords.reduce((sum, r) => sum + Number(r.score), 0) / filteredRecords.length).toFixed(1);
      summaryEl.innerHTML = `
        <div class="summary-left">
          <span class="summary-label">店家平均評分</span>
          <div class="summary-score">⭐ ${avg} <span>/ 5.0 分</span></div>
        </div>
        <div class="summary-right">共 ${filteredRecords.length} 則評價</div>
      `;
      summaryEl.classList.remove("hidden");
    } else {
      summaryEl.classList.add("hidden");
    }
  } else {
    summaryEl.classList.add("hidden");
    if (activeTab === "store") {
      titleEl.textContent = "⭐ 淡江店家點餐攻略";
      subtitleEl.textContent = "點擊棋盤店家或下方選單查看推薦菜色";
    } else {
      titleEl.textContent = "💬 全部歷史評論";
      subtitleEl.textContent = `共累積 ${reviewRecords.length} 則真實用餐評論`;
    }
  }

  countBadge.textContent = `${filteredRecords.length} 則`;

  if (filteredRecords.length === 0) {
    feedList.innerHTML = `
      <div class="empty-state">
        <div class="empty-emoji">📝</div>
        <p>目前還沒有這間店的評論！<br>吃完飯後點右上角「✍️ 寫評論」分享必點菜色吧！</p>
      </div>`;
    return;
  }

  feedList.innerHTML = filteredRecords.map(rec => `
    <div class="feed-card">
      <div class="review-top-row">
        <div class="review-author-group">
          <strong style="color:${rec.playerColor}">${escapeHTML(rec.playerName)}</strong>
          <span class="store-tag">${rec.storeIcon} ${escapeHTML(rec.storeName)}</span>
        </div>
        <div class="card-crud-actions">
          <button class="crud-mini-btn" onclick="editRecord(${rec.id})" title="編輯評論">✏️</button>
          <button class="crud-mini-btn del" onclick="deleteRecord(${rec.id})" title="刪除評論">🗑️</button>
        </div>
      </div>

      <div class="review-score-row">
        <div class="star-display">${renderStars(rec.score)}</div>
        <button class="upvote-btn" onclick="upvoteRecord(${rec.id})" title="認同這則推薦">👍 ${rec.likes || 0}</button>
      </div>

      <div class="feed-comment">
        <span class="reason-label">推薦與評價：</span>${escapeHTML(rec.reason)}
      </div>

      <div class="review-time">${rec.timestamp || ""}</div>
    </div>
  `).join("");
}

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/'/g, "'")
}

document.getElementById("tab-store").addEventListener("click", () => {
  activeTab = "store";
  document.getElementById("tab-store").classList.add("active");
  document.getElementById("tab-all").classList.remove("active");
  document.getElementById("category-bar").classList.remove("hidden");
  renderWall();
});

document.getElementById("tab-all").addEventListener("click", () => {
  activeTab = "all";
  document.getElementById("tab-all").classList.add("active");
  document.getElementById("tab-store").classList.remove("active");
  document.getElementById("category-bar").classList.add("hidden");
  renderWall();
});

document.getElementById("category-select").addEventListener("change", (e) => {
  selectedStoreId = e.target.value;
  renderWall();
});

// 遊戲規則彈窗控制
const rulesModal = document.getElementById("rules-modal");
document.getElementById("rules-btn").addEventListener("click", () => {
  rulesModal.classList.remove("hidden");
});
document.getElementById("close-rules-btn").addEventListener("click", () => {
  rulesModal.classList.add("hidden");
});
rulesModal.addEventListener("click", (e) => {
  if (e.target === rulesModal) {
    rulesModal.classList.add("hidden");
  }
});

// 頂部控制按鈕
document.getElementById("add-player-btn").addEventListener("click", () => {
  if (isMoving) return;
  if (players.length >= 4) return alert("最多支援 4 位玩家！");
  const idx = players.length;
  players.push({ id: idx, name: `玩家 ${idx + 1}`, color: playerColors[idx], pos: 0 });
  saveGameState();
  renderPlayerStatus();
  renderTokens();
});

document.getElementById("remove-player-btn").addEventListener("click", () => {
  if (isMoving) return;
  if (players.length <= 1) return alert("至少需要保留 1 位玩家！");
  const removed = players.pop();
  if (removed) delete activePlayerTasks[removed.id];
  if (currentPlayerIdx >= players.length) currentPlayerIdx = 0;
  saveGameState();
  renderPlayerStatus();
  renderTokens();
  updateTurnBanner();
});

document.getElementById("reset-players-btn").addEventListener("click", () => {
  if (isMoving) return;
  if (!confirm("確定要將玩家人數與名稱重置為預設的「玩家 1、玩家 2」嗎？（歷史評論會完整保留）")) return;
  players = createDefaultPlayers();
  activePlayerTasks = {};
  currentPlayerIdx = 0;
  isMoving = false;
  rollBtn.disabled = false;
  saveGameState();
  renderPlayerStatus();
  renderTokens();
  updateTurnBanner();
});

document.getElementById("reset-btn").addEventListener("click", () => {
  if (!confirm("確定要將目前所有棋子退回起點 GO 並從第一位玩家重新開始嗎？（歷史評論會完整保留）")) return;
  players.forEach(p => p.pos = 0);
  activePlayerTasks = {};
  currentPlayerIdx = 0;
  isMoving = false;
  rollBtn.disabled = false;
  saveGameState();
  switchToStoreReviews("all");
  initGame();
});

document.getElementById("clear-history-btn").addEventListener("click", () => {
  if (confirm("確定要清空所有淡江店家的歷史評論紀錄嗎？此動作無法復原！")) {
    reviewRecords = [];
    saveReviews();
    renderWall();
  }
});

// 啟動遊戲
function startApp() {
  const boardEl = document.getElementById("board");
  if (boardEl && typeof ResizeObserver !== "undefined") {
    new ResizeObserver(() => positionAllTokens(false)).observe(boardEl);
  }
  loadAllData();
  initGame();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startApp);
} else {
  startApp();
}
