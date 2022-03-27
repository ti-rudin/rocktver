<script>

	import { getEfir, getNow } from '../components/api.js';
	import { isAuthenticated, user } from '$lib/stores/auth';
	import KnobHeart from '../components/KnobHeart.svelte';
	let index = 0,
		imagable = true,
		width = imagable ? 'auto' : '50%',
		gap = 16,
		length = 15,
		scrollPos = 0;
	export let now;
	export let efir;
	export let isshowgo,
		band_on_scene,
		concert,
		timeline,
		status,
		concertid,
		show_name,
		have_spisok,
		actual_spisok_pesen;
	export let 	displaylikes = false;

	async function getData() {
		//index = await getIdTrackNow();
		now = await getNow();
		efir = await getEfir();
		index = now.now_track_id;
		status = efir;
				isshowgo = status.is_show_go;
				have_spisok = status.now_on_scene.have_spisok;
				concertid = +status.concert_id;
				show_name = status.show_name;
				band_on_scene = status.now_on_scene.band_rtid;
				actual_spisok_pesen = status.now_on_scene.actual_spisok_pesen;
				have_spisok = status.now_on_scene.have_spisok;
				console.log(now);
				console.log(status);
				if (now.now_event_id !== "null") { displaylikes = true;}
	}			
$: displaylikes = displaylikes;

	const timerId = setInterval(function () {
		getData();
	}, 2000);

	onDestroy(() => {
		clearInterval(timerId);
	});

	
	import { onDestroy, onMount } from 'svelte';



	import { slidy } from '@slidy/core';

	

	import { blur, crossfade, draw, fade, fly, scale, slide } from 'svelte/transition';

	import LogoComponent from '../components/LogoComponent.svelte';
</script>

<LogoComponent />

{#if isshowgo}
	<div class="w-full">
		<div
			transition:scale={{ duration: 300 }}
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
					<div class="px-4 pt-3 text-center text-xl  text-black dark:text-white">
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
					<div class="mx-auto  pl-3">
						<h1
							tabindex="0"
							class="pt-2 text-xl text-gray-800 focus:outline-none dark:text-gray-200"
						>
							{status.now_on_scene.band_name}
						</h1>
					</div>
					<h1 tabindex="0" class="pt-2 text-xl text-gray-800 focus:outline-none dark:text-gray-200">
						{status.now_on_scene.band_town}
					</h1>
				</div>
			</div>
		</div>
	</div>
	{#if displaylikes}
		
			<div class="mt-4 w-full">
				<div
					aria-label="card 1"
					class="mx-auto max-w-2xl rounded bg-blue-400/40 p-3 pt-4 shadow focus:outline-none dark:bg-blue-500/25"
				>
					<div class=" items-center pb-2">
						<div class="flex  items-start justify-between">
							<div class="mx-auto w-full" />
							<h1
								tabindex="0"
								class="mx-auto pt-2 text-xl text-gray-800 focus:outline-none dark:text-gray-200"
							>
								ВСЕГО
							</h1>
							<div class="mx-auto  px-3">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="37"
									height="37"
									viewBox="-2 -3 28 28"
									stroke="red"
									fill="red"
									stroke-width="1"
								>
									<path
										d="M12 4.4119c-2.826-5.695-11.999-4.064-11.999 3.27 0 7.27 9.903 10.938 11.999 15.311 2.096-4.373 12-8.041 12-15.311 0-7.327-9.17-8.972-12-3.27z"
									/>
								</svg>
							</div>

							<h1 tabindex="0" class="like-btn mx-auto text-4xl">
								{now.now_event_likes}
							</h1>
							{#if now.now_track_likes !== 'null'}
								<div class="mx-auto w-full" />
								<h1
									tabindex="0"
									class="pt-2 text-xl text-gray-800 focus:outline-none dark:text-gray-200"
								>
									ТРЕК
								</h1>
								<div class="mx-auto  px-3">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="37"
										height="37"
										opacity="80%"
										viewBox="-2 -3 28 28"
										stroke="red"
										fill="red"
										stroke-width="1"
									>
										<path
											d="M12 4.4119c-2.826-5.695-11.999-4.064-11.999 3.27 0 7.27 9.903 10.938 11.999 15.311 2.096-4.373 12-8.041 12-15.311 0-7.327-9.17-8.972-12-3.27z"
										/>
									</svg>
								</div>
								<h1 tabindex="0" class="like-btn text-4xl">
									{now.now_track_likes}
								</h1>
								
							{/if}
							<div class="mx-auto w-full" />
						</div>
					</div>
				</div>
			</div>
			<KnobHeart user = {$user} now = {now} efir = {efir} eventobj={{ status }} {index} />
		
	{/if}

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
					<li id={i} class:active={i === index}>
						<div
							class="transform-all relative my-4 flex h-24 w-72 cursor-pointer items-center justify-center rounded-xl border-2 border-slate-100 bg-gradient-to-r from-yellow-400 to-pink-500 p-3 shadow-lg transition-all hover:scale-105"
						>
							<div class="text-center text-slate-200">
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
							Виджет "Сейчас на сцене" сейчас не работает. Попробуйте обновить страницу или зайдите
							попозже)
						</h1>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.like-btn {
		color: red;
		display: flex;
		justify-content: center;
	}
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
