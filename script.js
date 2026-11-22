// 1. 經典大富翁 24 格順時針路徑（淡江大學周邊美食店家）
const boardData = [
  // 右下角落：起點 GO
  { id: 0, name: "起點 GO", icon: "🚩", type: "special", side: "corner", isGo: true, grid: "7 / 7" },

  // 下排（由右往左）：棕色組 & 淺藍組
  { id: 1, name: "欣宏牛肉麵", icon: "🍜", type: "restaurant", side: "bottom", color: "#8b5a2b", grid: "7 / 6" },
  { id: 2, name: "樂之屋", icon: "🍱", type: "restaurant", side: "bottom", color: "#8b5a2b", grid: "7 / 5" },
  { id: 3, name: "宵夜500", icon: "🌙", type: "restaurant", side: "bottom", color: "#38bdf8", grid: "7 / 4" },
  { id: 4, name: "滷獲至飽", icon: "🍲", type: "restaurant", side: "bottom", color: "#38bdf8", grid: "7 / 3" },
  { id: 5, name: "海盜灣漢堡", icon: "🍔", type: "restaurant", side: "bottom", color: "#38bdf8", grid: "7 / 2" },

  // 左下角落
  { id: 6, name: "大學城廣場", icon: "🤤", type: "special", side: "corner", grid: "7 / 1" },

  // 左排（由下往上）：粉紅組 & 橘色組
  { id: 7, name: "eat 窩", icon: "🍝", type: "restaurant", side: "left", color: "#ec4899", grid: "6 / 1" },
  { id: 8, name: "滄洲燒臘飯", icon: "🍖", type: "restaurant", side: "left", color: "#ec4899", grid: "5 / 1" },
  { id: 9, name: "牛狀元牛排", icon: "🥩", type: "restaurant", side: "left", color: "#f97316", grid: "4 / 1" },
  { id: 10, name: "無名蒸餃", icon: "🥟", type: "restaurant", side: "left", color: "#f97316", grid: "3 / 1" },
  { id: 11, name: "呷呼飽", icon: "🍚", type: "restaurant", side: "left", color: "#f97316", grid: "2 / 1" },

  // 左上角落
  { id: 12, name: "i 珍食", icon: "🎪", type: "special", side: "corner", grid: "1 / 1" },

  // 上排（由左往右）：紅色組 & 黃色組
  { id: 13, name: "大塊雞排", icon: "🍗", type: "restaurant", side: "top", color: "#ef4444", grid: "1 / 2" },
  { id: 14, name: "黑殿排骨飯", icon: "🍛", type: "restaurant", side: "top", color: "#ef4444", grid: "1 / 3" },
  { id: 15, name: "文化阿給", icon: "🥡", type: "restaurant", side: "top", color: "#eab308", grid: "1 / 4" },
  { id: 16, name: "金雞母關東煮", icon: "🍢", type: "restaurant", side: "top", color: "#eab308", grid: "1 / 5" },
  { id: 17, name: "原味豆花", icon: "🍧", type: "restaurant", side: "top", color: "#eab308", grid: "1 / 6" },

  // 右上角落
  { id: 18, name: "英專路夜市", icon: "🏮", type: "special", side: "corner", grid: "1 / 7" },

  // 右排（由上往下）：綠色組 & 深藍高級地段組
  { id: 19, name: "極鮮火鍋", icon: "🍲", type: "restaurant", side: "right", color: "#10b981", grid: "2 / 7" },
  { id: 20, name: "淡江滷味王", icon: "🥘", type: "restaurant", side: "right", color: "#10b981", grid: "3 / 7" },
  { id: 21, name: "北新路咖哩", icon: "🍛", type: "restaurant", side: "right", color: "#1d4ed8", grid: "4 / 7" },
  { id: 22, name: "宮燈大道咖啡", icon: "☕", type: "restaurant", side: "right", color: "#1d4ed8", grid: "5 / 7" },
  { id: 23, name: "淡水老街魚丸", icon: "🥣", type: "restaurant", side: "right", color: "#1d4ed8", grid: "6 / 7" }
];

// ==========================================
// LocalStorage 完整狀態持久化（玩家位置 + 輪次 + 評論）
// ==========================================
const REVIEWS_KEY = "tku_food_monopoly_reviews_v1";
const GAME_STATE_KEY = "tku_food_monopoly_state_v2";
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
let activeTab = "store"; // "store" | "all"
let selectedStoreId = "all";
let isMoving = false;
let rollCounter = 0;
let posBeforeRoll = 0;

function loadAllData() {
  try {
    const rawReviews = localStorage.getItem(REVIEWS_KEY);
    if (rawReviews) reviewRecords = JSON.parse(rawReviews);

    const rawState = localStorage.getItem(GAME_STATE_KEY);
    if (rawState) {
      const state = JSON.parse(rawState);
      if (Array.isArray(state.players) && state.players.length >= 1) {
        players = state.players;
      }
      if (typeof state.currentPlayerIdx === "number" && state.currentPlayerIdx < players.length) {
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
  localStorage.setItem(GAME_STATE_KEY, JSON.stringify({
    players,
    currentPlayerIdx
  }));
}

// 2. 全螢幕彩帶特效系統
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

// 3. 3D 六面骰 (D6) 1~6 點對應的正面旋轉角度
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
    div.className = `tile side-${tile.side} ${tile.isGo ? "corner-go" : ""}`;
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
      div.addEventListener("click", () => {
        switchToStoreReviews(String(tile.id));
      });

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
  document.getElementById("dice-result").textContent = `輪到 ${players[currentPlayerIdx].name}`;
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

// 4. 擲 3D 六面骰 (1~6) 與移動
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
  for (let i = 0; i < steps; i++) {
    player.pos = (player.pos + 1) % boardData.length;
    positionAllTokens(true);
    await new Promise(r => setTimeout(r, 240));
  }

  const landedTile = document.getElementById(`tile-${player.pos}`);
  landedTile.classList.remove("tile-landed");
  void landedTile.offsetWidth;
  landedTile.classList.add("tile-landed");
}

// 5. 踩點彈窗：顯示店家點餐攻略並定案今日晚餐
function handleLanding(player) {
  const tile = boardData[player.pos];
  const previewEl = document.getElementById("decision-preview");

  document.getElementById("decision-hero").textContent = tile.icon;
  document.getElementById("decision-title").textContent = tile.name;

  if (tile.type === "restaurant") {
    switchToStoreReviews(String(tile.id));
    document.getElementById("decision-badge").textContent = `🎯 ${player.name} 抽中今日晚餐`;
    document.getElementById("decision-desc").textContent = "路上先看看隊友推薦點什麼，確認後就出發開吃！";

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
  } else {
    document.getElementById("decision-badge").textContent = "✨ 自由美食特區";
    document.getElementById("decision-desc").textContent = `恭喜 ${player.name} 獲得「自由選擇權」，今天在【${tile.name}】周邊隨意挑一間吃！`;
    previewEl.classList.add("hidden");
  }

  document.getElementById("decision-modal").classList.remove("hidden");
}

document.getElementById("confirm-eat-btn").addEventListener("click", () => {
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
  document.getElementById("dice-result").textContent = `${player.name} 再重擲一次！`;
});

// 6. 評論牆 CRUD（新增、讀取、編輯、單則刪除、按讚）
const reviewModal = document.getElementById("review-modal");
const reviewForm = document.getElementById("review-form");

document.getElementById("open-review-btn").addEventListener("click", () => {
  document.getElementById("edit-record-id").value = "";
  document.getElementById("review-modal-title").textContent = "新增店家評論";
  reviewForm.reset();
  document.getElementById("food-score").value = "5";

  const defaultStore = selectedStoreId !== "all" ? selectedStoreId : "1";
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

    filteredRecords = reviewRecords.filter(r => String(r.tileId) === String(selectedStoreId));
    const tile = boardData.find(t => String(t.id) === String(selectedStoreId));
    titleEl.textContent = `${tile.icon} ${tile.name}`;
    subtitleEl.textContent = `查看大家給「${tile.name}」的推薦菜色與評分`;

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

// 7. 頂部控制按鈕（新增玩家 / 減少玩家 / 重置玩家 / 重置棋盤 / 清空評論）
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
  players.pop();
  if (currentPlayerIdx >= players.length) {
    currentPlayerIdx = 0;
  }
  saveGameState();
  renderPlayerStatus();
  renderTokens();
  updateTurnBanner();
});

document.getElementById("reset-players-btn").addEventListener("click", () => {
  if (isMoving) return;
  if (!confirm("確定要將玩家人數與名稱重置為預設的「玩家 1、玩家 2」嗎？（歷史評論會完整保留）")) return;
  players = createDefaultPlayers();
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

// 監聽棋盤尺寸變化，即時重新對齊棋子座標
new ResizeObserver(() => {
  positionAllTokens(false);
}).observe(document.getElementById("board"));

// 讀取存檔並啟動遊戲
loadAllData();
initGame();