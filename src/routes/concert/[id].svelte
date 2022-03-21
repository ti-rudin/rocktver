<script context="module">
	
	export async function load({ params, fetch }) {
		const res = await fetch('https://admin.rocktver.ru/graphql', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				query:
					`{
            concert (id:` +
					params.id +
					`)  {
              data {
                id
                attributes {
                  start_date
                  mc_id
                  show_name
				  ploschadka
				  bilet_ot
                  spisok {
                    ... on ComponentBandsTimeline {
                      id
                      band{
                        data{
                          attributes{
                            band_name
                          }
                        }
                      }
                      tech_pause
                      open_speache
                      finish_speache
					  start_time
           			 title
         			 slovo_vedusch
                    }
                  }
                }
              }
            }
          }`
			})
		});
		if (res.ok) {
			const { data } = await res.json();
			console.log(data);
			return {
				props: {
					concert: data.concert.data,
					timeline: data.concert.data.attributes.spisok
				}
			};
		}
		return {
			status: res.status,
			error: new Error(`Error fetching GraphQL data`)
		};
	}
</script>

<script>

	export let concert, timeline;
	//console.log(this.artists.data[0].attributes.name)
	$: concert = concert;
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
	import { isAuthenticated, user } from '$lib/stores/auth';
	import { isDarkFlag, isMngr, isAdmin } from '$lib/siteConfig';

	let apiurl = 'https://api.rocktver.ru/getuserdata';

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

		fetch(apiurl, requestOptions)
			.then((response) => response.json())
			.then((result) => {
				console.log(result.id);
				if (result.id == 'admin') {
					$isAdmin = true;
				}
				return result.id;
			})
			.catch((error) => console.log('error', error));
	}

	if ($isAuthenticated) {
		loaduser($user.id);
	}
</script>


{#if $isAuthenticated}
	Авторизованный
	{#if $isAdmin}
		админ
	{/if}
{/if}

<!--- more free and premium Tailwind CSS components at https://tailwinduikit.com/ --->
<div class="w-full ">
	<div
		aria-label="card 1"
		class="mx-auto max-w-2xl rounded bg-red-400/40 p-6 shadow focus:outline-none dark:bg-red-500"
	>
		<div class="flex items-center border-b border-gray-200 pb-6">
			<div class="flex w-full items-start justify-between">
				<div class="w-full pl-3">
					<h1 tabindex="0" class="text-2xl text-black focus:outline-none dark:text-gray-200">
						{concert.attributes.show_name}
					</h1>
					<h1 tabindex="0" class="pt-2 text-xl text-gray-800 focus:outline-none dark:text-gray-200">
						{dateFormat(concert.attributes.start_date, 'd mmmm, dddd')}
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
			<p
				tabindex="0"
				class="py-4 text-sm leading-5 text-gray-600 focus:outline-none dark:text-gray-200"
			/>
			<div tabindex="0" class="flex flex-col focus:outline-none">
				<div class="mb-3 py-2 px-4  text-center text-lg leading-3 text-black dark:text-white">
					Концертная площадка
				</div>
				<a
					href="https://bigbclub.ru/"
					target="blank"
					tabindex="0"
					class="mx-auto w-fit rounded-full bg-yellow-400 p-2 px-4  px-3 text-xl text-black ring-yellow-400 transition-all
				hover:ring-2 dark:bg-yellow-800 dark:text-white"
				>
					{concert.attributes.ploschadka}
				</a>
				<div class="my-3 py-2 px-4  text-center text-lg leading-3 text-black dark:text-white">
					{concert.attributes.bilet_ot}
				</div>
			</div>
		</div>
	</div>
</div>
<div class="relative mx-auto w-10/12 py-2 md:w-9/12 lg:w-7/12">
	<div class="mt-10 border-l-2">
		{#each timeline as event}
			{#if event.open_speache || event.finish_speache}
				<div
					class="items-left relative ml-10 mb-10 flex transform cursor-pointer flex-col space-y-4 rounded bg-blue-600 px-6 py-4 text-white transition hover:-translate-y-2 md:flex-row md:space-y-0"
				>
					<div
						class="absolute -left-10 z-10 mt-2 h-5 w-5 -translate-x-2/4 transform rounded-full bg-blue-600 md:mt-2"
					/>
					<div class="absolute -left-10 z-0 h-1 w-10 bg-blue-300 md:top-8" />

					<!-- Content that showing in the box -->
					<div class="flex-auto">
						<h1 class="text-lg">
							{event.start_time.split(':00.000')[0]}
						</h1>
						<h1 class="text-xl font-bold">{event.title}</h1>
					</div>
					{#if $isAuthenticated}
						{#if $isAdmin}
						<button
						aria-label="Toggle Dark Mode"
						class="ml-1 flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-400 ring-yellow-400
						transition-all hover:ring-2 dark:bg-yellow-800"
						
					>
						{#if $isDarkFlag}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								class="h-5 w-5 text-gray-800 dark:text-yellow-100"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728
									0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
								/>
							</svg>
						{:else}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								class="w-5 h-5 text-gray-800 dark:text-gray-200"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
								/>
							</svg>
						{/if}
					</button>
						{/if}
					{/if}
				</div>
			{:else if event.tech_pause}
				<div
					class="relative ml-10 mb-10 flex transform cursor-pointer flex-col items-left space-y-4 rounded bg-yellow-600 px-6 py-4 text-white transition hover:-translate-y-2 md:flex-row md:space-y-0"
				>
					<div
						class="absolute -left-10 z-10 mt-2 h-5 w-5 -translate-x-2/4 transform rounded-full bg-yellow-600 md:mt-2"
					/>
					<div class="absolute -left-10 md:top-8 z-0 h-1 w-10 bg-yellow-600" />

					<!-- Content that showing in the box -->
					<div class="flex-auto">
						<h1 class="text-lg">
							{event.start_time.split(':00.000')[0]}
						</h1>
						{#if event.band.data}
							<h1 class="text-xl font-bold">{event.band.data.attributes.band_name}</h1>
						{:else}
							<h1 class="text-xl font-bold">{event.title}</h1>
						{/if}
					</div>
					{#if $isAuthenticated}
						{#if $isAdmin}
							<a href="#" class="text-center text-white hover:text-gray-300">Управление</a>
						{/if}
					{/if}
				</div>
			{:else if event.slovo_vedusch}
				<div
					class="relative ml-10 mb-10 flex transform cursor-pointer flex-col items-left space-y-4 rounded bg-green-600 px-6 py-4 text-white transition hover:-translate-y-2 md:flex-row md:space-y-0"
				>
					<div
						class="absolute -left-10 z-10 mt-2 h-5 w-5 -translate-x-2/4 transform rounded-full bg-green-600 md:mt-2"
					/>
					<div class="absolute -left-10 md:top-8 z-0 h-1 w-10 bg-green-600" />

					<!-- Content that showing in the box -->
					<div class="flex-auto">
						<h1 class="text-lg">
							{event.start_time.split(':00.000')[0]}
						</h1>
						{#if event.band.data}
							<h1 class="text-xl font-bold">{event.band.data.attributes.band_name}</h1>
						{:else}
							<h1 class="text-xl font-bold">{event.title}</h1>
						{/if}
					</div>
					{#if $isAuthenticated}
					{#if $isAdmin}
						<a href="#" class="text-center text-white hover:text-gray-300">Управление</a>
					{/if}
				{/if}
				</div>
			{:else}
				<div
					class="relative ml-10 mb-10 flex transform cursor-pointer flex-col items-left space-y-4 rounded bg-pink-600 px-6 py-4 text-white transition hover:-translate-y-2 md:flex-row md:space-y-0"
				>
					<div
						class="absolute -left-10 z-10 mt-2 h-5 w-5 -translate-x-2/4 transform rounded-full bg-pink-600 md:mt-2"
					/>
					<div class="absolute -left-10 md:top-8 z-0 h-1 w-10 bg-pink-600" />

					<!-- Content that showing in the box -->
					<div class="flex-auto">
						<h1 class="text-lg">
							{event.start_time.split(':00.000')[0]}
						</h1>
						{#if event.band.data}
							<h1 class="text-xl font-bold">{event.band.data.attributes.band_name}</h1>
						{:else}
							<h1 class="text-xl font-bold">{event.title}</h1>
						{/if}
					</div>
					{#if $isAuthenticated}
						{#if $isAdmin}
							<a href="#" class="text-center text-white hover:text-gray-300">Управление</a>
						{/if}
					{/if}
				</div>
			{/if}
		{/each}
	</div>
</div>

<!-- component -->
<style>
	.card {
		min-width: 280px;
	}
	.smtxt {
		top: -40px;
		left: 110px;
		position: relative;
		line-height: 0px;
		min-width: 450px;
	}
	ul {
		list-style: none;
		padding: 0;
		margin-top: 32px;
		width: auto;
	}
	li {
		border: 1px solid #eaeaea;
		border-radius: 8px;
		margin-bottom: 16px;
		background-color: white;
		transition: 0.15s box-shadow ease-in-out;
	}
	li:hover {
		box-shadow: 0 5px 10px rgba(0, 0, 0, 0.12);
	}
	p {
		color: #666;
		font-size: 14px;
		line-height: 1.75;
	}

	.card-link {
		padding: 8px 24px;
		display: block;
	}
	.link {
		transition: 0.15s text-decoration ease-in-out;
		color: #0761d1;
	}
	.link:hover {
		text-decoration: underline;
	}
</style>
