<script>
	import dateFormat, { masks } from 'dateformat';
	async function load_efir() {
		console.log('ssdd');
		let myHeaders = new Headers();
		myHeaders.append('Content-Type', 'application/json');
		let requestOptions = {
			method: 'GET',
			headers: myHeaders
		};

		fetch('https://api.rocktver.ru/open-status/', requestOptions)
			.then((response) => response.json())
			.then((result) => {
				console.log(result);
				status = result;
				isshowgo = status.is_show_go;
				have_spisok = status.now_on_scene.have_spisok;
				concertid = status.concert_id;
				show_name = status.show_name;
				band_on_scene = status.now_on_scene.band_rtid;
				actual_spisok_pesen = status.now_on_scene.actual_spisok_pesen;
				status.
				setTimeout(function () {
					load_efir();
				}, 2000);
			})
			.catch((error) => console.log('error', error));
	}

	export let isshowgo, band_on_scene, concert, timeline, status, concertid, show_name, have_spisok, actual_spisok_pesen;
	import { onDestroy, onMount } from 'svelte';

	onMount(() => {
		load_efir();
	});
	onDestroy(() =>{
		clearInterval(timerId);
		
	}

	);

	import { slidy } from '@slidy/core';
	import { getIdTrackNow } from '../components/api.js';
	import KnobHeart from '../components/KnobHeart.svelte'
	let index = 0,
			imagable = true,
		width = imagable ? 'auto' : '50%',
		gap = 16,
		length = 15,
		scrollPos = 0;



	async function getCountdown() {
        index = await getIdTrackNow();
	
    };

    const timerId = setInterval(function () {
		getCountdown();
	}, 2000);


$: ready_track_data = actual_spisok_pesen;

import { blur, crossfade, draw, fade, fly, scale, slide } from 'svelte/transition';	
import { flip } from 'svelte/animate';
	
</script>

{#if isshowgo}
	<div  class="w-full">
		<div transition:scale={{ duration: 300 }}
			aria-label="card 1"
			class="mx-auto max-w-2xl rounded bg-red-400/40 p-6 shadow focus:outline-none dark:bg-red-500"
		>
			<div class="flex items-center border-b border-gray-200 pb-6">
				<div class="flex w-full items-start justify-between">
					<div class="w-full pl-3">
						<h1 tabindex="0" class="text-2xl text-black focus:outline-none dark:text-gray-200">
							{status.show_name}
						</h1>
					</div>
					<div role="img" aria-label="bookmark">
						<svg
							class="focus:outline-none"
							width="28"
							height="28"
							viewBox="0 0 28 28"
							fill="red"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M10.5001 4.66667H17.5001C18.1189 4.66667 18.7124 4.9125 19.15 5.35009C19.5876 5.78767 19.8334 6.38117 19.8334 7V23.3333L14.0001 19.8333L8.16675 23.3333V7C8.16675 6.38117 8.41258 5.78767 8.85017 5.35009C9.28775 4.9125 9.88124 4.66667 10.5001 4.66667Z"
								stroke="#2C3E50"
								stroke-width="1.25"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</div>
				</div>
			</div>

			<div class="px-2">
				<div tabindex="0" class="flex flex-col focus:outline-none">
					<div class="mb-3 py-2 px-4  text-center text-lg leading-3 text-black dark:text-white">
						{status.ploschadka_type}
					</div>

					<div class="mb-3 py-2 px-4  text-center text-2xl leading-3 text-black dark:text-white">
						{status.ploschadka}
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="mt-4 w-full">
		<div
			aria-label="card 1"
			class="mx-auto max-w-2xl rounded bg-blue-400/40 p-6 shadow focus:outline-none dark:bg-blue-500"
		>
			<div class="flex items-center pb-2">
				<div class="flex w-full items-start justify-between">
					<div  class="mx-auto  pl-3">
						<h1
							tabindex="0"
							class="pt-2 text-xl text-gray-800 focus:outline-none dark:text-gray-200"
						>
							{status.event_name}
						</h1>
					</div>
					<h1 tabindex="0" class="pt-2 text-xl text-gray-800 focus:outline-none dark:text-gray-200">
						{status.now_on_scene.band_town}
					</h1>
				</div>
			</div>
		</div>
	</div>
	{#if have_spisok}

		<section style="--gap: {gap}px; --width: {width}" tab-index="0">

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
				{#each actual_spisok_pesen as item, i}
					<li  id={i} class:active={i === index}>
						
							<div
								class="h-24 w-72 my-4 bg-gradient-to-r from-yellow-400 to-pink-500 flex justify-center items-center p-3 rounded-xl border-2 border-slate-100 shadow-lg transition-all transform-all hover:scale-105 cursor-pointer relative"
								
							>
								<div class="text-slate-200 text-center">
									<div>{item.name}</div>
									<div class="font-mono text-xs">{item.track_name}</div>
								</div>
							</div>
					
					</li>
				{/each}
			</ul>
		
		</section>
	{/if}
{:else}
	<div class="w-full mt-4">
		<div
			aria-label="card 1"
			class="mx-auto max-w-2xl rounded bg-blue-400/40 p-6 shadow focus:outline-none dark:bg-blue-500"
		>
			<div class="flex items-center pb-2">
				<div class="flex w-full items-start justify-between">
					<div class="mx-auto  pl-3">
						<h1
							tabindex="0"
							class="pt-2 text-xl text-gray-800 focus:outline-none dark:text-gray-200"
						>
							Виджет "Сейчас на сцене" сейчас не работает. Попробуйте обновить страницу или зайдите попозже)
						</h1>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<KnobHeart eventobj={{status}} index={index}/>


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
	
}
ul li:before {
	content: attr(id);
	position: absolute;
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
