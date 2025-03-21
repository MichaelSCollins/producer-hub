import { useAudioStore, QUANTIZE_DIVISIONS } from '@/store/audioStore';

export const QuantizeControls = () => {
    const {
        bpm,
        quantizeDivision,
        setBpm,
        setQuantizeDivision,
    } = useAudioStore();

    return (
        <div className="flex items-center space-x-4 bg-blue-900/30 p-2 rounded-lg">
            <div className="flex items-center">
                <label className="text-white text-sm mr-2">BPM</label>
                <input
                    type="number"
                    min="20"
                    max="300"
                    value={bpm}
                    onChange={(e) => setBpm(Number(e.target.value))}
                    className="w-16 px-2 py-1 bg-blue-800 text-white rounded"
                />
            </div>

            <div className="h-6 border-l border-blue-700 mx-2" />

            <div className="flex items-center">
                <label className="text-white text-sm mr-2">Quantize</label>
                <div className="flex items-center space-x-1">
                    {Object.entries(QUANTIZE_DIVISIONS).map(([key, division]) => (
                        <button
                            key={key}
                            onClick={() => setQuantizeDivision(key as keyof typeof QUANTIZE_DIVISIONS)}
                            className={`px-2 py-1 text-sm rounded ${quantizeDivision === key
                                ? 'bg-blue-500 text-white'
                                : 'bg-blue-800 text-white hover:bg-blue-700'
                                }`}
                            title={`Quantize to ${division.label}`}
                        >
                            {division.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}; 