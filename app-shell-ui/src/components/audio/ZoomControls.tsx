import { useAudioStore, ZOOM_PRESETS } from '@/store/audioStore';

export const ZoomControls = () => {
    const {
        zoomIn,
        zoomOut,
        zoomToSelection,
        zoomToPreset,
        zoomToFitProject,
        selectionStart,
        selectionEnd,
    } = useAudioStore();

    return (
        <div className="flex items-center space-x-2 bg-blue-900/30 p-2 rounded-lg">
            <button
                onClick={zoomOut}
                className="px-3 py-1 bg-blue-800 hover:bg-blue-700 text-white rounded"
                title="Zoom Out"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
            </button>

            <button
                onClick={zoomIn}
                className="px-3 py-1 bg-blue-800 hover:bg-blue-700 text-white rounded"
                title="Zoom In"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            </button>

            <div className="h-6 border-l border-blue-700 mx-2" />

            <button
                onClick={zoomToFitProject}
                className="px-3 py-1 bg-blue-800 hover:bg-blue-700 text-white rounded text-sm"
                title="Zoom to Fit Project"
            >
                Fit All
            </button>

            <button
                onClick={() => zoomToSelection()}
                disabled={selectionStart === null || selectionEnd === null}
                className={`px-3 py-1 bg-blue-800 hover:bg-blue-700 text-white rounded text-sm ${selectionStart === null || selectionEnd === null ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                title="Zoom to Selection"
            >
                Fit Selection
            </button>

            <div className="h-6 border-l border-blue-700 mx-2" />

            <div className="flex items-center space-x-1">
                {Object.values(ZOOM_PRESETS).map((preset) => (
                    <button
                        key={preset.label}
                        onClick={() => zoomToPreset(preset.seconds)}
                        className="px-2 py-1 bg-blue-800 hover:bg-blue-700 text-white rounded text-sm"
                        title={`Zoom to ${preset.label}`}
                    >
                        {preset.label}
                    </button>
                ))}
            </div>
        </div>
    );
}; 