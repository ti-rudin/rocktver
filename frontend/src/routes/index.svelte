<script>
  import auth from '$lib/services/auth'
  import { isAuthenticated, user } from '$lib/stores/auth'
  import { onMount } from 'svelte'

  let auth0Client
  let leadsurl="https://api.rocktver.ru/apites"
  let t

  onMount(async () => {
    auth0Client = await auth.createClient()
    isAuthenticated.set(await auth0Client.isAuthenticated())
    user.set(await auth0Client.getUser())
    

    await fetch(leadsurl)
    .then(r => r.text())
    .then(result=> t=result)

  })

$: if ($isAuthenticated) {
  console.log($user)
}

  function login() {
    auth.loginWithPopup(auth0Client)
  }

  function logout() {
    auth.logout(auth0Client)
  }
 





</script>

<h1>Welcome to SvelteKit</h1>
<p>
  Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the
  documentation
</p>

{#if $isAuthenticated}
  {#if ($user.name == "Александр Рудин")}
  <h2>dd {t}</h2>
  {/if}
  <h2>Hey {$user.name} !</h2>
  {#if $user.picture}
    <img src={$user.picture} alt={user.name} />
  {:else}
    <img
      src="https://source.unsplash.com/random/400x300"
      alt="Random Photo"
    />
  {/if}
  <button on:click={logout}>Logout</button>
{:else}
  <button on:click={login}>Login</button>
{/if}
