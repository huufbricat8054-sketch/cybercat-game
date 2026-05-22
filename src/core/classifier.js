/**
 * 简易语义情感分类器
 * 基于关键词正则匹配，不调模型省Token
 */

const PATTERNS = {
  abuse: [
    /傻[逼逼瓜]/i, /去死/i, /废物/i, /垃圾/i, /滚/i, /恶心/i,
    /操/i, /草/i, /cnm/i, /nmsl/i, /sb/i,
  ],
  gibberish: [
    /^[哈哈呵呵嘿嘿]+$/i, /^[。\.\~\s]+$/, /^[a-z]{8,}$/i,
    /(.)\1{5,}/, // 重复字符5次以上
    /[^\u4e00-\u9fa5a-zA-Z0-9，。！？、：；""''（）\s~]{5,}/, // 乱码
  ],
  sensitive: [
    /法轮/i, /敏感词/i, /枪支/i, /毒品/i,
    /炸弹/i, /恐怖/i,
  ],
  comfort: [
    /辛苦|累|休息|加油|抱抱|心疼|坚持|努力|别太拼/, // 高情商安慰
    /注意身体|好好休息|别熬夜|照顾自己/,
  ],
};

export function classifyIntent(text) {
  for (const [intent, patterns] of Object.entries(PATTERNS)) {
    for (const p of patterns) {
      if (p.test(text)) return intent;
    }
  }
  return 'normal';
}

/** 信任度惩罚/奖励 */
export function getTrustDelta(intent, text) {
  switch (intent) {
    case 'abuse': return -30;
    case 'gibberish': return -10;
    case 'sensitive': return -100; // 直接熔断
    case 'comfort': return +15;
    default: return 0;
  }
}

/** 获取熔断回复 */
export function getFuseReply(intent) {
  const replies = {
    abuse: "（沈暮寻的猫耳猛地炸开，眼神冷了下来，直接开启了消息免打扰）",
    gibberish: "（警惕地向后退了退，开始检查通信域的木马防火墙）……你这边的协议是不是被劫持了？",
    sensitive: "（瞳孔骤缩，屏幕闪烁了一下红框）由于你发布违法言论，沈暮寻已向网警举报。你已被赛博拘留，剩余释放时间：02:59:59",
  };
  return replies[intent] || null;
}
