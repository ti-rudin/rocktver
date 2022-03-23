<script>
	import dateFormat, { masks } from 'dateformat';
	async function load_efir() {
		console.log('ssdd');
		let myHeaders = new Headers();
		myHeaders.append('Content-Type', 'application/json');
		let requestOptions = {
			method: 'GET',
			headers: myHeaders
		};

		fetch('https://api.rocktver.ru/open-status/', requestOptions)
			.then((response) => response.json())
			.then((result) => {
				console.log(result);
				status = result;
				isshowgo = status.is_show_go;
				concertid = status.concert_id;
				show_name = status.show_name;
				band_on_scene = status.now_on_scene.band_rtid;
				setTimeout(function () {
					load_efir();
				}, 2000);
			})
			.catch((error) => console.log('error', error));
	}

	export let isshowgo, band_on_scene, concert, timeline, status, concertid, show_name;
	import { onDestroy, onMount } from 'svelte';

	onMount(() => {
		load_efir();
	});
</script>

{#if isshowgo}
	
		<div class="w-full">
			<div
				aria-label="card 1"
				class="mx-auto max-w-2xl rounded bg-red-400/40 p-6 shadow focus:outline-none dark:bg-red-500"
			>
				<div class="flex items-center border-b border-gray-200 pb-6">
					<div class="flex w-full items-start justify-between">
						<div class="w-full pl-3">
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
			</div>
		</div>


	<div class="mt-4 w-full">
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
							{status.event_name}
						</h1>
					</div>
				</div>
			</div>
		</div>
	</div>
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
							Виджет "Сейчас на сцене" сейчас не работает. Зайдите попозже)
						</h1>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
