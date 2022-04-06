<script>
	// href={item.slug} title={item.data.title} date={item.data.date}
	export let href = '#';


	export let title = 'Untitled post';
	/** @type {string} */
	export let stringData = 'no date';
</script>

<a
	sveltekit:prefetch
	class="w-full  delay-50 mx-auto cursor-pointer rounded-lg text-gray-900 focus:outline-none no-underline hover:text-yellow-600 dark:text-gray-100 dark:hover:text-yellow-100"
	href={href}
	><div class="mb-8 w-full">
		<div class="mt-2 flex flex-col justify-between md:flex-row">
			<h4 class=" w-full flex-auto text-lg font-medium md:text-xl focus:outline-none no-underline">
				{title}
			</h4>

			<p class="mb-4 w-32 text-left text-blue-500/80 focus:outline-none md:mb-0 md:text-right">{stringData}</p>
		</div>
		<p class="pt-4 text-gray-600 dark:text-gray-400">
			<slot />
		</p>
	</div></a
>
<style>
	a{
		text-decoration: none;
	}
</style>
