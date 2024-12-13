export default class Logger<T = string> {
  private context!: string;
  private levels = ['log', 'info', 'debug', 'wran', 'error'] as const;

  log: (...messages: any[]) => void;
  info: (...messages: any[]) => void;
  debug: (...messages: any[]) => void;
  warn: (...messages: any[]) => void;
  error: (...messages: any[]) => void;

  constructor(context?: string);
  constructor(context?: T);
  constructor(context?: string | T) {
    if (typeof context === 'string') {
      this.update(context);
    } else {
      this.update(context.constructor.name!);
    }
  }

  private get icon() {
    return ['🪵', '✨', '🐛', '⚠️', '❌'];
  }

  setContext(context?: string) {
    this.context = context || 'System';
  }

  update(context?: string) {
    this.setContext(context!);

    for (const level of this.levels) {
      Object.defineProperty(this, level, {
        get() {
          const index = this.levels.indexOf(level);
          const icon = this.icon[index];
          return console[level].bind(
            this,
            `${icon} [${level.toUpperCase()}] ${this.context} ---`,
          );
        },
      });
    }
  }
}
