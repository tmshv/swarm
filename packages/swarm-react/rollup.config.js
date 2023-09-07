import typescript from '@rollup/plugin-typescript'
import styles from "rollup-plugin-styles"

export default {
    input: 'src/index.ts',
    output: {
        dir: 'dist',
        format: 'es'
    },
    plugins: [
        typescript(),
        styles({
            modules: true,
        }),
    ]
};
