/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { audioStorageApi } from "@/lib/audioStorage";
import { AudioItem } from "@/components/features/AudioTrack"; // Import the AudioItem component to display each audio track
import { AudioTrack } from "@/types/audio";
import { useEffect, useState } from "react";

const AudioCriteriaList = () => {
    const [message, setMessage] = useState<string | undefined>()
    const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([]);
    const [filteredTracks, setFilteredTracks] = useState<AudioTrack[]>([]);
    // This function can be used to search for audio files by name
    const [searchQuery, setSearchQuery] = useState<string>('*')
    const [error, setError] = useState<string | undefined>()
    useEffect(() => {
        // Fetch all audio files from the API and set the state
        audioStorageApi.getAllAudioFiles().then((tracks) => {
            console.log("Fetched tracks", tracks)
            setMessage(JSON.stringify(tracks, null, 2))
            setAudioTracks(tracks);
        }).catch((error) => {
            console.error('Failed to fetch audio files:', error)
            setError(
                error.message
            )
        });
    }, []);
    useEffect(() => {
        try
        {
            if (searchQuery === "*")
            {
                setFilteredTracks(audioTracks)
            }
            else
            {

            }
            const filteredTracks = audioTracks.filter(track =>
                track.filename?.toLowerCase()
                    .includes(searchQuery
                        ?.toLowerCase()
                    )
            );
            setFilteredTracks(filteredTracks);
            console.log("Filtered tracks", filteredTracks)
            setMessage("Filtered tracks" + JSON.stringify(filteredTracks, null, 2))
        } catch (e: any)
        {
            setError(e.message)
        }
    }, [searchQuery, audioTracks])
    console.log("Audio tracks", audioTracks)

    console.log({ searchQuery, filteredTracks, audioTracks })
    return (
        <div>
            <p className="text-blue-500">{message}</p>
            <p className="text-red-500">{error}</p>
            <input className='mb-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent'
                type="text"
                placeholder="Search for audio files..."
                onChange={(e) => setSearchQuery(e.target.value)}
            // This input can be used to filter the audio list by name
            />
            <div className="space-y-6 max-h-96 overflow-y-auto p-4 bg-white rounded-lg shadow-md">
                {filteredTracks?.map((track: AudioTrack) => (
                    <AudioItem key={track.id}
                        track={track}
                        currentTime={0}
                    />
                ))}
            </div>
        </div>

    );
}

export default AudioCriteriaList;