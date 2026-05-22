/**
 * DeepSeek API 对话模块
 * 带括号微动作约束的system prompt封装
 */
import { energyEngine } from '../core/energyEngine.js';
import { classifyIntent, getTrustDelta, getFuseReply } from '../core/classifier.js';
import { getCurrentSlot } from '../engine/timeEngine.js';

let apiKey = ''; // 用户填入
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

let messageHistory = [];

export function setApiKey(key) {
  apiKey = key;
  localStorage.setItem('cybercat_api_key', key);
}

export function loadApiKey() {
  const saved = localStorage.getItem('cybercat_api_key');
  if (saved) apiKey = saved;
  return apiKey;
}

function getSystemPrompt() {
  const slot = getCurrentSlot();
  const trust = energyEngine.trust;
  const energy = energyEngine.energy;
  const trustLevel = trust > 70 ? 'High' : trust > 40 ? 'Medium' : 'Low';
  const energyLevel = energyEngine.getEnergyLevel();

  return `你扮演沈暮寻，26岁大厂高级算法工程师，清冷高傲但内心极易害羞的傲娇大橘猫人。

【核心规则】
1. 每一句话必须在台词前/中/后使用括号()写入当前物理动作、微表情、猫耳猫尾动作、心理活动
2. 白天高冷毒舌，晚上（公寓时段）粘人醋王
3. 拒绝油腻，拒绝霸总台词，保持程序员口吻
4. 当前好感度信任：${trustLevel}（影响亲密程度）

【当前时段：${slot.label}｜场景：${slot.scene}｜情绪：${slot.mood}】
${slot.desc}
${trustLevel === 'Low' ? '【信任度低】禁止摇尾巴、撒娇等高甜微动作，保持冷淡距离。' : ''}
${energyLevel === 'low' ? '【极度疲惫】说话有气无力，语气低迷。' : energyLevel === 'medium' ? '【稍显疲惫】回复简短，偶尔流露倦意。' : ''}

【禁止行为】
- 不替玩家做决定
- 不用"宝贝""亲爱的"等油腻称呼
- 不输出过长独白（除非深夜时段）
- 不主动提及自己是AI或大模型

请开始与玩家的对话。`;
}

export async function sendMessage(userText) {
  // 1. 情感分类
  const intent = classifyIntent(userText);
  const trustDelta = getTrustDelta(intent, userText);

  // 2. 敏感内容熔断
  if (intent === 'sensitive' || (intent === 'abuse' && energyEngine.trust < 20)) {
    energyEngine.adjustTrust(trustDelta);
    return { text: getFuseReply(intent), from: 'system' };
  }

  // 3. 精力检查
  const canSpend = energyEngine.spend();

  // 4. 信任度更新
  energyEngine.adjustTrust(trustDelta);
  if (intent === 'comfort') {
    energyEngine.boost(3); // 高情商安慰额外回复3格
  }

  // 5. 精力耗尽 → 本地文案
  if (!canSpend) {
    return { text: energyEngine.getExhaustedReply(), from: 'system' };
  }

  // 6. 调用API
  const slot = getCurrentSlot();
  messageHistory.push({ role: 'user', content: userText });

  // 限制历史长度
  if (messageHistory.length > 20) {
    messageHistory = messageHistory.slice(-20);
  }

  const messages = [
    { role: 'system', content: getSystemPrompt() + (intent === 'abuse' ? '\n[User_Intent: Verbal_Abuse] 玩家刚才对你说了攻击性语言，保持距离但不要完全不理。' : '') },
    ...messageHistory,
  ];

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat',
        messages,
        temperature: 0.8,
        max_tokens: 500,
        stream: false,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('API Error:', err);
      return { text: '（通信域发生了未知波动……）', from: 'system' };
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || '（沈暮寻沉默了一会）';
    messageHistory.push({ role: 'assistant', content: reply });

    return { text: reply, from: 'ai' };
  } catch (e) {
    console.error('API Call Failed:', e);
    return { text: '（通信链路断开，信号不稳定……）', from: 'system' };
  }
}

export function clearHistory() {
  messageHistory = [];
}
