<script>
	import { getEfir, getItems, getNow } from '../components/api.js';
	import { isAuthenticated, user } from '$lib/stores/auth';
	import KnobHeart from '../components/KnobHeart.svelte';
	import Flower from '../components/Flower.svelte';
	let index = 0,
		imagable = true,
		width = imagable ? 'auto' : '50%',
		gap = 16,
		length = 15,
		scrollPos = 0;
	export let now;
	export let efir;
	export let isshowgo,
		band_on_scene,
		concert,
		timeline,
		status,
		concertid,
		show_name,
		have_spisok,
		actual_spisok_pesen;
	export let displaylikes = false;

	async function getData() {
		//index = await getIdTrackNow();
		now = await getNow();
		efir = await getEfir();
		index = now.now_track_id;
		status = efir;
		isshowgo = status.is_show_go;
		have_spisok = status.now_on_scene.have_spisok;
		concertid = +status.concert_id;
		show_name = status.show_name;
		band_on_scene = status.now_on_scene.band_rtid;
		actual_spisok_pesen = status.now_on_scene.actual_spisok_pesen;
		have_spisok = status.now_on_scene.have_spisok;
		band_rtid = status.now_on_scene.band_rtid;
		artists = status.now_on_scene.artists;
		logobandurl = 'https://admin.rocktver.ru' + status.now_on_scene.bandlogo;

		console.log(now);
		console.log(status);
		if (now.now_event_id !== 'null') {
			displaylikes = true;
		}
	}
	$: displaylikes = displaylikes;

	const timerId = setInterval(function () {
		getData();
	}, 2000);

	onDestroy(() => {
		clearInterval(timerId);
	});

	import { onDestroy, onMount } from 'svelte';

	import { slidy } from '@slidy/core';

	import { blur, crossfade, draw, fade, fly, scale, slide } from 'svelte/transition';

	import LogoComponent from '../components/LogoComponent.svelte';

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
					console.log(r.response);
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
					//LogRocket.identify(r.response[0]['id'], {
					//	name: r.response[0]['first_name'] + ' ' + r.response[0]['last_name'],
					//	vk_id: r.response[0]['id'],
					//	city: r.response[0]['city'] ? r.response[0]['city'].title : "не указано",
					//});

					// This is an example script - don't forget to change it!
				}
			}
		);
	}
	export let logobandurl;
	export let band_rtid, artists;
</script>

{#if isshowgo}
	<div class="w-full">
		<div
			transition:scale={{ duration: 300 }}
			aria-label="card 1"
			class="mx-auto max-w-2xl rounded bg-red-400/40 p-6 shadow focus:outline-none dark:bg-red-500"
		>
			<div class="flex items-center border-b border-gray-200 pb-6">
				<div class="flex w-full items-start justify-between">
					<div class="w-full">
						<h1 tabindex="0" class="text-2xl text-black focus:outline-none dark:text-gray-200">
							{status.show_name}
						</h1>
					</div>
					<div role="img" aria-label="bookmark">
						<svg
							class="focus:outline-none"
							width="28"
							height="28"
							viewBox="0 0 28 28"
							fill="red"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M10.5001 4.66667H17.5001C18.1189 4.66667 18.7124 4.9125 19.15 5.35009C19.5876 5.78767 19.8334 6.38117 19.8334 7V23.3333L14.0001 19.8333L8.16675 23.3333V7C8.16675 6.38117 8.41258 5.78767 8.85017 5.35009C9.28775 4.9125 9.88124 4.66667 10.5001 4.66667Z"
								stroke="#2C3E50"
								stroke-width="1.25"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</div>
				</div>
			</div>

			<div class="px-2">
				<div tabindex="0" class="flex flex-col focus:outline-none">
					<div class="px-4 pt-3 text-center text-xl  text-black dark:text-white">
						{status.ploschadka}
					</div>
				</div>
			</div>
		</div>
	</div>
	<LogoComponent />
	<div class="mt-4 w-full">
		<div
			aria-label="card 1"
			class="mx-auto max-w-2xl rounded bg-blue-400/70 p-6 shadow focus:outline-none dark:bg-blue-500"
		>
			{#if status.now_on_scene.band_rtid}
				<div class="flex">
					<img
						class="mb-4 h-28 w-28 w-full rounded shadow"
						src={logobandurl}
						alt={status.event_name}
					/>
					<div>
					<h1 tabindex="0" class="pl-4 text-2xl text-gray-800 focus:outline-none dark:text-white">
						{status.event_name}
					</h1>
					<h1 tabindex="0" class="pl-4 text-xl text-pink-600 focus:outline-none dark:text-pink-300">
						{status.now_on_scene.band_town}
					</h1>
					<p class="pl-4">{status.now_on_scene.small_text}</p>
				</div>
				</div>
				<div class="mb-2 h-1 border-b border-white/30" />
				<div class="flex flex-col">
					{#each artists as artist}
						<div class="flex">
							<p class="lblock  mt-2 border-b border-white/30 text-right">
								{artist.attributes.role}
							</p>
							<img
								class="ml-4 mr-2 mb-4 h-12 w-12 rounded-full "
								src={'https://admin.rocktver.ru' + artist.attributes.avatar.data.attributes.url}
								alt=""
							/>

							<p class="lblock  mt-2 border-b border-white/30">{artist.attributes.name}</p>
						</div>
					{/each}
				</div>
			{:else}
				<div class="flex items-center pb-2">
					<div class="flex w-full items-start justify-between">
						<div class="mx-auto">
							<h1
								tabindex="0"
								class="pt-2 text-2xl text-gray-800 focus:outline-none dark:text-white"
							>
								{status.event_name}
							</h1>
						</div>
						<h1
							tabindex="0"
							class="pt-2 text-xl text-gray-600 focus:outline-none dark:text-gray-300"
						>
							{status.now_on_scene.band_town}
						</h1>
					</div>
				</div>
			{/if}
		</div>
	</div>
	{#if displaylikes}
		{#if $isAuthenticated}
			<KnobHeart user={$user} {now} {efir} eventobj={{ status }} {index} />
		{:else}
			<div class="mx-auto flex mt-4">
				<div
					class="cursor-pointer  ml-4 p-2 pb-0 mx-auto flex w-full max-w-2xl flex-col items-start rounded-lg bg-yellow-400/50 px-3 text-black ring-yellow-400 transition-all hover:ring-2 dark:bg-yellow-800/25 dark:text-white"
					id="login_button"
					on:click={() => {
						VK.Auth.login(getit);
					}}
				>
					<p class="mx-auto text-lg">Войдите, чтобы голосовать</p>
					<div class="flex mx-auto">
						<svg
							class="mx-auto mt-2 opacity-100"
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
						<p class="mx-auto p-5 text-lg">ВКОНТАКТЕ</p>
						<button
							class=" animate-pulse like-btn-nonauth m-2 mx-auto rounded-full bg-pink-400/50  p-3"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="25"
								height="25"
								viewBox="-2 -3 28 28"
								stroke="red"
								stroke-width="1"
								fill="red"
							>
								<path
									d="M12 4.4119c-2.826-5.695-11.999-4.064-11.999 3.27 0 7.27 9.903 10.938 11.999 15.311 2.096-4.373 12-8.041 12-15.311 0-7.327-9.17-8.972-12-3.27z"
								/>
							</svg>
						</button>
						<h1 tabindex="0" class="like mx-auto pl-2 pt-5 text-xl">
							{now.now_event_likes}
						</h1>
					</div>
				</div>
			</div>
		{/if}
	{/if}

	{#if have_spisok}
		<section class="" style="--gap: {gap}px; --width: {width}" tab-index="0">
			<ul
				class="pb-0"
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
				{#each actual_spisok_pesen as item, i}
					<li class:active={i === index} class="">
						<div
							class="transform-all trackcard justify-top relative mt-3 mb-2 flex cursor-pointer flex-col items-center rounded-xl border-2 border-slate-100 bg-gradient-to-r from-blue-400 to-pink-500 p-3 shadow-lg transition-all hover:scale-105"
						>
							<div class="text-center text-2xl text-slate-200">
								<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{item.name}</div>
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
							{#if now.now_track_likes > 0}
								<div class="likestrackblock mx-auto flex">
									<div class="mx-auto" />
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="25"
										height="25"
										opacity="80%"
										viewBox="-2 -3 28 28"
										stroke="red"
										fill="#ff7fbf"
										stroke-width="1"
									>
										<path
											d="M12 4.4119c-2.826-5.695-11.999-4.064-11.999 3.27 0 7.27 9.903 10.938 11.999 15.311 2.096-4.373 12-8.041 12-15.311 0-7.327-9.17-8.972-12-3.27z"
										/>
									</svg>
									<h1 class="like pl-1 text-lg">
										{now.now_track_likes}
									</h1>
									<div class="mx-auto" />
								</div>
							{/if}
							{#if item.is_premiere}
								<div class="prem rounded-lg px-2 text-lg">ПРЕМЬЕРА</div>
							{/if}
						</div>
					</li>
				{/each}
			</ul>
		</section>
		<div class="mx-auto ">
			<div
				aria-label="card 1"
				class="mx-auto flex items-center rounded bg-blue-100/30 p-6 shadow focus:outline-none dark:bg-blue-500"
			>
				<div class="mx-auto " />
				<pre class="textcard">
					{status.now_on_scene.actual_spisok_pesen[index].text}
				</pre>
				<div class="mx-auto " />
			</div>
		</div>
	{/if}
{:else}
	<div class="w-full mt-4">
		<div
			aria-label="card 1"
			class="mx-auto max-w-2xl rounded bg-blue-400/40 p-6 shadow focus:outline-none dark:bg-blue-500"
		>
			<div class="flex items-center pb-2">
				<div class="flex w-full items-start justify-between">
					<div class="mx-auto  pl-3">
						<h1
							tabindex="0"
							class="pt-2 text-xl text-gray-800 focus:outline-none dark:text-gray-200"
						>
							На старт, внимание, марш!
							<Flower />
						</h1>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.lblock {
		width: 40vw;
	}
	.likestrackblock {
		left: 0.5rem;
		top: 0.3rem;
		position: absolute;
	}
	.prem {
		color: rgb(235, 222, 46);
		position: absolute;
		right: 0.5rem;
		bottom: 0.5rem;
		background-color: #ff7fbf;
	}
	.textcard {
		width: 80vw;
		height: 100%;
		justify-content: left;
		display: flex;
		overflow: hidden;
	}
	.trackcard {
		height: 13.5rem;
	}
	.like {
		color: #ca327e;
		display: flex;
		justify-content: center;
	}
	.like-btn {
		color: red;
		display: flex;
		justify-content: center;
		height: 3.1rem;
	}
	.like-btn-nonauth {
		color: red;
		display: flex;
		justify-content: center;
		height: 3.1rem;
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
</style>
