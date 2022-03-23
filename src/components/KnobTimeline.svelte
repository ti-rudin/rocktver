<script>
	import { onDestroy, onMount } from 'svelte';

	let status, isshowgo, band_on_scene, concertid;

	function load_efir() {
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
				band_on_scene = status.now_on_scene.band_rtid;
				return result;
			})
			.catch((error) => console.log('error', error));
	}

	function longpress(node, duration) {
		let timer;

		const handleMousedown = () => {
			timer = setTimeout(() => {
				node.dispatchEvent(new CustomEvent('longpress'));
			}, duration);
		};

		const handleMouseup = () => {
			clearTimeout(timer);
		};

		node.addEventListener('mousedown', handleMousedown);
		node.addEventListener('mouseup', handleMouseup);

		return {
			update(newDuration) {
				duration = newDuration;
			},
			destroy() {
				node.removeEventListener('mousedown', handleMousedown);
				node.removeEventListener('mouseup', handleMouseup);
			}
		};
	}

	let pressed = false;
	let duration = 2000;
	let isactive;
	export let idtogo, show_name;

	function change_timeline(x) {
		let myHeaders = new Headers();
		myHeaders.append('Content-Type', 'application/json');
		status.event_id = 0;
		status.show_name = show_name;
		status.event_id = 0;
		status.event_name = 'ключ на старт';
		let raw = JSON.stringify({ id: x, isshowgo: !isshowgo, status: status });

		let requestOptions = {
			method: 'POST',
			headers: myHeaders,
			body: raw,
			redirect: 'follow'
		};

		fetch('https://api.rocktver.ru/change-efir/', requestOptions)
			.then((response) => response.json())
			.then((result) => {
				return result;
			})
			.catch((error) => console.log('error', error));
	}

	load_efir();

	$: if (isshowgo) {
		if (concertid == idtogo) {
			isactive = false;
		}
	} else {
		isactive = true;
	}
	$: if (pressed) {
		change_timeline(idtogo);
		load_efir();
	}
</script>

{#if isactive}
	<button
		aria-label="Toggle Dark Mode"
		class="ml-1 flex h-14 w-14 items-center justify-center rounded-lg border ring-yellow-400
transition-all hover:ring-2"
	>
		<svg
			version="1.1"
			id="Capa_1"
			xmlns="http://www.w3.org/2000/svg"
			xmlns:xlink="http://www.w3.org/1999/xlink"
			x="0px"
			y="0px"
			viewBox="-70 -70 600 600"
			xml:space="preserve"
		>
			<rect x="65.074" y="24" style="fill:red;" width="25.21" height="15.154" />
			<rect x="65.074" y="63.154" style="fill:blue;" width="25.21" height="331.956" />
			<path
				stroke="#2C3E50"
				stroke-width="1.25"
				stroke-linecap="round"
				stroke-linejoin="round"
				style="fill:red;"
				d="M303.736,137.84l41.826-74.686H114.284v161.098h231.278l-41.826-74.685
			   C301.696,145.925,301.695,141.483,303.736,137.84z"
			/>
			<path
				style="fill:black;"
				d="M327.96,143.704l48.547-86.686c2.081-3.717,2.036-8.257-0.116-11.932
			   c-2.154-3.675-6.094-5.933-10.354-5.933H114.284V12c0-6.628-5.372-12-12-12h-49.21c-6.628,0-12,5.372-12,12v395.11
			   c0,6.627,5.372,12,12,12h49.21c6.628,0,12-5.373,12-12V248.252h251.753c4.26,0,8.199-2.258,10.354-5.933
			   c2.152-3.675,2.197-8.215,0.116-11.932L327.96,143.704z M90.284,395.11h-25.21V63.154h25.21V395.11z M90.284,39.154h-25.21V24
			   h25.21V39.154z M114.284,224.252V63.154h231.278l-41.826,74.686c-2.041,3.643-2.04,8.085,0,11.727l41.826,74.685H114.284z"
			/>
		</svg>
	</button>
{:else}
	<button
		aria-label="Toggle Dark Mode"
		class="ml-1 flex h-14 w-14 items-center justify-center rounded-lg ring-yellow-400
transition-all hover:ring-2"
	>
		<svg
			version="1.1"
			id="Capa_1"
			xmlns="http://www.w3.org/2000/svg"
			xmlns:xlink="http://www.w3.org/1999/xlink"
			x="0px"
			y="0px"
			viewBox="-70 -70 600 600"
			xml:space="preserve"
		>
			<rect x="65.074" y="24" style="fill:red;" width="25.21" height="15.154" />
			<rect x="65.074" y="63.154" style="fill:blue;" width="25.21" height="331.956" />
			<path
				stroke="#2C3E50"
				stroke-width="1.25"
				stroke-linecap="round"
				stroke-linejoin="round"
				style="fill:red;"
				d="M303.736,137.84l41.826-74.686H114.284v161.098h231.278l-41.826-74.685
			   C301.696,145.925,301.695,141.483,303.736,137.84z"
			/>
			<path
				style="fill:black;"
				d="M327.96,143.704l48.547-86.686c2.081-3.717,2.036-8.257-0.116-11.932
			   c-2.154-3.675-6.094-5.933-10.354-5.933H114.284V12c0-6.628-5.372-12-12-12h-49.21c-6.628,0-12,5.372-12,12v395.11
			   c0,6.627,5.372,12,12,12h49.21c6.628,0,12-5.373,12-12V248.252h251.753c4.26,0,8.199-2.258,10.354-5.933
			   c2.152-3.675,2.197-8.215,0.116-11.932L327.96,143.704z M90.284,395.11h-25.21V63.154h25.21V395.11z M90.284,39.154h-25.21V24
			   h25.21V39.154z M114.284,224.252V63.154h231.278l-41.826,74.686c-2.041,3.643-2.04,8.085,0,11.727l41.826,74.685H114.284z"
			/>
		</svg>
	</button>
{/if}
