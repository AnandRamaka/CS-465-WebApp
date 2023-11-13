<script lang="ts">
	import type { Caption } from '$lib/utils/captions';
	import RangeSlider from 'svelte-range-slider-pips';

	export let caption: Caption;
	export let video_duration: number;

	let range = [caption.startTime, caption.endTime];
	// TODO: probably want this to be up until the previous & next captions
	const range_err = video_duration / 10;
</script>

<div>
	<RangeSlider
		min={Math.max(0, caption.startTime - range_err)}
		max={Math.min(video_duration, caption.endTime + range_err)}
		step={3}
		bind:values={range}
		range
		pips
	/>
	<div id="label-container">
		<div>{range[0]}</div>
		<div>{range[1]}</div>
	</div>
</div>

<style>
	#label-container {
		display: flex;
		justify-content: space-between;
	}
</style>
