<script context="module">
	export async function load({ fetch }) {
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
			bandsdata.forEach((band, id) => {
				bandsobj[band.id] = band;
			});
			bandsobj = bandsobj.filter(function (el) {
				return (el != null && el != '') || el === 0;
			});
			console.log('bands ---' + JSON.stringify(bandsobj));
			return {
				props: {
					bands: bandsobj,
					concerts: data.concerts.data
				}
			};
		}
		return {
			status: res.status,
			error: new Error(`Error fetching GraphQL data`)
		};
	}
	//export const prerender = true;
</script>

<script>
	import { goto } from '$app/navigation';
	import LogoComponent from '../components/LogoComponent.svelte';
	//export let concerts
	export let bands;
	//console.log(this.artists.data[0].attributes.name)
	$: launches = launches;
</script>

<LogoComponent />
<h1 class="mx-auto max-w-2xl text-2xl">Все команды</h1>

<div class="w-full ">
	{#each bands as band}
		<div class="mt-3 w-full  ">
			<div
				aria-label="card 1"
				class="mx-auto max-w-2xl cursor-pointer rounded-lg bg-blue-400/70 p-6 shadow ring-yellow-400 transition-all  dark:bg-blue-500 "
			>
				{#if band}
					<div
						class="flex cursor-pointer rounded ring-yellow-400 transition-all hover:ring-2 focus:outline-none"
						on:click={() => {
							goto('/band/' + band.attributes.band_name);
						}}
					>
						{#if band.attributes.group_logo.data}
							<img
								class=" h-28 w-28 w-full rounded shadow"
								src={'https://admin.rocktver.ru' + band.attributes.group_logo.data.attributes.url}
								alt=""
							/>
						{:else}
							<img class=" h-28 w-28 w-full rounded shadow" src="/rock-band-icon-9.jpg" alt="" />
						{/if}
						<div>
							<h1 class="pl-4 text-2xl text-gray-800 focus:outline-none dark:text-white">
								{band.attributes.band_name}
							</h1>

							<h1 class="pl-4 text-xl text-pink-600 focus:outline-none dark:text-pink-300">
								{band.attributes.town}
							</h1>
							{#if band.attributes.small_text}
							<p class="pl-4">{band.attributes.small_text}</p>
							{/if}
							
						</div>
					</div>

					<div class="flex flex-col">
						{#each band.attributes.artists.data as artist}
							<div
								class="flex cursor-pointer rounded ring-yellow-400 transition-all hover:ring-2 focus:outline-none"
								on:click={() => {
									goto('/person/' + artist.attributes.name);
								}}
							>
								<img
									class="mr-2 mb-1 h-12 w-12 rounded-full "
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
					</div>
				{/if}
			</div>
		</div>
	{/each}
</div>

<style>
	.lblock {
		width: 40vw;
	}
</style>
