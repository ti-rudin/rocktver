<script>
	import { isAuthenticated, user } from '$lib/stores/auth';
	import { isDarkFlag } from '$lib/siteConfig';
	import LogoComponent from '../components/LogoComponent.svelte';



	import { browser } from '$app/env';
	let apiurl = 'https://api.rocktver.ru';
	//isAuthenticated = browser ? window.localStorage.getItem('isAuthenticated') ?? isAuthenticated_defaultValue : isAuthenticated_defaultValue;

	export let flag, qrurl, playedusers,index
	index = 0;
	
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
			})
			.catch((error) => console.log('error', error));
	}

	onMount(() => {
		getplayedusers();
	});
	$: playedusers = playedusers;

	const timerId = setInterval(function () {
		index = index +1
if (index >= playedusers.length) { index = 0}
	}, 700);

	onDestroy(() => {
		clearInterval(timerId);
	});


</script>


	<LogoComponent />
	<p class="slogan mx-auto mb-5">Зарегистрированные участники лотерии</p>
	{#if playedusers}
		<div class="my-2 flex flex-wrap max-w-2xl mx-auto">
			{#each playedusers as user, i}
				<img 
				class:active={i == index}
					class="delay-50 h-28 w-28 rounded-full rounded-full bg-blue-800/40 p-2 m-2"
					src={user.photo}
					alt={user.name}
				/>
			{/each}
			
		</div>
	{/if}



<style>

.active{
	background-color: #ff2e17;
}


	.tomain {
		width: 250px;
		font-size: 20px;
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
