<script context="module">
	import {
		SITE_URL,
		REPO_URL,
		SITE_TITLE,
		SITE_DESCRIPTION,
		DEFAULT_OG_IMAGE,
		isDarkFlag
	} from '$lib/siteConfig';
	import LogoComponent from '../components/LogoComponent.svelte';
	

	export async function load({ fetch }) {
	const res = await fetch('https://admin.rocktver.ru/graphql', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				query: `{
	            bands (pagination:{pageSize:100}) {
	              data {
	                id
				
	                attributes {
                    artists{
                      data{
						id
                        attributes{
                          name
                          avatar{
                            data{
                              attributes{url}
                            }
                          }
                          
                        }
                      }
                    }
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
	          }`
			})
		});

		if (res.ok) {
			const { data } = await res.json();

			const comandes_data = data.bands.data;
			const ready_comandes_data = await comandes_data.map(item => {
				const container ={};
				//if (item.attributes ){
				//	container[item.path] = item.attributes.group_logo.data.attributes.url;
				//}
				container.band_name =  item.attributes.band_name;
				if (item.attributes.group_logo.data !==null) {
					container.path = 'https://admin.rocktver.ru' +item.attributes.group_logo.data.attributes.url;
				} else {
					container.path = 'rock-band-icon-9.jpg';
				}
				container.id = 'images'+item.id;
				container.url = 'band/'+container.band_name;
				return container;

				
			})

	
		//	const ready_artists_data = await comandes_data.map((item) => {
		//		const container ={};
		//		//if (item.attributes ){
		//		//	container[item.path] = item.attributes.group_logo.data.attributes.url;
		//		//}
		//		if (item.attributes.artists.data !== null){
//
		//		container.name =  item.attributes.artists.data[i].attributes.name;
		//	hhhhhhhhh
		//		} else {
		//			container.name = '';
		//		}
//
		//		if (item.attributes.artists.data[i] !==null) {
		//			container.path = 'https://admin.rocktver.ru' +item.attributes.artists.data[i].attributes.avatar.data.url;
		//		} else {
		//			container.path = 'icon-person-10.jpg';
		//		}
		//		container.id = 'images'+item.id;
		//		container.url = 'band/'+container.name;
		//		return container;
//
		//		
		//	})
		let ready_artists_data = [];
			comandes_data.forEach(item => {

				let artists = item.attributes.artists.data;

				artists.forEach(item => {
					let url = 'icon-person-10.jpg';
					if (item.attributes.avatar.data !== null){
						url = 'https://admin.rocktver.ru' + item.attributes.avatar.data.attributes.url
					}

					const container = {
						path: url,
						id: item.id,
						url: 'person/'+item.attributes.name,
					};
					ready_artists_data = [...ready_artists_data, container];


				});

				
				//container.name =  item.attributes.artists.data.attributes.name;
				
			});

			console.log(ready_artists_data);
			//console.log(data);
			console.log(ready_comandes_data);

			return {
				props: {
					ready_comandes_data: ready_comandes_data,
					ready_artists_data: ready_artists_data
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
	import { onDestroy, onMount } from 'svelte';
	import { blur, crossfade, draw, fade, fly, scale, slide } from 'svelte/transition';
	import Carousel from '../components/Carusel.svelte';
	import { ChevronLeftIcon, ChevronRightIcon } from 'svelte-feather-icons';
	export let ready_comandes_data, ready_artists_data;
	//console.log(this.artists.data[0].attributes.name)
	onMount(() => {
		//comandes_data = launches;

	//	console.log(comandes_data);
	});

	const personas = [
		{ path: 'icon-person-10.jpg', id: 'image2', url: '/' },
		{ path: 'icon-person-10.jpg', id: 'image3', url: '/' },
		{ path: 'icon-person-10.jpg', id: 'image4', url: '/' },
		{ path: 'icon-person-10.jpg', id: 'image5', url: '/' },
		{ path: 'icon-person-10.jpg', id: 'image6', url: '/' },
		{ path: 'icon-person-10.jpg', id: 'image7', url: '/' },
		{ path: 'icon-person-10.jpg', id: 'image8', url: '/' }

		// {path: 'images/image6.jpg', id: 'image6'},
	];

	//const comandes = [
	//	{ path: 'rock-band-icon-9.jpg', id: 'image2', url: '/' },
	//	{ path: 'rock-band-icon-9.jpg', id: 'image3', url: '/' },
	//	{ path: 'rock-band-icon-9.jpg', id: 'image4', url: '/' },
	//	{ path: 'rock-band-icon-9.jpg', id: 'image5', url: '/' },
	//	{ path: 'rock-band-icon-9.jpg', id: 'image6', url: '/' },
	//	{ path: 'rock-band-icon-9.jpg', id: 'image7', url: '/' },
	//	{ path: 'rock-band-icon-9.jpg', id: 'image8', url: '/' }
//
	//	// {path: 'images/image6.jpg', id: 'image6'},
	//];
    const comandes = [];
	//$: comandes = ready_comandes_data;
</script>

<svelte:head>
	<title>{SITE_TITLE}</title>
	<link rel="canonical" href={SITE_URL} />
	<link rel="alternate" type="application/rss+xml" href={SITE_URL + '/api/rss.xml'} />
	<meta property="og:url" content={SITE_URL} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={SITE_TITLE} />
	<meta name="Description" content={SITE_DESCRIPTION} />
	<meta property="og:description" content={SITE_DESCRIPTION} />
	<meta property="og:image" content={DEFAULT_OG_IMAGE} />
	<meta name="twitter:card" content="summary" />

	<meta name="twitter:title" content={SITE_TITLE} />
	<meta name="twitter:description" content={SITE_DESCRIPTION} />
	<meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
</svelte:head>

<LogoComponent/>
<h1 class="adr mx-auto mt-3 mb-2 bg-white text-black dark:bg-gray-900 dark:text-white">Команды</h1>

<Carousel
	images={ready_comandes_data}
	imageWidth={200}
	imageSpacing={15}
	displayControls={true}
	autoplay={true}
	autoplaySpeed={3500}
>
	<span class="control" slot="left-control"><ChevronLeftIcon /></span>
	<span class="control" slot="right-control"><ChevronRightIcon /></span>
</Carousel>

<h1 class="adr mx-auto mt-5 mb-2 bg-white text-black dark:bg-gray-900 dark:text-white">Персоны</h1>

<Carousel
	images={ready_artists_data}
	imageWidth={200}
	imageSpacing={15}
	controlScale={0.7}
	displayControls={true}
	autoplay={true}
	autoplaySpeed={3000}
>
	<span class="control" slot="left-control"><ChevronLeftIcon /></span>
	<span class="control" slot="right-control"><ChevronRightIcon /></span>
</Carousel>

<style>
	.adr {
		font-size: 2rem;
	}
	.control {
		color: red;
		width: 70px;
		opacity: 0.3;
	}
</style>