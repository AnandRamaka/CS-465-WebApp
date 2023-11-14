<script lang="ts">
	import { onMount } from 'svelte';
	import { Caption, type SerializedCaption } from '$lib/utils/captions';
	import CaptionTimestamp from './CaptionTimestamp.svelte';
	import { Video } from '$lib/utils/video';

	export let videoSrc: string;
	export let captions: SerializedCaption[];
	export let hidden: boolean;

	let video: HTMLVideoElement;
	let currentTime: number;
	let paused: boolean;
	let ended: boolean;
	let volume: number;

	// Use the video src & captions to create a Video object that contains
	// useful metadata for editing individual caption timestamps --> edit the
	// Captions within the video object --> send the final Video object into
	// some function that writes the new captions to a file
	let vid = new Video(videoSrc, Caption.deserializeCaptions(captions));

	onMount(() => {
		const track = video.addTextTrack('captions', 'Captions', 'en');
		track.mode = 'showing';
		for (const caption of vid.captions) {
			track.addCue(caption.vttCue);
		}
	});

	$: {
		console.log('captions changed', vid.captions);
	}
</script>

<div class="video-container">
	<video
		id="video-player"
		{hidden}
		controls
		src={videoSrc}
		bind:this={video}
		bind:currentTime
		bind:paused
		bind:ended
		bind:volume
		bind:duration={vid.duration}
	>
		<track kind="captions" />
	</video>
	<div class="captions-container">
		<span>
			<button>Undo</button> <button>Redo</button>
			<button> Show Original </button>
		</span>
		{#if !vid.captions.length}
			<p>No captions available</p>
		{:else if vid.duration}
			{#each vid.captions as _, idx}
				<div class="caption">
					<CaptionTimestamp
						bind:vid
						{idx}
						prevCaption={idx == 0 ? undefined : vid.captions[idx - 1]}
						nextCaption={idx == vid.captions.length - 1 ? undefined : vid.captions[idx + 1]}
					/>
					{vid.captions[idx].text}
				</div>
			{/each}
		{/if}
	</div>
</div>

<style>
	.video-container {
		display: flex;
	}

	#video-player {
		width: calc(70% - 20px);
		margin: 10px;
		border-radius: 10px;
	}

	.captions-container {
		width: 30%;
		margin: 10px;
		padding: 10px;
		border-radius: 10px;
		overflow-y: auto;
		background-color: #f0f0f0;
	}

	.caption {
		margin-bottom: 10px;
	}
</style>
