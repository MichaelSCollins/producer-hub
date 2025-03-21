import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AudioTrack as AudioTrackType } from '@/store/audioStore';
import { useAudioStore } from '@/store/audioStore';

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onPositionChange,
}: AudioTrackProps) => {
    const waveformRef = useRef<HTMLDivElement>(null);
    const wavesurfer = useRef<WaveSurfer | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const pixelsPerSecond = useAudioStore((state) => state.pixelsPerSecond);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({
        id: track.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        marginLeft: `${track.startTime * pixelsPerSecond}px`,
        width: '100%',// `${30 * pixelsPerSecond}px`, // Assuming 30 seconds duration, TODO: Use actual duration
        height: '100%'
    };

    useEffect(() => {
        if (!waveformRef.current) return;

        wavesurfer.current = WaveSurfer.create({
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
        });

        wavesurfer.current.load(track.url);

        wavesurfer.current.on('ready', () => {
            setIsLoaded(true);
        });

        return () => {
            if (wavesurfer.current)
            {
                wavesurfer.current.destroy();
            }
        };
    }, [track.url, pixelsPerSecond]);

    useEffect(() => {
        if (!wavesurfer.current || !isLoaded) return;

        if (isPlaying)
        {
            wavesurfer.current.play();
        } else
        {
            wavesurfer.current.pause();
        }
    }, [isPlaying, isLoaded]);

    useEffect(() => {
        if (!wavesurfer.current || !isLoaded) return;
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
            <div
                ref={waveformRef}
                className="w-full h-full"
            />
        </div>
    );
}; 