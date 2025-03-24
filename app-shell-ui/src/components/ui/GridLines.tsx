import { useCallback } from 'react';
import { QUANTIZE_DIVISIONS } from '@/store/presets';

interface GridLine {
    position: number;
    strength: 'bar' | 'beat' | 'division';
}

const useQuantization = false;

const GridLines = (cfg: {
    bpm: number;
    quantizeDivision: string;
    pixelsPerSecond: number;
    containerWidth: number;
}) => {
    const { bpm, quantizeDivision, pixelsPerSecond, containerWidth } = cfg;
    // Calculate grid lines based on BPM and quantization with beat strength
    const gridLines = useCallback((): GridLine[] => {
        if (quantizeDivision === 'OFF') return [];

        const division = QUANTIZE_DIVISIONS[quantizeDivision as keyof typeof QUANTIZE_DIVISIONS];
        const beatDuration = 60 / bpm; // Duration of one beat in seconds
        const barDuration = beatDuration * 4; // Assuming 4/4 time signature
        const gridSize = beatDuration * division.value;
        const gridPixels = gridSize * pixelsPerSecond;

        const numberOfLines = Math.ceil(containerWidth / gridPixels);
        return Array.from({ length: numberOfLines }, (_, i): GridLine => {
            const position = i * gridPixels;
            const timePosition = position / pixelsPerSecond;

            // Determine line strength
            if (timePosition % barDuration === 0)
            {
                return { position, strength: 'bar' };
            } else if (timePosition % beatDuration === 0)
            {
                return { position, strength: 'beat' };
            } else
            {
                return { position, strength: 'division' };
            }
        });
    }, [bpm, quantizeDivision, pixelsPerSecond, containerWidth]);

    const getGridLineStyle = (strength: GridLine['strength']) => {
        switch (strength)
        {
            case 'bar':
                return 'border-l-2 border-purple-500 opacity-50';
            case 'beat':
                return 'border-l border-yellow-400 opacity-40';
            case 'division':
                return 'border-l border-green-500 opacity-30';
        }
    };
    return (
        useQuantization && <div className="absolute inset-0 pointer-events-none">
            {gridLines().map((line, index) => (
                <div
                    key={index}
                    className={`absolute top-0 bottom-0 ${getGridLineStyle(line.strength)}`}
                    style={{ left: `${line.position}px` }}
                />
            ))}
        </div>)
}

export default GridLines;