<script context="module">
  export async function load({ fetch }) {
    const res = await fetch('https://admin.rocktver.ru/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: ` {
          artists { 
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
      //console.log(data)
      return {
        props: {
          launches: data.artists.data,
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
  export let launches
  //console.log(this.artists.data[0].attributes.name)

</script>

<h1>Артисты</h1>

<ul>
  {#each launches as launch}
    <li>
      <a
        class="card-link"
        target="_blank"
        rel="noopener"
        href={launch.attributes.name}
      >
        <h2>{launch.attributes.name}</h2>
        <h2>{launch.id}</h2>

        <img
          src={'https://admin.rocktver.ru' +
            launch.attributes.avatar.data.attributes.url}
          alt=""
        />
      </a>
      
    </li>
  {/each}
</ul>
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
