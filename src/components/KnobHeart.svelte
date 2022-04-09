<script>
	import { onDestroy, onMount } from 'svelte';
	onMount(() => {});
	import { blur, crossfade, draw, fade, fly, scale, slide } from 'svelte/transition';
	import { bounceIn } from 'svelte/easing';
	import { flip } from 'svelte/animate';
	let issend = false;
	let timerId;
	let timersend;
	export let tim = 5;
	export let eventobj;
	//export let index;

	export let now;
	export let user;
	export let efir;

	function sendliketoserver(x) {
		let myHeaders = new Headers();
		myHeaders.append('Content-Type', 'application/json');

		let raw = JSON.stringify(x);

		let requestOptions = {
			method: 'POST',
			headers: myHeaders,
			body: raw,
			redirect: 'follow'
		};

		fetch('https://api.rocktver.ru/like/', requestOptions)
			.then((response) => response.json())
			.then((result) => {
				issend = true;
				return result;
			})
			.catch((error) => console.log('error', error));
		ym(88086612, 'reachGoal', 'like');
	}

	function sendlike() {
		issend = true;
		sendliketoserver({ u: user, now: now, efir: efir });
		//console.log('now' + now);
		//setTimeout(function () {
		//	issend = true;
		//}, 800);

		timerId = setInterval(function () {
			tim = tim - 1;
			if (tim == 0) {
				clearInterval(timerId);
				issend = false;
				tim = 5;
			}
		}, 1000);
	}
	const [send, receive] = crossfade({
		duration: 2500,
		easing: bounceIn
	});

	onDestroy(() => {
		if (timerId) {
			clearInterval(timerId);
		}
	});

	let likes = 'load';
	let tracklikes = 'load';
	$: if (eventobj.status) {
		likes = eventobj.status.likes;
		if (likes == null) {
			likes = '';
		}
	}

	$: if (eventobj.status) {
		tracklikes = eventobj.status.tracklikes;
		//if (tracklikes == null) {tracklikes = ""}
	}
</script>

{#if !issend}
	{#key 1}
		<div on:click={sendlike} class="mx-auto cursor-pointer  flex animate-pulse rounded-lg bg-blue-400/50 shadow dark:bg-blue-500/20  ">
			<div class=ml-auto></div>
			<button  class="like-btn m-6  rounded-full bg-pink-400/90  p-4">
				<svg
					width="54"
					height="54"
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
			
			<div class=mr-auto><h1 class="kolvo text-left animate-none pr-5 pt-11 text-4xl">
				{now.now_event_likes}
			</h1></div>
			
			
		</div>
	{/key}
{:else}
	{#key 2}
		<div class="hight2rem flex flex-col mx-auto mt-2 mb-0 transition ease-in-out delay-150">
			<h1 class="text-xl mx-auto text-center">Благодарим за отклик!</h1>
			<h1 class="text-base mx-auto text-center">Повторное голосование будет возможно через</h1>
			<div class="text-xl mx-auto text-center tim">{tim}</div>
			<h1 class="text-base mx-auto text-center">секунд</h1>
		</div>
	{/key}
{/if}

<style>
	.kolvo{
color:#ec3e3e
	}
	.hight2rem {
		height: 7.88rem;
	}
	.like-btn {
	
		display: flex;
		justify-content: center;
	}


	.tim {
		color: #ec3e3e;
	}
</style>
