import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import pkg from './package.json';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

const name = 'pixiGrid';

export default {
    input: './src/index.ts',

    // Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
    // https://rollupjs.org/guide/en#external-e-external
    external: [],

    plugins: [
        // Allows node_modules resolution
        resolve({ extensions }),

        // Allow bundling cjs modules. Rollup doesn't understand cjs
        commonjs(),

        // Compile TypeScript/JavaScript files
        babel({
            extensions,
            include: ['src/**/*'],
            presets: [
                // [
                //     '@babel/preset-env',
                //     {
                //         useBuiltIns: 'usage',
                //         corejs: { version: 3, proposals: true },
                //         bugfixes: true,
                //         debug: true,
                //     },
                // ],
                '@babel/preset-typescript',
            ],
            plugins: ['@babel/plugin-proposal-class-properties'],
        }),
    ],

    output: [
        {
            file: pkg.main,
            format: 'cjs',
        },
        {
            file: pkg.module,
            format: 'es',
        },
        {
            file: pkg.browser,
            format: 'iife',
            name,
            // https://rollupjs.org/guide/en#output-globals-g-globals
            globals: {},
        },
    ],
};
