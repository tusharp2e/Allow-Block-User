import { defineConfig } from 'tsup';
 
export default defineConfig({
    format: ['cjs', 'esm'],
    entry: ['./app.ts'],
    dts: true,
    shims: true,
    skipNodeModulesBundle: true,
    clean: true,
});