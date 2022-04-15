<script>
	import { onDestroy, onMount } from 'svelte';
	import { isAuthenticated, user } from '$lib/stores/auth';
	import { isDarkFlag, isMngr, isAdmin } from '$lib/siteConfig';
	
	import LogoComponent from '../components/LogoComponent.svelte';


	import { browser } from '$app/env';
	let apiurl = 'https://api.rocktver.ru';
	//isAuthenticated = browser ? window.localStorage.getItem('isAuthenticated') ?? isAuthenticated_defaultValue : isAuthenticated_defaultValue;
	function logauth(ud) {
		let myHeaders = new Headers();
		myHeaders.append('Content-Type', 'application/json');

		let raw = JSON.stringify({ user: ud });

		let requestOptions = {
			method: 'POST',
			headers: myHeaders,
			body: raw
		};

		fetch(apiurl+'/log-auth', requestOptions)
			.then((response) => response.json())
			.then((result) => {
				console.log(result);
				
				//return result;
			})
			.catch((error) => console.log('error', error));
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

					logauth(user_data);
					loaduser($user.id);
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
	async function loaduser(userid) {
		let myHeaders = new Headers();
		myHeaders.append('Content-Type', 'application/json');

		let raw = JSON.stringify({ id: userid });

		let requestOptions = {
			method: 'POST',
			headers: myHeaders,
			body: raw,
			redirect: 'follow'
		};

		fetch(apiurl+'/getuserdata', requestOptions)
			.then((response) => response.json())
			.then((result) => {
				//console.log(result.id);
				if (result.id == 'admin') {
					$isAdmin = true;
				}
				return result.id;
			})
			.catch((error) => console.log('error', error));
	}
	$isAdmin = false;
	onMount(() => {
		
		
	});
	export let flag, qrurl;
	$: flag = $isAuthenticated;
	$: qrurl = apiurl+'/qrcode-register?id='+ $user.id
</script>

{#if flag}
	<LogoComponent />
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


	<div class="mx-auto text-lg mt-2">Лотерея для гостей маук "ГЦКиД" Бежецк!</div>
	<a
		class="tomain delay-50 mb-3 mx-auto cursor-pointer rounded-lg bg-yellow-400/50 p-2 px-3 text-gray-800 shadow ring-yellow-800 transition-all duration-100 hover:ring-2 focus:outline-none  dark:bg-yellow-500/70 dark:text-gray-200 dark:hover:bg-blue-700/50 "
		id="logout_button"
		href="/lotereya-hello"
	>
		<p class="mx-auto">Участвовать в лотерее</p>
	</a>
	<a
		class="tomain delay-50 m-5 mx-auto cursor-pointer rounded-lg bg-blue-400/50 p-2 px-3 text-gray-800 shadow ring-yellow-800 transition-all duration-100 hover:ring-2 focus:outline-none  dark:bg-blue-500/20 dark:text-gray-300 dark:hover:bg-blue-700/50 "
		id="logout_button"
		href="/concert/3"
	>
		<p class="mx-auto">Перейти на страницу концерта</p>
	</a>
	<a
		class="tomain  delay-50 mx-auto cursor-pointer rounded-lg bg-blue-400/50 p-2 px-3 text-gray-800 shadow ring-yellow-800 transition-all duration-100 hover:ring-2 focus:outline-none dark:bg-blue-500/20 dark:text-gray-300 dark:hover:bg-blue-700/50 "
		id="logout_button"
		href="/now"
	>
		<p class="mx-auto">Перейти на страницу прямого эфира</p>
	</a>
	<div
		class="logoutbut m-5 mx-auto cursor-pointer rounded-lg bg-red-400/95 p-2 px-3 text-white ring-red-800 transition-all hover:ring-2 dark:bg-red-800/95 dark:text-white"
		id="logout_button"
		on:click={() => {
			VK.Auth.logout(getit);
			$isAuthenticated = false;
			$isAdmin = false;
			$user = {};
			localStorage.removeItem('user');
			localStorage.removeItem('isAuthenticated');
		}}
	>
		<p class="mx-auto">Выйти</p>
	</div>
{:else}
	<h1 class="txt mx-auto text-lg mt-3 mb-2 ">
		Авторизуйтесь без лишних анкет.
	</h1>
	<h2
		class="txt mx-auto max-w-sm justify-center mt-3 mb-5 "
	>
	После авторизации Вы сможете голосовать в виджете прямого эфира, а также участвовать в лотерее
	</h2>

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
{/if}

<style>
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
