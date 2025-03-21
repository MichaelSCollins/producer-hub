import { useState, useCallback } from 'react';
import { useAudioStore } from '@/store/audioStore';

interface UseAudioUploadProps {
    channelId?: number;
    audioFileId: number;
}

export const useAudioUpload = ({ channelId, audioFileId }: UseAudioUploadProps) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const addTrack = useAudioStore((state) => state.addTrack);

    const handleFileUpload = useCallback(async (file: File) => {
        if (!file.type.startsWith('audio/'))
        {
            throw new Error('Invalid file type. Please upload an audio file.');
        }

        setIsUploading(true);
        setUploadProgress(0);

        try
        {
            // TODO: Replace with actual upload logic to your backend
            // This is a mock implementation
            const mockUpload = () => new Promise<string>((resolve) => {
                const interval = setInterval(() => {
                    setUploadProgress((prev) => {
                        if (prev >= 100)
                        {
                            clearInterval(interval);
                            return 100;
                        }
                        return prev + 10;
                    });
                }, 100);

                // Mock URL - replace with actual uploaded file URL from your backend
                setTimeout(() => {
                    resolve(URL.createObjectURL(file));
                }, 1000);
            });

            const url = await mockUpload();

            addTrack(channelId || -1, {
                name: file.name,
                url,
                audioFileId,
                startTime: 0,
                channel: channelId || -1,
            });

            setUploadProgress(100);
        } catch (error)
        {
            console.error('Error uploading file:', error);
            throw error;
        } finally
        {
            setIsUploading(false);
        }
    }, [addTrack, channelId, audioFileId]);

    const handleDrop = useCallback(async (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();

        const files = Array.from(event.dataTransfer.files);
        const audioFiles = files.filter(file => file.type.startsWith('audio/'));

        if (audioFiles.length === 0)
        {
            throw new Error('No audio files were dropped');
        }

        // Upload each audio file
        await Promise.all(audioFiles.map(handleFileUpload));
    }, [handleFileUpload]);

    const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    }, []);

    return {
        isUploading,
        uploadProgress,
        handleFileUpload,
        handleDrop,
        handleDragOver,
    };
}; 