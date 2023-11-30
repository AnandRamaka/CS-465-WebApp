<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	// Add any additional settings and their default values here
	let settings: { [key: string]: any } = {
		highAccuracyThreshold: 0.9,
		mediumAccuracyThreshold: 0.7,
		lowAccuracyThreshold: 0.5,
		advancedMode: false,
		enableSpeakerNames: false
	};

	const dispatch = createEventDispatcher();

	let showDropdown = false;
	function toggleDropdown() {
		showDropdown = !showDropdown;
	}

	function updateSetting() {
		dispatch('settingsChange', settings);
	}

	onMount(() => {
		updateSetting();
	});
</script>

<div id="settingsmenu">
	<button on:click={toggleDropdown}>Settings</button>
	{#if showDropdown}
		<div class="dropdown-content">
			{#each Object.entries(settings) as [setting, value]}
				<div class="setting-item">
					<label for={setting}>{setting}</label>
					{#if typeof value === 'boolean'}
						<input type="checkbox" bind:checked={settings[setting]} on:change={updateSetting} />
					{:else if typeof value === 'string'}
						<input type="text" bind:value={settings[setting]} on:blur={updateSetting} />
					{:else if typeof value === 'number'}
						<input type="number" bind:value={settings[setting]} on:blur={updateSetting} />
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.setting-item {
		display: flex;
		align-items: center;
		margin: 10px;
		color: white;
	}

	label {
		margin-right: 10px;
		color: white;
	}
</style>
