import { resolve } from 'path'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import dts from 'vite-plugin-dts'

export default defineConfig({
    plugins: [
        tsconfigPaths(),
        // create d.ts file
        dts({
            rollupTypes: true, // merge d.ts file to single one
        }),
    ],
    build: {
        sourcemap: true,
        lib: {
            entry: resolve(__dirname, 'lib/index.ts'),
            formats: ['es'],
        },
    },
})
