import { MODE } from '@common/variables';
import dayjs from 'dayjs';

const mode = MODE === 'development';

export class Logger<T extends string | object> {
  private levels = ['log', 'info', 'debug', 'warn', 'error'] as const;
  private icons = ['🪵', '✨', '🐛', '⚠️', '❌'];
  private colors = ['#f57f17', '#1565c0', '#388e3c', '#f44336', '#c62828'];

  context: string = 'System';

  log!: (...messages: any) => void;
  info!: (...messages: any) => void;
  debug!: (...messages: any) => void;
  warn!: (...messages: any) => void;
  error!: (...messages: any) => void;

  constructor(context?: T) {
    this.updateContext(context);
  }

  updateContext(context?: T) {
    if (context) {
      this.context =
        typeof context === 'string' ? context : context.constructor.name;
    }
    this.update();
  }

  update() {
    if (!mode) return;
    for (const level of this.levels) {
      const index = this.levels.indexOf(level);
      const icon = this.icons[index];
      const color = this.colors[index];
      Object.defineProperty(this, level, {
        get() {
          const time = dayjs().format('mm:ss.SSS');
          return console.log.bind(
            this,
            `%c${icon} [${time}] ${this.context} --- `,
            `color: ${color}`,
          );
        },
      });
    }
  }
}
