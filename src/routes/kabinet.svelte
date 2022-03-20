<script>

	import { isAuthenticated, user } from '$lib/stores/auth';

	import { onMount } from 'svelte';


	$: if ($isAuthenticated) {
		console.log($user);
		//loadsettings($user.id);
	}

	onMount(() => {
		VK.UI.button('login_button');

	});

	function getit(response) {
		if (response.session) {
			var id = response.session.mid;
		}
		VK.Api.call('users.get', { uids: id, fields: 'photo, first_name,last_name', v: "5.131" }, function (r) {
			if (r.response) {
				//alert(r.response.sex);
				$isAuthenticated = true;
				console.log(r.response);
				let user_data = {
					id: r.response['id'],
					name: r.response[0]['first_name'] + ' ' + r.response[0]['last_name'],
					photo: r.response[0].photo,
			
				};
				user.set(user_data);
			}
		});
	}

	
</script>



{#if $isAuthenticated}
	<p>qu</p>
	{$user.photo}
	{$user.name}
{:else}
	<p>Авторизуйтесь</p>

	<div id="login_button" on:click={() => {VK.Auth.login(getit)}}></div>
	
{/if}



<style>
</style>
