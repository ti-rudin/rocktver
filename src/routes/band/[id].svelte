<script context="module">
	export async function load({ params, fetch }) {
		const res = await fetch('https://admin.rocktver.ru/graphql', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				query: `{
          bands(pagination: { pageSize: 100 }) {
    data {
      id
      attributes {
        band_name
        town
        small_text
        big_text
        group_logo {
          data {
            attributes {
              url
            }
          }
        }
        group_link_vk
        group_link_rocktver
        mngr_id
        time_on_scene
        artists {
          data {
            attributes {
              name
              avatar {
                data {
                  attributes {
                    url
                  }
                }
              }
              role
              vk_link
            }
          }
        }
        spisok  {
          ... on ComponentPesniTrack {
            name
            text
            words_rights
            music_rights
            year_born
            is_premiere
            id
          }
        }
      }
    }
  }
  concerts {
    data {
      id
      attributes {
        start_date
				ploschadka

        bilet_ot
        url_website
        show_name
        spisok (pagination: { pageSize: 100 }) {
          ... on ComponentBandsTimeline {
            id
            band {
              data {
                id
                attributes {
                  band_name
                  
                }
              }
            }
            title
            slovo_vedusch
            tech_pause
            open_speache
            finish_speache
          }
        }
      }
    }
  }
}
`
			})
		});
		if (res.ok) {
			const { data } = await res.json();
			//console.log(data);
			let bandsdata = data.bands.data;
			let bandsobj = [];
			//транспонируем масив
			bandsdata.forEach((band, id) => {
				bandsobj[band.id] = band;
			});
			//чистим нули
			bandsobj = bandsobj.filter(function (el) {
				return (el != null && el != '') || el === 0;
			});

			//console.log('bands ---' + JSON.stringify(bandsobj));
			return {
				props: {
					bands: bandsobj,
					concerts: data.concerts.data,

					launches: bandsobj,
					id: params.id
				}
			};
		}

		return {
			status: res.status,
			error: new Error(`Error fetching GraphQL data`)
		};
	}
	export const prerender = true;
</script>

<script>
	import { getEfir2, getNow } from '../../components/api.js';
	import LogoComponent from '../../components/LogoComponent.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { isAuthenticated, user } from '$lib/stores/auth';
	import { isDarkFlag, isMngr, isAdmin } from '$lib/siteConfig';
	import { goto } from '$app/navigation';
	export let status, isshowgo, band_on_scene;
	//export let concert, bands
	export let concertid, show_name, have_spisok, actual_spisok_pesen, ploschadka;

	export let now, efir;
	async function load_open_status() {
		now = await getNow();
		efir = await getEfir2($user);
		//index = Number(now.now_track_id);
		status = efir;
		isshowgo = status.is_show_go;
		have_spisok = status.now_on_scene.have_spisok;
		concertid = +status.concert_id;
		show_name = status.show_name;
		band_on_scene = status.now_on_scene.band_rtid;
		actual_spisok_pesen = status.now_on_scene.actual_spisok_pesen;
		have_spisok = status.now_on_scene.have_spisok;
		ploschadka = status.ploschadka;
		//console.log(now);
		//console.log(status);
	}
	onMount(() => {
		load_open_status();
	});

	export let isonscene, launches, launch, id, spisok, artists;

	$: launch = launches.filter((launch) => launch.attributes.band_name == id)[0];

	//$: efir = efir;

	$: if (launch.attributes.spisok) {
		spisok = launch.attributes.spisok;
	}

	$: if (launch.attributes.artists) {
		artists = launch.attributes.artists.data;
	} else {
		artists = false;
	}

	$: if (band_on_scene == launch.id) {
		//console.log('re');
		isonscene = true;
	} else {
		isonscene = false;
	}

	import { slidy } from '@slidy/core';

	let index = 0,
		imagable = true,
		width = imagable ? 'auto' : '50%',
		gap = 16,
		length = 15,
		scrollPos = 0;

	function change_track(userid, x) {
		if( (userid == launch.attributes.mngr_id) || $isAdmin) {
			//console.log('launch'+launch.attributes.mngr_id );

			let myHeaders = new Headers();
			myHeaders.append('Content-Type', 'application/json');

			let raw = JSON.stringify({
				userid: userid,
				track_i: x,
				bandid: launch.id,
				cmd: 'change-track'
			});

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
	}

	$: if ($isAuthenticated) {
		
		change_track($user.id, +index);
	}

</script>

<LogoComponent />

<div class="mt-1 w-full ">
	<div
		aria-label="card 1"
		class="mx-auto max-w-2xl rounded bg-blue-400/70 p-6 shadow  dark:bg-blue-500 "
	>
		<div
			class="flex cursor-pointer rounded ring-yellow-400 transition-all hover:ring-2 focus:outline-none"
			on:click={() => {
				goto('/band/' + launch.attributes.band_name);
			}}
		>
			{#if launch.attributes.group_logo.data}
			<img
				class=" h-28 w-28 w-full rounded shadow"
				src={'https://admin.rocktver.ru' + launch.attributes.group_logo.data.attributes.url}
				alt=""
			/>
			{:else}
			<img
				class=" h-28 w-28 w-full rounded shadow"
				src="/rock-band-icon-9.jpg"
				alt=""
			/>

			{/if}

			<div>
				<h1 class="pl-4 text-xl text-gray-800 focus:outline-none dark:text-white">
					{launch.attributes.band_name}
				</h1>

				<h1 class="pl-4 text-lg text-pink-600 focus:outline-none dark:text-pink-300">
					{launch.attributes.town}
				</h1>
			</div>
		</div>
		<div class="mx-auto my-3">
			<div class="textcard">
				{#if launch.attributes.big_text}
				{launch.attributes.big_text}
				{/if}
				
			</div>
		</div>

		<div class="flex flex-col">
			{#if artists}
				{#each artists as artist}
					<div
						class="flex cursor-pointer rounded ring-yellow-400 transition-all hover:ring-2 focus:outline-none"
						on:click={() => {
							goto('/person/' + artist.attributes.name);
						}}
					>
						<img
							class="mr-2 mb-1 h-14 w-14 rounded-full "
							src={'https://admin.rocktver.ru' + artist.attributes.avatar.data.attributes.url}
							alt=""
						/>
						<p class="lblock  mt-1 border-t border-white/30">{artist.attributes.name}</p>
						<p
							class="lblock ml-1 mt-1 border-t border-white/30 text-left text-gray-700 dark:text-gray-300"
						>
							{artist.attributes.role}
						</p>
					</div>
				{/each}
			{/if}
		</div>
	</div>
</div>
{#if launch.attributes.spisok[0]}
	<h1 class="mx-auto mt-3 text-2xl ">Программа выступления</h1>
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
				<li class:active={i == index} class="">
					<div
						class="transform-all trackcard justify-top relative mt-3 mb-2 flex cursor-pointer flex-col items-center rounded-xl border-2 border-slate-100 bg-gradient-to-r from-blue-400 to-pink-500 p-3 shadow-lg transition-all hover:scale-105"
					>
						<div class="text-center text-2xl text-slate-200">
							<div>{item.name}</div>
						</div>
						<div class="flex w-full flex-col text-left">
							<div class="mx-auto" />

							<div class="mt-1 flex flex-col text-slate-200">
								<div class="font-mono text-xs">Музыка:</div>
								<div class="">{item.music_rights}</div>
							</div>

							<div class="mt-1 flex flex-col text-slate-200">
								<div class="font-mono text-xs">Слова:</div>
								<div class="">{item.words_rights}</div>
							</div>
							<div class="mt-1 flex  flex-col text-slate-200">
								<div class="font-mono text-xs">Год создания:</div>
								<div class="">
									{item.year_born}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
								</div>
							</div>

							<div class="mx-auto" />
						</div>

						{#if item.is_premiere}
							<div class="prem border-1 ml-10 rounded-xl px-2 text-lg">ПРЕМЬЕРА</div>
						{/if}
					</div>
				</li>
			{/each}
		</ul>
	</section>
	<div class="mx-auto mt-2 max-w-2xl">
		<div
			aria-label="card 1"
			class="mx-auto flex rounded bg-blue-100/30 p-6 shadow focus:outline-none dark:bg-blue-500"
		>
			<div class="textcard">
				{spisok[index].text}
			</div>
		</div>
	</div>
{/if}

<style>
	.prem {
		color: rgb(235, 222, 46);
		position: absolute;
		right: 0.5rem;
		bottom: 0.5rem;
		background-color: rgb(255, 127, 191);
	}
	.textcard {
		white-space: pre-wrap;
		word-wrap: break-word;
	}
	.trackcard {
		height: 13.5rem;
	}
	.like {
		color: red;
		display: flex;
		justify-content: center;
		opacity: 0;
	}
	.active .like {
		opacity: 1;
	}

	.like-btn {
		color: red;
		display: flex;
		justify-content: center;
		height: 5.4rem;
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
		max-width: 85%;
		height: auto;
		position: relative;
		opacity: 20%;
	}
	ul li:before {
		content: attr(id);
		position: absolute;
		padding: 1rem;
		z-index: 1;
	}

	.active {
		color: red;
		opacity: 100%;
	}
	.lblock {
		width: 40vw;
	}
</style>
