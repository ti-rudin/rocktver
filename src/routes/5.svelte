<svelte:options immutable={true} />

<script context="module">
	import { isDarkFlag } from '$lib/siteConfig';

	export const prerender = true; // index page is most visited, lets prerender
</script>

<script>
	import { slidy } from '@slidy/core';

	import { getIdTrackNow } from '../components/api.js';

	let items = [],
		imagable = true,
		width = imagable ? 'auto' : '50%',
		gap = 16,
		index = 0,
		length = 15,
		scrollPos = 0;

	let page = Math.trunc(Math.random() * 10);

	async function getCountdown() {
        index = await getIdTrackNow();
        
    };

    const timerId = setInterval(function () {
		getCountdown();
	}, 2000);

	const timerIdS = setTimeout(function () {
		getCountdown();
	}, 500);

	
	
///////////////////////////////////////////////////
	export let ready_comandes_data = [];
	export let ready_track_data = [];
    export let track_now_data = {
						band_name: '',
						band_id: '',
						track_id: '',
						track_name: '',
						track_text: ''
					};
    export let track_now = 1;
	async function load() {
		const res = await fetch('https://admin.rocktver.ru/graphql', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				query: `{
	            bands {
	              data {
	                id
				
	                attributes {
                    artists{
                      data{
						id
                        attributes{
                          name
                          avatar{
                            data{
                              attributes{url}
                            }
                          }
                          
                        }
                      }
                    }
	                  band_name
	                  town
	                  small_text
	                  group_logo{
	                    data{
	                      attributes{
	                        url
	                      }
	                    }
	                  }
	                  group_link_vk
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

			const comandes_data = data.bands.data;

			ready_comandes_data = await comandes_data.map((item) => {
				const container = {};
				//if (item.attributes ){
				//	container[item.path] = item.attributes.group_logo.data.attributes.url;
				//}
				container.band_name = item.attributes.band_name;
				if (item.attributes.group_logo.data !== null) {
					container.path =
						'https://admin.rocktver.ru' + item.attributes.group_logo.data.attributes.url;
				} else {
					container.path = 'rock-band-icon-9.jpg';
				}
				container.id = 'images' + item.id;
				container.url = 'band/' + container.band_name;
				return container;
			});

			let ready_artists_data = [];
			comandes_data.forEach((item) => {
				let artists = item.attributes.artists.data;
				let tracks = item.attributes.spisok;

				artists.forEach((item) => {
					let url = 'icon-person-10.jpg';
					if (item.attributes.avatar.data !== null) {
						url = 'https://admin.rocktver.ru' + item.attributes.avatar.data.attributes.url;
					}

					const container = {
						path: url,
						id: item.id,
						url: 'person/' + item.attributes.name
					};
					ready_artists_data = [...ready_artists_data, container];
				});

				tracks.forEach((track) => {
					const container2 = {
						band_name: item.attributes.band_name,
						band_id: item.id,
						track_id: track.id,
						track_name: track.name,
						track_text: track.text
					};

					ready_track_data = [...ready_track_data, container2];
				});
			});

			//console.log(ready_artists_data);
			//console.log(data);
			console.log(ready_track_data);

			return {
				props: {
					ready_comandes_data: ready_comandes_data,
					ready_artists_data: ready_artists_data,
                    ready_track_data: ready_track_data
				}
			};
		}
		return {
			status: res.status,
			error: new Error(`Error fetching GraphQL data`)
		};
	}

	import { onMount } from 'svelte';


	onMount(() => {
		//comandes_data = launches;
		//	console.log(comandes_data);
		load();
		
        
	});
    $: track_now_data = ready_track_data[track_now];
    
    $: console.log(track_now_data);

    export let trackname = '';
  $: if (track_now_data) {
        trackname = track_now_data.track_name;
    }

//////////////////////////////////////////////////////

</script>

<p>index: [{index}] scrollPos: {Math.trunc(scrollPos)}px</p>

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
			{#each ready_track_data as item, i}
				<li id={i} class:active={i === index}>
					
						<div
							class="h-24 w-72 my-4 bg-gradient-to-r from-yellow-400 to-pink-500 flex justify-center items-center p-3 rounded-xl border-2 border-slate-100 shadow-lg transition-all transform-all hover:scale-105 cursor-pointer relative"
							
						>
							<div class="text-slate-200 text-center">
								<div>{item.band_name}</div>
								<div class="font-mono text-xs">{item.track_name}</div>
							</div>
						</div>
				
				</li>
			{/each}
		</ul>
	
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
