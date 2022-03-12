<!-- https://tailwindcss.com/docs/typography-plugin#element-modifiers -->
<script>
	import { onDestroy, onMount } from 'svelte';  
import {
    blur,
    crossfade,
    draw,
    fade,
    fly,
    scale,
    slide,
  } from 'svelte/transition';

  let show = false;
  let interval;


  onMount(() => {
    interval = setTimeout(() => {
      show = !show;
    }, 100);
  })

  onDestroy(() => {
	if (interval) {
	  clearTimeout(interval);
    }  
  });
</script>

{#if show}


<article  transition:blur="{{duration: 400 }}"
	class="container prose mx-auto mb-12 hover:prose-a:text-orange-300
prose-ul:list-disc
dark:prose-invert
"
>
	<slot  />
</article>
{/if}