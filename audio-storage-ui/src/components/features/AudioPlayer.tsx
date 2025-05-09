'use client';

import { useAudioPlayback } from '@/hooks/useAudioPlayback';
import { AudioTrack } from '@/types/audio';
import { useState, useEffect } from 'react';
import { AudioService } from '@/services/audioService';
import { formatTime } from '@/lib/timeUtil';
import { FaSpinner } from 'react-icons/fa';

interface AudioPlayerProps {
    track: AudioTrack;
    width?: number;
    height?: number;
}

export function AudioPlayer({
    track,
    width = 600, height = 100
}: AudioPlayerProps) {
    const [, setWaveform] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const {
        isPlaying,
        currentTime,
        duration,
        volume,
        play,
        pause,
        seek,
        setVolume,
    } = useAudioPlayback();


    useEffect(() => {
        const audioService = AudioService.getInstance();
        audioService.getTrackWaveform(track.id)
            .then((waveformData) => {
                ;
                setWaveform(waveformData)
            })
            .catch((error) => {
                console.error('Failed to load waveform:', error);
                // Fallback to a simple waveform if loading fails
                setWaveform(Array.from({ length: 100 }, () => Math.random()));
            }).finally(() => {
                setIsLoading(false);
            })
    }, [track.id]);

    return (
        <div className="flex flex-col gap-4 p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{track.name}</h3>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                </div>
            </div>

            <div className="relative">
                {/* <AudioControls
                    id={track.id}
                    volume={volume}
                    solo={false}
                    name={track.name}
                    muted={false} 
                    wavesurfer={wavesurfer} 
                    isPlaying={false}                /> */}
                {isLoading ? (
                    <div
                        className="animate-pulse bg-gray-200"
                        style={{ width: `${width}px`, height: `${height}px` }}
                    />
                ) : (
                    <FaSpinner className="animate-spin text-indigo-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ width: '24px', height: '24px' }} />
                )}
                <div
                    className="absolute top-0 bottom-0 w-1 bg-red-500"
                    style={{
                        left: `${(currentTime / duration) * 100}%`,
                    }}
                />
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={() => (isPlaying ? pause() : play(track))}
                    className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700"
                >
                    {isPlaying ? (
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    ) : (
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    )}
                </button>

                <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={(e) => seek(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />

                <div className="flex items-center gap-2">
                    <svg
                        className="w-5 h-5 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 012.828 2.828"
                        />
                    </svg>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={(e) => setVolume(Number(e.target.value))}
                        className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
            </div>
        </div>
    );
} 