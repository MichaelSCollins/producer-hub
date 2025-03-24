"use client"

import { useEffect, useState } from 'react';
import { useAudioStore } from '@/store/audioStore';
import { projectStorageApi } from '@/lib/api/projectStorage';
import ChannelAudioBuilder from '@/lib/builder/audioBuilder';
import { Channel } from '@/lib/interface';
import { QUANTIZE_DIVISIONS } from '@/store/presets';
import UIJob from '@/lib/facade/UIJob';

export const ProjectControls = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [projectName, setProjectName] = useState('');
    const [userId] = useState('user'); // TODO: Replace with actual user ID from auth system
    const [projects, setProjects] = useState<Array<{ id: string; name: string }>>([]);
    const [showProjects, setShowProjects] = useState(false);
    const job = new UIJob().before(() => {
        setIsLoading(true);
        setError(null);
    }).success(async (response) => {
        setProjectName(response?.data?.name);
        await loadProjects();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }).error((error: any) => {
        setError('Failed to save project... ' + error.messages);
        console.error('Error saving project:', error);
    }).after(() => {
        setIsLoading(false);
    });
    const {
        channels,
        masterChannel,
        bpm,
        quantizeDivision,
    } = useAudioStore();

    useEffect(() => {
        if (showProjects)
        {
            loadProjects();
        }
    }, [userId, showProjects]);

    const loadProjects = async () => {
        try
        {
            console.log({ userId })
            const userProjects = await projectStorageApi.getProjectsByUser(
                userId
            );
            console.log({ userProjects })
            setProjects(userProjects.map(p => ({ id: p.id, name: p.name })));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any)
        {
            console.error('Error processing projects:', err);
            setError(err.code + ': ' + err.message);
        }
    };
    const handleSaveProject = async () =>
        await job.setJobFunction(
            async () => projectStorageApi.createProject(
                projectName,
                bpm,
                quantizeDivision,
                masterChannel,
                channels,
                userId
            ))
            .execute()

    const handleLoadProject = async (projectId: string) => {
        await job.setJobFunction(
            async () => {
                const project = await projectStorageApi.getProject(projectId);
                const audioBuilder = new ChannelAudioBuilder();
                audioBuilder.setChannels(channels as Channel[]);
                const channelsWithAudio = await audioBuilder.build();
                // Load audio files for each track
                useAudioStore.setState({
                    projectId,
                    channels: channelsWithAudio,
                    masterChannel: {
                        volume: Number(project.masterVolume),
                        muted: project.masterMuted,
                        effects: masterChannel.effects.map(effect => ({
                            id: effect.id,
                            type: effect.type as 'eq' | 'compressor' | 'limiter',
                            enabled: effect.enabled,
                            parameters: effect.parameters,
                        })),
                    },
                    bpm: project.bpm,
                    quantizeDivision: project.quantizeDivision as keyof typeof QUANTIZE_DIVISIONS,
                });
            })
            .execute()
    };

    return (
        <div className="space-y-4 py-2" >
            <div className="flex items-center  space-x-4 bg-blue-900/30 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="Project name"
                        className="px-3 py-1 rounded bg-blue-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleSaveProject}
                        disabled={isLoading}
                        className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50"
                    >
                        {isLoading ? 'Saving...' : 'Save Project'}
                    </button>
                    <button
                        onClick={() => setShowProjects(!showProjects)}
                        className="px-3 py-1 rounded bg-blue-800 hover:bg-blue-700 text-white"
                    >
                        {showProjects ? 'Hide Projects' : 'Load Project'}
                    </button>
                </div>

                {error && (
                    <div className="text-red-500 text-sm">{error}</div>
                )}
            </div>

            {showProjects && (
                <div className="bg-blue-900/30 p-4 rounded-lg ">
                    <h3 className="text-white font-semibold mb-3">Your Projects</h3>
                    {projects.length === 0 ? (
                        <p className="text-gray-400">No projects found</p>
                    ) : (
                        <div className="space-y-2  max-h-32 overflow-y-auto">
                            {projects.map(project => (
                                <div
                                    key={project.id}
                                    className="flex items-center justify-between bg-blue-800/50 p-2 rounded"
                                >
                                    <span className="text-white">{project.name}</span>
                                    <button
                                        onClick={() => handleLoadProject(project.id)}
                                        className="px-2 py-1 rounded bg-blue-600 text-white text-sm hover:bg-blue-500"
                                    >
                                        Load
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )
            }
        </div >
    );
}; 