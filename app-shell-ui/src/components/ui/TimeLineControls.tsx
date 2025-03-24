"use client"
import { useAudioStore } from "@/store/audioStore";

const TimeLineControls = () => {
    const {
        isPlaying,
        addChannel,
        setIsPlaying,
        // setCurrentTime,
    } = useAudioStore();

    return (
        <div className="flex items-center space-x-4">
            <button
                className={`px-4 py-2 rounded ${isPlaying ? 'bg-green-600' : 'bg-green-500'} 
                text-white font-semibold hover:${isPlaying ? 'bg-green-500' : 'bg-green-400'}`}
                onClick={() => setIsPlaying(!isPlaying)}
            >
                {isPlaying ? 'Stop' : 'Play'}
            </button>
            <button
                className="px-4 py-2 rounded bg-gray-600 hover:bg-blue-500 text-white font-semibold"
                onClick={() => addChannel()}
            >
                Add Channel
            </button>
        </div>
    )
}

export default TimeLineControls;