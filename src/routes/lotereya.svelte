<script>
	import { isAuthenticated, user } from '$lib/stores/auth';
	import { isDarkFlag } from '$lib/siteConfig';
	import LogoComponent from '../components/LogoComponent.svelte';

	import { browser } from '$app/env';
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

	function register(x) {
		let myHeaders = new Headers();
		myHeaders.append('Content-Type', 'application/json');

		let raw = JSON.stringify({ user: x });

		let requestOptions = {
			method: 'POST',
			headers: myHeaders,
			body: raw
		};

		fetch('https://api.rocktver.ru/lotereya-register/', requestOptions)
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

	$: if (sec <1) { sec = 2};
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
				playedusers = result;
				kolvo = playedusers.length;
			})
			.catch((error) => console.log('error', error));
	}

	onMount(() => {
		getplayedusers();
	});
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
</script>

<LogoComponent />
<h1 class="mx-auto max-w-2xl text-2xl">Разыгрываем билеты на 29, 30 июля</h1>
<div class=" mx-auto mb-5 text-center text-xl">
	<a href="/kabinet">Войдите</a>, чтобы участвовать в розыгрыше!
</div>

{#if kolvo}
	<p class=" mx-auto mb-5 text-center text-xl">
		Количество зарегистрированных участников - <span class="slogan">{kolvo}</span> чел.
	</p>
	
{/if}
<h1 class="mx-auto max-w-lg mt-3 mb-1 text-lg">Таймер</h1>
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
{#if playedusers}
	<div class="my-2 mx-auto flex max-w-2xl flex-wrap justify-center">
		{#each playedusers as user, i}
			<img
				class:active={i == index}
				class="delay-50 m-2 h-28 w-28 rounded-full rounded-full bg-blue-800/40 p-2"
				src={user.photo}
				alt={user.name}
			/>
		{/each}
	</div>
{/if}

<style>
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
	.loginbut {
		width: 200px;
		font-size: 20px;
		text-align: center;
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
</style>
