import { resolve } from 'path'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import dts from 'vite-plugin-dts'

export default defineConfig({
    plugins: [
        tsconfigPaths(),
        dts({
            rollupTypes: true, // merge d.ts file to single one
        }),
    ],
    build: {
        sourcemap: true,
        lib: {
            entry: resolve(__dirname, 'lib/index.ts'),
            // name: 'Swarm React',
            formats: ['es'],
            // the proper extensions will be added
            // fileName: 'swarm-react',
        },
        rollupOptions: {
            external: [
                "react",
                "react-dom",
                "@tmshv/swarm",
                "@tmshv/swarm-render",
            ],
        },
    },
})
