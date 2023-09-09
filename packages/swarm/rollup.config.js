import typescript from '@rollup/plugin-typescript'
import { dts } from 'rollup-plugin-dts'

export default [
    {
        input: 'build/index.js',
        output: {
            dir: 'dist',
            format: 'es',
        },
        // plugins: [
        //     typescript(),
        // ]
    },
    // {
    //     input: ' build/index.d.ts',
    //     output: {
    //         file: 'dist/index.t.ts',
    //         format: 'es',
    //     },
    //     plugins: [
    //         dts(),
    //     ]
    // },
]
