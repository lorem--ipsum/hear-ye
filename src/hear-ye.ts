import * as process from 'process';
import * as path from 'path';
import { spawn } from 'child_process';
import hereAndThere from './utils/here-and-there';
import * as fs from 'fs-extra';

const cwd = process.cwd();

const { here, there } = hereAndThere(cwd, __dirname);

let thereTmp = (str: string) => there(str);

const packageJSON: any = JSON.parse(fs.readFileSync(there('package.json')).toString());

if (fs.existsSync(there('tsconfig.json'))) {
  const tsConfig = JSON.parse('' + fs.readFileSync(there('tsconfig.json')));
  const rootDir = (tsConfig.compilerOptions || {}).rootDir || '';

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
  tolerant?: boolean;
  config?: string;
  noCleanup?: boolean;
}

interface Config {
  topLevelImports?: string[];
  htmlStyleSheets?: string[];
}

async function replaceInFile(file: string, replacements: Record<string, string>)  {
  const buffer = await fs.readFile(file);
  let content = buffer.toString();

  Object.keys(replacements).forEach(key => {
    content = content.replace(key, replacements[key]);
  });

  return await fs.writeFile(file, content);
}

async function templatizeIndex(config: Config, options: Args) {
  const imports = (config.topLevelImports || [])
    .join('\n')
  ;

  const { name, version, description, keywords } = packageJSON;

  return replaceInFile(
    thereTmp('index.tsx'),
    {
      '%topLevelImports%': imports,
      '%project-info%': JSON.stringify({name, version, description, keywords}),
      '%options%': JSON.stringify({strict: !options.tolerant})
    }
  );
}

async function templatizeHtml(config: Config) {
  const stylesheets = (config.htmlStyleSheets || [])
    .join('\n')
  ;

  return replaceInFile(thereTmp('index.html'), {'%stylesheets%': stylesheets});
}

module.exports = async function(options: Args) {
  const additionalArgs: string[] = [];

  let config: Config = {};

  if (fs.existsSync(options.config)) {
    config = JSON.parse('' + fs.readFileSync(options.config));
  } else if (fs.existsSync(there('hear-ye.config.json'))) {
    config = JSON.parse('' + fs.readFileSync(there('hear-ye.config.json')));
  } else {
    if (options.config) {
      console.warn('Warning: could not find config at ' + options.config);
    }
  }

  await fs.copy(here('assets'), thereTmp(''));

  await templatizeIndex(config, options);
  await templatizeHtml(config);

  await fs.copy(thereTmp('index.html'), there('demo/index.html'));

  if (options.once) {

    if (options.verbose) additionalArgs.push('--display=verbose');
    const webpack = spawn('webpack', ['--config', thereTmp('webpack.config.js'), ...additionalArgs], {stdio: 'inherit'});

    webpack.on('close', async code => {
      if (options.noCleanup !== true) await cleanUp();
      process.exit(code);
    });

    return;
  }

  const server = spawn('webpack-dev-server', ['--config', thereTmp('webpack.config.js'), '--hot'], {stdio: 'inherit'});

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
        .catch(() => process.exit())
        ;
    }
  });
};

