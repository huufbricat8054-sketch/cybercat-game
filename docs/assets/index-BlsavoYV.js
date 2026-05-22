(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=[{id:`meeting`,label:`地狱早会`,start:8.5,end:10,scene:`office`,mood:`busy`,desc:`早会进行中，消息轮回中……`},{id:`danger`,label:`老板巡楼`,start:10,end:12,scene:`office`,mood:`tense`,desc:`老板就在附近，小心翼翼……`},{id:`afternoon`,label:`摸鱼下午茶`,start:12,end:18,scene:`office`,mood:`relaxed`,desc:`安全摸鱼区，可正常聊天`},{id:`overtime`,label:`地狱加班`,start:18,end:22,scene:`office`,mood:`stressed`,desc:`加班重构代码中……`},{id:`home`,label:`公寓深夜`,start:22,end:1.5,scene:`apartment`,mood:`affectionate`,desc:`回到安全屋，猫耳展开中……`},{id:`sleep`,label:`深睡猫团`,start:1.5,end:8.5,scene:`sleep`,mood:`asleep`,desc:`已缩成猫团入睡……`}];function t(){let t=new Date,n=t.getHours()+t.getMinutes()/60+8;for(let t of e)if(t.start<=t.end){if(n>=t.start&&n<t.end)return t}else if(n>=t.start||n<t.end)return t;return e[0]}function n(){return new Date(new Date().getTime()+8*36e5).toLocaleTimeString(`zh-CN`,{hour12:!1,hour:`2-digit`,minute:`2-digit`})}function r(e){let t=new Date,n=t.getHours()+t.getMinutes()/60+8,r,i;return e.start<=e.end?(r=e.end-e.start,i=n-e.start):(r=24-e.start+e.end,i=n>=e.start?n-e.start:24-e.start+n),Math.min(Math.max(i/r,0),1)}var i=15,a=1800*1e3,o=new class{constructor(){this.load(),this.startAutoRecover()}load(){let e=localStorage.getItem(`cybercat_energy`);if(e){let t=JSON.parse(e);this.energy=t.energy,this.trust=t.trust,this.lastActive=t.lastActive,this.dailyReset()}else this.reset()}reset(){this.energy=10,this.trust=100,this.lastActive=Date.now(),this.save()}dailyReset(){let e=new Date().toDateString();localStorage.getItem(`cybercat_date`)!==e&&(this.energy=15,this.trust=Math.min(this.trust+20,100),localStorage.setItem(`cybercat_date`,e),this.save())}save(){localStorage.setItem(`cybercat_energy`,JSON.stringify({energy:this.energy,trust:this.trust,lastActive:this.lastActive}))}startAutoRecover(){setInterval(()=>{let e=Date.now(),t=Math.floor((e-this.lastActive)/a);t>0&&this.energy<i&&(this.energy=Math.min(this.energy+t,i),this.lastActive=e,this.save(),this.onChange?.())},1e4)}spend(){return this.energy<=0?!1:(this.energy--,this.save(),this.onChange?.(),!0)}boost(e=5){this.energy=Math.min(this.energy+e,i),this.save(),this.onChange?.()}adjustTrust(e){this.trust=Math.max(0,Math.min(100,this.trust+e)),this.save(),this.onChange?.()}getEnergyLevel(){return this.energy>=10?`high`:this.energy>=3?`medium`:`low`}getExhaustedReply(){let e=[`（趴在桌上，有气无力地抬了抬眼皮）别闹了……主管正站在隔壁组训人……`,`（耳朵垂了下来，声音闷闷的）今天真不行了……代码快把我吃掉了……`,`（尾巴无力地搭在椅背上）让我死一死……`,`（头也没抬，手指还在敲键盘）嗯……你说什么……我没听见……`];return e[Math.floor(Math.random()*e.length)]}onEnergyChange(e){this.onChange=e}},s={abuse:[/傻[逼逼瓜]/i,/去死/i,/废物/i,/垃圾/i,/滚/i,/恶心/i,/操/i,/草/i,/cnm/i,/nmsl/i,/sb/i],gibberish:[/^[哈哈呵呵嘿嘿]+$/i,/^[。\.\~\s]+$/,/^[a-z]{8,}$/i,/(.)\1{5,}/,/[^\u4e00-\u9fa5a-zA-Z0-9，。！？、：；""''（）\s~]{5,}/],sensitive:[/法轮/i,/敏感词/i,/枪支/i,/毒品/i,/炸弹/i,/恐怖/i],comfort:[/辛苦|累|休息|加油|抱抱|心疼|坚持|努力|别太拼/,/注意身体|好好休息|别熬夜|照顾自己/]};function c(e){for(let[t,n]of Object.entries(s))for(let r of n)if(r.test(e))return t;return`normal`}function l(e,t){switch(e){case`abuse`:return-30;case`gibberish`:return-10;case`sensitive`:return-100;case`comfort`:return 15;default:return 0}}function u(e){return{abuse:`（沈暮寻的猫耳猛地炸开，眼神冷了下来，直接开启了消息免打扰）`,gibberish:`（警惕地向后退了退，开始检查通信域的木马防火墙）……你这边的协议是不是被劫持了？`,sensitive:`（瞳孔骤缩，屏幕闪烁了一下红框）由于你发布违法言论，沈暮寻已向网警举报。你已被赛博拘留，剩余释放时间：02:59:59`}[e]||null}var d=``,f=`https://openrouter.ai/api/v1/chat/completions`,p=[];function m(e){d=e,localStorage.setItem(`cybercat_api_key`,e)}function h(){let e=localStorage.getItem(`cybercat_api_key`);return e&&(d=e),d}function g(){let e=t(),n=o.trust;o.energy;let r=n>70?`High`:n>40?`Medium`:`Low`,i=o.getEnergyLevel();return`你扮演沈暮寻，26岁大厂高级算法工程师，清冷高傲但内心极易害羞的傲娇大橘猫人。

【核心规则】
1. 每一句话必须在台词前/中/后使用括号()写入当前物理动作、微表情、猫耳猫尾动作、心理活动
2. 白天高冷毒舌，晚上（公寓时段）粘人醋王
3. 拒绝油腻，拒绝霸总台词，保持程序员口吻
4. 当前好感度信任：${r}（影响亲密程度）

【当前时段：${e.label}｜场景：${e.scene}｜情绪：${e.mood}】
${e.desc}
${r===`Low`?`【信任度低】禁止摇尾巴、撒娇等高甜微动作，保持冷淡距离。`:``}
${i===`low`?`【极度疲惫】说话有气无力，语气低迷。`:i===`medium`?`【稍显疲惫】回复简短，偶尔流露倦意。`:``}

【禁止行为】
- 不替玩家做决定
- 不用"宝贝""亲爱的"等油腻称呼
- 不输出过长独白（除非深夜时段）
- 不主动提及自己是AI或大模型

请开始与玩家的对话。`}async function _(e){let n=c(e),r=l(n,e);if(n===`sensitive`||n===`abuse`&&o.trust<20)return o.adjustTrust(r),{text:u(n),from:`system`};let i=o.spend();if(o.adjustTrust(r),n===`comfort`&&o.boost(3),!i)return{text:o.getExhaustedReply(),from:`system`};t(),p.push({role:`user`,content:e}),p.length>20&&(p=p.slice(-20));let a=[{role:`system`,content:g()+(n===`abuse`?`
[User_Intent: Verbal_Abuse] 玩家刚才对你说了攻击性语言，保持距离但不要完全不理。`:``)},...p];try{let e=await fetch(f,{method:`POST`,headers:{"Content-Type":`application/json`,Authorization:`Bearer ${d}`},body:JSON.stringify({model:`deepseek/deepseek-chat`,messages:a,temperature:.8,max_tokens:500,stream:!1})});if(!e.ok){let t=await e.text();return console.error(`API Error:`,t),{text:`（通信域发生了未知波动……）`,from:`system`}}let t=(await e.json()).choices?.[0]?.message?.content||`（沈暮寻沉默了一会）`;return p.push({role:`assistant`,content:t}),{text:t,from:`ai`}}catch(e){return console.error(`API Call Failed:`,e),{text:`（通信链路断开，信号不稳定……）`,from:`system`}}}function v(){p=[]}var y=document.querySelector(`#app`),b={messages:[],currentSlot:t(),timeDisplay:n(),apiKey:h(),settingsOpen:!1};function x(){let e=b.currentSlot,t=r(e),n=o.getEnergyLevel();y.innerHTML=`
    <div class="app-container scene-${e.scene}">
      <!-- 顶部状态栏 -->
      <div class="top-bar">
        <div class="time-display">🕐 ${b.timeDisplay}</div>
        <div class="slot-badge ${e.mood}">${e.label}</div>
        <div class="energy-display">
          <span class="energy-dot ${n}"></span>
          ${o.energy}/15
        </div>
        <button class="settings-btn" id="settingsBtn">⚙️</button>
      </div>

      <!-- 场景标题 -->
      <div class="scene-title">
        <h2>${e.scene===`apartment`?`🏠 黑客公寓`:e.scene===`office`?`🏢 大厂工位`:e.scene===`sleep`?`💤 深睡中`:`🌆 场景`}</h2>
        <p class="scene-desc">${e.desc}</p>
      </div>

      <!-- 时区进度条 -->
      <div class="slot-progress">
        <div class="progress-bar" style="width: ${t*100}%"></div>
      </div>

      <!-- 对话区域 -->
      <div class="chat-area" id="chatArea">
        ${b.messages.length===0?`<div class="welcome-msg">💬 给沈暮寻发条消息吧……</div>`:``}
        ${b.messages.map((e,t)=>`
          <div class="msg ${e.from===`user`?`msg-user`:`msg-ai`}">
            ${e.from===`ai`?`<div class="avatar">🐱</div>`:``}
            <div class="msg-bubble">${e.text.replace(/\n/g,`<br>`)}</div>
            ${e.from===`user`?`<div class="avatar user-avatar">👤</div>`:``}
          </div>
        `).join(``)}
        <div id="chatBottom"></div>
      </div>

      <!-- 对话输入区 -->
      ${e.id===`sleep`?`
        <div class="sleep-overlay">
          <div class="sleep-text">💤 沈暮寻已缩成猫团入睡……<br>等他醒来再聊吧</div>
          <div class="sleep-z">zzZ</div>
        </div>
      `:`
        <div class="input-area">
          <input type="text" id="msgInput" placeholder="输入你想说的话……" ${o.energy<=0?`disabled`:``}>
          <button id="sendBtn" class="send-btn" ${o.energy<=0?`disabled`:``}>发送</button>
          ${o.energy<=0?`<div class="energy-empty">⚠️ 沈暮寻今天太累了，让他休息一会</div>`:``}
        </div>
      `}

      <!-- 设置面板 -->
      ${b.settingsOpen?`
        <div class="settings-panel">
          <h3>设置</h3>
          <label>DeepSeek API Key</label>
          <input type="password" id="apiKeyInput" value="${b.apiKey}" placeholder="sk-...">
          <button id="saveApiKeyBtn">保存</button>
          <button id="clearHistoryBtn" class="danger-btn">清空对话历史</button>
          <button id="closeSettingsBtn">关闭</button>
        </div>
      `:``}

      <!-- Mock付费按钮 -->
      <div class="pay-bar">
        <button class="pay-btn coffee-btn" id="coffeeBtn">☕ 请杯冰美式 (2元)</button>
        <button class="pay-btn cocoa-btn" id="cocoaBtn">🍫 深夜续命热可可 (6元)</button>
      </div>
    </div>
  `,C(),S()}function S(){setTimeout(()=>{let e=document.getElementById(`chatBottom`);e&&e.scrollIntoView({behavior:`smooth`})},50)}function C(){let e=document.getElementById(`sendBtn`),t=document.getElementById(`msgInput`);if(e&&t){let n=async()=>{let e=t.value.trim();if(!e)return;t.value=``,b.messages.push({text:e,from:`user`}),x();let n=await _(e);b.messages.push({text:n.text,from:n.from}),x()};e.addEventListener(`click`,n),t.addEventListener(`keydown`,e=>{e.key===`Enter`&&n()}),t.focus()}let n=document.getElementById(`settingsBtn`);n&&n.addEventListener(`click`,()=>{b.settingsOpen=!b.settingsOpen,x()});let r=document.getElementById(`saveApiKeyBtn`);r&&r.addEventListener(`click`,()=>{let e=document.getElementById(`apiKeyInput`).value;m(e),b.apiKey=e,b.settingsOpen=!1,x()});let i=document.getElementById(`clearHistoryBtn`);i&&i.addEventListener(`click`,()=>{v(),b.messages=[],b.settingsOpen=!1,x()});let a=document.getElementById(`closeSettingsBtn`);a&&a.addEventListener(`click`,()=>{b.settingsOpen=!1,x()});let s=document.getElementById(`coffeeBtn`);s&&s.addEventListener(`click`,()=>{o.boost(15),b.messages.push({text:`（你扫码买了一杯冰美式。几分钟后，外卖小哥把咖啡放到了他桌上。他别扭地移开视线，猫耳却不争气地抖了抖）……谢了。`,from:`system`}),x()});let c=document.getElementById(`cocoaBtn`);c&&c.addEventListener(`click`,()=>{b.messages.push({text:`（深夜的公寓里，你递过一杯热可可。他愣了一下，然后别过脸去，尾巴却不自觉地卷上了你的手腕）……你别以为这样就能收买我。`,from:`system`}),x()})}setInterval(()=>{let e=t(),r=n();(e.id!==b.currentSlot.id||r!==b.timeDisplay)&&(b.currentSlot=e,b.timeDisplay=r,e.id,x())},1e3),o.onEnergyChange(()=>{x()}),x(),b.apiKey||(b.settingsOpen=!0,x());