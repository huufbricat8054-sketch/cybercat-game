/**
 * CyberCat - 主入口 & App组件
 */
import { getCurrentSlot, getTimeDisplay, getSlotProgress } from './engine/timeEngine.js';
import { energyEngine } from './core/energyEngine.js';
import { sendMessage, loadApiKey, setApiKey, clearHistory } from './ai/deepseekChat.js';
import './style.css';

// DOM 引用
const app = document.querySelector('#app');

let state = {
  messages: [],
  currentSlot: getCurrentSlot(),
  timeDisplay: getTimeDisplay(),
  apiKey: loadApiKey(),
  settingsOpen: false,
};

function render() {
  const slot = state.currentSlot;
  const progress = getSlotProgress(slot);
  const eLevel = energyEngine.getEnergyLevel();

  app.innerHTML = `
    <div class="app-container scene-${slot.scene}">
      <!-- 顶部状态栏 -->
      <div class="top-bar">
        <div class="time-display">🕐 ${state.timeDisplay}</div>
        <div class="slot-badge ${slot.mood}">${slot.label}</div>
        <div class="energy-display">
          <span class="energy-dot ${eLevel}"></span>
          ${energyEngine.energy}/15
        </div>
        <button class="settings-btn" id="settingsBtn">⚙️</button>
      </div>

      <!-- 场景标题 -->
      <div class="scene-title">
        <h2>${slot.scene === 'apartment' ? '🏠 黑客公寓' : slot.scene === 'office' ? '🏢 大厂工位' : slot.scene === 'sleep' ? '💤 深睡中' : '🌆 场景'}</h2>
        <p class="scene-desc">${slot.desc}</p>
      </div>

      <!-- 时区进度条 -->
      <div class="slot-progress">
        <div class="progress-bar" style="width: ${progress * 100}%"></div>
      </div>

      <!-- 对话区域 -->
      <div class="chat-area" id="chatArea">
        ${state.messages.length === 0 ? '<div class="welcome-msg">💬 给沈暮寻发条消息吧……</div>' : ''}
        ${state.messages.map((msg, i) => `
          <div class="msg ${msg.from === 'user' ? 'msg-user' : 'msg-ai'}">
            ${msg.from === 'ai' ? '<div class="avatar">🐱</div>' : ''}
            <div class="msg-bubble">${msg.text.replace(/\n/g, '<br>')}</div>
            ${msg.from === 'user' ? '<div class="avatar user-avatar">👤</div>' : ''}
          </div>
        `).join('')}
        <div id="chatBottom"></div>
      </div>

      <!-- 对话输入区 -->
      ${slot.id === 'sleep' ? `
        <div class="sleep-overlay">
          <div class="sleep-text">💤 沈暮寻已缩成猫团入睡……<br>等他醒来再聊吧</div>
          <div class="sleep-z">zzZ</div>
        </div>
      ` : `
        <div class="input-area">
          <input type="text" id="msgInput" placeholder="输入你想说的话……" ${energyEngine.energy <= 0 ? 'disabled' : ''}>
          <button id="sendBtn" class="send-btn" ${energyEngine.energy <= 0 ? 'disabled' : ''}>发送</button>
          ${energyEngine.energy <= 0 ? '<div class="energy-empty">⚠️ 沈暮寻今天太累了，让他休息一会</div>' : ''}
        </div>
      `}

      <!-- 设置面板 -->
      ${state.settingsOpen ? `
        <div class="settings-panel">
          <h3>设置</h3>
          <label>DeepSeek API Key</label>
          <input type="password" id="apiKeyInput" value="${state.apiKey}" placeholder="sk-...">
          <button id="saveApiKeyBtn">保存</button>
          <button id="clearHistoryBtn" class="danger-btn">清空对话历史</button>
          <button id="closeSettingsBtn">关闭</button>
        </div>
      ` : ''}

      <!-- Mock付费按钮 -->
      <div class="pay-bar">
        <button class="pay-btn coffee-btn" id="coffeeBtn">☕ 请杯冰美式 (2元)</button>
        <button class="pay-btn cocoa-btn" id="cocoaBtn">🍫 深夜续命热可可 (6元)</button>
      </div>
    </div>
  `;

  attachEvents();
  scrollToBottom();
}

function scrollToBottom() {
  setTimeout(() => {
    const bottom = document.getElementById('chatBottom');
    if (bottom) bottom.scrollIntoView({ behavior: 'smooth' });
  }, 50);
}

function attachEvents() {
  // 发送
  const sendBtn = document.getElementById('sendBtn');
  const msgInput = document.getElementById('msgInput');
  if (sendBtn && msgInput) {
    const doSend = async () => {
      const text = msgInput.value.trim();
      if (!text) return;
      msgInput.value = '';
      state.messages.push({ text, from: 'user' });
      render();
      const reply = await sendMessage(text);
      state.messages.push({ text: reply.text, from: reply.from });
      render();
    };
    sendBtn.addEventListener('click', doSend);
    msgInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') doSend(); });
    msgInput.focus();
  }

  // 设置
  const settingsBtn = document.getElementById('settingsBtn');
  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      state.settingsOpen = !state.settingsOpen;
      render();
    });
  }
  const saveKeyBtn = document.getElementById('saveApiKeyBtn');
  if (saveKeyBtn) {
    saveKeyBtn.addEventListener('click', () => {
      const key = document.getElementById('apiKeyInput').value;
      setApiKey(key);
      state.apiKey = key;
      state.settingsOpen = false;
      render();
    });
  }
  const clearBtn = document.getElementById('clearHistoryBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      clearHistory();
      state.messages = [];
      state.settingsOpen = false;
      render();
    });
  }
  const closeBtn = document.getElementById('closeSettingsBtn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      state.settingsOpen = false;
      render();
    });
  }

  // Mock付费
  const coffeeBtn = document.getElementById('coffeeBtn');
  if (coffeeBtn) {
    coffeeBtn.addEventListener('click', () => {
      energyEngine.boost(15);
      state.messages.push({
        text: "（你扫码买了一杯冰美式。几分钟后，外卖小哥把咖啡放到了他桌上。他别扭地移开视线，猫耳却不争气地抖了抖）……谢了。",
        from: 'system'
      });
      render();
    });
  }
  const cocoaBtn = document.getElementById('cocoaBtn');
  if (cocoaBtn) {
    cocoaBtn.addEventListener('click', () => {
      state.messages.push({
        text: "（深夜的公寓里，你递过一杯热可可。他愣了一下，然后别过脸去，尾巴却不自觉地卷上了你的手腕）……你别以为这样就能收买我。",
        from: 'system'
      });
      render();
    });
  }
}

// 时钟更新
setInterval(() => {
  const newSlot = getCurrentSlot();
  const newTime = getTimeDisplay();
  if (newSlot.id !== state.currentSlot.id || newTime !== state.timeDisplay) {
    state.currentSlot = newSlot;
    state.timeDisplay = newTime;
    if (newSlot.id === 'sleep') {
      // 睡眠时段锁定输入
    }
    render();
  }
}, 1000);

// 能量更新监听
energyEngine.onEnergyChange(() => {
  render();
});

// 初始渲染
render();

// 如果没有保存的API Key，弹出设置
if (!state.apiKey) {
  state.settingsOpen = true;
  render();
}
