<script context="module">
	export async function load({ params, fetch }) {
		const res = await fetch('https://admin.rocktver.ru/graphql', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				query: `{
          bands (pagination:{pageSize:100}) {
            data {
              id
              
              attributes {
                band_name
                spisok {
                  ... on ComponentPesniTrack {
                    
                    id
                    name
                    text
                  }
                }
              }
            }
          }
        }`
			})
		});
		if (res.ok) {
			const { data } = await res.json();
			console.log(data);
			return {
				props: {
					launches: data.bands.data,
					id: params.id
				}
			};
		}
		return {
			status: res.status,
			error: new Error(`Error fetching GraphQL data`)
		};
	}
</script>

<script>
	import LogoComponent from '../../components/LogoComponent.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { isAuthenticated, user } from '$lib/stores/auth';
	export let status, isshowgo, band_on_scene;
	export let concert, timeline, concertid, show_name, have_spisok, actual_spisok_pesen;

	async function load_open_status() {
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
				band_on_scene = status.now_on_scene.band_rtid;
				return result;
			})
			.catch((error) => console.log('error', error));
	}
	onMount(() => {
		load_open_status();
	});

	export let isonscene, launches, launch, id, spisok;

	launch = launches.filter((launch) => launch.attributes.band_name == id)[0];

	if (launch.attributes.spisok) {
		spisok = launch.attributes.spisok;
	}

	$: if (band_on_scene == launch.id) {
		console.log('re');
		isonscene = true;
	} else {
		isonscene = false;
	}

	//////////////////

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
				
			})
			.catch((error) => console.log('error', error));
	}

	onMount(() => {
		load_efir();
	});

	import { slidy } from '@slidy/core';
	import { getIdTrackNow } from '../../components/api.js';
import { isAdmin } from '$lib/siteConfig';
	let index = 0,
		imagable = true,
		width = imagable ? 'auto' : '50%',
		gap = 16,
		length = 15,
		scrollPos = 0;



	function change_track(userid,x) {
		let myHeaders = new Headers();
		myHeaders.append('Content-Type', 'application/json');
		

		let raw = JSON.stringify({ userid: userid, x:x, bandid: launch.id });

		let requestOptions2 = {
			method: 'POST',
			headers: myHeaders,
			body: raw
		};

		fetch('https://api.rocktver.ru/change-track', requestOptions2)
			.then((response) => response.json())
			.then((result) => {
				return result;
			})
			.catch((error) => console.log('error', error));
	}

	$: if ($isAuthenticated) {
			let userid = $user.id;
			console.log("index"+userid);
			
			change_track(userid, index)
		}
		
	
</script>
{$isAuthenticated}

<LogoComponent />
<div class="mx-auto text-gray-900 dark:text-white">
	<h1>Команда</h1>

	{#if launch}
		<h2>{launch.attributes.band_name}</h2>
		<h2>{launch.id}</h2>

		{isshowgo}
	{:else}
		<h1>Что-то пошло не так. Информация о группе не загрузилась.</h1>
	{/if}
	<ul />
</div>

<div class="w-full ">
	<div
		aria-label="card 1"
		class="mx-auto max-w-2xl rounded bg-red-400/40 p-6 shadow focus:outline-none dark:bg-red-500"
	>
		<div class="flex items-center border-b border-gray-200 pb-6">
			<div class="flex w-full items-start justify-between">
				<div class="w-full pl-3">
					<h1 tabindex="0" class="text-2xl text-black focus:outline-none dark:text-gray-200">
						{launch.attributes.band_name}
					</h1>
					<h1 tabindex="0" class="pt-2 text-xl text-gray-800 focus:outline-none dark:text-gray-200">
						{#if isonscene}
							Сейчас на сцене
						{/if}
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
			<p
				tabindex="0"
				class="py-4 text-sm leading-5 text-gray-600 focus:outline-none dark:text-gray-200"
			/>
			<div tabindex="0" class="flex flex-col focus:outline-none">
				<div class="mb-3 py-2 px-4  text-center text-lg leading-3 text-black dark:text-white">
					Концертная площадка
				</div>
				<a
					href="/"
					target="blank"
					tabindex="0"
					class="mx-auto w-fit rounded-full bg-yellow-400 p-2 px-4  px-3 text-xl text-black ring-yellow-400 transition-all
				hover:ring-2 dark:bg-yellow-800 dark:text-white"
				>
					площадка
				</a>
				<div class="my-3 py-2 px-4  text-center text-lg leading-3 text-black dark:text-white">
					стоимость билета
				</div>
			</div>
		</div>
	</div>
</div>


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
		{#each spisok as item, i}
			<li id={i} class:active={i === index}>
				<div
					class="transform-all relative my-4 flex h-24 w-72 cursor-pointer items-center justify-center rounded-xl border-2 border-slate-100 bg-gradient-to-r from-yellow-400 to-pink-500 p-3 shadow-lg transition-all hover:scale-105"
				>
					<div class="text-center text-slate-200">
						<div>{item.name}</div>
						<div class="font-mono text-xs">{item.id}</div>
					</div>
				</div>
			</li>
		{/each}
	</ul>
</section>
{index}
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
