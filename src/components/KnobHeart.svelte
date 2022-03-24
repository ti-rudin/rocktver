<script>
import { onDestroy, onMount } from 'svelte';
onMount(() => {
	
	let button = document.querySelector('.like-btn');
	let icon = document.querySelector('.like-icon');

	button.addEventListener('click', () => {
		button.classList.toggle('active');
		if (button.classList.contains('active')) {
			createClones(button);
		}
	});

	function randomNum(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	function negativePositive() {
		return Math.random() < 0.5 ? -1 : 1;
	}

	function createClones(button) {
		let numberOfClones = randomNum(1, 10);

		for (let i = 1; i <= numberOfClones; i++) {
			let clone = icon.cloneNode(true);
			let size = randomNum(8, 20);

			button.appendChild(clone);
			clone.setAttribute('width', size);
			clone.setAttribute('height', size);
			clone.classList.add('clone');
			clone.style.transform = `translate(${negativePositive() * randomNum(15, 30)}px, ${
				negativePositive() * randomNum(15, 30)
			}px)`;
			let removeNode = setTimeout(() => {
				button.removeChild(clone);
				clearTimeout(removeNode);
			}, 800);
		}
	}
	});

</script>

<a href="#" class="like-btn">
	<svg
		class="like-icon"
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
	>
		<path
			d="M12 4.4119c-2.826-5.695-11.999-4.064-11.999 3.27 0 7.27 9.903 10.938 11.999 15.311 2.096-4.373 12-8.041 12-15.311 0-7.327-9.17-8.972-12-3.27z"
		/>
	</svg>
</a>




<style> 

.like-btn {
  color: red;
  display: flex;
  justify-content: center;
}

.like-btn:acive {
  transform: scale(0.9, 0.9);
}

.like-btn.active {
  animation: pop 0.6s 1;
}

.like-btn path {
  fill: #767676;
}

.like-btn.active path {
  fill: #ec3e3e;
}


.clone {
  position: absolute;
  animation: moveOutwards 0.9s 1;
  opacity: 0;
}
</style>
