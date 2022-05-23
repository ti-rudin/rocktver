<script context="module">
	export async function load({ params, fetch }) {
		const res = await fetch('https://admin.rocktver.ru/graphql', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				query: `{
  lotereyas {
    data {
      attributes {
        title
        loter_id
      }
    }
  }
}`
			})
		});
		if (res.ok) {
			const { data } = await res.json();
			//console.log(data);
			return {
				props: {
					launches: data.lotereyas.data,

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
	import LogoComponent from '../../components/LogoComponent.svelte';
	import Ramka1 from '../../components/Ramka1.svelte';
	import * as htmlToImage from 'html-to-image';
	import { toPng, toJpeg, toSvg } from 'html-to-image';

	import { onDestroy, onMount } from 'svelte';
	import { goto } from '$app/navigation';

    import { isAuthenticated, user } from '$lib/stores/auth';


	export let launches, launch, id, htmlimg, imgurl, bands, site;

	site = 'https://rocktver.ru/';
	//site = 'https://dev--rocktver.netlify.app/person/';

	launch = launches.filter((launch) => launch.attributes.loter_id == id)[0];


	function download() {
		var link = document.createElement('a');
		link.download = $user.name + '-in-RockTver.jpeg';
		link.href = imgurl;
		link.click();

		//http://vk.com/share.php?url={$url}&title={$titleVk}&description={$desc}&image={$image}&noparse=true
		//http://vk.com/share.php?url={$url}&image={$image}&noparse=true
	}

	function postprepare() {
		htmlToImage.toJpeg(htmlimg, { quality: 0.95 }).then(function (dataUrl) {
			//console.log(dataUrl)
			imgurl = dataUrl;
			//fetch('')
		});
	}

	onMount(() => {
		postprepare();
		//console.log(imgurl);
		document.getElementById('vk_share_button').innerHTML = VK.Share.button(false, {
			type: 'round',
			text: 'Поделиться',
			image: imgurl,
			noparse: true
		});
	});
	$: imgurl = imgurl;
	export let  imguserurl;

    $: imguserurl = $user.photo;

	

	//$: console.log(imgurl);
</script>

<svelte:head>
	<meta property="image" content={imgurl} />

	<title>{$user.name}  - УЧАСТНИК РОК-ОПОЛЧЕНИЯ 2022</title>
	<link rel="canonical" href={site} />
	<meta property="og:url" content={site} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={$user.name+'- УЧАСpppТНИК РОК-ОПОЛЧЕНИЯ 2022'} />
	<meta name="Description" content='Я участник музыкального праздника для честных людей!' />
	<meta
		property="og:description"
		content='Я участник музыкального праздника для честных людей!'
	/>
	<meta property="og:image" content={imgurl} />
	<meta name="twitter:card" content="summary" />

	<meta name="twitter:title" content={$user.name + ' - УЧАСТhggНИК РОК-ОПОЛЧЕНИЯ 2022'} />
	<meta
		name="twitter:description"
		content='Я участник музыкального праздника для честных людей!'
	/>
	<meta name="twitter:image" content={imgurl} />
</svelte:head>
<LogoComponent />
{#if isAuthenticated}


	{#if imgurl}
		<div class="mx-auto max-w-xl">
			<img class="" src={imgurl} alt="" />
		</div>
	{:else}
	<div class="mx-auto max-w-xl">
		<div
			bind:this={htmlimg}
			class="maskpic mx-auto  flex flex-col bg-white p-4 text-black dark:bg-gray-900 dark:text-white"
		>
			

			<div aria-label="card 1" class="mx-auto rounded-lg">
				<div class="readypic">
					<Ramka1 img={imguserurl} />
				</div>
				<h2 class="name mr-auto ml-3">{$user.name}</h2>
			</div>
			
		
		</div>
	</div>
	{/if}
	<div class="mt-3 w-full">
		<div
			aria-label="card 1"
			class="mx-auto max-w-2xl rounded-lg bg-blue-400/50 pb-3 shadow dark:bg-blue-500/20 "
		>
			<div class=" mx-auto p-4 text-center text-gray-800 focus:outline-none dark:text-white">
				Скачайте готовую картинку для постинга на любых своих ресурсах.<br />
				Помогите узнать о нас как можно больше широкому кругу людей!
			</div>

			<div
				aria-label="card 1"
				class="mx-auto mb-2 max-w-[60%] text-xl cursor-pointer rounded-lg bg-blue-400/70 p-2 text-center shadow ring-1 ring-yellow-400 transition-all hover:ring-2 focus:outline-none dark:bg-blue-300/40 "
				on:click={() => {
					download();
					ym(88086612, 'reachGoal', 'download pic');
				}}
			>
				Скачать открытку
			</div>
		</div>
	</div>

	<div class="mt-3 w-full ">
		<div
			aria-label="card 1"
			class="mx-auto max-w-2xl rounded-lg bg-blue-400/50 pb-3 shadow dark:bg-blue-500/20 "
		>
			<div class=" mx-auto p-4 text-center text-gray-800 focus:outline-none dark:text-white">
				Поделитесь этой страницей в социальных сетях!<br />
				Помогите узнать о нас как можно больше широкому кругу людей!
			</div>

			<div
				class="pb-4 pt-2"
				id="vk_share_button"
				on:click={() => {
					ym(88086612, 'reachGoal', 'repost pic');
				}}
			/>
		</div>
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
	.readypic {
	}
	.maskpic {
		max-width: fit-content;
		min-width: 27rem;
	}
	#vk_share_button {
		transform: scale(1.8);
		position: relative;
		width: 1rem;
		left: -4.7rem;
		margin-left: auto;
		margin-right: auto;
	}

	.name {
		color: red;
		max-width: fit-content;
		bottom: 6rem;
		position: relative;
		z-index: 100;
		font-weight: bold;
		font-size: 1.3rem;
		line-height: 1.3rem;
	}
	.role {
		opacity: 0.8;
		color: red;
		width: 100%;
		position: relative;
		bottom: 1rem;
		z-index: 100;
		padding-bottom: 5px;
		font-size: 1.4rem;
		line-height: 1.4rem;
		background: radial-gradient(
			50% 50% at 50% 50%,
			rgba(255, 0, 0, 0.48) 18.09%,
			rgba(255, 0, 0, 0) 94.21%
		);
	}
	.urlonscreen {
		opacity: 0.8;
		color: red;
		opacity: 0.5;
		width: 100%;
		position: relative;
		bottom: 0.6rem;
		z-index: 100;

		font-size: 0.9rem;
		line-height: 1.4rem;
	}
</style>
