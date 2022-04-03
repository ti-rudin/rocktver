<script>


	let status, isshowgo, band_on_scene, concertid, concert;

	function load_efir() {
		
		let myHeaders = new Headers();
		myHeaders.append('Content-Type', 'application/json');
		let requestOptions = {
			method: 'GET',
			headers: myHeaders
		};

		fetch('https://api.rocktver.ru/get-efir/', requestOptions)
			.then((response) => response.json())
			.then((result) => {
				//console.log(result);
				status = result;
				isshowgo = status.is_show_go;
                concertid = status.concert_id;
				band_on_scene = status.now_on_scene.band_rtid;
				return result;
			})
			.catch((error) => console.log('error', error));
	}



	let isactive;
	export let idtogo, user;


	function change_efir(x) {
		let myHeaders = new Headers();
		myHeaders.append('Content-Type', 'application/json');


		let raw = JSON.stringify({ id: x, isshowgo: !isshowgo, userid: user, cmd:"change-concert" });

		let requestOptions = {
			method: 'POST',
			headers: myHeaders,
			body: raw
		};

		fetch('https://api.rocktver.ru/change-concert/', requestOptions)
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
			
			
			isactive = !isactive;
            change_efir(idtogo);
			load_efir();
		}}
	>
		СТАРТ
	</button>
{:else}
	<button
		class="ml-1 flex h-9 w-40 items-center justify-center rounded-lg bg-red-400 ring-yellow-400
			transition-all hover:ring-2 dark:bg-red-800"
		
		on:click={() => {
			
			
			isactive = !isactive;
            change_efir(idtogo);
			load_efir();
		}}
	>
		Остановить
	</button>
{/if}
