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
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'Swarm Render',
            formats: ['es'],
            // the proper extensions will be added
            fileName: 'swarm-render',
        },
    },
    rollupOptions: {
        external: [
            "@tmshv/swarm",
        ],
    },
})
