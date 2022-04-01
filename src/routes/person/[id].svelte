<script context="module">
	export async function load({ params, fetch }) {
		const res = await fetch('https://admin.rocktver.ru/graphql', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				query: `{
  artists(pagination: { pageSize: 500 }) {
    data {
      id
      attributes{
        name
        avatar{
          data{
            attributes{
              url
            }
          }
        }
        vk_link
        role
        bands{
          data{
            attributes{
              band_name
              group_logo{
                data{
                  attributes{
                    url
                  }
                }
              }
            }
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
					launches: data.artists.data,
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
	import * as htmlToImage from 'html-to-image';
	import { toPng, toJpeg, toSvg } from 'html-to-image';

	import { onDestroy, onMount } from 'svelte';

	export let launches, launch, id, htmlimg, imgurl;

	launch = launches.filter((launch) => launch.attributes.name == id)[0];

	$: imgurl = imgurl;
	function download() {
		htmlToImage.toJpeg(htmlimg, { quality: 0.95 }).then(function (dataUrl) {
			//console.log(dataUrl)
			imgurl = dataUrl;
			var link = document.createElement('a');
			link.download = 'my-image-name.jpeg';
			link.href = dataUrl;
			link.click();
		});
	}

	function repost() {
		htmlToImage.toJpeg(htmlimg, { quality: 0.95 }).then(function (dataUrl) {
			//console.log(dataUrl)
			imgurl = dataUrl;
		});
	}

	onMount(() => {
		document.getElementById(
			'vk_share_button'
		).innerHTML = VK.Share.button('https://rocktver.ru/person/' + launch.attributes.name, {
			type: 'round_nocount',
			text: 'Опубликовать на своей странице'
		});
	});
</script>

<svelte:head>
	<meta property="og:url" content={'https://rocktver.ru/person/' + launch.attributes.name} />
	<meta property="og:title" content={launch.attributes.name + ' - РОКОПОЛЧЕНИЕ 2022'} />
    <meta property="og:image"  content={imgurl} />
</svelte:head>

<LogoComponent />
<div id="vk_share_button" />
{#if launch}
	<div bind:this={htmlimg} class="mt-1 w-full ">
		<div
			aria-label="card 1"
			class="mx-auto max-w-2xl cursor-pointer rounded-lg bg-blue-400/70 p-6 shadow ring-yellow-400 transition-all hover:ring-2 focus:outline-none dark:bg-blue-500 "
		>
			<img
				class="mx-auto w-full max-w-sm rounded shadow"
				src={'https://admin.rocktver.ru' + launch.attributes.avatar.data.attributes.url}
				alt=""
			/>
			<h2 class="mx-auto max-w-sm text-2xl">{launch.attributes.name}</h2>
		</div>
	</div>
	<div class="mt-3 w-full ">
		<div
			aria-label="card 1"
			class="mx-auto max-w-2xl cursor-pointer rounded-lg bg-blue-400/70 p-6 shadow ring-yellow-400 transition-all hover:ring-2 focus:outline-none dark:bg-blue-500 "
			on:click={() => {
				repost();
			}}
		>
			ghjhg
		</div>
	</div>
	<div class="mx-auto text-gray-900 dark:text-white">
		<h1>Персона</h1>

		<h2>{launch.attributes.avatar.data.attributes.url}</h2>
		<h2>{launch.id}</h2>
		<h2>{launch.id}</h2>
		<h2>{launch.id}</h2>
		<h2>{launch.id}</h2>
	</div>
{:else}
	<div class="mt-1 w-full ">
		<div
			aria-label="card 1"
			class="mx-auto max-w-2xl cursor-pointer rounded-lg bg-blue-400/70 p-6 shadow ring-yellow-400 transition-all hover:ring-2 focus:outline-none dark:bg-blue-500 "
		>
			<div class="mx-auto">Об этой персоне информации нет...</div>
			<div class="mx-auto">Правильно ли указано имя?</div>
			<h1 class="text-2xl mx-auto">{id}</h1>
		</div>
	</div>
{/if}

<style>
</style>
