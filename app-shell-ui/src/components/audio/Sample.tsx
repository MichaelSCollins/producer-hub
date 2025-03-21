import { useCallback, useEffect, useRef, useState } from 'react';
import { Channel as SampleType, AudioTrack as AudioTrackType } from '@/store/audioStore';
import { AudioTrack } from './AudioTrack';
import { useAudioUpload } from '@/lib/hooks/useAudioUpload';
import { useAudioStore } from '@/store/audioStore';
import { audioStorageApi, AudioFileMetadata } from '@/lib/api/audioStorage';
import { projectStorageApi } from '@/lib/api/projectStorage';

interface SampleProps {
    sample: SampleType;
    isPlaying: boolean;
    currentTime: number;
    onTrackPositionChange: (trackId: string, startTime: number) => void;
}

export const Sample = ({
    sample,
    isPlaying,
    currentTime,
    onTrackPositionChange,
}: SampleProps) => {
    const { handleDrop, handleDragOver, isUploading } = useAudioUpload({
        channelId: sample.id,
        audioFileId: sample.audioFileId
    });
    const containerRef = useRef<HTMLDivElement>(null);
    const setViewportWidth = useAudioStore((state) => state.setViewportWidth);
    const setSelection = useAudioStore((state) => state.setSelection);
    const pixelsPerSecond = useAudioStore((state) => state.pixelsPerSecond);
    const [isDraggingSelection, setIsDraggingSelection] = useState(false);
    const [selectionStartX, setSelectionStartX] = useState<number | null>(null);
    const [savedFiles, setSavedFiles] = useState<AudioFileMetadata[]>([]);
    const [isLoadingFiles, setIsLoadingFiles] = useState(false);
    const [showSavedFiles, setShowSavedFiles] = useState(false);
    const projectId = useAudioStore((state) => state.projectId);

    const loadSavedFiles = useCallback(async () => {
        console.log("loading saved files")
        try
        {
            setIsLoadingFiles(true);
            const files = await audioStorageApi.getAllAudioFiles();
            setSavedFiles(files);
        } catch (error)
        {
            console.error('Error loading saved files:', error);
        } finally
        {
            setIsLoadingFiles(false);
        }
    }, []);

    const handleSaveTrack = useCallback(async (track: AudioTrackType) => {
        try
        {
            console.log("saving track", track)
            const response = await fetch(track.url);
            const blob = await response.blob();
            const file = new File([blob], track.name, { type: blob.type });
            const obj = await audioStorageApi.uploadAudio(file, `Track from sample: ${sample.name}`, 'user');
            track.audioFileId = obj.id;
            await projectStorageApi.updateChannel(
                projectId ?? '-1',
                track.channel, {
                ...sample,
                tracks: sample.tracks.map(t => t.id === track.id ? {
                    ...t,
                    audioFileId: obj.id
                } : t)
            })
            await loadSavedFiles();
        } catch (error)
        {
            console.error('Error saving track:', error);
        }
    }, [sample, projectId, loadSavedFiles]);

    const handleLoadTrack = useCallback(async (audioFile: AudioFileMetadata) => {
        try
        {
            console.log("loading track", audioFile)
            const blob = await audioStorageApi.downloadAudio(audioFile.id);
            const url = URL.createObjectURL(blob);
            const addTrack = useAudioStore.getState().addTrack;
            addTrack(sample.id, {
                name: audioFile.filename,
                audioFileId: audioFile.id,
                channel: sample.id,
                url,
                startTime: 0,
            });
        } catch (error)
        {
            console.error('Error loading track:', error);
        }
    }, [sample.id]);

    useEffect(() => {
        if (containerRef.current)
        {
            const resizeObserver = new ResizeObserver((entries) => {
                for (const entry of entries)
                {
                    setViewportWidth(entry.contentRect.width);
                }
            });

            resizeObserver.observe(containerRef.current);
            return () => resizeObserver.disconnect();
        }
    }, [setViewportWidth]);

    const handleTrackPositionChange = useCallback((trackId: string) => (startTime: number) => {
        onTrackPositionChange(trackId, startTime);
    }, [onTrackPositionChange]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button !== 0) return; // Only handle left click
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        setIsDraggingSelection(true);
        const startX = e.clientX - rect.left;
        setSelectionStartX(startX);
        setSelection(startX / pixelsPerSecond, startX / pixelsPerSecond);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDraggingSelection || selectionStartX === null) return;
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        const currentX = e.clientX - rect.left;
        setSelection(
            selectionStartX / pixelsPerSecond,
            currentX / pixelsPerSecond
        );
    };

    const handleMouseUp = () => {
        setIsDraggingSelection(false);
        setSelectionStartX(null);
    };

    useEffect(() => {
        if (isDraggingSelection)
        {
            document.addEventListener('mouseup', handleMouseUp);
            return () => document.removeEventListener('mouseup', handleMouseUp);
        }
    }, [isDraggingSelection]);

    return (
        <div className="flex flex-col bg-gray-900 p-4 rounded-lg mb-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">{sample.name}</h3>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                        <label className="text-white mr-2">Volume</label>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={sample.volume}
                            className="w-24"
                            onChange={(e) => {
                                // TODO: Implement volume change
                                console.log('Volume:', e.target.value);
                            }}
                        />
                    </div>
                    <button
                        className={`px-3 py-1 rounded ${sample.muted ? 'bg-red-500' : 'bg-gray-700'
                            } text-white`}
                        onClick={() => {
                            // TODO: Implement mute toggle
                            console.log('Toggle mute');
                        }}
                    >
                        Mute
                    </button>
                    <button
                        className={`px-3 py-1 rounded ${sample.solo ? 'bg-green-500' : 'bg-gray-700'
                            } text-white`}
                        onClick={() => {
                            // TODO: Implement solo toggle
                            console.log('Toggle solo');
                        }}
                    >
                        Solo
                    </button>
                    <button
                        className="px-3 py-1 rounded bg-blue-500 text-white"
                        onClick={() => {
                            setShowSavedFiles(!showSavedFiles);
                            if (!showSavedFiles)
                            {
                                loadSavedFiles();
                            }
                        }}
                    >
                        {showSavedFiles ? 'Hide Library' : 'Show Library'}
                    </button>
                </div>
            </div>

            {showSavedFiles && (
                <div className="mb-4 bg-gray-800 p-4 rounded">
                    <h4 className="text-white font-semibold mb-2">Audio Library</h4>
                    {isLoadingFiles ? (
                        <div className="text-gray-400">Loading...</div>
                    ) : savedFiles.length === 0 ? (
                        <div className="text-gray-400">No saved files found</div>
                    ) : (
                        <div className="space-y-2">
                            {savedFiles.map((file) => (
                                <div key={file.id} className="flex items-center justify-between bg-gray-700 p-2 rounded">
                                    <span className="text-white">{file.filename}</span>
                                    <button
                                        className="px-2 py-1 rounded bg-blue-500 text-white text-sm"
                                        onClick={() => handleLoadTrack(file)}
                                    >
                                        Load
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div
                ref={containerRef}
                className={`min-h-[100px] border-2 border-dashed ${isUploading ? 'border-blue-500' : 'border-gray-700'
                    } rounded-lg p-4 transition-colors relative overflow-x-auto`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
            >
                <div className="absolute top-0 left-0 min-w-full h-full">
                    {sample.tracks.map((track) => (
                        <div key={track.id} className="relative">
                            <AudioTrack
                                track={track}
                                isPlaying={isPlaying}
                                currentTime={currentTime}
                                onPositionChange={handleTrackPositionChange(track.id.toString())}
                            />
                            <div className="absolute top-2 right-2 flex space-x-2">
                                <button
                                    className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-xs"
                                    onClick={() => handleSaveTrack(track)}
                                >
                                    Save
                                </button>
                                <a
                                    href={track.url}
                                    download={track.name}
                                    className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    Download
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
                {sample.tracks.length === 0 && (
                    <div className="text-gray-500 text-center">
                        Drag and drop audio files here
                    </div>
                )}
            </div>
        </div>
    );
}; 