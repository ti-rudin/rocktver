<script>
	// href={item.slug} title={item.data.title} date={item.data.date}
	export let href = '#';

	/** @type {import('$lib/types').GHMetadata} */
	export let ghMetadata = null;
	export let title = 'Untitled post';
	/** @type {string} */
	export let stringData = 'no date';
</script>

<a
	sveltekit:prefetch
	class="w-full text-gray-900 hover:text-yellow-600 dark:text-gray-100 dark:hover:text-yellow-100"
	{href}
	><div class="mb-8 w-full">
		<div class="mt-2 flex flex-col justify-between md:flex-row">
			<h4 class=" w-full flex-auto text-lg font-medium md:text-xl">
				{title}
			</h4>

			<p class="mb-4 w-32 text-left text-blue-500/80 md:mb-0 md:text-right">{stringData}</p>
		</div>
		<p class="pt-4 text-gray-600 dark:text-gray-400">
			<slot />
		</p>
	</div></a
>
