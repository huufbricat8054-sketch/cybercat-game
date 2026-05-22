/**
 * 能量-情绪双驱防刷引擎
 */
const MAX_ENERGY = 15;
const RECOVER_INTERVAL = 30 * 60 * 1000; // 30分钟恢复1格

class EnergyEngine {
  constructor() {
    this.load();
    this.startAutoRecover();
  }

  load() {
    const saved = localStorage.getItem('cybercat_energy');
    if (saved) {
      const data = JSON.parse(saved);
      this.energy = data.energy;
      this.trust = data.trust;
      this.lastActive = data.lastActive;
      this.dailyReset();
    } else {
      this.reset();
    }
  }

  reset() {
    this.energy = 10;
    this.trust = 100;
    this.lastActive = Date.now();
    this.save();
  }

  dailyReset() {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem('cybercat_date');
    if (savedDate !== today) {
      this.energy = 15;
      this.trust = Math.min(this.trust + 20, 100); // 每天自动回一些信任
      localStorage.setItem('cybercat_date', today);
      this.save();
    }
  }

  save() {
    localStorage.setItem('cybercat_energy', JSON.stringify({
      energy: this.energy,
      trust: this.trust,
      lastActive: this.lastActive,
    }));
  }

  startAutoRecover() {
    setInterval(() => {
      const now = Date.now();
      const slots = Math.floor((now - this.lastActive) / RECOVER_INTERVAL);
      if (slots > 0 && this.energy < MAX_ENERGY) {
        this.energy = Math.min(this.energy + slots, MAX_ENERGY);
        this.lastActive = now;
        this.save();
        this.onChange?.();
      }
    }, 10000);
  }

  /** 花费1格精力，返回是否能回复 */
  spend() {
    if (this.energy <= 0) return false;
    this.energy--;
    this.save();
    this.onChange?.();
    return true;
  }

  /** 增加精力（冰美式/摸鱼） */
  boost(amount = 5) {
    this.energy = Math.min(this.energy + amount, MAX_ENERGY);
    this.save();
    this.onChange?.();
  }

  /** 信任度变化 */
  adjustTrust(delta) {
    this.trust = Math.max(0, Math.min(100, this.trust + delta));
    this.save();
    this.onChange?.();
  }

  getEnergyLevel() {
    if (this.energy >= 10) return 'high';
    if (this.energy >= 3) return 'medium';
    return 'low';
  }

  getExhaustedReply() {
    const replies = [
      "（趴在桌上，有气无力地抬了抬眼皮）别闹了……主管正站在隔壁组训人……",
      "（耳朵垂了下来，声音闷闷的）今天真不行了……代码快把我吃掉了……",
      "（尾巴无力地搭在椅背上）让我死一死……",
      "（头也没抬，手指还在敲键盘）嗯……你说什么……我没听见……",
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  }

  onEnergyChange(callback) {
    this.onChange = callback;
  }
}

export const energyEngine = new EnergyEngine();
