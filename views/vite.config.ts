import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import path from 'path';
import tsconfig from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import * as pkg from './package.json';

dotenv.config({
  path: path.join(path.resolve(), '.env'),
});

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const MODE = process.env.NODE_ENV || 'production';

  const projectBasePath = MODE === 'development' ? '/' : '/';

  const env = loadEnv(mode, process.cwd(), '');

  const host = process.env.HOST;
  const port = +(process.env.PORT || 5000);

  return {
    // vite config
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
      'process.env': {
        MODE,
        HOST: host,
        PORT: port,
        PROJECT_BASEPATH: projectBasePath,
        USER_NAME: pkg.author.name,
        USER_BLOG: pkg.author.url,
        USER_PROFILE: pkg.author.profile,
      },
    },
    server: {
      host,
      port,
    },
    // resolve: {
    //   alias: [
    //     { find: '@assets', replacement: path.resolve('src/assets') },
    //     { find: '@common', replacement: path.resolve('src/common') },
    //     { find: '@models', replacement: path.resolve('src/models') },
    //     { find: '@providers', replacement: path.resolve('src/providers') },
    //     { find: '@hooks', replacement: path.resolve('src/hooks') },
    //     {
    //       find: '@components',
    //       replacement: path.resolve('src/components'),
    //     },
    //     {
    //       find: '@atoms',
    //       replacement: path.resolve('src/components/atoms'),
    //     },
    //     {
    //       find: '@moleculars',
    //       replacement: path.resolve('src/components/moleculars'),
    //     },
    //     {
    //       find: '@organisms',
    //       replacement: path.resolve('src/components/organisms'),
    //     },
    //     {
    //       find: '@templates',
    //       replacement: path.resolve('src/components/templates'),
    //     },
    //     { find: '@utils', replacement: path.resolve('src/utils') },
    //     { find: '@routes', replacement: path.resolve('src/routes') },
    //     { find: '@pages', replacement: path.resolve('src/pages') },
    //     { find: '@', replacement: path.resolve('src') },
    //   ],
    // },
    base: projectBasePath,
    plugins: [react(), tsconfig(), svgr()],
  };
});
