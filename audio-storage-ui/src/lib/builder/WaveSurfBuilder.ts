/* eslint-disable @typescript-eslint/no-explicit-any */
import WaveSurfer from 'wavesurfer.js';
import { audioStorageApi } from '../audioStorage';

class WaveSurferBuilder {
    static instance = new this()
    static getInstance() {
        // This method allows you to get a new instance of the WaveSurferBuilder   
        // This is useful for creating a new instance of the builder when needed
        return WaveSurferBuilder.instance;
    }
    el: string | HTMLElement | null = null; // The container element for WaveSurfer
    audioUrl: string | null = null;
    wavesurfer: WaveSurfer | null = null;
    trackId?: string;
    pixelsPerSecond?: number | undefined;
    trackLoaded: () => void = () => { };
    onTrackLoaded(callback: () => void) {
        this.trackLoaded = callback;
        return this;
    }
    urlCreated: (url: string) => void = (url: string) => { console.log(url) };
    onUrlCreated(callback: (url: string) => void) {
        this.urlCreated = callback;
        return this; // Allow chaining
    }
    wavesurferLoaded: () => void = () => { };
    onWavesurferLoaded(callback: () => void) {
        this.wavesurferLoaded = callback;
        return this; // Allow chaining
    }
    error: (e: any) => void = () => { };
    onError(callback: (e: any) => void) {
        this.error = callback;
        return this;
    }
    setPixelsPerSecond(pixelsPerSecond: number | undefined) {
        // Set the pixels per second for WaveSurfer 
        // This determines the width of the waveform in the container
        this.pixelsPerSecond = pixelsPerSecond;
        return this; // Allow chaining, so you can call it in a chain with other methods
    }
    setTrack(trackId: string) {
        this.trackId = trackId;
        return this;
    }
    setContainer(el: HTMLElement | string | null) {
        // Set the container for WaveSurfer
        this.el = el;
        return this; // Allow chaining
    }
    destroy = () => {
        // Clean up the WaveSurfer instance if it exists
        if (this.wavesurfer)
        {
            this.wavesurfer.destroy();
            // this.wavesurfer = null; // Reset the instance
        }
        if (this.audioUrl)
        {
            // Revoke the object URL to free up memory
            URL.revokeObjectURL(this.audioUrl);
            this.audioUrl = null; // Reset the URL
        }
    }
    build = async () => {
        if (!this.trackId)
        {
            console.log('No audioFileId provided');
            throw Error('No audio file ID provided');
            return;
        }

        try
        {
            // Clean up previous instances
            this.destroy()
            // Get audio file metadata
            const audioFiles = await audioStorageApi.getAllAudioFiles();
            const audioFile = audioFiles.find((audioFile) =>
                audioFile.id === this.trackId
            );

            if (!audioFile)
            {
                throw new Error('Audio file not found');
            }

            // Download and create object URL
            const audioBlob = await audioStorageApi.downloadAudio(
                Number(this.trackId)
            ); // Ensure trackId is a number for downloadAudio
            if (!audioBlob)
            {
                throw new Error('Failed to download audio file');
            }
            // Successfully downloaded the audio blob, now create an object URL
            this.audioUrl = URL.createObjectURL(audioBlob);
            this.urlCreated(this.audioUrl); // Notify that the URL has been created
            // Initialize WaveSurfer if container is ready
            if (!this.el)
            {
                throw new Error('Container element is not set for WaveSurfer');
            }
            if (this.wavesurfer == undefined)
            {
                this.wavesurfer = WaveSurfer.create({
                    container: this.el ?? '#audio-track',
                    waveColor: '#facc15',
                    progressColor: '#9333ea',
                    cursorColor: '#22c55e',
                    barWidth: 2,
                    barRadius: 3,
                    cursorWidth: 1,
                    height: 80,
                    barGap: 2,
                    autoScroll: false,
                    minPxPerSec: this.pixelsPerSecond,
                    normalize: true,
                    backend: 'WebAudio',
                });

                // Load audio file
                await this.wavesurfer.load(
                    this.audioUrl
                );

                // Set up event listeners
                this.wavesurfer.on('ready',
                    this.wavesurferLoaded
                    // console.log('WaveSurfer ready event fired');
                    // setIsLoaded(true);
                    // setError(null);
                );
                this.wavesurfer.on('ready', () => this.trackLoaded)
                this.trackLoaded();
                this.wavesurfer.on('error', this.error); // Handle errors from WaveSurfer
            }
        } catch (error)
        {
            this.error(error); // Handle any errors that occur during initialization
        }
    };
}

export default WaveSurferBuilder;