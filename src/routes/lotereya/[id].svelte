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
	let apiurl = 'https://api.rocktver.ru';
	//isAuthenticated = browser ? window.localStorage.getItem('isAuthenticated') ?? isAuthenticated_defaultValue : isAuthenticated_defaultValue;

	export let flag, qrurl, playedusers, index, leader, leaderview, played, sec;
	played = false;
	leaderview = false;
	sec = 4;

	leader = {};
	index = -1;

	let timerId;
	let timerCount;

	$: flag = $isAuthenticated;
	$: qrurl = apiurl + '/qrcode-register?id=' + $user.id;
	import { onDestroy, onMount } from 'svelte';
	import LogoComponent from '../../components/LogoComponent.svelte';
	import Share from '../../components/Share.svelte';
	import Ramka1 from '../../components/Ramka1.svelte';
	import * as htmlToImage from 'html-to-image';
	import { toPng, toJpeg, toSvg } from 'html-to-image';

	import { goto } from '$app/navigation';

	import { isAuthenticated, user } from '$lib/stores/auth';
	import { isDarkFlag, isMngr, isAdmin } from '$lib/siteConfig';

	export let launches, launch, id, htmlimg, imgurl, bands, site;
	function register(x) {
		let myHeaders = new Headers();
		myHeaders.append('Content-Type', 'application/json');

		let raw = JSON.stringify({ user: x });

		let requestOptions = {
			method: 'POST',
			headers: myHeaders,
			body: raw
		};

		fetch('https://api.rocktver.ru/lotereya-register/?id=' + { id }, requestOptions)
			.then((response) => response.json())
			.then((result) => {
				return result;
			})
			.catch((error) => console.log('error', error));
	}

	function stop() {
		clearInterval(timerId);
		clearInterval(timerCount);
		leaderview = true;
		played = false;
		leader = playedusers[index];
		sec = 4;
	}
	function play() {
		leaderview = false;
		leader = {};
		played = true;

		timerId = setInterval(function () {
			index = index + 1;
			if (index >= playedusers.length) {
				index = 0;
			}
		}, 130);

		sec = sec - 1;
		timerCount = setInterval(function () {
			sec = sec - 1;
			if (sec == 0) {
				stop();
			}
		}, 1000);
	}

	function plus() {
		sec = sec + 1;
	}
	function minus() {
		sec = sec - 1;
		if (sec == 0) {
			sec = 1;
		}
	}

	$: if (sec < 1) {
		sec = 2;
	}
	async function getplayedusers() {
		let myHeaders = new Headers();
		myHeaders.append('Content-Type', 'application/json');

		//let raw = JSON.stringify({user: x});

		let requestOptions = {
			method: 'GET',
			headers: myHeaders
			//body: raw,
		};

		fetch('https://api.rocktver.ru/lotereya-getplayedusers/', requestOptions)
			.then((response) => response.json())
			.then((result) => {
				console.log(result);
				playedusers = result.filter(function (el){
					return el.loterid == launch.attributes.loter_id
				});
				kolvo = playedusers.length;
			})
			.catch((error) => console.log('error', error));
	}


	$: playedusers = playedusers;

	export let kolvo;

	onDestroy(() => {
		clearInterval(timerId);
		clearInterval(timerupdate);
		clearInterval(timerCount);
	});
	const timerupdate = setInterval(function () {
		getplayedusers();
	}, 2000);



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
		getplayedusers();
		postprepare();
		//console.log(imgurl);

	});


	$: imgurl = imgurl;
	export let imguserurl, usernametitle;

	$: imguserurl = $user.photo;

	$: usernametitle = 'Я собираюсь на Рок ОполЧЕние 2022';

	//$: console.log(imgurl);
	if (flag) {
		document.getElementById('vk_share_button').innerHTML = VK.Share.button(
			{
				image: 'https://rocktver.ru/rockopolchenie2022.jpg',
				title: 'Я собираюсь на Рок ОполЧЕние 2022',
				noparse: true,
				url: 'https://vk.com/rock_opolchenie2022'
			},
			{
				type: 'round_nocount',
				text: 'Поделиться'
			}
		);

	}
</script>

<svelte:head>
	<meta property="image" content={imgurl} />

	<title>{launch.attributes.title}</title>
	<link rel="canonical" href={site} />
	<meta property="og:url" content={site} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={usernametitle} />
	<meta name="Description" content="Я собираюсь на Рок ОполЧЕние 2022" />
	<meta property="og:description" content="Я собираюсь на Рок ОполЧЕние 2022" />
	<meta property="og:image" content='https://rocktver.ru/rockopolchenie2022.jpg' />
	<meta name="twitter:card" content="summary" />

	<meta name="twitter:title" content={usernametitle} />
	<meta name="twitter:description" content="Я собираюсь на Рок ОполЧЕние 2022" />
	<meta name="twitter:image" content='https://rocktver.ru/rockopolchenie2022.jpg' />
</svelte:head>
<LogoComponent />
<div class="mt-1 w-full ">
	<div
		aria-label="card 1"
		class="mx-auto max-w-2xl  rounded-lg bg-blue-400/70 p-6 shadow transition-all  focus:outline-none dark:bg-blue-500/40 "
	>
		<h1 class="mx-auto text-2xl">{launch.attributes.title}</h1>
	</div>
</div>
<div class="mt-4 w-full ">
	<div
		aria-label="card 1"
		class="mx-auto max-w-2xl  rounded-lg bg-blue-800/40 p-6 shadow  transition-all  focus:outline-none dark:bg-blue-600/80 "
	>
		
		<h1 class="text-xl mx-auto">Для участия в розыгрыше авторизуйтесь через ВК и разместите информацию о нашем празднике на своей странице.</h1>
	</div>
</div>
{#if $isAuthenticated}
	<p class="slogan mx-auto my-4">Спасибо, что Вы с нами!</p>
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
	<div class="mx-auto">
		<Share usernametitle={usernametitle} loterid={launch.attributes.loter_id}/>
	</div>
	
{:else}
<div class="flex max-w-3xl mx-auto">
	<div
		class="loginbut cursor-pointer p-3 mx-auto my-4 flex w-full max-w-2xl flex-col items-start rounded-lg bg-yellow-400/50 px-3 text-black ring-yellow-400 transition-all hover:ring-2 dark:bg-yellow-800/25 dark:text-white"
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

</div>

{/if}
{#if playedusers}
	<div class="my-2 mx-auto flex max-w-2xl flex-wrap justify-center">
		{#each playedusers as user, i}
		<div class="tooltip">
			<a href="https://vk.com/id{user.id}">
			<img
				class:active={i == index}
				class="delay-50 m-2 h-28 w-28 rounded-full rounded-full bg-blue-800/40 p-2"
				src={user.photo}
				alt={user.name}
			/>
		</a>
			<span class="tooltiptext">{user.name}</span>
		</div>
		{/each}
	</div>
{/if}
{#if kolvo}
	<p class=" mx-auto mb-5 text-center text-xl">
		Зарегистрированные участники розыгрыша. <span class="slogan">{kolvo}</span> чел.
	</p>
{/if}

{#if $isAuthenticated}
	{#if $isAdmin}


<h1 class="mx-auto mt-3 mb-1 max-w-lg text-lg">Таймер, сек</h1>
{#if !played}
	<div class="count mx-auto flex h-10">
		<div
			class="delay-50  mx-auto cursor-pointer rounded-lg bg-green-400/50 p-1 px-3 text-gray-800
			shadow ring-orange-800 transition-all duration-100 hover:bg-green-500/90 hover:ring-2 focus:outline-none  dark:bg-orange-500/70 
			dark:text-gray-300  dark:hover:bg-orange-400/90 "
			on:click={minus}
		>
			<p class="mx-auto">-</p>
		</div>
		<div class="w-2" />
		<div
			class=" delay-50 mx-auto rounded-lg bg-green-400/10 p-1 px-3
			 text-gray-800 shadow ring-yellow-800 transition-all duration-100 
			  focus:outline-none dark:bg-green-500/10 dark:text-gray-300 "
		>
			<p class="mx-auto">{sec}</p>
		</div>
		<div class="w-2" />
		<div
			class="delay-50  mx-auto cursor-pointer rounded-lg bg-green-400/50 p-1 px-3 text-gray-800
			shadow ring-orange-800 transition-all duration-100 hover:bg-green-500/90 hover:ring-2 focus:outline-none  dark:bg-orange-500/70 
			dark:text-gray-300  dark:hover:bg-orange-400/90 "
			on:click={plus}
		>
			<p class="mx-auto">+</p>
		</div>
	</div>
	<div
		class="tomain  delay-50 mx-auto cursor-pointer rounded-lg bg-green-400/50 p-2 px-3 text-gray-800 shadow ring-yellow-800 transition-all duration-100 hover:bg-green-500/90 hover:ring-2 focus:outline-none dark:bg-green-500/50 dark:text-gray-300 dark:hover:bg-green-500/90"
		on:click={play}
	>
		<p class="mx-auto">Старт</p>
	</div>
{:else}
	<div class="count mx-auto flex h-10">
		<div
			class=" delay-50 mx-auto rounded-lg bg-green-400/10 p-1 px-3
		 text-gray-800 shadow ring-yellow-800 transition-all duration-100 
		  focus:outline-none dark:bg-green-500/10 dark:text-gray-300 "
		>
			<p class="mx-auto">{sec}</p>
		</div>
	</div>

	<div
		class="tomain  delay-50 mx-auto cursor-pointer rounded-lg bg-red-400/50 p-2 px-3 text-gray-800 shadow ring-yellow-800 transition-all duration-100 hover:ring-2 focus:outline-none dark:bg-red-500/50 dark:text-gray-300 hover:bg-red-500/90 dark:hover:bg-red-500/90"
		on:click={stop}
	>
		<p class="mx-auto">Стоп</p>
	</div>
{/if}
{#if leaderview}
	<h3 class="slogan mt-4 font-bold">Победитель</h3>
	<div class="delay-50 group mx-auto flex rounded-lg bg-gray-800/80 p-5">
		<!-- Image Cover -->

		<img class="h-28 w-28 w-full rounded shadow" src={leader.photo} alt={leader.name} />
		<div class="mx-10 flex flex-col">
			<!-- Title -->
			<h3 class="font-bold text-gray-200">{leader.name}</h3>

			<!-- Description -->
			<p class="mt-2 text-sm font-bold text-gray-400">Страна: {leader.country}</p>
			<p class="mt-2 text-sm font-bold text-gray-400">Город: {leader.city}</p>
			<!-- <p class="mt-2 text-sm font-bold text-gray-400">ВК ID: {leader.id}</p> -->
		</div>
	</div>
{/if}

	{/if}
{/if}



<style>

	/* Tooltip container */
.tooltip {
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted black; /* If you want dots under the hoverable text */
}

/* Tooltip text */
.tooltip .tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: black;
  color: #fff;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;
 
  /* Position the tooltip text - see examples below! */
  position: absolute;
  z-index: 1;
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover .tooltiptext {
  visibility: visible;
}
.tooltip .tooltiptext {
  top: 80px;
  left: 2px;
}

	.count {
		font-size: 21px;
		width: auto;
	}
	.active {
		background-color: #ff2e17;
	}

	.tomain {
		width: 200px;
		font-size: 20px;
		margin-top: 1rem;
		text-align: center;
		text-decoration: none;
	}
	.logoutbut {
		width: 200px;
		font-size: 20px;
		text-align: center;
		text-decoration: none;
	}

	.txt {
		text-align: center;
	}
	.slogan {
		font: bold 24px Arial, sans-serif;
		color: #ff2e17;
		text-shadow: 1px 1px 0px #000;
		text-align: center;
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
