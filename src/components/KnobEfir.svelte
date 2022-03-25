<script>
	import { onDestroy, onMount } from 'svelte';

	let status, isshowgo, band_on_scene, concertid, concert;

	function load_efir() {
		
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

	let isactive;
	export let idtogo, show_name;


	function change_efir(x) {
		let myHeaders = new Headers();
		myHeaders.append('Content-Type', 'application/json');
		status.event_id = 0;
		status.show_name = show_name;
		status.event_id = 0;
		status.event_name = "ключ на старт";

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
  

</script>

{#if isactive}
	<button
		class="ml-1 flex h-9 w-40 items-center justify-center rounded-lg bg-green-400 ring-green-400
			transition-all hover:ring-2 dark:bg-green-800"
		
		on:click={() => {
			pressed = true;
			
			isactive = !isactive;
            change_efir(idtogo);
			load_efir();
		}}
	>
		Запустить
	</button>
{:else}
	<button
		class="ml-1 flex h-9 w-40 items-center justify-center rounded-lg bg-red-400 ring-yellow-400
			transition-all hover:ring-2 dark:bg-red-800"
		
		on:click={() => {
			pressed = true;
			
			isactive = !isactive;
            change_efir(idtogo);
			load_efir();
		}}
	>
		Остановить
	</button>
{/if}
