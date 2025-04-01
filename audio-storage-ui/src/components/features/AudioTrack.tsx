"use client"
import { SiSpinrilla } from "react-icons/si";
import { CgRename } from "react-icons/cg";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAudioStore } from '@/store/audioStore';
import { AudioTrack } from '@/types/audio';
import AudioControls from './AudioControls';
import WaveSurferBuilder from '@/lib/builder/WaveSurfFactory';

interface AudioTrackProps {
    track: AudioTrack;
    currentTime: number;
}

export const AudioItem = ({
    track,
    currentTime,
    // onPositionChange,
}: AudioTrackProps) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const pixelsPerSecond = useAudioStore((state) => state.pixelsPerSecond);
    const waveformRef = useRef<HTMLDivElement>(null);
    const wavesurfer = useRef<WaveSurfer | null>(null);
    const [editNameMode, setEditNameMode] = useState(false);
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({
        id: track.id,
    });

    const waveBuilder = new WaveSurferBuilder()
        .setContainer(waveformRef.current) // Set the container for WaveSurfer
        .setPixelsPerSecond(pixelsPerSecond)
        .onUrlCreated(setAudioUrl)
        .onTrackLoaded(() => {
            // Callback when track is loaded
            setIsLoaded(true);
        })
        .onWavesurferLoaded(() => {
            console.log("Wavesurfer loaded for track:", track.id);
            setError(null); // Clear error when wavesurfer is loaded
            setIsLoaded(true);
        })
        .onError((e: any) => {
            setError(`Error loading audio: ${e.message || e}`);
            console.error('Error loading audio:', e);
        })
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        marginLeft: `${track.startTime * pixelsPerSecond}px`,
        width: '100%',
        height: '100%'
    };
    // Load audio file URL and initialize WaveSurfer
    useEffect(() => {
        if (!waveformRef.current)
        {
            console.error('Waveform container is not available');
            return;
        }
        waveBuilder
            .setContainer(waveformRef.current) // Set the container for WaveSurfer
            .setTrack(track.id) // Set the track ID for the builder
            .setPixelsPerSecond(pixelsPerSecond) // Set pixels per second for the builder
            .build();
        // Cleanup function
        // return () => {
        //     waveBuilder.destroy(); // Clean up the WaveSurfer instance
        //     // This will also revoke the object URL if it was created
        //     // and destroy the wavesurfer instance to free up memory
        // };
    }, [pixelsPerSecond, track.id]); // Rebuild when pixelsPerSecond changes,
    // Handle seeking
    useEffect(() => {
        if (!wavesurfer.current || !isLoaded)
        {
            return;
        }
        wavesurfer.current.seekTo(currentTime / wavesurfer.current.getDuration());
    }, [currentTime, isLoaded]);
    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="h-full flex bg-blue-900/40 rounded-lg pt-2 cursor-move hover:bg-blue-800/40 border-4 border-slate-800/40">
            {/* <div className="text-sm h-full text-white mb-1">{track.filename}</div> */}
            {!isLoaded && <SiSpinrilla className="animate-spin ml-2 text-3xl p-1 text-indigo-600" />}
            {error ? (
                <div className="text-red-500 text-sm">{error}</div>
            ) : (
                <div className="relative h-full">
                    <div className="flex items-center">
                        {editNameMode ? <input
                            type="text"
                            placeholder="Rename Sound..."
                            value={track.filename} // Use the filename from the track object
                            // onChange={(e) => setSearchQuery(e.target.value)}
                            className="mb-4 p-2 border rounded w-full"
                        /> :
                            <h4 className='px-2 pb-2'>{track.filename} </h4>
                        }
                        {isLoaded &&
                            <CgRename className="mb-2 text-4    xl" onClick={() => { setEditNameMode(!editNameMode) }} />
                        }
                        {isLoaded && <AudioControls
                            track={track}
                            isPlaying={false}
                            wavesurfer={wavesurfer}
                            solo={false}
                            muted={false}
                        />}
                    </div>

                    <div
                        ref={waveformRef}
                        className={isLoaded ? "w-full h-full py-2 bg-blue-900/50 border-t-4 border-slate-800/40"
                            : ''
                        }
                    />
                </div>
            )}


        </div>
    );
}; 