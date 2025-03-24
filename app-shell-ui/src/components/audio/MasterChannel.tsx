import { Effect } from '@/lib/interface';
import { useAudioStore } from '@/store/audioStore';

export const MasterChannel = () => {
    const {
        masterChannel,
        setMasterVolume,
        toggleMasterMute,
        addMasterEffect,
        removeMasterEffect,
        updateMasterEffect,
        toggleMasterEffect,
    } = useAudioStore();

    const handleEffectParameterChange = (
        effectId: string,
        parameter: string,
        value: number
    ) => {
        updateMasterEffect(effectId, { [parameter]: value });
    };
    const active = false;
    return <>
        {
            !active
            && <div className={`
                absolute bg-gray-900/80 
                border-blue-500
                h-1/2 w-full z-50 p-4 text-slate-300
                flex items-center justify-center text-2xl
                rounded-lg mb-4 border-2`}>
                Coming Soon...</div>
        }
        <div className="relative z-10 flex flex-col bg-blue-900 p-4 h-full rounded-lg mb-4 border-2 border-blue-500">
            <div className="relative flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Master Channel</h3>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                        <label className="text-white mr-2">Volume</label>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={masterChannel.volume}
                            className="w-32"
                            onChange={(e) => setMasterVolume(Number(e.target.value))}
                        />
                        <span className="text-white ml-2">
                            {Math.round(masterChannel.volume * 100)}%
                        </span>

                    </div>
                    <button
                        className={`px-3 py-1 rounded 
                            ${masterChannel.muted
                                ? 'bg-red-500'
                                : 'bg-gray-700'}
                            `}

                        onClick={() => toggleMasterMute()}
                    >
                        Mute
                    </button>
                </div>
            </div>

            <div className="space-y-4">

                <div className="flex items-center space-x-2">
                    <span className="text-white">Effects:</span>
                    <button
                        className="px-2 py-1 rounded bg-blue-500 text-white text-sm"
                        onClick={() => addMasterEffect('eq')}
                    >
                        Add EQ
                    </button>
                    <button
                        className="px-2 py-1 rounded bg-blue-500 text-white text-sm"
                        onClick={() => addMasterEffect('compressor')}
                    >
                        Add Compressor
                    </button>
                    <button
                        className="px-2 py-1 rounded bg-blue-500 text-white text-sm"
                        onClick={() => addMasterEffect('limiter')}
                    >
                        Add Limiter
                    </button>
                </div>

                <div className="space-y-2">
                    {masterChannel.effects.map((effect, i) => (
                        <div
                            key={i}
                            className="bg-gray-800 p-3 rounded flex flex-col space-y-2"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <span className="text-white capitalize">{effect.type}</span>
                                    <button
                                        className={`px-2 py-1 rounded text-xs ${effect.enabled ? 'bg-green-500' : 'bg-blue-600'
                                            } text-white`}
                                        onClick={() => toggleMasterEffect(effect.id)}
                                    >
                                        {effect.enabled ? 'Enabled' : 'Disabled'}
                                    </button>
                                </div>
                                <button
                                    className="text-red-500 hover:text-red-400"
                                    onClick={() => removeMasterEffect(effect.id)}
                                >
                                    Remove
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                {Object.entries(effect.parameters).map(([param, value]) => (
                                    <div key={param} className="flex items-center">
                                        <label className="text-white text-sm capitalize mr-2">
                                            {param}
                                        </label>
                                        <input
                                            type="range"
                                            min={getParameterRange(effect.type, param).min}
                                            max={getParameterRange(effect.type, param).max}
                                            step={getParameterRange(effect.type, param).step}
                                            value={value}
                                            className="w-24"
                                            onChange={(e) =>
                                                handleEffectParameterChange(
                                                    effect.id ?? '<NEW-EFFECT>',
                                                    param,
                                                    Number(e.target.value)
                                                )
                                            }
                                        />
                                        <span className="text-white text-sm ml-2">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </>
}

function getParameterRange(
    effectType: Effect['type'],
    parameter: string
): { min: number; max: number; step: number } {
    switch (effectType)
    {
        case 'eq':
            return { min: -12, max: 12, step: 0.1 };
        case 'compressor':
            switch (parameter)
            {
                case 'threshold':
                    return { min: -60, max: 0, step: 0.1 };
                case 'ratio':
                    return { min: 1, max: 20, step: 0.1 };
                case 'attack':
                    return { min: 0, max: 100, step: 0.1 };
                case 'release':
                    return { min: 0, max: 1000, step: 1 };
                default:
                    return { min: 0, max: 1, step: 0.01 };
            }
        case 'limiter':
            switch (parameter)
            {
                case 'threshold':
                    return { min: -60, max: 0, step: 0.1 };
                case 'release':
                    return { min: 0, max: 1000, step: 1 };
                default:
                    return { min: 0, max: 1, step: 0.01 };
            }
        default:
            return { min: 0, max: 1, step: 0.01 };
    }
} 