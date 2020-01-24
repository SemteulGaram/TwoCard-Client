import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';

const production = !process.env.ROLLUP_WATCH;

const cordovaFolder = 'src-cordova';
let publicFolder = 'public';
if (process.env.CORDOVA_PLATFORM) {
	publicFolder = `${cordovaFolder}/www`
}

console.log(`publicFolder is ${publicFolder}`)

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: `${publicFolder}/bundle.js`
	},
	plugins: [
		svelte({
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file — better for performance
			css: css => {
				css.write(`${publicFolder}/bundle.css`);
			}
		}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration —
		// consult the documentation for details:
		// https://github.com/rollup/rollup-plugin-commonjs
		resolve({ browser: true }),
		commonjs(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload(publicFolder),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser(),

		production && babel({
			exclude: [
				// 'node_modules/**',
				/\/core-js\//,
			],
			extensions: ['.svelte', '.js', '.jsx', '.es6', '.es', '.mjs', '.ts']
		}),
	],
	watch: {
		clearScreen: false
	}
};
