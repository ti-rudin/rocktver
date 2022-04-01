<script context="module">
	export async function load({ params, fetch }) {
		const res = await fetch('https://admin.rocktver.ru/graphql', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				query: `{
  artists(pagination: { pageSize: 500 }) {
    data {
      id
      attributes{
        name
        avatar{
          data{
            attributes{
              url
            }
          }
        }
        vk_link
        role
        bands{
          data{
            attributes{
              band_name
              group_logo{
                data{
                  attributes{
                    url
                  }
                }
              }
            }
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
					launches: data.artists.data,
					id: params.id
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
	import LogoComponent from '../../components/LogoComponent.svelte';
	export let launches, launch, id;

	launch = launches.filter((launch) => launch.attributes.name == id)[0];
</script>

<LogoComponent />
{#if launch}
	<div class="mt-1 w-full ">
		<div
			aria-label="card 1"
			class="mx-auto max-w-2xl cursor-pointer rounded-lg bg-blue-400/70 p-6 shadow ring-yellow-400 transition-all hover:ring-2 focus:outline-none dark:bg-blue-500 "
		>
    <h2 class="text-2xl w-1/2 mx-auto">{launch.attributes.name}</h2>
    <img
    class="mx-auto w-1/2 w-full rounded shadow"
    src={'https://admin.rocktver.ru' + launch.attributes.avatar.data.attributes.url}
    alt=""
  />
			
		</div>
	</div>
	<div class="mt-3 w-full ">
		<div
			aria-label="card 1"
			class="mx-auto max-w-2xl cursor-pointer rounded-lg bg-blue-400/70 p-6 shadow ring-yellow-400 transition-all hover:ring-2 focus:outline-none dark:bg-blue-500 "
		/>
	</div>
	<div class="mx-auto text-gray-900 dark:text-white">
		<h1>Персона</h1>

		<h2>{launch.attributes.avatar.data.attributes.url}</h2>
		<h2>{launch.id}</h2>
		<h2>{launch.id}</h2>
		<h2>{launch.id}</h2>
		<h2>{launch.id}</h2>
	</div>
{:else}
	<div class="mt-1 w-full ">
		<div
			aria-label="card 1"
			class="mx-auto max-w-2xl cursor-pointer rounded-lg bg-blue-400/70 p-6 shadow ring-yellow-400 transition-all hover:ring-2 focus:outline-none dark:bg-blue-500 "
		>
			<div class="mx-auto">Об этой персоне информации нет...</div>
			<div class="mx-auto">Правильно ли указано имя?</div>
			<h1 class="text-2xl mx-auto">{id}</h1>
		</div>
	</div>
{/if}

<style>
</style>
