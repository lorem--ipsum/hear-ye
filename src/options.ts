import * as yargs from 'yargs';

export function args() {
  return yargs
    .command('default', 'Watches and rebuilds demo if necessary')

    .describe('once', 'Runs only once')

    .option('verbose', {
      alias: 'v',
      default: false,
      type: 'boolean'
    })

    .option('tolerant', {
      default: false,
      type: 'boolean'
    })

    .option('publish', {
      default: false,
      type: 'boolean'
    })

    .option('no-cleanup', {
      default: false,
      type: 'boolean'
    })

    .option('config', {
      alias: 'c',
      type: 'string'
    })

    .help('h')
    .alias('h', 'help')

    .strict()

    ;
}
