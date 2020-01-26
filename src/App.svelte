<script>
	import Twocard from './twocard';

	export let name = '';
	export let ready = false;

	document.addEventListener("deviceready", () => {
		ready = true;
	});
</script>

{#if ready}
	<canvas id='game'></canvas>
{:else}
	<h2>Waiting for cordova deviceready</h2>
{/if}
