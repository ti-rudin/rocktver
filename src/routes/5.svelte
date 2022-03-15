<svelte:options immutable={true} />

<script context="module">
	import { isDarkFlag } from '$lib/siteConfig';

	export const prerender = true; // index page is most visited, lets prerender
</script>

<script>
	import { slidy } from '@slidy/core';
	//import pkg from '@slidy/core/package.json'
	import { getItems } from '../components/api.js';
	import { getIdTrackNow } from '../components/api.js';

	let items = [],
		imagable = true,
		width = imagable ? 'auto' : '50%',
		gap = 16,
		index = 7,
		length = 15,
		scrollPos = 0;

	let page = Math.trunc(Math.random() * 10);

    const timerId = setInterval(function () {
		getCountdown();
	}, 3000);

	async function getCountdown() {
        index = await getIdTrackNow();
        if (index >= 10) { index = 0}
    }
</script>

<p>index: [{index}] scrollPos: {Math.trunc(scrollPos)}px</p>
<label
	>imagable
	<input
		type="checkbox"
		bind:checked={imagable}
		on:change={() => (width = imagable ? 'auto' : '50%')}
	/>
</label>

<section style="--gap: {gap}px; --width: {width}" tab-index="0">
	{#await getItems(page) then items}
		<ul
			use:slidy={{
				index,
				length,
				axis: 'x',
				align: 'middle',
				duration: 375,
				clamp: false,
				snap: true,
				gravity: 1.2,
				indexer: (x) => (index = x),
				scroller: (p) => (scrollPos = p)
			}}
		>
			{#each items as item, i}
				<li id={i} class:active={i === index}>
					{#if imagable}
						<div
							class="h-24 my-4 bg-gradient-to-r from-yellow-400 to-pink-500 flex justify-center items-center p-3 rounded-xl border-2 border-slate-100 shadow-lg transition-all transform-all hover:scale-105 cursor-pointer relative"
							
						>
							<div class="text-slate-200 text-center">
								<div>Alihossein</div>
								<div class="font-mono text-xs">from-yellow-400 to-pink-500</div>
							</div>
						</div>
					{/if}
				</li>
			{/each}
		</ul>
	{/await}
</section>

<label
	>{index}
	<input type="range" min="0" max={length} step="1" bind:value={index} />
</label>
<label
	>width
	<input placeholder={width} step="1" bind:value={width} />
</label>
<nav id="dots">
	{#if length > 0}
		{#each { length } as dot, i}
			<button on:click={() => (index = i)} class:active={i === index}>{i}</button>
		{/each}
	{/if}
</nav>
<nav>
	<button on:click={() => index--}>←</button>
	<button on:click={() => index++}>→</button>
</nav>

<style>
	section {
		overflow: hidden;
		height: auto;
		/* 		position: relative; */
	}
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		gap: var(--gap);
		width: 100%;
		height: 100%;
		min-width: 0;
		/* 		position: relative; */
	}
	ul li {
		flex: 1 0 var(--width);
		width: var(--width);
		max-width: 100%;
		height: 100%;
		position: relative;
		background: whitesmoke;
	}
	ul li:before {
		content: attr(id);
		position: absolute;
		background: white;
		padding: 1rem;
		z-index: 1;
	}
	ul li img {
		width: 100%;
		width: auto;
		height: 100%;
		display: flex;
		object-fit: cover;
		max-width: 100%;
		will-change: transform;
	}
	nav,
	label {
		display: flex;
		justify-content: start;
		margin: 1rem 0;
		flex-wrap: wrap;
		align-items: center;
	}
	.active {
		color: red;
	}
	input {
		margin: 0;
	}
</style>
