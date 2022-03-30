<script context="module">


	export async function load({ params, fetch }) {
		const res = await fetch('https://admin.rocktver.ru/graphql', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				query: `{
  bands(pagination: { pageSize: 100 }) {
    data {
      id
      attributes {
        band_name
        town
        small_text
        big_text
        group_logo {
          data {
            attributes {
              url
            }
          }
        }
        group_link_vk
        group_link_rocktver
        mngr_id
        time_on_scene
        artists {
          data {
            attributes {
              name
              avatar {
                data {
                  attributes {
                    url
                  }
                }
              }
              role
              vk_link
            }
          }
        }
        spisok {
          ... on ComponentPesniTrack {
            name
            text
            words_rights
            music_rights
			year_born
            is_premiere
            id
          }
        }
      }
    }
  }
  concerts {
    data {
      id
      attributes {
        start_date
		ploschadka
        bilet_ot
        url_website
        show_name
        spisok (pagination: { pageSize: 100 }) {
          ... on ComponentBandsTimeline {
            id
            band {
              data {
				  id
                attributes {
                  band_name
				  
                }
              }
            }
			title
            slovo_vedusch
            tech_pause
            open_speache
            finish_speache
          }
        }
      }
    }
  }
}

`
			})
		});
		if (res.ok) {
			const { data } = await res.json();
			console.log('bands - ' + data);
			
			return {
				props: {
					status: data
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
	function update(obj) {
		console.log(obj);
	
		let myHeaders = new Headers();
		myHeaders.append('Content-Type', 'application/json');

		let raw = JSON.stringify({ bands : obj });

		let requestOptions = {
			method: 'POST',
			headers: myHeaders,
			body: raw,
			redirect: 'follow'
		};

		fetch('https://api.rocktver.ru/bands-data-update/', requestOptions)
			.then((response) => response.json())
			.then((result) => {
				return result;
			})
			.catch((error) => console.log('error', error));
	}
	export let status;
	$: if (status) {
		update(status)
	}
</script>

{JSON.stringify(status)}
