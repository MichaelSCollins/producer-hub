import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AudioTrack as AudioTrackType } from '@/lib/interface';
import { useAudioStore } from '@/store/audioStore';
import { audioStorageApi } from '@/lib/api/audioStorage';

interface AudioTrackProps {
    track: AudioTrackType;
    isPlaying: boolean;
    currentTime: number;
    onPositionChange: (startTime: number) => void;
}

export const AudioTrack = ({
    track,
    isPlaying,
    currentTime,
    // onPositionChange,
}: AudioTrackProps) => {
    const [, setAudioTrack] = useState<string | null>(null);
    const waveformRef = useRef<HTMLDivElement>(null);
    const wavesurfer = useRef<WaveSurfer | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const pixelsPerSecond = useAudioStore((state) => state.pixelsPerSecond);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({
        id: track.id ?? Math.random() * 1000000,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        marginLeft: `${track.startTime * pixelsPerSecond}px`,
        width: '100%',
        height: '100%'
    };

    // Load audio file URL and initialize WaveSurfer
    useEffect(() => {
        let objectUrl: string | null = null;
        let ws: WaveSurfer | null = null;

        const initializeAudio = async () => {
            if (!track.audioFileId)
            {
                console.log('No audioFileId provided');
                setError('No audio file ID provided');
                return;
            }

            try
            {
                // Clean up previous instances
                if (wavesurfer.current)
                {
                    wavesurfer.current.destroy();
                    wavesurfer.current = null;
                }
                if (objectUrl)
                {
                    URL.revokeObjectURL(objectUrl);
                    objectUrl = null;
                }

                // Get audio file metadata
                const audioFiles = await audioStorageApi.getAllAudioFiles();
                const audioFile = audioFiles.find((audioFile) =>
                    audioFile.id === track.audioFileId
                );

                if (!audioFile)
                {
                    throw new Error('Audio file not found');
                }

                // Download and create object URL
                const audioBlob = await audioStorageApi.downloadAudio(track.audioFileId);
                objectUrl = URL.createObjectURL(audioBlob);
                setAudioTrack(objectUrl);

                // Initialize WaveSurfer if container is ready
                if (waveformRef.current)
                {
                    ws = WaveSurfer.create({
                        container: waveformRef.current,
                        waveColor: '#facc15',
                        progressColor: '#9333ea',
                        cursorColor: '#22c55e',
                        barWidth: 2,
                        barRadius: 3,
                        cursorWidth: 1,
                        height: 80,
                        barGap: 2,
                        autoScroll: false,
                        minPxPerSec: pixelsPerSecond,
                        normalize: true,
                        backend: 'WebAudio',
                    });

                    wavesurfer.current = ws;

                    // Load audio file
                    await ws.load(objectUrl);

                    // Set up event listeners
                    ws.on('ready', () => {
                        console.log('WaveSurfer ready event fired');
                        setIsLoaded(true);
                        setError(null);
                    });

                    ws.on('error', (err) => {
                        console.error('WaveSurfer error:', err);
                        setIsLoaded(false);
                        setError('Failed to load audio file');
                    });
                }
            } catch (error)
            {
                console.error('Error initializing audio:', error);
                setError(error instanceof Error ? error.message : 'Failed to initialize audio');
                setIsLoaded(false);
            }
        };

        initializeAudio();

        // Cleanup function
        return () => {
            if (ws)
            {
                ws.destroy();
                ws = null;
            }
            if (objectUrl)
            {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [track.audioFileId, pixelsPerSecond]);

    // Handle play/pause
    useEffect(() => {
        if (!wavesurfer.current || !isLoaded)
        {
            return;
        }

        if (isPlaying)
        {
            wavesurfer.current.play();
        } else
        {
            wavesurfer.current.pause();
        }
    }, [isPlaying, isLoaded]);

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
            className="relative h-full bg-blue-900/40 rounded-lg p-2 mb-2 cursor-move hover:bg-blue-800/40"
            {...attributes}
            {...listeners}
        >
            <div className="text-sm h-full text-white mb-1">{track.name}</div>
            {error ? (
                <div className="text-red-500 text-sm">{error}</div>
            ) : (
                <div
                    ref={waveformRef}
                    className="w-full h-full"
                />
            )}
        </div>
    );
}; 