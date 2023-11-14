<script lang="ts">
	import type { Caption } from '$lib/utils/captions';
	import type { Video } from '$lib/utils/video';
	import RangeSlider from 'svelte-range-slider-pips';

	export let vid: Video;
	export let idx: number;
	export let prevCaption: Caption | undefined;
	export let nextCaption: Caption | undefined;

	let caption = vid.captions[idx];
	let lower_bound = prevCaption?.endTime ?? 0;
	let upper_bound = nextCaption?.startTime ?? vid.duration;
	let range = [caption.startTime, caption.endTime];

	const saveRange = () => {
		vid.captions[idx].startTime = range[0];
		vid.captions[idx].endTime = range[1];
	};

	const formatTime = (seconds: number) => {
		return new Date(seconds * 1000).toISOString().substring(11, 19);
	};

	$: {
		lower_bound = prevCaption?.endTime ?? 0;
		upper_bound = nextCaption?.startTime ?? vid.duration;
	}
</script>

<div>
	<RangeSlider min={lower_bound} max={upper_bound} step={3} bind:values={range} range pips />
	<div id="label-container">
		<div>{formatTime(range[0])}</div>
		<button on:click={saveRange}> Save </button>
		<div>{formatTime(range[1])}</div>
	</div>
</div>

<style>
	#label-container {
		display: flex;
		justify-content: space-between;
	}
</style>
