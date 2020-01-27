<script>
	import { Game } from './game';

	export let name = '';
	export let ready = false;

	const readyCallback = () => {
		if (ready) return
		ready = true
		window.game = new Game()
		window.game.init().catch(err => {
			const logs = document.querySelector('#logs')
			const item = document.createTextNode('\n' + err.stack)
			logs.appendChild(item)
		})
	}
	document.addEventListener("deviceready", readyCallback)
	document.addEventListener("load", readyCallback)
</script>

<style>
	#logs {
		white-space: pre-wrap;
		word-break: break-word;
		width: 100%;
	}

	#game {
		width: 100%;
		height: 100%;
		background-color: black;
	}
</style>

{#if ready}
	<pre id='logs' style>logs</pre>
	<canvas id='game'></canvas>
{:else}
	<h2>Waiting for cordova deviceready</h2>
{/if}
