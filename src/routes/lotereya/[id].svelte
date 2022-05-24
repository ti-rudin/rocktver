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
	import { browser } from '$app/env';

	function getit(response) {
		if (response.session) {
			var id = response.session.mid;
		}
		VK.Api.call(
			'users.get',
			{
				uids: id,
				fields: 'photo_max, first_name,last_name, sex, bdate, city, country, followers_count',
				v: '5.131'
			},
			function (r) {
				if (r.response) {
					//alert(r.response.sex);
					$isAuthenticated = true;

					localStorage.setItem('isAuthenticated', JSON.stringify(true));

					//console.log(r.response);
					let user_data = {
						id: r.response[0]['id'],
						bdate: r.response[0]['bdate'] ? r.response[0]['bdate'] : 'не указано',
						name: r.response[0]['first_name'] + ' ' + r.response[0]['last_name'],
						photo: r.response[0].photo_max,
						city: r.response[0]['city'] ? r.response[0]['city'].title : 'не указано',
						country: r.response[0]['country'] ? r.response[0]['country'].title : 'не указано',
						followers_count: r.response[0].followers_count,
						sex: r.response[0].sex ? r.response[0].sex : 'не указано'
					};
					user.set(user_data);

					localStorage.setItem('user', JSON.stringify(user_data));

					ym(88086612, 'reachGoal', 'vk-auth');
					//LogRocket.identify(r.response[0]['id'], {
					//	name: r.response[0]['first_name'] + ' ' + r.response[0]['last_name'],
					//	vk_id: r.response[0]['id'],
					//	city: r.response[0]['city'] ? r.response[0]['city'].title : 'не указано'
					//});
				}
			}
		);
	}
	onMount(() => {
		postprepare();
		//console.log(imgurl);
		document.getElementById('vk_share_button').innerHTML = VK.Share.button(
			{
				image: 'https://rocktver.ru/2930.jpeg',
				title: usernametitle,
				noparse: true,
				url: 'https://rocktver.ru'
			},
			{
				type: 'round_nocount',
				text: 'Поделиться'
			}
		);
	});
	$: imgurl = imgurl;
	export let imguserurl, usernametitle;

	$: imguserurl = $user.photo;

	$: usernametitle = $user.name + ' - Я участвую в розыгрыше билета на РОК-ОПОЛЧЕНИЕ 2022';

	//$: console.log(imgurl);
</script>

<svelte:head>
	<meta property="image" content={imgurl} />

	<title>{$user.name} - УЧАСТНИК РОК-ОПОЛЧЕНИЯ 2022</title>
	<link rel="canonical" href={site} />
	<meta property="og:url" content={site} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={usernametitle} />
	<meta name="Description" content="Я участник музыкального праздника для честных людей!" />
	<meta property="og:description" content="Я участник музыкального праздника для честных людей!" />
	<meta property="og:image" content={imgurl} />
	<meta name="twitter:card" content="summary" />

	<meta name="twitter:title" content={usernametitle} />
	<meta name="twitter:description" content="Я участник музыкального праздника для честных людей!" />
	<meta name="twitter:image" content={imgurl} />
</svelte:head>
<LogoComponent />
<div class="mt-1 w-full ">
	<div
		aria-label="card 1"
		class="mx-auto max-w-2xl cursor-pointer rounded-lg bg-blue-400/70 p-6 shadow ring-yellow-400 transition-all hover:ring-2 focus:outline-none dark:bg-blue-500 "
	>
		<h1 class="mx-auto text-2xl">{launch.attributes.title}</h1>
	</div>
</div>

{#if $isAuthenticated}
	<p class="slogan mx-auto mb-5">Спасибо, что Вы с нами!</p>
	<div class="flex justify-center">
		<!-- Card -->
		<div class="delay-50 group flex w-auto rounded-lg bg-gray-800 p-5">
			<!-- Image Cover -->
			<img class="h-28 w-28 w-full rounded shadow" src={$user.photo} alt={$user.name} />
			<div class="mx-10 flex flex-col">
				<!-- Title -->
				<h3 class="font-bold text-gray-200">{$user.name}</h3>

				<!-- Description -->
				<p class="mt-2 text-sm font-bold text-gray-400">Страна: {$user.country}</p>
				<p class="mt-2 text-sm font-bold text-gray-400">Город: {$user.city}</p>
				<p class="mt-2 text-sm font-bold text-gray-400">ВК ID: {$user.id}</p>
			</div>
		</div>
	</div>

	<div class="mt-3 w-full ">
		<div
			aria-label="card 1"
			class="mx-auto max-w-2xl rounded-lg bg-blue-400/50 pb-3 shadow dark:bg-blue-500/20 "
		>
			<div class=" mx-auto p-4 text-center text-gray-800 focus:outline-none dark:text-white">
				Для участия в лотерее осталось совсем немного. Поделитесь информацией о нашем празднике в ВК!<br />
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
	<div
		class="loginbut cursor-pointer p-3 mx-auto mb-8 flex w-full max-w-2xl flex-col items-start rounded-lg bg-yellow-400/50 px-3 text-black ring-yellow-400 transition-all hover:ring-2 dark:bg-yellow-800/25 dark:text-white"
		id="login_button"
		on:click={() => {
			ym(88086612, 'reachGoal', 'vk-auth-start');
			VK.Auth.login(getit);
		}}
	>
		<p class="mx-auto">Войти с помощью</p>
		<svg
			class="mx-auto mt-5 opacity-100"
			width="48"
			height="48"
			viewBox="0 0 48 48"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M0 23.04C0 12.1788 0 6.74826 3.37413 3.37413C6.74826 0 12.1788 0 23.04 0H24.96C35.8212 0 41.2517 0 44.6259 3.37413C48 6.74826 48 12.1788 48 23.04V24.96C48 35.8212 48 41.2517 44.6259 44.6259C41.2517 48 35.8212 48 24.96 48H23.04C12.1788 48 6.74826 48 3.37413 44.6259C0 41.2517 0 35.8212 0 24.96V23.04Z"
				fill="#0077FF"
			/>
			<path
				d="M25.54 34.5801C14.6 34.5801 8.3601 27.0801 8.1001 14.6001H13.5801C13.7601 23.7601 17.8 27.6401 21 28.4401V14.6001H26.1602V22.5001C29.3202 22.1601 32.6398 18.5601 33.7598 14.6001H38.9199C38.0599 19.4801 34.4599 23.0801 31.8999 24.5601C34.4599 25.7601 38.5601 28.9001 40.1201 34.5801H34.4399C33.2199 30.7801 30.1802 27.8401 26.1602 27.4401V34.5801H25.54Z"
				fill="white"
			/>
		</svg>
		<p class="mx-auto">Вконтакте</p>
	</div>

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
	.loginbut {
		width: 200px;
		font-size: 20px;
		text-align: center;
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
