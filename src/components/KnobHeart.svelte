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
	export let index;
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
		ym(88086612,'reachGoal','like')
	}

	function sendlike() {
		issend = true;
		sendliketoserver({ u: user, now: now, efir: efir });
		console.log('now' + now);
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
			<div class="mx-auto flex animate-pulse">
				<button on:click={sendlike} class="like-btn m-6 mx-auto rounded-full bg-pink-400/50  p-4">
					<svg
						class="like-icon"
						xmlns="http://www.w3.org/2000/svg"
						width="54"
						height="54"
						viewBox="-2 -3 28 28"
						stroke="red"
						stroke-width="1"
					>
						<path
							d="M12 4.4119c-2.826-5.695-11.999-4.064-11.999 3.27 0 7.27 9.903 10.938 11.999 15.311 2.096-4.373 12-8.041 12-15.311 0-7.327-9.17-8.972-12-3.27z"
						/>
					</svg>
					
				</button>
				<h1 class="animate-none pl-2 pt-11 like-btn mx-auto text-4xl">
					{now.now_event_likes}
				</h1>
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
	.hight2rem {
		height: 7.88rem;
	}
	.like-btn {
		color: red;
		display: flex;
		justify-content: center;
	}
	.liked-btn {
		color: red;
		display: flex;
		justify-content: center;
	}

	.like-btn path {
		fill: #ff8d8d;
	}

	.like-btn.active path {
		fill: #ec3e3e;
	}
	.tim {
		color: #ec3e3e;
	}
</style>
