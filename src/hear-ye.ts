import process from 'process';
import path from 'path';
import { spawn } from 'child_process';
import hereAndThere from './utils/here-and-there';
import fs from 'fs-extra';
import ora from 'ora';
import { args } from './options';

const cwd = process.cwd();

const { here, there } = hereAndThere(cwd, __dirname);

let thereTmp = (str: string) => there(str);

const hearYeVersion = JSON.parse(fs.readFileSync(here('../package.json')).toString()).version;
const packageJSON: any = JSON.parse(fs.readFileSync(there('package.json')).toString());

if (fs.existsSync(there('tsconfig.json'))) {
  const tsConfig = JSON.parse('' + fs.readFileSync(there('tsconfig.json')));
  const rootDir = (tsConfig.compilerOptions || {}).rootDir || '';

  thereTmp = (str: string) => there(path.resolve(rootDir, '.tmp', str));
} else {
  throw new Error('Could not find tsconfig.json file');
}

async function cleanUp() {
  const files = [thereTmp('')];

  return Promise.all(files.map(f => fs.remove(f)));
}

interface Config {
  topLevelImports?: string[];
  htmlStyleSheets?: string[];
}

async function replaceInFile(file: string, replacements: Record<string, string>) {
  const buffer = await fs.readFile(file);
  let content = buffer.toString();

  Object.keys(replacements).forEach(key => {
    content = content.replace(new RegExp(key, 'g'), replacements[key]);
  });

  return await fs.writeFile(file, content);
}

async function templatizeIndex(
  config: Config,
  options: { tolerant: boolean; once: boolean; pure: boolean },
) {
  const imports = (
    config.topLevelImports ||
    (options.pure ? [] : ["import '@implydata/css-sanity/css-sanity.min.css';"])
  ).join('\n');

  const { name, version, description, keywords } = packageJSON;

  return replaceInFile(thereTmp('index.tsx'), {
    '%topLevelImports%': imports,
    '%project-info%': JSON.stringify({ name, version, description, keywords }),
    '%options%': JSON.stringify({
      strict: !options.tolerant,
      standalone: !!options.once,
      noNiceCss: !!options.pure,
    }),
    '%version%': hearYeVersion,
  });
}

async function templatizeHtml(config: Config, options: { pure: boolean }) {
  const stylesheets = (
    config.htmlStyleSheets ||
    (options.pure
      ? []
      : [
          '<link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600" rel="stylesheet">',
        ])
  ).join('\n');

  return replaceInFile(thereTmp('index.html'), {
    '%stylesheets%': stylesheets,
    '%niceCss%': `
      font-size: 13px;
      box-sizing: border-box;
      font-family: 'Open Sans', sans-serif;
    `,
  });
}

function getConfig(options: { config: string | undefined }) {
  let config: Config = {};

  if (options.config && fs.existsSync(options.config)) {
    config = JSON.parse('' + fs.readFileSync(options.config));
  } else if (fs.existsSync(there('hear-ye.config.json'))) {
    config = JSON.parse('' + fs.readFileSync(there('hear-ye.config.json')));
  } else {
    if (options.config) {
      console.warn('Warning: could not find config at ' + options.config);
    }
  }

  return config;
}

async function runOnce(options: { verbose: boolean; 'no-cleanup': boolean }) {
  const spinner = ora().start('Building...');

  const additionalArgs: string[] = [];

  if (options.verbose) additionalArgs.push('--display=verbose');
  const webpack = spawn(
    'webpack',
    ['-p', '--config', thereTmp('webpack.config.js'), ...additionalArgs],
    { stdio: 'inherit' },
  );

  return new Promise<number>((yes, no) => {
    webpack.on('close', async code => {
      if (options['no-cleanup'] !== true) await cleanUp();
      if (code == 0) {
        spinner.succeed();
        yes(code);
      } else {
        spinner.fail();
        no(code);
      }
    });
  });
}

module.exports = async function() {
  const options = args().parse();

  const config = getConfig(options);

  await fs.copy(here('assets'), thereTmp(''));
  await templatizeIndex(config, options);
  await templatizeHtml(config, options);
  await fs.copy(thereTmp('index.html'), there('demo/index.html'));

  if (options.once) {
    const code = await runOnce(options);
    process.exit(code);
    return;
  }

  const server = spawn('webpack-dev-server', ['--config', thereTmp('webpack.config.js'), '--hot'], {
    stdio: 'inherit',
  });

  server.on('close', async code => {
    if (options.noCleanup !== true) await cleanUp();
    process.exit(code);
  });

  process.on('SIGINT', function() {
    server.kill();

    if (options.noCleanup === true) {
      process.exit();
    } else {
      cleanUp()
        .then(() => process.exit())
        .catch(() => process.exit());
    }
  });
};
