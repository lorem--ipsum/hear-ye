import * as process from 'process';
import hereAndThere from './utils/here-and-there';
import * as fs from 'fs-extra';

const Bundler = require('parcel-bundler');

const cwd = process.cwd();

const { here, there } = hereAndThere(cwd, __dirname);

// Otherwise ParcelJS will throw up on the carpet
process.chdir(there(''));


// Bundler options
const options = {
  outDir: there('demo'),
  logLevel: 3
};

module.exports = async function(verbose: boolean) {
  if (verbose) options.logLevel = 4;

  await fs.copy(here('tmp'), there('demo/tmp'))
  const indexContent = await fs.readFile(there('demo/tmp/index.tsx'));
  const newIndexContent = String(indexContent).replace('%demo-files%', there('src/**/*.demo.tsx'));
  await fs.writeFile(there('demo/tmp/index.tsx'), newIndexContent);

  const bundler = new Bundler(there('demo/tmp/index.html'), options);

  const bundle = await bundler.serve();
};
