<script>
	import { SITE_TITLE } from '$lib/siteConfig';

	import '../tailwind.css';
	import Nav from '../components/Nav.svelte';
	import { screenmode } from '$lib/siteConfig';
	import { isAuthenticated, user } from '$lib/stores/auth';
	import { onMount } from 'svelte';

	import { browser } from '$app/env';

	onMount(() => {
		VK.init({ apiId: 8083840 });
	});
</script>

<svelte:head />

<div class="flex flex-col justify-center bg-white/70 px-4 dark:bg-gray-400/10 ">
	<Nav />
</div>
<main class=" flex flex-col justify-center bg-gray-100/50 px-4 pb-4 pt-3 dark:bg-gray-900 sm:px-8 transition-all ">
	<slot />
</main>
{#if !$screenmode}
	<footer class="z-20 w-full mb-4 flex   flex-col  bg-gray-300 dark:bg-black/20 items-start justify-center">
		<div class="flex w-full  mx-auto max-w-2xl  px-4 sm:px-0">
			<div class="flex flex-col">
				<a sveltekit:prefetch href="/" class="pt-4"> Главная </a>
				<a sveltekit:prefetch href="/now" class="pt-4"> Эфир </a>
				<a sveltekit:prefetch href="/sponsoram" class="pt-4"> Спонсорам </a>
			</div>
			<div class="ml-4 flex flex-col">
				<a sveltekit:prefetch href="/bands" class="pt-4"> Участники </a>
				<a sveltekit:prefetch href="/manual" class="pt-4"> Инструкция </a>
				<a sveltekit:prefetch href="/kabinet" class="pt-4"> Кабинет </a>
			</div>
			<div class="mx-auto" />
			<div class="container_develop space-between flex flex-col pb-0 pl-10">
				<a href="/ti">
					<div class="cub_container">
						<div class="front side">
							<svg
								width="40"
								height="40"
								viewBox="0 0 52 53"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fill-rule="evenodd"
									clip-rule="evenodd"
									d="M0 0H52V53H0V0ZM50 19V25.4059H41.9062V19H50ZM50 51V27.0985H41.9062V40.8481C41.4843 46.5375 45.0535 50.7028 50 51ZM40.0361 25.479V19.0964H16V25.4785H24.1913V51H32.2826V25.479H40.0361Z"
									fill="#1A80D3"
								/>
							</svg>
						</div>
						<div class="right side pr-8 text-right">
							<p>Создание<br />и поддержка<br />Ti-UNITS.RU</p>
						</div>
					</div>
				</a>
				<div my-auto>&nbsp;</div>
				<a href="/blog" class="pt-4">Журнал </a>
			</div>
		</div>
		<div class="mt-5 flex w-full  flex-col">
			<a href="/feedback" class="feedback mx-auto pb-2"> Отзывы и предложения </a>
			<div class="mx-auto mt-2 flex">
				<div class="lblock  text-right">2022<a class="px-1" href="/rights">©</a>РОКТВЕРЬ</div>
				<a sveltekit:prefetch href="/privacy" class="lblock ml-3 pt-1 text-sm"> Условия использования</a>
			</div>
		</div>
	</footer>
{/if}

<style>
	.feedback {
		color: orange;
	}
	.lblock {
		width: auto;
	}
	.container_develop a {
		display: block;
	}
	.container_develop {
		-webkit-perspective-origin: center 40px;
		perspective-origin: center 40px;
	}
	.cub_container .side,
	.cub_container {
		width: 40px;
		height: 40px;
		text-align: left;
		color: #465ee0;
	}

	.cub_container p {
		font-size: 12px;
		line-height: 14px;
	}
	.cub_container {
		margin-left: 20px;
		margin-top: 20px;
		-webkit-transition: ease-in-out 0.4s all;
		transition: ease-in-out 0.4s all;
		-webkit-transform-style: preserve-3d;
		transform-style: preserve-3d;
	}
	.cub_container:hover {
		-webkit-transform: rotateY(-90deg);
		transform: rotateY(-90deg);
	}
	.cub_container .side {
		position: absolute;
		width: 40px;
		height: 40px;
	}
	.cub_container .front {
		-webkit-transform: translateZ(100px);
		transform: translateZ(100px);
		background-color: rgba(0, 8, 51, 0);
	}
	.cub_container .right {
		right: 15rem;
		text-align: right;
		width: 130px;
		-webkit-transform: translateX(40px) translateZ(10px) rotateY(90deg);
		transform: translateX(40px) translateZ(10px) rotateY(90deg);
	}
</style>
