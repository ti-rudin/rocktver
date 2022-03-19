<svelte:options immutable={true} />

<script context="module">
	import { isDarkFlag } from '$lib/siteConfig';

	export const prerender = true; // index page is most visited, lets prerender
</script>

<script>
	import auth from '$lib/services/auth';
	import { isAuthenticated, user } from '$lib/stores/auth';
	import { onMount } from 'svelte';

	let auth0Client;
	let leadsurl = 'https://api.rocktver.ru/track-now-id';
	let apiurl = 'https://api.rocktver.ru/api';
	let t;

	let userset;
	function loadsettings(userid) {
		let myHeaders = new Headers();
		myHeaders.append('Content-Type', 'application/json');

		let raw = JSON.stringify({ id: userid });

		let requestOptions = {
			method: 'POST',
			headers: myHeaders,
			body: raw,
			redirect: 'follow'
		};

		fetch(apiurl, requestOptions)
			.then((response) => response.json())
			.then((result) => {
				console.log(result);
				userset = result.id;
			})
			.catch((error) => console.log('error', error));
	}

	onMount(async () => {
		auth0Client = await auth.createClient();
		isAuthenticated.set(await auth0Client.isAuthenticated());
		user.set(await auth0Client.getUser());

		await fetch(leadsurl)
			.then((r) => r.text())
			.then((result) => (t = result));
	});

	$: if ($isAuthenticated) {
		console.log($user);
		loadsettings($user.id);
	}



	import { slidy } from '@slidy/core';

	import { getIdTrackNow } from '../components/api.js';

	let imagable = true,
		width = imagable ? 'auto' : '50%',
		gap = 16,
		index = 0,
		length = 15,
		scrollPos = 0;

	let items = [];

	let page = Math.trunc(Math.random() * 10);

	async function getCountdown() {
		index = await getIdTrackNow();
	}

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

	onMount(() => {
		//comandes_data = launches;
		//	console.log(comandes_data);
		load();
		VK.Widgets.Auth('vk_auth', {
			onAuth: function (data) {
				alert('user ' + data['uid'] + ' authorized');
				$isAuthenticated = true;
				$user.id = data['uid'];
				$user.name = data['first_name'] + " " + data['last_name'];
				$user.photo = data['photo'];
				$user.photo_rec = data['photo_rec'];
				$user.hash = data['hash'];
			}
		});
	});
	$: track_now_data = ready_track_data[track_now];

	// $: console.log(track_now_data);

	export let trackname = '';
	$: if (track_now_data) {
		trackname = track_now_data.track_name;
	}

	//////////////////////////////////////////////////////
	$: items = ready_comandes_data;
	$: console.log(items);
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';

	console.log(items);
	const flipDurationMs = 300;
	function handleDndConsider(e) {
		items = e.detail.items;
	}
	function handleDndFinalize(e) {
		const { items: newItems } = e.detail;
		items = newItems;
		console.log(items);
	}
</script>

<p>index: [{index}] scrollPos: {Math.trunc(scrollPos)}px</p>

{#if $isAuthenticated}
	<p>qu</p>
	{$user.photo}

{:else}
	<p>Авторизуйтесь</p>

	<div id="vk_auth" />
{/if}

<section
	use:dndzone={{ items, flipDurationMs }}
	on:consider={handleDndConsider}
	on:finalize={handleDndFinalize}
>
	{#each items as item (item.id)}
		<div class="dcl" animate:flip={{ duration: flipDurationMs }}>{item.band_name}</div>
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
