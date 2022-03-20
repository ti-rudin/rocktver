<script context="module">
	export async function load({ fetch }) {
		const res = await fetch('https://admin.rocktver.ru/graphql', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				query:
					`{
          concert (id:` +
					`1` +
					`)  {
            data {
              id
              attributes {
                start_date
                mc_id
                show_name
                spisok {
                  ... on ComponentBandsTimeline {
                    id
                    band{
                      data{
                        attributes{
                          band_name
                        }
                      }
                    }
                    tech_pause
                    open_speache
                    finish_speache
                  }
                }
              }
            }
          }
        }`
			})
		});
		if (res.ok) {
			const { data } = await res.json();
			console.log(data);
			return {
				props: {
					concerts: data.concerts.data
				}
			};
		}
		return {
			status: res.status,
			error: new Error(`Error fetching GraphQL data`)
		};
	}
</script>

<script>
	import { isAuthenticated, user } from '$lib/stores/auth';
	import { isDarkFlag } from '$lib/siteConfig';
	export let concerts;
	//console.log(this.artists.data[0].attributes.name)
	$: concerts = concerts;
</script>

<div class="w-full ">
	{#each concerts as concert}
		<div
			aria-label="card 1"
			class="mx-auto mb-7 max-w-2xl rounded bg-white p-6 shadow focus:outline-none dark:bg-gray-500"
		>
			<div class="flex items-center border-b border-gray-200 pb-6">
				<div class="flex w-full items-start justify-between">
					<div class="w-full pl-3">
						<p
							tabindex="0"
							class="text-2xl font-medium leading-5 text-gray-800 focus:outline-none dark:text-gray-200"
						>
							{concert.attributes.show_name}
						</p>
						<p
							tabindex="0"
							class="pt-2 text-sm leading-normal text-gray-500 focus:outline-none dark:text-gray-200"
						>
							{concert.attributes.start_date}
						</p>
					</div>
					<div role="img" aria-label="bookmark">
						<svg
							class="focus:outline-none"
							width="28"
							height="28"
							viewBox="0 0 28 28"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M10.5001 4.66667H17.5001C18.1189 4.66667 18.7124 4.9125 19.15 5.35009C19.5876 5.78767 19.8334 6.38117 19.8334 7V23.3333L14.0001 19.8333L8.16675 23.3333V7C8.16675 6.38117 8.41258 5.78767 8.85017 5.35009C9.28775 4.9125 9.88124 4.66667 10.5001 4.66667Z"
								stroke="#2C3E50"
								stroke-width="1.25"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</div>
				</div>
			</div>
			<div class="px-2">
				<p
					tabindex="0"
					class="py-4 text-sm leading-5 text-gray-600 focus:outline-none dark:text-gray-200"
				/>
				<div tabindex="0" class="flex focus:outline-none">
					<div class="rounded-full bg-indigo-100 py-2 px-4 text-xs leading-3 text-indigo-700">
						#dogecoin
					</div>
					<div class="ml-3 rounded-full bg-indigo-100 py-2 px-4 text-xs leading-3 text-indigo-700">
						#crypto
					</div>
				</div>
			</div>
		</div>
	{/each}
</div>

<style>
	.card {
		min-width: 280px;
	}
	.smtxt {
		top: -40px;
		left: 110px;
		position: relative;
		line-height: 0px;
		min-width: 450px;
	}
	ul {
		list-style: none;
		padding: 0;
		margin-top: 32px;
		width: auto;
	}
	li {
		border: 1px solid #eaeaea;
		border-radius: 8px;
		margin-bottom: 16px;
		background-color: white;
		transition: 0.15s box-shadow ease-in-out;
	}
	li:hover {
		box-shadow: 0 5px 10px rgba(0, 0, 0, 0.12);
	}
	p {
		color: #666;
		font-size: 14px;
		line-height: 1.75;
	}

	.card-link {
		padding: 8px 24px;
		display: block;
	}
	.link {
		transition: 0.15s text-decoration ease-in-out;
		color: #0761d1;
	}
	.link:hover {
		text-decoration: underline;
	}
</style>
