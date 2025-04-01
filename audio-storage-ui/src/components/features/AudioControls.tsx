import { MdDeleteForever } from "react-icons/md";
import { FaDownload } from "react-icons/fa";
import { FaPlay } from "react-icons/fa";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { audioStorageApi } from "@/lib/audioStorage";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState } from "react";
import { AudioTrack } from "@/types/audio";

interface AudioControlsProps {
    wavesurfer: any | null;
    isPlaying: boolean;
    track: AudioTrack;
    solo: boolean;
    muted: boolean;
}

const AudioControls = ({ track, wavesurfer }: AudioControlsProps) => {
    console.log('AudioControls', track, wavesurfer);
    const { id, filename: name, downloadUrl: url } = track; // Destructure the track object to get the id and name 

    const [isLoaded,] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const { setNodeRef, attributes, listeners, transform, transition } = useSortable({
        id,
    });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    const downloaded = false;

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

    return (
        <div className="w-full flex justify-end">
            <div
                ref={setNodeRef}
                style={style}
                className={`
                    flex
                    rounded-lg 
                    w-min
                    cursor-pointer
                    z-50 mr-4 mb-4`}
                {...attributes}
                {...listeners}
            >
                <div className="flex justify-end items-center space-x-4 cursor-pointer">
                    <button
                        className={`h-10 w-10  rounded ${isPlaying ? 'bg-green-400 text-white' : 'bg-blue-800'
                            } hover:bg-green-500 cursor-pointer text-white hover:text-white`}
                        onClick={() => {
                            setIsPlaying(!isPlaying);
                            console.log('Toggle play');
                        }}>
                        <FaPlay className="m-auto text-xl" />
                    </button>
                    <a
                        download={name || "audio-file.mp3"}
                        href={url}
                        className={`h-10 w-10 justify-center items-center text-xl rounded ${downloaded ? "bg-blue-500 text-white" : "bg-blue-800"
                            } hover:bg-indigo-600 cursor-pointer text-white hover:text-white`}
                    >
                        <FaDownload className="m-auto h-full" />
                    </a>
                    <button
                        className={`h-10 w-10 text-3xl justify-center items-center  rounded ${downloaded ? 'bg-red-500 text-white' : 'bg-red-800'
                            } hover:bg-red-500 cursor-pointer text-white hover:text-white`}
                        onClick={() => {
                            console.log('Toggle delete');
                            audioStorageApi.deleteAudio(id);                                                                                                                                                                                                                
                            window.location.reload();
                        }}
                    >
                        <MdDeleteForever className="m-auto" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AudioControls;