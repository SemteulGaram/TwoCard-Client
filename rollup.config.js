import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import babel from 'rollup-plugin-babel';
import builtins from 'rollup-plugin-node-builtins';
import nodeGlobal from 'rollup-plugin-node-globals';

const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/main.ts',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'www/bundle.js'
	},
	plugins: [
		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration —
		// consult the documentation for details:
		// https://github.com/rollup/rollup-plugin-commonjs
		resolve({
			browser: true,
			preferBuiltins: true
		}),
		commonjs(),

		nodeGlobal(),
		builtins(),

		typescript(),
		babel({ exclude: [/\/core-js\//] })
	],
	watch: {
		clearScreen: false
	}
};
