<script>
import { onDestroy, onMount } from 'svelte';
onMount(() => {
	

	});
  import { blur, crossfade, draw, fade, fly, scale, slide } from 'svelte/transition';	
</script>

<button class="like-btn mx-auto rouded ">
	<svg  
		class="like-icon"
		xmlns="http://www.w3.org/2000/svg"
		width="54"
		height="54"
		viewBox="0 0 24 24"
	>
		<path
			d="M12 4.4119c-2.826-5.695-11.999-4.064-11.999 3.27 0 7.27 9.903 10.938 11.999 15.311 2.096-4.373 12-8.041 12-15.311 0-7.327-9.17-8.972-12-3.27z"
		/>
	</svg>
</button>
<svg transition:blur={{ duration: 300 }} xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" fill="pink" viewBox="0 0 24 24" stroke="red" stroke-width="1">
	<path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>



<style> 

.like-btn {
  color: red;
  display: flex;
  justify-content: center;
}



.like-btn path {
  fill: #c29898;
}

.like-btn.active path {
  fill: #ec3e3e;
}



</style>
