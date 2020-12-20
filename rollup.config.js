import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import pkg from './package.json';

const extensions = ['.js', '.ts'];

export default [
    // browser-friendly UMD build
    {
        input: 'src/index.ts',
        output: {
            name: 'pixi-grid',
            file: pkg.browser,
            format: 'umd',
        },
        plugins: [
            resolve({ extensions }), // so Rollup can find `ms`
            commonjs(), // so Rollup can convert `ms` to an ES module
            babel({
                extensions,
                exclude: ['node_modules/**'],
                presets: [
                    [
                        '@babel/preset-env',
                        {
                            useBuiltIns: 'usage',
                            modules: false,
                            corejs: { version: 3, proposals: true },
                            targets: {
                                browsers: ['ios >= 10', 'and_chr >= 20', 'safari >= 8'],
                            },
                            debug: true,
                        },
                    ],
                    '@babel/preset-typescript',
                ],
                plugins: ['@babel/plugin-proposal-class-properties'],
            }),
        ],
    },

    // CommonJS (for Node) and ES module (for bundlers) build.
    // (We could have three entries in the configuration array
    // instead of two, but it's quicker to generate multiple
    // builds from a single configuration where possible, using
    // an array for the `output` option, where we can specify
    // `file` and `format` for each target)
    {
        input: 'src/index.ts',
        external: [],
        output: [
            { file: pkg.main, format: 'cjs' },
            { file: pkg.module, format: 'es' },
        ],
        plugins: [
            resolve({ extensions }),
            babel({
                extensions,
                exclude: ['node_modules/**'],
                presets: [
                    [
                        '@babel/preset-env',
                        {
                            useBuiltIns: 'usage',
                            // modules: false,
                            corejs: { version: 3, proposals: true },
                            targets: {
                                browsers: ['ios >= 10', 'and_chr >= 20', 'safari >= 8'],
                            },
                            debug: true,
                        },
                    ],
                    '@babel/preset-typescript',
                ],
                plugins: ['@babel/plugin-proposal-class-properties'],
            }),
        ],
    },
];
