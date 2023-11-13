<script lang="ts">
    import { onMount } from 'svelte';
    import { Caption, type SerializedCaption } from '$lib/utils/captions';

    export let videoSrc: string;
    export let captions: SerializedCaption[];
    export let hidden: boolean;

    let video: HTMLVideoElement;
    let currentTime: number;
    let paused: boolean;
    let ended: boolean;
    let volume: number;

    const _captions = Caption.deserializeCaptions(captions);

    onMount(() => {
        const track = video.addTextTrack('captions', 'Captions', 'en');
        track.mode = 'showing';
        for (const caption of _captions) {
            track.addCue(caption.vttCue);
        }
    })
</script>

<div class="video-container">
    <video
        id="videoPlayer"
        hidden={hidden}
        controls
        src={videoSrc}
        bind:this={video}
        bind:currentTime
        bind:paused
        bind:ended
        bind:volume
    >
    <track kind="captions"/>
  </video>
    <div class="captions-container">
        <span>      
            <button>Undo</button> <button>Redo</button>
            <button> Show Original </button> 
        </span>
        {#if !_captions.length}
            <p>No captions available</p>
        {:else}
            {#each _captions as caption}
                <div class="caption">{caption.text}</div>
            {/each}
        {/if}
    </div>
</div>



<style>
    .video-container {
        display: flex;
    }

    #videoPlayer {
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
