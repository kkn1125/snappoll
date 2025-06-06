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
  const CLIENT_KEY = process.env.CLIENT_KEY;
  const TOSS_SECRET = process.env.TOSS_SECRET;

  return {
    // vite config
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
      'process.env': {
        MODE,
        HOST: host,
        PORT: port,
        PROJECT_BASEPATH: projectBasePath,
        DESCRIPTION: pkg.description,
        VERSION: pkg.version,
        USER_NAME: pkg.author.name,
        USER_EMAIL: pkg.author.email,
        USER_BLOG: pkg.author.url,
        USER_PROFILE: pkg.author.profile,
        CLIENT_KEY,
        TOSS_SECRET,
      },
    },
    server: {
      host,
      port,
    },
    base: projectBasePath,
    plugins: [react(), tsconfig(), svgr()],
  };
});
