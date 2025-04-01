import { useState, useRef, useCallback, useEffect } from 'react';
import { AudioPlaybackState, AudioTrack } from '@/types/audio';

const initialState: AudioPlaybackState = {
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    trackId: null,
};

export function useAudioPlayback() {
    const [state, setState] = useState<AudioPlaybackState>(initialState);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const play = useCallback(async (track: AudioTrack) => {
        if (audioRef.current)
        {
            audioRef.current.src = track.audioUrl;
            await audioRef.current.play();
            setState(prev => ({
                ...prev,
                isPlaying: true,
                trackId: track.id,
            }));
        }
    }, []);

    const pause = useCallback(() => {
        if (audioRef.current)
        {
            audioRef.current.pause();
            setState(prev => ({
                ...prev,
                isPlaying: false,
            }));
        }
    }, []);

    const seek = useCallback((time: number) => {
        if (audioRef.current)
        {
            audioRef.current.currentTime = time;
            setState(prev => ({
                ...prev,
                currentTime: time,
            }));
        }
    }, []);

    const setVolume = useCallback((volume: number) => {
        if (audioRef.current)
        {
            audioRef.current.volume = volume;
            setState(prev => ({
                ...prev,
                volume,
            }));
        }
    }, []);

    useEffect(() => {
        const audio = new Audio();
        audioRef.current = audio;

        const handleTimeUpdate = () => {
            setState(prev => ({
                ...prev,
                currentTime: audio.currentTime,
            }));
        };

        const handleLoadedMetadata = () => {
            setState(prev => ({
                ...prev,
                duration: audio.duration,
            }));
        };

        const handleEnded = () => {
            setState(prev => ({
                ...prev,
                isPlaying: false,
                currentTime: 0,
            }));
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('ended', handleEnded);
            audio.pause();
            audio.src = '';
        };
    }, []);

    return {
        ...state,
        play,
        pause,
        seek,
        setVolume,
    };
} 