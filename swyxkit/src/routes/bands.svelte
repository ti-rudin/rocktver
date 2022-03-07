<script context="module">
  export async function load({ fetch }) {
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
        town
        small_text
        group_logo{
          data{
            attributes{
              url
            }
          }
        }
        group_link_vk
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
      console.log(data)
      return {
        props: {
          launches: data.bands.data,
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
  $: launches = launches;



</script>

<div class="mx-auto flex max-w-4xl flex-col items-start justify-center border-gray-200 px-0 pb-16 dark:border-gray-700">
<ul>
  {#each launches as launch}
  
      <a
        class="card-link"
        target="_self"
        rel="noopener"
        href={"band/"+launch.attributes.band_name}
      >

        <h2>{launch.id}</h2>

        

    
   

      
  
    <div class='w-full max-w-xl mx-auto bg-white rounded-lg shadow-xl'>
      <div style="background-image: radial-gradient(
      transparent 28px,
      #ffffff 28px,
      #ffffff 32px,
      transparent 32px
  );height: 50px;width: 100%; background-color: #00b5f7;
  background-size: 53px 53px;" class="rounded-t-lg"></div>
      <div>
          <div class="text-left" style="margin-top: -44px">
              <span class="border-4 border-white rounded-full mx-2 inline-block">
                
                {#if (launch.attributes.group_logo.data !== null)}
                  <img class="rounded-full w-20 h-20" src={'https://admin.rocktver.ru' +
                  launch.attributes.group_logo.data.attributes.url} alt="profile" />
                {/if}
               
              </span>
             
          </div>
          <p class="smtxt">{launch.attributes.small_text}</p>
          <p class="text-center"><span class="font-bold">{launch.attributes.band_name}</p>
          <p class="text-xs text-center mb-5">{launch.attributes.town}</p>
          <hr />
          <div class="flex justify-between px-10 py-5">
              <div class="text-center">
                  <p class="font-bold">100K</p>
                  <p class="text-xs">Followers</p>
              </div>
              <div class="text-center">
                  <p class="font-bold">903K</p>
                  <p class="text-xs">Likes</p>
                  
              </div>
              <div class="text-center">
                  <p class="font-bold">104K</p>
                  <p class="text-xs">Photos</p>
                  
              </div>
          </div>
      </div>
  </div>
</a>
  {/each}
</ul>







</div>
<style>
 .smtxt{
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
