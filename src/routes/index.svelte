<script context="module">
	import {
		SITE_URL,
		SITE_TITLE,
		SITE_DESCRIPTION,
		DEFAULT_OG_IMAGE,
		isDarkFlag
	} from '$lib/siteConfig';
	export const prerender = true; // index page is most visited, lets prerender
</script>

<script>
	import { onDestroy, onMount } from 'svelte';
	import LogoComponent from '../components/LogoComponent.svelte';
	import { blur, crossfade, draw, fade, fly, scale, slide } from 'svelte/transition';

	let show = false;
	let interval;

	onMount(() => {
		interval = setTimeout(() => {
			show = !show;
		}, 1);
	});

	onDestroy(() => {
		if (interval) {
			clearTimeout(interval);
		}
	});

	const target_date = new Date(2022, 6, 29, 10, 0, 0);
	const target_date2 = new Date(2022, 3, 10, 18, 0, 0); // set the countdown date
	let days, hours, minutes, seconds; // variables for time units
	let days2, hours2, minutes2, seconds2;
	getCountdown();
	getCountdown2();

	const timerId = setInterval(function () {
		getCountdown();
		getCountdown2();
	}, 1000);

	function getCountdown() {
		// find the amount of "seconds" between now and target
		var current_date = new Date().getTime();
		var seconds_left = (target_date - current_date) / 1000;

		days = pad(parseInt(seconds_left / 86400));
		seconds_left = seconds_left % 86400;

		hours = pad(parseInt(seconds_left / 3600));
		seconds_left = seconds_left % 3600;

		minutes = pad(parseInt(seconds_left / 60));
		seconds = pad(parseInt(seconds_left % 60));

		// format countdown string + set tag value
		//	countdown.innerHTML = "<span>" + days + "</span><span>" + hours + "</span><span>" + minutes + "</span><span>" + seconds + "</span>";
	}
	function getCountdown2() {
		// find the amount of "seconds" between now and target
		var current_date = new Date().getTime();
		var seconds_left2 = (target_date2 - current_date) / 1000;

		days2 = pad(parseInt(seconds_left2 / 86400));
		seconds_left2 = seconds_left2 % 86400;

		hours2 = pad(parseInt(seconds_left2 / 3600));
		seconds_left2 = seconds_left2 % 3600;

		minutes2 = pad(parseInt(seconds_left2 / 60));
		seconds2 = pad(parseInt(seconds_left2 % 60));

		// format countdown string + set tag value
		//	countdown.innerHTML = "<span>" + days + "</span><span>" + hours + "</span><span>" + minutes + "</span><span>" + seconds + "</span>";
	}

	function pad(n) {
		return (n < 10 ? '0' : '') + n;
	}
</script>

<svelte:head>
	<title>{SITE_TITLE}</title>
	<link rel="canonical" href={SITE_URL} />
	<meta property="og:url" content={SITE_URL} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={SITE_TITLE} />
	<meta name="Description" content={SITE_DESCRIPTION} />
	<meta property="og:description" content={SITE_DESCRIPTION} />
	<meta property="og:image" content={DEFAULT_OG_IMAGE} />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:creator" content={'@' + SITE_TITLE} />
	<meta name="twitter:title" content={SITE_TITLE} />
	<meta name="twitter:description" content={SITE_DESCRIPTION} />
	<meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
</svelte:head>

<LogoComponent/>
<h2 class="mx-auto mt-1  text-center ">
	Cемейный музыкальный праздник на открытом воздухе, объединяющий честных людей.
</h2>
<h2 class="mx-auto mt-3 ">
	Девиз мероприятия:
</h2>
<h1 class="slogan mx-auto  text-black  dark:text-white">
	ЧЕстный праздник для ЧЕстных людей
</h1>




<a sveltekit:prefetch href = "/concert/2" class="ramka flex sm:p-4 mx-auto my-2 text-center flex-col rounded ring-yellow-600  ring-1 hover:ring-4">
	<h2 class="mx-auto mt-2  text-center text-black  dark:text-white">
		Дата проведения:
	</h2>
	<h1 class="adr mx-auto  text-black  dark:text-white">29-30 июля 2022</h1>

	<div
		class="mx-auto flex max-w-4xl flex-col items-start justify-center border-gray-200 px-0 pb-16 dark:border-gray-700"
	>
		<div class="flex flex-col-reverse items-start sm:flex-row">
			<div class="countdown">
				<div class="tiles">
					<span>{days}</span>
					<span>{hours}</span>
					<span>{minutes}</span>
					<span>{seconds}</span>
				</div>
				<div class="labels">
					<li>Дней</li>
					<li>Часов</li>
					<li>Мин</li>
					<li>Сек</li>
				</div>
			</div>
			<!-- <div

				class="w-[80px] h-[80px] rounded-full sm:w-[176px] sm:h-[136px] relative mb-8 sm:mb-0 mr-auto bg-cyan-300 bg-opacity-25"
			/> 
		-->
		</div>
	</div>

	<h2 class="mx-auto mt-5  text-center text-black  dark:text-white">
		Место проведения:
	</h2>

	<h1 class="adr mx-auto  text-black  dark:text-white">
		Тверская область, д. Тутань (на берегу р. Тьма)
	</h1>
</a>

<a sveltekit:prefetch href = "/concert/1" class="ramka flex sm:p-4 mx-auto my-2 text-center flex-col rounded ring-yellow-600  ring-1 hover:ring-4">
	<h1 class="otbor mx-auto ">Отборочный тур</h1>
	<h2 class="mx-auto mt-2  text-center text-black  dark:text-white">
		Дата проведения:
	</h2>
	<h1 class="adr mx-auto  text-black  dark:text-white">10 апреля 2022</h1>

	

	<h2 class="mx-auto mt-5  text-center">
		Место проведения:
	</h2>

	<h1 class="adr mx-auto  text-black  dark:text-white">
		КЛУБ BIG BEN
	</h1>
	
</a>

<style>

	.ramka{
		text-decoration: none;
		cursor: pointer;
		padding-top: 1.4rem;
		padding-bottom: 1rem;
	}
	.otbor {
		font: bold 20px Arial, sans-serif;
		color: #ff782a;
		text-shadow: 1px 1px 0px #000;
		text-align: center;
	}
	.adr {
		font: bold 20px Arial, sans-serif;
		color: #ff2e17;
		text-shadow: 1px 1px 0px #000;
		text-align: center;
	}
	.slogan {
		font: bold 24px Arial, sans-serif;
		color: #ff2e17;
		text-shadow: 1px 1px 0px #000;
		text-align: center;
	}

	.countdown {
		width: 330px;
		height: 95px;
		text-align: center;
		background: #222;
		background-image: -webkit-linear-gradient(top, #222, #333, #333, #221);
		background-image: -moz-linear-gradient(top, #222, #333, #333, #222);
		background-image: -ms-linear-gradient(top, #222, #333, #333, #222);
		background-image: -o-linear-gradient(top, #222, #333, #333, #222);
		border: 1px solid #111;
		border-radius: 5px;
		box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.6);
		margin: auto;
		padding: 24px 0;
		position: relative;
		top: 50px;
		bottom: 0;
		left: 0;
		right: 0;
	}

	.countdown .tiles {
		position: relative;
		z-index: 1;
		top: -40px;
	}

	.countdown .tiles > span {
		width: 65px;
		max-width: 65px;
		font: bold 31px Arial, sans-serif;
		text-align: center;
		color: #111;
		background-color: #ddd;
		background-image: -webkit-linear-gradient(top, #bbb, #eee);
		background-image: -moz-linear-gradient(top, #bbb, #eee);
		background-image: -ms-linear-gradient(top, #bbb, #eee);
		background-image: -o-linear-gradient(top, #bbb, #eee);
		border-top: 1px solid #fff;
		border-radius: 3px;
		box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.7);
		margin: 0 4px;
		padding: 12px 0;
		display: inline-block;
		position: relative;
	}

	.countdown .tiles > span:before {
		content: '';
		width: 100%;
		height: 10px;
		background: #111;
		display: block;
		padding: 0 3px;
		position: absolute;
		top: 41%;
		left: -3px;
		z-index: -1;
	}

	.countdown .tiles > span:after {
		content: '';
		width: 100%;
		height: 1px;
		background: #eee;
		border-top: 1px solid #333;
		display: block;
		position: absolute;
		top: 48%;
		left: 0;
	}

	.countdown .labels {
		width: 100%;
		height: 25px;
		text-align: center;
		position: absolute;
		bottom: 8px;
	}

	.countdown .labels li {
		width: 72px;
		font: bold 15px Arial, sans-serif;
		color: #ff2e17;
		text-shadow: 1px 1px 0px #000;
		text-align: center;
		text-transform: uppercase;
		display: inline-block;
	}
</style>
