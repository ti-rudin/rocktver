<div class="dot z-0"></div>

  <style lang="scss">
$dots: 100;

@function rando($n) {
  $val : ();
	@for $j from 1 through $n {
		$val : append($val, rgb(random(250),random(250),random(250)));
	}
  @return $val;
}
$c1: rando($dots);
$c2: rando($dots);
@function dot($n,$arr) {
	$val : 0 0 0 0 transparent;
	@for $j from 1 through $n {
		$val :  #{$val}, #{random(100)}vw #{random(100)}vh #{random(10)}vmin #{random(10)}vmin rgba(nth($arr, ($j%length($arr)) + 1), random(100)/100);
	}
  @return $val;
}
@keyframes bs{
	100%{
		box-shadow: dot($dots,$c2);
	}	
}
.dot{
	animation: bs 13s ease-in-out alternate infinite;
	border-radius: 50%;
	box-shadow: dot($dots,$c1);
	height: 10px;
	transform: translate(-100%,-100%);
	transition: height 5s ease-out, width 5s ease-out;
	width: 10px;
	z-index: 0;
}



  </style>