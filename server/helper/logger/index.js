class Logger {
  constructor(context = 'default') {
    this.context = context;
    this.styles = {
      reset: '\x1b[0m',
      info: '\x1b[34m',
      success: '\x1b[32m',
      warning: '\x1b[33m',
      error: '\x1b[31m',
      debug: '\x1b[35m',
      critical: '\x1b[41m\x1b[37m'
    };
  }

  log(level, message) {
    const style = this.styles[level] || this.styles.reset;
    const timestamp = new Date().toISOString();
    console.log(`${style}[${level.toUpperCase()}][${this.context}] ${timestamp}: ${message}${this.styles.reset}`);
  }

  info(message) {
    this.log('info', message);
  }

  success(message) {
    this.log('success', message);
  }

  warning(message) {
    this.log('warning', message);
  }

  error(message) {
    this.log('error', message);
  }

  debug(message) {
    this.log('debug', message);
  }

  critical(message) {
    this.log('critical', message);
  }
}

module.exports = Logger;