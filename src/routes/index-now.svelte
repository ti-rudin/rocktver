<script>
	import { getEfir, getItems, getNow, getEfir2 } from '../components/api.js';
	import { isAuthenticated, user } from '$lib/stores/auth';
	import KnobHeart from '../components/KnobHeart.svelte';
	import Flower from '../components/Flower.svelte';
	import { goto } from '$app/navigation';
	let index = 0,
		imagable = true,
		width = imagable ? 'auto' : '50%',
		gap = 16,
		length = 15,
		scrollPos = 0;
	export let now;
	export let efir;

	//export let concert, timeline
	export let isshowgo,
		band_on_scene,
		status,
		concertid,
		show_name,
		have_spisok,
		actual_spisok_pesen;
	export let displaylikes = false;

	async function getData(userq) {
		//index = await getIdTrackNow();
		now = await getNow();

		efir = await getEfir2(userq);

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
		//console.log(status);
		if (now.now_event_id !== 'null') {
			displaylikes = true;
		}
	}
	$: displaylikes = displaylikes;

	const timerId = setInterval(function () {
		getData($user);
	}, 2000);

	onDestroy(() => {
		clearInterval(timerId);
	});

	import { onDestroy, onMount } from 'svelte';

	import { slidy } from '@slidy/core';
	import dateFormat, { masks } from 'dateformat';
	import { i18n } from 'dateformat';
	i18n.dayNames = [
		'Sun',
		'Mon',
		'Tue',
		'Wed',
		'Thu',
		'Fri',
		'Sat',
		'Воскресенье',
		'Понедельник',
		'Вторник',
		'Среда',
		'Четверг',
		'Пятница',
		'Суббота'
	];
	i18n.monthNames = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec',
		'Января',
		'Февраля',
		'Марта',
		'Апреля',
		'Мая',
		'Июня',
		'Июля',
		'Августа',
		'Сентября',
		'Октября',
		'Ноября',
		'Декабря'
	];
	import { blur, crossfade, draw, fade, fly, scale, slide } from 'svelte/transition';

	import LogoComponent from '../components/LogoComponent.svelte';
	import Users from '../components/Users.svelte';

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
					ym(88086612, 'reachGoal', 'vk-auth');
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
	<div class="w-full pb-2 z-10 ">
		<div
			transition:scale={{ duration: 300 }}
			aria-label="card 1"
			class="mx-auto mt-1 max-w-2xl rounded-lg bg-orange-400/40 p-4 shadow ring-yellow-400 transition-all hover:ring-2 focus:outline-none dark:bg-red-500/70 "
			on:click={() => {
				goto('/concert/' + status.concert_id);
			}}
		>
			<div class="flex cursor-pointer items-center border-b border-gray-200 pb-6 ">
				<div class="flex w-full items-start justify-between">
					<div class="w-full">
						<h1 tabindex="0" class="text-2xl text-black focus:outline-none dark:text-gray-200">
							{status.show_name}
						</h1>
						<h1 class="pt-2 text-xl text-gray-800 focus:outline-none dark:text-gray-200">
							{dateFormat(status.start, 'd mmmm, dddd')}
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

			<div class="">
				<div tabindex="0" class="flex focus:outline-none">
					<div class="pr-4 pt-3 text-center text-xl  text-black dark:text-white">
						{status.ploschadka}
					</div>
					<div class="mx-auto" />
					<div class="flex pt-3">
						<div><Users /></div>
						<div class="pl-4 text-xl  text-black dark:text-white">
							{now.auth_users_count}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<LogoComponent />
	{#if displaylikes}
		{#if $isAuthenticated}
			<KnobHeart user={$user} {now} {efir} eventobj={{ status }} {index} />
		{:else}
			<div class="mx-auto flex mt-4">
				<div
					class="cursor-pointer ring-1 ring-yellow-500 ml-4 p-2 pb-0 mx-auto flex w-full max-w-2xl flex-col items-start rounded-lg bg-yellow-400/50 px-3 text-black  transition-all hover:ring-2 dark:bg-orange-500/60 dark:text-white"
					id="login_button"
					on:click={() => {
						ym(88086612, 'reachGoal', 'vk-auth-start');
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
							class=" animate-pulse like-btn-nonauth m-2 mx-auto rounded-full bg-pink-400/90  p-1"
						>
							<svg
								width="42"
								height="42"
								viewBox="-10 -50 1200 1300"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M880.198 1189.61C879.904 1189.61 879.904 1189.61 879.611 1189.9C879.318 1189.9 879.318 1189.9 879.024 1189.61C683.327 1111.8 616.43 969.393 636.675 862.819C649.585 794.11 695.943 751.243 756.97 751.243C792.47 751.243 830.32 765.924 869.048 794.701C875.209 799.399 883.718 799.399 889.879 794.701C928.022 767.101 966.457 752.419 1001.37 752.419C1062.4 752.419 1108.75 794.701 1122.54 862.821C1150.71 1009.05 1021.32 1132.38 880.195 1189.61L880.198 1189.61Z"
									fill="red"
								/>
								<path
									d="M1146.11 861.755C1130.36 783.568 1075.23 732.382 1004.36 729.005C1032.2 664.036 1046.54 594.005 1046.26 523.131C1046.26 234.566 811.7 0 523.131 0C234.563 0 0 234.563 0 523.131C0 811.7 234.563 1046.26 523.131 1046.26C563.912 1046.26 604.695 1041.48 644.631 1031.92C682.881 1101.67 754.881 1167.76 867.662 1212.48C867.943 1212.48 868.224 1212.76 868.505 1212.76C876.099 1215.58 884.255 1215.58 891.849 1212.76C892.13 1212.76 892.412 1212.48 892.974 1212.48C1098.85 1129.23 1168.32 976.232 1146.1 861.765L1146.11 861.755ZM523.409 1012.51C253.692 1012.51 34.0406 792.849 34.0406 523.137C34.0406 253.425 253.697 33.768 523.409 33.768C793.121 33.768 1012.78 253.425 1012.78 523.137C1013.06 595.417 997.028 666.574 966.091 731.824C937.965 737.167 908.997 749.542 880.311 768.667C840.654 741.387 800.997 727.324 762.747 727.324C687.934 727.324 629.717 779.917 614.247 861.48C606.091 904.51 610.591 952.606 629.997 1000.7C594.841 1008.57 559.124 1012.51 523.404 1012.51L523.409 1012.51ZM880.889 1180.97C880.608 1180.97 880.608 1180.97 880.327 1181.26C880.045 1181.26 880.045 1181.26 879.764 1180.97C692.171 1106.44 628.044 970.038 647.451 867.955C659.826 802.142 704.264 761.081 762.764 761.081C796.794 761.081 833.077 775.144 870.201 802.707C876.107 807.207 884.264 807.207 890.17 802.707C926.733 776.271 963.576 762.207 997.043 762.207C1055.54 762.207 1099.98 802.707 1113.2 867.958C1140.2 1008.02 1016.17 1126.15 880.887 1180.98L880.889 1180.97Z"
									fill="white"
								/>
								<path
									d="M694.975 517.775C640.695 517.775 596.538 555.745 596.538 602.432C596.538 649.119 640.695 687.088 694.975 687.088C749.255 687.088 793.412 649.119 793.412 602.432V229.497C793.412 220.216 785.818 212.622 776.537 212.622C775.13 212.622 773.724 212.904 772.599 213.185L429.468 297.842C421.874 299.81 416.53 306.56 416.53 314.154V684.851C397.687 671.07 375.187 663.758 351.844 664.039C297.563 664.039 253.407 702.008 253.407 748.695C253.407 795.382 297.563 833.352 351.844 833.352C406.124 833.352 450.28 795.382 450.28 748.695V461.544L759.649 385.324V538.604C740.805 524.823 718.023 517.511 694.962 517.792L694.975 517.775ZM351.843 799.861C316.124 799.861 287.157 777.08 287.157 748.954C287.157 720.829 316.126 698.048 351.843 698.048C387.56 698.048 416.53 720.829 416.53 748.954C416.53 776.798 387.56 799.861 351.843 799.861ZM450.28 426.927V327.363L759.649 251.144V350.707L450.28 426.927ZM759.649 602.427C759.649 630.553 730.679 653.333 694.962 653.333C659.245 653.333 630.275 630.552 630.275 602.427C630.275 574.301 659.245 551.52 694.962 551.52C730.399 551.52 759.649 574.301 759.649 602.427Z"
									fill="white"
								/>
							</svg>
						</button>
						<h1 tabindex="0" class="text-red-400 mx-auto pl-2 pt-5 text-xl">
							{now.now_event_likes}
						</h1>
					</div>
				</div>
			</div>
		{/if}
	{/if}
	<h1 class="mx-auto mt-3 max-w-2xl text-xl text-gray-800 focus:outline-none dark:text-white">
		{#if status.now_on_scene.band_rtid}Сейчас на сцене{/if}
	</h1>
	<div class="mt-1 w-full ">
		<div
			in:scale={{ duration: 300 }}
			aria-label="card 1"
			class="mx-auto max-w-2xl  rounded-lg bg-blue-400/70 p-6 shadow  dark:bg-blue-500/50 "
		>
			{#if status.now_on_scene.band_rtid}
			
				<div
					class="flex cursor-pointer rounded ring-yellow-400 transition-all hover:ring-2 focus:outline-none"
					on:click={() => {
						goto('/band/' + status.event_name);
					}}
				>
					<img class="h-28 w-28 w-full rounded shadow" src={logobandurl} alt={status.event_name} />
					<div>
						<h1 class="pl-3 text-xl text-gray-800 focus:outline-none dark:text-white">
							{status.event_name}
						</h1>

						<h1 class="pl-3 text-lg text-pink-600 focus:outline-none dark:text-pink-300">
							{status.now_on_scene.band_town}
						</h1>
					</div>
				</div>
				<p class="my-2 text-lg">{status.now_on_scene.small_text}</p>

				<div class="flex flex-col pt-2">
					{#each artists as artist}
						<div
							class="flex cursor-pointer rounded ring-yellow-400 transition-all hover:ring-2 focus:outline-none"
							on:click={() => {
								goto('/person/' + artist.attributes.name);
							}}
						>
							<img
								class="mr-2 mb-1 h-14 w-14 rounded-full "
								src={'https://admin.rocktver.ru' + artist.attributes.avatar.data.attributes.url}
								alt=""
							/>
							<p class="lblock mt-1 border-t border-white/30 text-lg">{artist.attributes.name}</p>
							<p
								class="lblock ml-1 mt-1 border-t border-white/30 text-left text-lg text-gray-700 dark:text-gray-300"
							>
								{artist.attributes.role}
							</p>
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

	{#if have_spisok}
		<h1
			class="mx-auto max-w-2xl pt-2 pl-4 text-xl text-gray-800 focus:outline-none dark:text-white"
		>
			Сейчас звучит
		</h1>
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
					<li class:active={i == index} class="">
					
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
		<div class="mx-auto max-w-2xl ">
			<div
				aria-label="card 1"
				class="mx-auto flex items-center rounded bg-blue-100/30 p-6 shadow focus:outline-none dark:bg-blue-500"
			>
				<div class="mx-auto " />
				<div class="textcard">
					{status.now_on_scene.actual_spisok_pesen[index].text}
				</div>
				<div class="mx-auto " />
			</div>
		</div>
	{/if}
{:else}
<div class="opacity-90"><Flower /></div>
	<div class="z-10 w-full mt-4">
		<div
			aria-label="card 1"
			class="mx-auto max-w-2xl rounded-lg bg-blue-400/40 p-6 shadow focus:outline-none dark:bg-blue-500/50"
		>
			<div class="flex items-center pb-2">
				<div class="flex w-full items-start justify-between">
					<div class="mx-auto  pl-3">
						<h1
							tabindex="0"
							class="pt-2 text-xl text-gray-800 focus:outline-none dark:text-gray-200"
						>
							Виджет прямого эфира выключен
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
		white-space: pre-wrap;
		word-wrap: break-word;
	}
	.trackcard {
		height: 13.5rem;
	}
	.like {
		color: #ca327e;
		display: flex;
		justify-content: center;
		opacity: 0;
	}
	.active .like {
		opacity: 1;
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
