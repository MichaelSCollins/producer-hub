"use client"

import { audioStorageApi } from "@/lib/audioStorage";
import { AudioItem } from "@/components/features/AudioTrack"; // Import the AudioItem component to display each audio track
import { AudioTrack } from "@/types/audio";
import { useEffect, useState } from "react";

const AudioCriteriaList = ({ tracks }: { tracks: AudioTrack[] }) => {
    const [audioTracks, setAudioTracks] = useState<AudioTrack[]>(tracks);
    // This function can be used to search for audio files by name
    const [searchQuery, setSearchQuery] = useState<string>('*')
    useEffect(() => {
        // Fetch all audio files from the API and set the state
        audioStorageApi.getAllAudioFiles().then((tracks) => {
            console.log("Fetched tracks", tracks)
            setAudioTracks(tracks);
        }).catch((error) => {
            console.error('Failed to fetch audio files:', error);
        });
    }, []);


    const filteredTracks = audioTracks?.filter(track =>
        track.filename?.toLowerCase().includes(searchQuery?.toLowerCase())
    ) || [];
    console.log({ searchQuery, filteredTracks, audioTracks })
    return (
        <div>
            <input className='mb-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent'
                type="text"
                placeholder="Search for audio files..."
                onChange={(e) => setSearchQuery(e.target.value)}
            // This input can be used to filter the audio list by name
            />
            <div className="space-y-6 max-h-96 overflow-y-auto p-4 bg-white rounded-lg shadow-md">
                {(searchQuery === "*" ? audioTracks : filteredTracks).map((track: AudioTrack) => (
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