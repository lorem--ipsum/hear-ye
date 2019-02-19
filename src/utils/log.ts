import chalk from 'chalk';

var DEBUG = false;

export function setDebug(value: boolean) {DEBUG = value};

export function info(...txt: any[]) {console.log(chalk.grey(txt.join()))};
export function success(...txt: any[]) {console.log(chalk.green(txt.join()))};
export function error(...txt: any[]) {console.log(chalk.red(txt.join()))};
export function warn(...txt: any[]) {console.log(chalk.yellow(txt.join()))};
export function debug(...txt: any[]) {DEBUG && console.log('[DEBUG] ' + chalk.white(txt.join()))};
export function prettyPrintError(_error: any){
  _error = _error || {};
  error(_error.stack);
  error(_error.message);
};
