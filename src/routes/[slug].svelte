<script context="module">
	// export const prerender = true; // you can uncomment to prerender as an optimization
	export const hydrate = true;
	import { REPO_URL, SITE_URL } from '$lib/siteConfig';

	export async function load({ url, params, fetch }) {
		const slug = params.slug;
		let res = null;
		try {
			res = await fetch(`/api/blog/${slug}.json`);
			if (res.status > 400) {
				return {
					status: res.status,
					error: await res.text()
				};
			}

			return {
				props: {
					json: await res.json(),
					slug,
					REPO_URL
				},
				maxage: 60 // 1 minute
			};
		} catch (err) {
			console.error('error fetching blog post at [slug].svelte: ' + slug, res, err);
			return {
				status: 500,
				error: new Error('error fetching blog post at [slug].svelte: ' + slug + ': ' + res)
			};
		}
	}
</script>

<script>
	import 'prism-themes/themes/prism-shades-of-purple.min.css';

	import Newsletter from '../components/Newsletter.svelte';
	import Reactions from '../components/Reactions.svelte';

	/** @type {import('$lib/types').ContentItem} */
	export let json; // warning: if you try to destructure content here, make sure to make it reactive, or your page content will not update when your user navigates
</script>

<svelte:head>
	<title>{json.title}</title>
	<meta name="description" content="swyxkit blog" />

	<link rel="canonical" href={SITE_URL} />
	<meta property="og:url" content={SITE_URL} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={json.title} />
	<meta name="Description" content={json.description} />
	<meta property="og:description" content={json.description} />
	<meta name="twitter:card" content={json.image ? 'summary_large_image' : 'summary'} />
	<meta name="twitter:title" content={json.title} />
	<meta name="twitter:description" content={json.description} />
	{#if json.image}
		<meta property="og:image" content={json.image} />
		<meta name="twitter:image" content={json.image} />
	{/if}
</svelte:head>

<article
	class="mx-auto mb-16 flex w-full max-w-2xl flex-col items-start justify-center px-3 sm:px-1"
>
	<h1 class="mb-6 text-3xl font-bold tracking-tight text-black dark:text-white md:text-5xl ">
		{json.title}
	</h1>
	<div
		class="bg flex w-full justify-between sm:flex-col sm:items-start md:flex-row md:items-center"
	>
		<p class="flex items-center text-sm text-gray-700 dark:text-gray-300">РОКТВЕРЬ</p>

		<p class="min-w-32 flex items-center text-sm text-gray-600 dark:text-gray-400 md:mt-0">
			{new Date(json.date).toISOString().slice(0, 10)}
		</p>
	</div>
	<div
		class="-mx-1 my-2 flex h-1 w-[90vw] bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 sm:mx-0 sm:w-full"
	/>
	<a
		class="flex h-9 items-center justify-center rounded-lg bg-yellow-400 px-3 text-black ring-yellow-400 transition-all
			hover:ring-2 dark:bg-yellow-800 dark:text-white"
		href="/blog"
	>
	Журнал
	</a>
	<div class="prose mt-6 mb-6 w-full max-w-none dark:prose-invert">
		{@html json.content}
	</div>
</article>
