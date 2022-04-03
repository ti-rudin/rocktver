<script context="module">
  export async function load({ params, fetch }) {
    const res = await fetch('https://admin.rocktver.ru/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `{
  bands {
    data {
      id
      
      attributes {
        band_name
        spisok {
          ... on ComponentPesniTrack {
            
            id
            name
            text
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
      //console.log(data)
      return {
        props: {
          launches: data.bands.data,
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
    launch => launch.attributes.band_name == id
  )[0]
</script>

<h1>Команда</h1>

{#if launch}
  <h2>{launch.attributes.band_name}</h2>
  <h2>{launch.id}</h2>
  <h2>{JSON.stringify(launch.attributes.spisok)}</h2>
{:else}
  <h1>Об этой команде информации нет</h1>
{/if}
<ul />
<footer>
  <p>
    Created with <a
      class="link"
      target="_blank"
      rel="noopener"
      href="https://svelte.dev">SvelteKit</a
    >
    and deployed with
    <a
      class="link"
      target="_blank"
      rel="noopener"
      href="https://vercel.com">▲ Vercel</a
    >.
  </p>
</footer>

<style>
  :global(body) {
    font-family: Menlo, Consolas, Monaco, Liberation Mono,
      Lucida Console, monospace;
    background-color: #fafafa;
    max-width: 650px;
    margin: 32px auto;
    padding: 0 16px;
  }
  h1 {
    letter-spacing: -0.025em;
  }
  h2 {
    font-size: 18px;
  }
  ul {
    list-style: none;
    padding: 0;
    margin-top: 32px;
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
  a {
    color: #0070f3;
    text-decoration: none;
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
