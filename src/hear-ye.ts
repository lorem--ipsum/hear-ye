import * as process from 'process';
import { spawn } from 'child_process';
import hereAndThere from './utils/here-and-there';
import * as webpack from 'webpack';
import * as WebpackDevServer from 'webpack-dev-server';
import * as fs from 'fs-extra';

const cwd = process.cwd();

const { here, there } = hereAndThere(cwd, __dirname);

// Bundler options

async function cleanUp() {
  const files = [
    there('.tmp')
  ];

  return Promise.all(files.map(f => fs.remove(f)));
}

module.exports = async function(singleRun: boolean, verbose: boolean) {
  // if (verbose) options.logLevel = 4;

  await fs.copy(here('.tmp'), there('.tmp'));
  await fs.copy(there('.tmp/index.html'), there('demo/index.html'));

  const config = require(there('.tmp/webpack.config.js'));
  const webpackCompiler = webpack(config);

  if (singleRun) {
    webpackCompiler.run((err, stats) => {
      if (err) throw err;

      if (stats.hasErrors()) {
        console.log(stats.toString({colors: true, chunks: false}));
        throw new Error('Unable to run');
      }

      cleanUp().then(() => {
        process.exit(0);
      });

    });

    return;
  }

  const server = spawn('webpack-dev-server', ['--config', '.tmp/webpack.config.js', '--hot'], {stdio: "inherit"});

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
