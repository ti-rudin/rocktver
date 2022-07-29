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

	const target_date = new Date(2022, 6, 29, 18, 1, 0);
	const target_date2 = new Date(2022, 6, 30, 14, 10, 0); // set the countdown date
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

<LogoComponent />
<h2 class="mx-auto my-2  max-w-2xl text-left text-lg">
	Cемейный музыкальный праздник на открытом воздухе в Тверской области, который пройдет 29-го и
	30-го июля 2022.
</h2>
<div class="mx-auto w-full max-w-2xl text-lg">
	<h1 class="w-full text-left">Основной принцип праздника - <strong>забота о гостях.</strong></h1>
	<h1 class="w-full text-left">В рамках этого:</h1>
</div>

<div class="mx-auto w-full max-w-2xl">
	<ul class="text-lg">
		<li>Проведена обработка территории от клещей</li>
		<li>Подготовлена парковка для машин</li>
		<li>Расчищена территория для палаток</li>
		<li>Приглашены аниматоры для детей и их родителей</li>
		<li>Профессиональные инструкторы проведут занятия для гостей</li>
	</ul>
</div>
<div class="mx-auto w-full max-w-2xl text-lg">
	На празднике выступят рок-группы из Твери, Москвы, Санкт-Петербурга и Череповца со своим
	творческим материалом.
</div>
<div class="mx-auto w-full max-w-2xl text-lg">Лето, речка, отдых для всей семьи.</div>

<div
	class="ramka mx-auto my-2 flex flex-col rounded text-center ring-1 ring-yellow-600  hover:ring-4 sm:p-4"
>
	<h1 class="adr mx-auto  text-black  dark:text-white">29 июля 2022</h1>

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
					<ul>
					<li>Дней</li>
					<li>Часов</li>
					<li>Мин</li>
					<li>Сек</li>
				</ul>
				</div>
			</div>
			<!-- <div

				class="w-[80px] h-[80px] rounded-full sm:w-[176px] sm:h-[136px] relative mb-8 sm:mb-0 mr-auto bg-cyan-300 bg-opacity-25"
			/> 
		-->
		</div>
	</div>

	<h2 class="mx-auto mt-5  text-center text-black  dark:text-white">Место проведения:</h2>

	<h1 class="adr mx-auto  text-black  dark:text-white">
		Тверская область, д. Тутань (на берегу р. Тьма)
	</h1>
</div>
<div class="mx-auto w-full max-w-2xl">
	<a href="/concert/2/">
		<img class="mx-auto w-full" src="/rockopolchenie-2022.jpg" alt="РОКОПОЛЧЕНИЕ  2022" />
	</a>
</div>
<div class="mx-auto ">
	<a
		href="/concert/2/"
		class="lineupbut m-4 flex h-9 w-auto cursor-pointer rounded-lg bg-yellow-400 px-3 pt-1 text-center text-black ring-yellow-400 transition-all
hover:ring-2 dark:bg-yellow-800 dark:text-white"
	>
		LINE UP
	</a>
</div>

<div class="mx-auto w-full max-w-2xl text-lg">Задачи которые мы ставим перед собой :</div>
<div class="mx-auto w-full max-w-2xl">
	<ul class="text-lg">
		<li>развитие и популяризация рок-культуры</li>
		<li>развитие и укрепление межкультурных связей городов</li>
		<li>мотивация молодежи к созидательной творческой деятельности</li>
		<li>
			обмен творческим опытом, идеями, повышение творческого уровня и развитие творческого
			потенциала музыкантов
		</li>
		<li>защита и популяризация традиционных семейных ценностей</li>
	</ul>
</div>
<div class="mx-auto ">
	<a
		sveltekit:prefetch
		href="/volonteram"
		class="m-4 flex h-9 w-auto rounded-lg bg-yellow-400 px-3 pt-1 text-center text-black ring-yellow-400 transition-all
	hover:ring-2 dark:bg-yellow-800 dark:text-white">Волонтёрам</a
	>
	<a
		sveltekit:prefetch
		href="/sponsoram"
		class="m-4 flex h-9 w-auto rounded-lg bg-yellow-400 px-3 pt-1 text-center text-black ring-yellow-400 transition-all
	hover:ring-2 dark:bg-yellow-800 dark:text-white">Спонсорам</a
	>
</div>

<style>

	.lineupbut {
		font-size: 20px;
		text-align: center;
	}
	ul {
		padding-bottom: 1rem;
	}
	li {
		margin-left: 2rem;
		padding-top: 0.5rem;
		padding-left: 0.5rem;
		list-style-type: circle;
	}
	.ramka {
		text-decoration: none;

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
		width: 370px;
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
		width: auto;
		height: 25px;
		text-align: center;
		position: absolute;
		bottom: 8px;
		
	}

	.countdown .labels li {
		
		font: bold 15px Arial, sans-serif;
		color: #ff2e17;
		text-shadow: 1px 1px 0px #000;
		text-align: center;
		text-transform: uppercase;
		display: inline-block;
		
	}
</style>
