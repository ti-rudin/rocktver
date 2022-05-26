<script>
	import { onDestroy, onMount } from 'svelte';
	import { isAuthenticated, user } from '$lib/stores/auth';
    export let usernametitle, loterid;
   
onMount(() => {

    //console.log(imgurl);
    document.getElementById('vk_share_button').innerHTML = VK.Share.button(
        {
            image: 'https://rocktver.ru/rockopolchenie2022-2.jpg',
            title: usernametitle,
            noparse: true,
            url: 'https://vk.com/rock_opolchenie2022'
        },
        {
            type: 'round_nocount',
            text: 'Поделиться'
        }
    );
});
function register(x) {
		let myHeaders = new Headers();
		myHeaders.append('Content-Type', 'application/json');

		let raw = JSON.stringify({user: x});

		let requestOptions = {
			method: 'POST',
			headers: myHeaders,
			body: raw,
		};

		fetch('https://api.rocktver.ru/lotereya-register/?loterid='+loterid, requestOptions)
			.then((response) => response.json())
			.then((result) => {
				
				return result;
			})
			.catch((error) => console.log('error', error));

	}
</script>

<div class="mt-3 ">
    <div
        aria-label="card 1"
        class="mx-auto max-w-2xl rounded-lg bg-blue-400/50 pb-3 shadow dark:bg-blue-500/20 "
    >
        <div class=" mx-auto p-4 text-center text-gray-800 focus:outline-none dark:text-white">
            <div class="mx-auto w-72">
                <img class="mx-auto w-full" src="/rockopolchenie2022-2.jpg" alt="РОКОПОЛЧЕНИЕ  2022" />
            </div>
        </div>

        <div
            class="pb-4 pt-2"
            id="vk_share_button"
            
            on:click={() => {
                ym(88086612, 'reachGoal', 'repost pic');
                register($user)
            }}
        />
    </div>
</div>
<style>

#vk_share_button {
		transform: scale(1.8);
		position: relative;
		width: 1rem;
		left: -4.7rem;
		margin-left: auto;
		margin-right: auto;
	}
</style>