"use client"

import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Channel } from "@/components/audio/Channel"
import { MasterChannel } from "@/components/audio/MasterChannel"
import GridLines from "./GridLines"
import { useRef, useState, useCallback, useEffect } from "react"
import { useAudioStore } from "@/store/audioStore"

const TimeLineEditor = (
) => {
    const {
        channels,
        isPlaying,
        currentTime,
        addChannel,
        updateTrackPosition,
        bpm,
        quantizeDivision,
        pixelsPerSecond,
    } = useAudioStore();


    // Add resize observer
    useEffect(() => {
        if (!containerRef.current) return;

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries)
            {
                setContainerWidth(entry.contentRect.width);
            }
        });

        resizeObserver.observe(containerRef.current);
        setContainerWidth(containerRef.current.offsetWidth);

        return () => resizeObserver.disconnect();
    }, []);

    useEffect(() => {
        if (channels.length === 0)
        {
            addChannel();
        }
    }, [channels.length, addChannel]);


    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(0);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        const trackId = active.id as number;
        const startTime = Math.max(0, event.delta.x / pixelsPerSecond);

        const channelWithTrack = channels.find((channel) =>
            channel.tracks.some((track) => track.id === trackId)
        );

        if (channelWithTrack)
        {
            updateTrackPosition(trackId, channelWithTrack.id, startTime);
        }
    }, [channels, updateTrackPosition, pixelsPerSecond]);

    return <div className="relative" ref={containerRef}>
        <GridLines
            bpm={bpm}
            quantizeDivision={quantizeDivision}
            pixelsPerSecond={pixelsPerSecond}
            containerWidth={containerWidth} />

        <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={channels.flatMap((channel) =>
                    channel.tracks.map((track) => track.id ?? -1)
                )}
                strategy={verticalListSortingStrategy}
            >
                {channels.map((channel) => (
                    <Channel
                        key={channel.id}
                        channel={channel}
                        isPlaying={isPlaying}
                        currentTime={currentTime}
                        onTrackPositionChange={(trackId, startTime) =>
                            updateTrackPosition(trackId, channel.id, startTime)
                        }
                    />
                ))}
            </SortableContext>
        </DndContext>

        {/* Master Channel */}
        <MasterChannel />
    </div>
}

export default TimeLineEditor;