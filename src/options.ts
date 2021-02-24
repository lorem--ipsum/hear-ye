import yargs from 'yargs';

export function args() {
  return yargs
    .command('default', 'Watches and rebuilds demo if necessary')

    .option('once', {
      describe: 'Runs only once',
      default: false,
      type: 'boolean',
    })

    .option('verbose', {
      alias: 'v',
      default: false,
      type: 'boolean',
    })

    .option('pure', {
      describe: 'no sanity code added',
      default: false,
      type: 'boolean',
    })

    .option('tolerant', {
      default: false,
      type: 'boolean',
    })

    .option('publish', {
      default: false,
      type: 'boolean',
    })

    .option('cleanup', {
      default: true,
      type: 'boolean',
    })

    .option('config', {
      alias: 'c',
      type: 'string',
    })

    .help('h')
    .alias('h', 'help')

    .strict();
}
