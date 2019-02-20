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

module.exports = async function(singleRun: boolean, verbose: boolean) {
  const additionalArgs: string[] = [];

  await fs.copy(here('assets'), thereTmp(''));
  await fs.copy(thereTmp('index.html'), there('demo/index.html'));

  // const content = await fs.readFile(there(thereTmp('index.tsx')));
  // const newContent = String(content).replace('%demo-inport-glob%', path.relative(thereTmp('index.tsx'), ));

  // %demo-inport-glob%
  // ../src/**/*.demo.tsx


  const config = require(thereTmp('webpack.config.js'));
  const webpackCompiler = webpack(config);

  if (singleRun) {

    if (verbose) additionalArgs.push('--display=verbose');
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
