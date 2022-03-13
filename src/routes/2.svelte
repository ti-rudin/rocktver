<script context="module">
	import {
		isDarkFlag
	} from '$lib/siteConfig';

	export const prerender = true; // index page is most visited, lets prerender


</script>

<script>
	import { onDestroy, onMount } from 'svelte';
	import { blur, crossfade, draw, fade, fly, scale, slide } from 'svelte/transition';
	import Carousel from '../components/Carusel.svelte';
	import Now from '../components/Now.svelte'
	import { ChevronLeftIcon, ChevronRightIcon } from 'svelte-feather-icons';



	onMount(() => {
		//comandes_data = launches;
		//	console.log(comandes_data);
	});
</script>

<Now/>