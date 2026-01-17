import { defineConfig } from 'tsup';

export default defineConfig({
    entry: {
        index: 'src/index.ts',
        middleware: 'src/middleware.ts',
        convex: 'src/convex.ts',
    },
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    external: ['react', 'next', '@workos-inc/authkit-nextjs'],
});
