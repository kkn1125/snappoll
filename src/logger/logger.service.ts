import { LOG_LEVEL } from '@common/variables';
import { Injectable, LoggerService, Optional } from '@nestjs/common';
import fs from 'fs';

@Injectable()
export default class SnapLoggerService<T = string> implements LoggerService {
  private context!: string;
  private levels = ['debug', 'log', 'info', 'warn', 'error'] as const;

  log: (...messages: any[]) => void;
  info: (...messages: any[]) => void;
  debug: (...messages: any[]) => void;
  warn: (...messages: any[]) => void;
  error: (...messages: any[]) => void;

  constructor(context?: string);
  constructor(context?: T);
  constructor(@Optional() context?: string | T) {
    if (context) {
      if (typeof context === 'string') {
        this.update(context);
      } else {
        this.update(context.constructor.name!);
      }
    } else {
      this.update();
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
          if (LOG_LEVEL >= this.levels.indexOf(level) + 1) return () => {};
          const index = this.levels.indexOf(level);
          const icon = this.icon[index];
          const logContent = `${icon} [${level.toUpperCase()}] ${this.context} ---`;
          return (...messages: any[]) => {
            this.saveLog(level, logContent, messages);
          };
        },
      });
    }
  }

  saveLog(
    level: 'debug' | 'log' | 'info' | 'warn' | 'error',
    logContent: string,
    messages: any[],
  ) {
    console[level](logContent, ...messages);
    fs.appendFileSync(
      'log.txt',
      `${logContent} ${messages
        .map((message) =>
          message instanceof Object ? JSON.stringify(message) : message,
        )
        .join(' ')}\n`,
    );
  }
}
