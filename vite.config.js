import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';

function copyChangelogPlugin() {
  return {
    name: 'copy-changelog-to-dist',
    writeBundle(options) {
      const outDir = options.dir || 'dist';
      const src = path.resolve(process.cwd(), 'CHANGELOG.md');
      const dest = path.resolve(process.cwd(), outDir, 'CHANGELOG.md');
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
      }
    }
  };
}

export default defineConfig({
  base: './',
  plugins: [copyChangelogPlugin()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true
  }
});
