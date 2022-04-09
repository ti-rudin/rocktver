<svelte:options immutable={true} />

<script context="module">
	import { isDarkFlag } from '$lib/siteConfig';

	export const prerender = true; // index page is most visited, lets prerender
</script>

<script>
	import { slidy } from '@slidy/core';

	import { getIdTrackNow } from '../components/api.js';

	let 
		imagable = true,
		width = imagable ? 'auto' : '50%',
		gap = 16,
		index = 0,
		length = 15,
		scrollPos = 0;

		let items = [];

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
				container.id = item.id;
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
						id: Number(track.id),
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
    
   // $: console.log(track_now_data);

    export let trackname = '';
  $: if (track_now_data) {
        trackname = track_now_data.track_name;
    }

//////////////////////////////////////////////////////
$: items = ready_comandes_data;
$: console.log(items)
import {flip} from "svelte/animate";
    import {dndzone} from "svelte-dnd-action";
    
	console.log(items)
    const flipDurationMs = 300;
    function handleDndConsider(e) {
        items = e.detail.items;

    }
    function handleDndFinalize(e) {
		const {items:newItems} = e.detail;
		items = newItems
		console.log(items)
    }
	
</script>

<p>index: [{index}] scrollPos: {Math.trunc(scrollPos)}px</p>


<section use:dndzone="{{items, flipDurationMs}}" on:consider="{handleDndConsider}" on:finalize="{handleDndFinalize}">
    {#each items as item(item.id)}
    <div class="dcl" animate:flip="{{duration: flipDurationMs}}">{item.band_name}</div>
    {/each}
</section>

<style>
	 section {
        width: 50%;
        padding: 0.3em;
        border: 1px solid black;
        /* this will allow the dragged element to scroll the list */
        overflow: scroll;
        height: 200px;
    }
    .dcl {
        width: 50%;
        padding: 0.2em;
        border: 1px solid blue;
        margin: 0.15em 0;
    }

</style>
