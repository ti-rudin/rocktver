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
import { goto } from '$app/navigation';

	export let launches, launch, id, htmlimg, imgurl;

	launch = launches.filter((launch) => launch.attributes.name == id)[0];

	$: imgurl = imgurl;
	function download() {
		htmlToImage.toJpeg(htmlimg, { quality: 0.95 }).then(function (dataUrl) {
			//console.log(dataUrl)
			imgurl = dataUrl;
			//var link = document.createElement('a');
			//link.download = 'my-image-name.jpeg';
			//link.href = dataUrl;
			//link.click();

			//http://vk.com/share.php?url={$url}&title={$titleVk}&description={$desc}&image={$image}&noparse=true
			//http://vk.com/share.php?url={$url}&image={$image}&noparse=true
		});
	}

	function repost() {
		htmlToImage.toJpeg(htmlimg, { quality: 0.95 }).then(function (dataUrl) {
			//console.log(dataUrl)
			imgurl = dataUrl;
			//fetch('')
		});
	}

	

	onMount(() => {
		repost();
		//console.log(imgurl);
		document.getElementById(
			'vk_share_button'
		).innerHTML = VK.Share.button(false,{type: "round", text: "Поделиться", image:"https://admin.rocktver.ru/uploads/rf_A_v0_Imk_NU_3f1957f5b7.jpg"});
	});
	$: imgurl = imgurl;
	export let s, s2;

	$: s = 'http://vk.com/share.php?url=https://dev--rocktver.netlify.app/person/' + String(launch.attributes.name) + '&image='+ imgurl + '&noparse=true';
	$: s2 = 'http://vk.com/share.php?url=https://dev--rocktver.netlify.app/person/' + String(launch.attributes.name) + '&image=https://admin.rocktver.ru/uploads/rf_A_v0_Imk_NU_3f1957f5b7.jpg';

	//$: console.log(imgurl);
</script>

<svelte:head>

	<meta property="image"  content='https://admin.rocktver.ru/uploads/rf_A_v0_Imk_NU_3f1957f5b7.jpg' />




	<title>{launch.attributes.name + ' - УЧАСТНИК РОК-ОПОЛЧЕНИЯ 2022'}</title>
	<link rel="canonical" href={'https://dev--rocktver.netlify.app/person/' + launch.attributes.name} />
	<meta property="og:url" content={'https://dev--rocktver.netlify.app/person/' + launch.attributes.name}/>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={launch.attributes.name + ' - УЧАСТНИК РОК-ОПОЛЧЕНИЯ 2022'} />
	<meta name="Description" content={'Я участник музыкального праздника для честных людей!'} />
	<meta property="og:description" content={'Я участник музыкального праздника для честных людей!'} />
	<meta property="og:image" content='https://admin.rocktver.ru/uploads/rf_A_v0_Imk_NU_3f1957f5b7.jpg' />
	<meta name="twitter:card" content="summary" />

	<meta name="twitter:title" content={launch.attributes.name + ' - УЧАСТНИК РОК-ОПОЛЧЕНИЯ 2022'} />
	<meta name="twitter:description" content={'Я участник музыкального праздника для честных людей!'} />
	<meta name="twitter:image" content='https://admin.rocktver.ru/uploads/rf_A_v0_Imk_NU_3f1957f5b7.jpg' />

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
		<a
			aria-label="card 1"
			class="mx-auto max-w-2xl cursor-pointer rounded-lg bg-blue-400/70 p-6 shadow ring-yellow-400 transition-all hover:ring-2 focus:outline-none dark:bg-blue-500 "
			href="https://vk.com/share.php?url=https://rocktver.ru/person//Антон%20Невзоров&image=https://admin.rocktver.ru/uploads/rf_A_v0_Imk_NU_3f1957f5b7.jpg"
			

		>
			ghjhg
		</a>
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
	#vk_share_button{
		width: 50vw;
	}
</style>
