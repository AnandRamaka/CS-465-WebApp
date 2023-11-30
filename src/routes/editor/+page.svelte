<script lang="ts">
	import CaptionedVideo from '$lib/components/CaptionedVideo.svelte';
	import CaptionsPane from '$lib/components/CaptionsPane.svelte';
	import SettingsMenu from '$lib/components/SettingsMenu.svelte';
	import { Caption } from '$lib/utils/captions';
	import { Editor } from '$lib/utils/editor';
	import type { PageData } from './$types';

	export let data: PageData;

	let settings: { [key: string]: any } = {};

	const captions = Caption.deserializeCaptions(data.captions);
	const editor = new Editor(captions);

	function handleSettingsChange(updatedSettings: { [key: string]: any }) {
		settings = updatedSettings.detail;
		editor.setUncertaintyThreshold(settings['mediumAccuracyThreshold']);
		const lightTheme = settings.lightTheme;
		if (lightTheme) {
			document.documentElement.style.setProperty('--color-bg-1', '#eff8ff'); // Light background color
			document.documentElement.style.setProperty('--color-fg-1', '#333333'); // Dark text color
		} else {
			// Reset to default theme styles
			document.documentElement.style.removeProperty('--color-bg-1');
			document.documentElement.style.removeProperty('--color-fg-1');
		}
	}

	let mouseSplitterDistance: number;
	let mouseNearSplitter = false;
	let splitterMoving = false;
	let leftPaneWidth = 400;
	let leftPaneHidden = false;

	function onMouseDown(e: Event) {
		if (mouseNearSplitter) {
			splitterMoving = true;
		}
	}

	function onMouseUp(e: Event) {
		splitterMoving = false;
	}

	function onMouseMove(e: MouseEvent) {
		if (!splitterMoving) {
			mouseSplitterDistance = Math.abs(e.clientX - leftPaneWidth);
			mouseNearSplitter = mouseSplitterDistance <= 3;
			if (mouseNearSplitter) {
				document.documentElement.style.cursor = 'col-resize';
			} else {
				document.documentElement.style.cursor = 'auto';
			}
		} else {
			if (e.clientX < 150) {
				leftPaneWidth = 5;
				leftPaneHidden = true;
			} else {
				leftPaneWidth = Math.max(300, Math.min(e.clientX + mouseSplitterDistance, 800));
				leftPaneHidden = false;
			}
		}
	}
</script>

<svelte:head>
	<title>Editor</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<svelte:window on:mousedown={onMouseDown} on:mouseup={onMouseUp} on:mousemove={onMouseMove} />

<div id="content">
	<div id="settingsMenu">
		<SettingsMenu on:settingsChange={handleSettingsChange} />
	</div>
	<div id="leftPane" style="width: {leftPaneWidth}px;">
		<CaptionedVideo videoSrc="/movie.mp4" {editor} hidden={leftPaneHidden} />
	</div>

	<div id={mouseNearSplitter ? 'splitterHover' : 'splitter'} />

	<div id="rightPane">
		<CaptionsPane {editor} {settings} />
	</div>
</div>

<style>
	#content {
		display: flex;
		flex-direction: row;
		width: 100vw;
		flex-grow: 1;
		align-items: stretch;
		background-color: var(--color-bg-1);
	}
	#splitter {
		width: 1px;
		background-color: var(--color-bg-3);
	}
	#splitterHover {
		width: 1px;
		background-color: var(--color-accent);
	}
	#rightPane {
		flex: 1;
		background: radial-gradient(ellipse at center, var(--color-bg-2) 60%, var(--color-bg-1) 120%);
	}
	#settingsMenu {
		position: absolute;
		top: 10px;
		right: 10px;
		z-index: 1;
		background: radial-gradient(ellipse at center, var(--color-bg-2) 60%, var(--color-bg-1) 120%);
		padding: 10px;
		box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
	}
</style>
