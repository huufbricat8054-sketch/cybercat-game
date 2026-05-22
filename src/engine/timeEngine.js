/**
 * 东八区实时时钟引擎
 * 每分钟校验当前时段，触发场景/状态切换
 */

// 时段定义（东八区）
export const TIME_SLOTS = [
  { id: 'meeting', label: '地狱早会', start: 8.5, end: 10, scene: 'office', mood: 'busy', desc: '早会进行中，消息轮回中……' },
  { id: 'danger', label: '老板巡楼', start: 10, end: 12, scene: 'office', mood: 'tense', desc: '老板就在附近，小心翼翼……' },
  { id: 'afternoon', label: '摸鱼下午茶', start: 12, end: 18, scene: 'office', mood: 'relaxed', desc: '安全摸鱼区，可正常聊天' },
  { id: 'overtime', label: '地狱加班', start: 18, end: 22, scene: 'office', mood: 'stressed', desc: '加班重构代码中……' },
  { id: 'home', label: '公寓深夜', start: 22, end: 1.5, scene: 'apartment', mood: 'affectionate', desc: '回到安全屋，猫耳展开中……' },
  { id: 'sleep', label: '深睡猫团', start: 1.5, end: 8.5, scene: 'sleep', mood: 'asleep', desc: '已缩成猫团入睡……' },
];

export function getCurrentSlot() {
  const now = new Date();
  const hour = now.getHours() + now.getMinutes() / 60;
  // 东八区偏移
  const cstHour = hour + 8;

  for (const slot of TIME_SLOTS) {
    if (slot.start <= slot.end) {
      if (cstHour >= slot.start && cstHour < slot.end) return slot;
    } else {
      // 跨天（深夜时段 22:00 ~ 01:30）
      if (cstHour >= slot.start || cstHour < slot.end) return slot;
    }
  }
  return TIME_SLOTS[0]; // fallback
}

export function getTimeDisplay() {
  const now = new Date();
  const cst = new Date(now.getTime() + 8 * 3600000);
  return cst.toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit' });
}

export function getSlotProgress(slot) {
  const now = new Date();
  const cstHour = now.getHours() + now.getMinutes() / 60 + 8;
  let duration, elapsed;
  if (slot.start <= slot.end) {
    duration = slot.end - slot.start;
    elapsed = cstHour - slot.start;
  } else {
    duration = (24 - slot.start) + slot.end;
    elapsed = cstHour >= slot.start ? cstHour - slot.start : (24 - slot.start) + cstHour;
  }
  return Math.min(Math.max(elapsed / duration, 0), 1);
}
