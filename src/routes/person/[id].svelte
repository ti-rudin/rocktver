<script context="module">
  export async function load({ params, fetch }) {
    const res = await fetch('https://admin.rocktver.ru/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `{
          artists{ 
                  data{
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
                    }
                  }
                }
        }`,
      }),
    })
    if (res.ok) {
      const { data } = await res.json()
      console.log(data)
      return {
        props: {
          launches: data.artists.data,
          id: params.id,
        },
      }
    }
    return {
      status: res.status,
      error: new Error(`Error fetching GraphQL data`),
    }
  }
</script>

<script>
  export let launches, launch, id

  launch = launches.filter(
    launch => launch.attributes.name == id
  )[0]
</script>

  <div class="text-gray-900 dark:text-white mx-auto">
<h1>Персона</h1>

{#if launch}
  <h2>{launch.attributes.name}</h2>
  <h2>{launch.id}</h2>
  
{:else}
  <h1>Об этой команде информации нет</h1>
{/if}
<ul />

</div>

<style>
  
</style>
