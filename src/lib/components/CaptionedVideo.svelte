<!-- CaptionedVideo.svelte -->

<script lang="ts">
	import { onMount } from 'svelte';
	import type { Editor } from '$lib/utils/editor';

	export let editor: Editor;
	export let videoSrc: string;
	export let hidden: boolean;

	const currentTimeStore = editor.video.currentTimeStore;
	const pausedStore = editor.video.pausedStore;
	const playbackRateStore = editor.video.playbackRateStore;

	let video: HTMLVideoElement;

	let totalCaptions=0;
	let remainingCaptions=0;
	let currentPos=0;

	function getRemainingCaptions(editor: Editor) {
		totalCaptions = editor.captions.length;
		remainingCaptions = totalCaptions - editor.currentIdx;
  	}

	function getCaptionPosition(editor: Editor) {
		currentPos=editor.currentIdx;
  	}

	editor.addNavigationListener(() => {
		getRemainingCaptions(editor);
		getCaptionPosition(editor);
	});

	onMount(() => {
		const track = video.addTextTrack('captions', 'Captions', 'en');
		track.mode = 'showing';
		for (const caption of editor.captions) {
			track.addCue(caption.vttCue);
		}
		getRemainingCaptions(editor);
		getCaptionPosition(editor);
	});
</script>

<div class="video-container">
	<video
		id="video-player"
		{hidden}
		controls
		src={videoSrc}
		bind:this={video}
		bind:currentTime={$currentTimeStore}
		bind:paused={$pausedStore}
		bind:playbackRate={$playbackRateStore}
		bind:duration={editor.video.duration}
	>
		<track kind="captions" />
	</video>
	<div class="statistics-container">
			<div class="statistics-box">
				<p class="statistics-label">Remaining Captions:</p>
				<p class="statistics-count">{remainingCaptions}</p>
			</div>
			<div class="statistics-box">
				<p class="statistics-label">You are at Caption:</p>
				<p class="statistics-count">{currentPos}</p>
			</div>
	</div>
</div>

<style>
	.video-container {
		display: flex;
		flex-direction: column;
	}

	.statistics-container {
		display: flex;
		justify-content: space-around;
		margin-top: 20px;
	}

	.statistics-box {
		padding: 10px;
		border: 2px solid #3498db; /* Border color */
		border-radius: 8px;
		text-align: center;
		background-color: white; /* Set background color */
	}

	.statistics-label {
		font-weight: bold;
		margin-bottom: 5px;
	}

	.statistics-count {
		font-size: 18px;
	}
</style>
