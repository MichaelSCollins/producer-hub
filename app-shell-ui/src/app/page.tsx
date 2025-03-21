'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Channel } from '@/components/audio/Channel';
import { useAudioStore, QUANTIZE_DIVISIONS } from '@/store/audioStore';
import { ZoomControls } from '@/components/audio/ZoomControls';
import { QuantizeControls } from '@/components/audio/QuantizeControls';
import { MasterChannel } from '@/components/audio/MasterChannel';
import { ProjectControls } from '@/components/project/ProjectControls';

const useQuantization = false;
interface GridLine {
  position: number;
  strength: 'bar' | 'beat' | 'division';
}

export default function Home() {
  const {
    channels,
    isPlaying,
    currentTime,
    addChannel,
    updateTrackPosition,
    setIsPlaying,
    // setCurrentTime,
    bpm,
    quantizeDivision,
    pixelsPerSecond,
  } = useAudioStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

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

  useEffect(() => {
    if (channels.length === 0)
    {
      addChannel();
    }
  }, [channels.length, addChannel]);

  // Calculate grid lines based on BPM and quantization with beat strength
  const gridLines = useCallback((): GridLine[] => {
    if (quantizeDivision === 'OFF') return [];

    const division = QUANTIZE_DIVISIONS[quantizeDivision];
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
    <main className="min-h-screen bg-gray-150 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Producer<span className="text-blue-500">HUB</span></h1>
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
        </div>

        <div className="space-y-4 mb-8">
          <ProjectControls />
          {useQuantization && <ZoomControls />}
          {useQuantization && <QuantizeControls />}
        </div>

        {/* <div className="mb-8">
          <input
            type="range"
            min="0"
            max="100"
            value={currentTime}
            className="w-full"
            onChange={(e) => setCurrentTime(parseInt(e.target.value, 10))}
          />
        </div> */}

        <div className="relative" ref={containerRef}>
          {/* Grid lines */}
          {useQuantization && <div className="absolute inset-0 pointer-events-none">
            {gridLines().map((line, index) => (
              <div
                key={index}
                className={`absolute top-0 bottom-0 ${getGridLineStyle(line.strength)}`}
                style={{ left: `${line.position}px` }}
              />
            ))}
          </div>}

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
      </div>
    </main>
  );
}
