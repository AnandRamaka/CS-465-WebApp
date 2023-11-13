<script lang="ts">
	import type { Caption } from '$lib/utils/captions';
	import type { Video } from '$lib/utils/video';
	import { onMount } from 'svelte';
	import RangeSlider from 'svelte-range-slider-pips';

	export let caption: Caption;
	export let video_duration: number;
	// export let vid: Video;
	export let idx: number;
	export let captions: Caption[];

	let range = [caption.startTime, caption.endTime];
	// TODO: probably want this to be up until the previous & next captions
	const range_err = video_duration / 10;

	$: {
		caption.startTime = range[0];
		caption.endTime = range[1];
		// captions[idx] = caption;
	}
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
