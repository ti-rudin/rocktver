<script>
	import { SITE_TITLE } from '$lib/siteConfig';
	import {
		isDarkFlag
	} from '$lib/siteConfig';
	import '../../tailwind.css';
	import Nav from '../../components/Nav.svelte';
	import { isAuthenticated, user } from '$lib/stores/auth';

    let isDark = false;
	$isDarkFlag = false;
	if (typeof localStorage !== 'undefined') {
		if (
			localStorage.theme === 'dark' ||
			(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
		) {
			isDark = true;
			$isDarkFlag = true;
		}
	}
	function toggleDarkMode() {
		if (isDark) {
			document.documentElement.classList.remove('dark');
			localStorage.theme = 'light';
			isDark = false;
			$isDarkFlag = false;
		} else {
			document.documentElement.classList.add('dark');
			localStorage.theme = 'dark';
			isDark = true;
			$isDarkFlag = true;
		}
	}

</script>

<svelte:head />


<main class="flex flex-col justify-center bg-gray-50 px-4 dark:bg-gray-900 sm:px-8">
	<slot />
</main>

<footer class="mx-auto mt-4 mb-4 flex border-white/30 border-t  max-w-2xl flex-col items-start justify-center">

	<div class="flex w-full p-4">
		
	
        <div class="flex flex-col justify-center pt-4 bg-gray-50 dark:bg-gray-900 ">
            <button
                    aria-label="Toggle Dark Mode"
                    class=" flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-400 ring-yellow-400
                    transition-all hover:ring-2 dark:bg-yellow-800"
                    on:click={toggleDarkMode}
                >
                {#if isDark}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            class="h-5 w-5 text-gray-800 dark:text-yellow-100"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728
                                0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                        </svg>
                    {:else}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            class="w-5 h-5 text-gray-800 dark:text-gray-200"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                            />
                        </svg>
                    {/if}
                </button>
        </div>
		<div class="mx-auto" />
        
		<div class="container_develop pb-0 pl-20">
			<a href="http://ti-units.ru/"
			
		
			>
				<div class="cub_container">
					<div class="front side">
						<svg
							width="40"
							height="40"
							viewBox="0 0 52 53"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M0 0H52V53H0V0ZM50 19V25.4059H41.9062V19H50ZM50 51V27.0985H41.9062V40.8481C41.4843 46.5375 45.0535 50.7028 50 51ZM40.0361 25.479V19.0964H16V25.4785H24.1913V51H32.2826V25.479H40.0361Z"
								fill="#1A80D3"
							/>
						</svg>
					</div>
					<div class="right side"><p>Создание<br />и поддержка<br />Ti-UNITS.RU</p></div>
				</div>
			</a>
		</div>
	</div>

</footer>

<style>
	.feedback{
		color: orange;
	}
	  	.lblock {
		width: 50%;
	}
	.container_develop a {
		display: block;
	
	}
	.container_develop {
		-webkit-perspective-origin: center 40px;
		perspective-origin: center 40px;
		
	}
	.cub_container .side,
	.cub_container {
		width: 40px;
		height: 40px;
		text-align: left;
		color: #465ee0;
	}
	.cub_containerdark {
		width: 40px;
		height: 40px;
		text-align: left;
		color: rgb(0, 8, 51);
	}
	.cub_container p {
		font-size: 12px;
		line-height: 14px;
	}
	.cub_container {
		margin: 20px auto 0;
		-webkit-transition: ease-in-out 0.4s all;
		transition: ease-in-out 0.4s all;
		-webkit-transform-style: preserve-3d;
		transform-style: preserve-3d;
	}
	.cub_container:hover {
		-webkit-transform: rotateY(-90deg);
		transform: rotateY(-90deg);
	}
	.cub_container .side {
		position: absolute;
		width: 40px;
		height: 40px;
	}
	.cub_container .front {
		-webkit-transform: translateZ(100px);
		transform: translateZ(100px);
		background-color:rgba(0, 8, 51,0);
		
	}
	.cub_container .right {
		padding: 0;
		margin: 0 -5em;
		width: 180px;
		-webkit-transform: translateX(40px) translateZ(10px) rotateY(90deg);
		transform: translateX(40px) translateZ(10px) rotateY(90deg);
	}
</style>
