"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react';
import { useAudioStore } from '@/store/audioStore';
import { audioStorageApi } from '@/lib/audioStorage';

interface UseAudioUploadProps {
    channelId: string;
    audioFileId?: number;
}

export const useAudioUpload = ({ channelId, audioFileId }: UseAudioUploadProps) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const addTrack = useAudioStore((state: { addTrack: any; }) => state.addTrack);

    const handleFileUpload = useCallback(async (file: File) => {
        console.log('handleFileUpload', file)
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
            const s3Object = await audioStorageApi.uploadAudio(file, 'Uploaded by user', 'user');
            console.log('s3Object', s3Object)
            addTrack(channelId, {
                name: file.name,
                audioFileId: s3Object.id ?? -1,
                url: s3Object.downloadUrl,
                startTime: 0,
                position: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
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
    }, [channelId, addTrack, audioFileId]);

    const handleDrop = useCallback(async (event: React.DragEvent<HTMLDivElement>) => {
        console.log('handleDrop')
        event.preventDefault();
        event.stopPropagation();

        const files = Array.from(event.dataTransfer.files);
        const audioFiles = files.filter(file => file.type.startsWith('audio/'));
        console.log('handleDrop', audioFiles)
        if (audioFiles.length === 0)
        {
            throw new Error('No audio files were dropped');
        }

        // Upload each audio file
        await Promise.all(audioFiles.map(handleFileUpload));
    }, [channelId, audioFileId]);

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