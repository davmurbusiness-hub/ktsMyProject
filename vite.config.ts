import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfig from './tsconfig.json';
import path from 'path';

const SRC_PATH = path.resolve(__dirname, 'src');

const parseTsConfigPaths = (paths: Record<string, string[]>) => {
  const aliases: Record<string, string> = {};

  Object.entries(paths).forEach(([alias, [pathPattern]]) => {
    const cleanPath = pathPattern.replace('/*', '');
    const cleanAlias = alias.replace('/*', '');
    const fullPath = path.join(SRC_PATH, cleanPath);

    aliases[cleanAlias] = fullPath;
  });

  return aliases;
};

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: parseTsConfigPaths(tsconfig.compilerOptions.paths),
  },
  json: {
    stringify: true,
  },
});
