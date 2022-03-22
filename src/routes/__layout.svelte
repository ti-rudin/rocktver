<script>
	import { SITE_TITLE } from '$lib/siteConfig';

	import '../tailwind.css';
	import Nav from '../components/Nav.svelte';
	import { isAuthenticated, user } from '$lib/stores/auth';
	import {onMount } from 'svelte';
	import LogRocket from 'logrocket';
	onMount(() => {
		VK.init({ apiId: 8083840 });

	});



</script>

<svelte:head>

</svelte:head>

<div class="flex flex-col justify-center bg-gray-50 px-4 dark:bg-gray-900 ">
	<Nav />
</div>
<main class="flex flex-col justify-center bg-gray-50 px-4 dark:bg-gray-900 sm:px-8">
	<slot />
</main>

<footer class="mx-auto mt-2 mb-8 flex w-full max-w-2xl flex-col items-start justify-center">
	<hr class="border-1 mb-8 w-full border-gray-200 dark:border-gray-800" />

</footer>
