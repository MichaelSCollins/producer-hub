import { AudioWaveformData } from '@/types/audio';

interface AudioWaveformProps {
    waveform: AudioWaveformData;
    width: number;
    height: number;
    color?: string;
    backgroundColor?: string;
}

export function AudioWaveform({
    waveform,
    width,
    height,
    color = '#4F46E5',
    backgroundColor = '#E5E7EB',
}: AudioWaveformProps) {
    const { peaks } = waveform;
    const barWidth = width / peaks.length;
    const maxPeak = Math.max(...peaks);

    return (
        <div
            className="relative"
            style={{
                width: `${width}px`,
                height: `${height}px`,
                backgroundColor,
            }}
        >
            {peaks.map((peak, index) => {
                const barHeight = (peak / maxPeak) * height;
                return (
                    <div
                        key={index}
                        className="absolute bottom-0"
                        style={{
                            left: `${index * barWidth}px`,
                            width: `${barWidth}px`,
                            height: `${barHeight}px`,
                            backgroundColor: color,
                        }}
                    />
                );
            })}
        </div>
    );
} 