import * as process from 'process';
import * as path from 'path';
import { spawn } from 'child_process';
import hereAndThere from './utils/here-and-there';
import * as webpack from 'webpack';
import * as WebpackDevServer from 'webpack-dev-server';
import * as fs from 'fs-extra';

const cwd = process.cwd();

const { here, there } = hereAndThere(cwd, __dirname);

let thereTmp = (str: string) => there(str);

if (fs.existsSync(there('tsconfig.json'))) {
  const rootDir = ((require(there('tsconfig.json')).compilerOptions || {}).rootDir || '');
  thereTmp = (str: string) => there(path.resolve(rootDir, '.tmp', str));
} else {
  throw new Error('Could not find tsconfig.json file');
}

async function cleanUp() {
  const files = [
    thereTmp('')
  ];

  return Promise.all(files.map(f => fs.remove(f)));
}

interface Args {
  once?: boolean;
  verbose?: boolean;
  config?: string;
}

interface Config {
  topLevelImports?: string[];
}

async function replaceInFile(file: string, pattern: string, replacement: string)  {
  const content = await fs.readFile(file);

  return await fs.writeFile(file, String(content).replace(pattern, replacement));
}

async function templatizeIndex(config: Config) {
  const imports = (config.topLevelImports || [])
    .join('\n')
  ;

  return await replaceInFile(thereTmp('index.tsx'), '%topLevelImports%', imports);
}

module.exports = async function(options: Args) {
  const additionalArgs: string[] = [];

  let config: Config = {};

  if (fs.existsSync(options.config)) {
    config = require(there(options.config));
  } else if (fs.existsSync(there('hear-ye.config.js'))) {
    config = require(there('hear-ye.config.js'));
  } else {
    if (options.config) {
      console.warn('Warning: could not find config at ' + options.config);
    }
  }

  await fs.copy(here('assets'), thereTmp(''));
  await fs.copy(thereTmp('index.html'), there('demo/index.html'));

  templatizeIndex(config);

  if (options.once) {

    if (options.verbose) additionalArgs.push('--display=verbose');
    const webpack = spawn('webpack', ['--config', thereTmp('webpack.config.js'), ...additionalArgs], {stdio: "inherit"});

    webpack.on('close', async code => {
      await cleanUp();
      process.exit(code);
    });

    return;
  }

  const server = spawn('webpack-dev-server', ['--config', thereTmp('webpack.config.js'), '--hot'], {stdio: "inherit"});

  server.on('close', async code => {
    await cleanUp();
    process.exit(code);
  });

};

process.on('SIGINT', function() {
  cleanUp()
    .then(() => process.exit())
    .catch(() => process.exit())
    ;
});
