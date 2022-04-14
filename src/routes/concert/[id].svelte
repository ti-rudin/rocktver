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
        show_name
        ploschadka
        bilet_ot
        zhuri {
          data {
            attributes {
              band_name
              town
              small_text
              big_text
              group_logo {
                data {
                  attributes {
                    url
                  }
                }
              }
              group_link_vk
              group_link_rocktver
              mngr_id
              time_on_scene
              artists {
                data {
                  attributes {
                    name
                    avatar {
                      data {
                        attributes {
                          url
                        }
                      }
                    }
                    role
                    vk_link
                  }
                }
              }
            }
          }
        }
        url_website
        spisok(pagination: { pageSize: 100 }) {
          ... on ComponentBandsTimeline {
            id
            band {
              data {
                id
                attributes {
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
			//console.log('concert - ' + data);

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
	export const prerender = true;
</script>

<script>
	import { onDestroy, onMount } from 'svelte';
	export let concert, timeline, state, artists;
	$: if (concert.attributes.zhuri.data) {
		artists = concert.attributes.zhuri.data.attributes.artists.data;
	}
	

	//console.log(this.artists.data[0].attributes.name)

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

	import KnobEfir from '../../components/KnobEfir.svelte';
	import KnobTimeline from '../../components/KnobTimeline.svelte';

	import LogoComponent from '../../components/LogoComponent.svelte';
	import { goto } from '$app/navigation';
	import { isAuthenticated, user } from '$lib/stores/auth';
	import { isDarkFlag, isMngr, isAdmin } from '$lib/siteConfig';
	import { getEfir, getNow } from '../../components/api.js';
import Bands from '../bands.svelte';
	//$isAdmin = false;
	let bandslikes = [];
	let apiurl = 'https://api.rocktver.ru';

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

	async function getlikes(cid) {
		let myHeaders = new Headers();
		myHeaders.append('Content-Type', 'application/json');

		let raw = JSON.stringify({ concert_id: cid });

		let requestOptions = {
			method: 'POST',
			headers: myHeaders,
			body: raw
		};

		fetch(apiurl+'/get-likes', requestOptions)
			.then((response) => response.json())
			.then((result) => {
				console.log(result);
				bandslikes = result;
				return result;
			})
			.catch((error) => console.log('error', error));
	}

	async function load_open_status() {
		state = await getEfir();
	}
	onMount(() => {
		loaduser($user.id);
		getlikes(concert.id);
	});
	$: state = state;
	load_open_status();

</script>


{#if $isAuthenticated}
	{#if $isAdmin}
		<div
			class="mx-auto my-3 flex max-w-2xl  flex-col rounded p-6  shadow ring-1 ring-yellow-600 focus:outline-none"
		>
			<h1 class="mx-auto mb-2 text-xl">Администрирование</h1>

			<div class="mx-auto">
				<KnobEfir idtogo={concert.id} user={$user.id} />
			</div>
		</div>
	{/if}
{/if}

<!--- more free and premium Tailwind CSS components at https://tailwinduikit.com/ --->
<div class="w-full  ">
	<div
		aria-label="card 1"
		class="mx-auto max-w-2xl rounded bg-orange-400/40 p-6 shadow focus:outline-none dark:bg-red-500"
	>
		<div class="flex items-center border-b border-gray-500 dark:border-gray-200 pb-3">
			<div class="flex w-full items-start justify-between">
				<div class="w-full ">
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
			
			<div tabindex="0" class="flex flex-col focus:outline-none mt-1">
				<div class="mb-3 py-2 px-4  text-center text-lg leading-3 text-black dark:text-white">
					Концертная площадка
				</div>
				<a sveltekit:prefetch
					href={concert.attributes.url_website}
					target="blank"
					tabindex="0"
					class="mx-auto w-fit rounded-full bg-yellow-400 p-2 px-4  px-3 text-xl text-black ring-yellow-400 transition-all
				hover:ring-2 dark:bg-yellow-800 dark:text-white"
				>
					{concert.attributes.ploschadka}
				</a>
				<div class="mt-3 pt-2 px-4  text-center text-lg leading-3 text-black dark:text-white">
					{concert.attributes.bilet_ot}
				</div>
			</div>
		</div>
	</div>
</div>
{#if concert.attributes.zhuri.data}

<div class="mt-5 w-full ">
	<div
		aria-label="card 1"
		class="mx-auto max-w-2xl rounded bg-blue-400/70 p-6 shadow  dark:bg-blue-500 "
	>
		<div
			class="flex cursor-pointer rounded ring-yellow-400 transition-all hover:ring-2 focus:outline-none"
			on:click={() => {
				goto('/band/' + concert.attributes.zhuri.data.attributes.band_name);
			}}
		>
			<img
				class=" h-28 w-28 w-full rounded shadow"
				src={'https://admin.rocktver.ru' + concert.attributes.zhuri.data.attributes.group_logo.data.attributes.url}
				alt=""
			/>
			<div>
				<h1 class="pl-4 text-xl text-gray-800 focus:outline-none dark:text-white">
					{concert.attributes.zhuri.data.attributes.band_name}
				</h1>

				<h1 class="pl-4 text-lg text-pink-600 focus:outline-none dark:text-pink-300">
					{concert.attributes.zhuri.data.attributes.town}
				</h1>
			</div>
		</div>
		<div class="mx-auto my-3">
			<div class="textcard">
				{concert.attributes.zhuri.data.attributes.big_text}
			</div>
		</div>

		<div class="flex flex-col">
			{#if artists}
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
						<p class="lblock  mt-1 border-t border-white/30">{artist.attributes.name}</p>
						<p
							class="lblock ml-1 mt-1 border-t border-white/30 text-left text-gray-700 dark:text-gray-300"
						>
							{artist.attributes.role}
						</p>
					</div>
				{/each}
			{/if}
		</div>
	</div>
</div>
{/if}
<div class="relative mx-auto  w-full max-w-2xl ">
	<div class="mt-5 border-l-2 border-gray-400">
		{#each timeline as event, i}
			{#if event.open_speache || event.finish_speache}
				<div
					class="items-left relative ml-10 mb-5 flex transform cursor-pointer flex-col space-y-4 rounded bg-blue-600 px-6 py-4 text-white transition hover:-translate-y-2 md:flex-row md:space-y-0"
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
							<KnobTimeline user={$user.id} event_i={i} {event} {concert} />
						{/if}
					{/if}
				</div>
			{:else if event.tech_pause}
				<div
					class="relative ml-10 mb-5 flex transform cursor-pointer flex-col items-left space-y-4 rounded bg-yellow-600 px-6 py-4 text-white transition hover:-translate-y-2 md:flex-row md:space-y-0"
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
							<KnobTimeline user={$user.id} event_i={i} {event} {concert} />
						{/if}
					{/if}
				</div>
			{:else if event.slovo_vedusch}
				<div
					class="relative ml-10 mb-5 flex transform cursor-pointer flex-col items-left space-y-4 rounded bg-green-600 px-6 py-4 text-white transition hover:-translate-y-2 md:flex-row md:space-y-0"
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
							<KnobTimeline user={$user.id} event_i={i} {event} {concert} />
						{/if}
					{/if}
				</div>
			{:else if ($isAdmin&&$isAuthenticated)}
				<div
					class="bandurl relative ml-10 mb-5 flex transform cursor-pointer flex-col items-left space-y-4 rounded bg-pink-600 px-6 py-4 text-white dark:text-white transition hover:-translate-y-2 md:flex-row md:space-y-0"
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

					<KnobTimeline user={$user.id} event_i={i} {event} {concert} />
				</div>
			{:else}
				<a sveltekit:prefetch
					class="bandurl relative ml-10 mb-5 flex transform cursor-pointer flex-col items-left space-y-4 rounded bg-pink-600 pl-6 pr-3 pb-4 text-white dark:text-white transition hover:-translate-y-2 md:flex-row md:space-y-0"
					on:click={() => {
						goto('/band/' + event.band.data.attributes.band_name);
					}}
				>
					<div
						class="absolute -left-10 z-10 mt-2 h-5 w-5 -translate-x-2/4 transform rounded-full bg-pink-600 md:mt-2"
					/>
					<div class="absolute -left-10 md:top-4 z-0 h-1 w-10 bg-pink-600" />

					<div class="flex w-full flex-wrap pt-4">
						<div>
							<h1 class="text-lg">
								{event.start_time.split(':00.000')[0]}
							</h1>
							{#if event.band.data}
								<h1 class="text-xl font-bold">{event.band.data.attributes.band_name}</h1>
							{:else}
								<h1 class="text-xl font-bold">{event.title}</h1>
							{/if}
						</div>
						
						<div class="flex mt-2 w-full">
							{#if bandslikes[i]}
							<svg
								width="44"
								height="44"
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
							
							<div class="text-xl mt-2">{bandslikes[i]}</div>
							{/if}
						</div>
					</div>
				</a>
			{/if}
		{/each}
	</div>
</div>

<!-- component -->
<style>
	.bandurl {
		text-decoration: none;
	}
	.bandurl:hover {
		text-decoration: none;
		color: white;
	}
	.lblock {
		width: 40vw;
	}
</style>
