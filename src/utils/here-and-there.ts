import path from 'path';

export default function hereAndThere(cwd: string, dirname: string) {
  return {
    // bark's src/demo-generator folder
    here: (_p: string) => {
      const trailingSlash = _p.charAt(_p.length - 1) === '/';

      return path.resolve(dirname, _p) + (trailingSlash ? '/' : '');
    },

    // target project's root folder
    there: (_p: string) => {
      const trailingSlash = _p.charAt(_p.length - 1) === '/';

      return path.resolve(cwd, _p) + (trailingSlash ? '/' : '');
    },
  };
}
