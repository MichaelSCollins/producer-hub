import { useEffect, useState } from 'react';
import { useAudioStore, QUANTIZE_DIVISIONS } from '@/store/audioStore';
import { projectStorageApi } from '@/lib/api/projectStorage';
import { audioStorageApi } from '@/lib/api/audioStorage';

export const ProjectControls = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [projectName, setProjectName] = useState('');
    const [userId] = useState('user'); // TODO: Replace with actual user ID from auth system
    const [projects, setProjects] = useState<Array<{ id: string; name: string }>>([]);
    const [showProjects, setShowProjects] = useState(false);

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
    }, [showProjects, userId]);

    const loadProjects = async () => {
        try
        {
            const userProjects = await projectStorageApi.getProjectsByUser(userId);
            console.log({ userProjects })
            setProjects(userProjects.map(p => ({ id: p.id, name: p.name })));
        } catch (err)
        {
            console.error('Error loading projects:', err);
            setError('Failed to load projects');
        }
    };

    const handleSaveProject = async () => {
        try
        {
            setIsLoading(true);
            setError(null);

            if (!projectName.trim())
            {
                setError('Please enter a project name');
                return;
            }
            console.log("saving project...")
            const project = await projectStorageApi.createProject({
                name: projectName,
                bpm,
                quantizeDivision,
                masterVolume: masterChannel.volume,
                masterMuted: masterChannel.muted,
            }, userId);

            console.log("saving channels...", channels)
            // Add channels
            for (const channel of channels)
            {
                const formattedTracks = channel.tracks.map(track => ({
                    ...track
                }))
                console.log("formatted tracks", formattedTracks)
                const res = await projectStorageApi.addChannel(project.id, {
                    name: channel.name,
                    volume: channel.volume,
                    tracks: channel.tracks,
                    muted: channel.muted,
                    solo: channel.solo,
                    position: channels.indexOf(channel),
                });
                console.log("added channel", res)
            }

            console.log("loading projects...")
            setProjectName('');
            await loadProjects();
        } catch (err)
        {
            setError('Failed to save project');
            console.error('Error saving project:', err);
        } finally
        {
            setIsLoading(false);
        }
    };

    const handleLoadProject = async (projectId: string) => {
        try
        {
            setIsLoading(true);
            setError(null);

            const project = await projectStorageApi.getProject(projectId);

            // Load audio files for each track
            const channelsWithAudio = await Promise.all(project.channels.map(async (channel) => {
                const tracksWithAudio = await Promise.all(channel.tracks.map(async (track) => {
                    if (track.audioFileId)
                    {
                        try
                        {
                            const blob = await audioStorageApi.downloadAudio(track.audioFileId);
                            const url = URL.createObjectURL(blob);
                            return {
                                ...track,
                                id: Number(track.id) ?? -1,
                                url,
                                startTime: Number(track.startTime),
                                channel: channel.id,
                            };
                        } catch (err)
                        {
                            console.error(`Failed to load audio file for track ${track.id}:`, err);
                            return {
                                ...track,
                                url: '',
                                startTime: Number(track.startTime),
                                channel: channel.id,
                            };
                        }
                    }
                    return {
                        ...track,
                        url: '',
                        startTime: Number(track.startTime),
                        channel: channel.id,
                    };
                }));

                return {
                    id: channel.id,
                    name: channel.name,
                    volume: Number(channel.volume),
                    muted: channel.muted,
                    solo: channel.solo,
                    tracks: tracksWithAudio,
                    effects: channel.effects.map(effect => ({
                        id: effect.id,
                        type: effect.type as 'eq' | 'compressor' | 'limiter',
                        enabled: effect.enabled,
                        parameters: effect.parameters,
                    })),
                };
            }));
            // Update master channel
            useAudioStore.setState(state => {
                const updatedState = {
                    ...state,
                    projectId: project.id,
                    masterChannel: {
                        ...state.masterChannel,
                        volume: Number(project.masterVolume),
                        muted: project.masterMuted,
                    },
                    bpm: project.bpm,
                    quantizeDivision: project.quantizeDivision as keyof typeof QUANTIZE_DIVISIONS,
                    channels: channelsWithAudio.map(channel => ({
                        ...channel
                    })),
                };
                return updatedState;
            });

            setShowProjects(false);
        } catch (err)
        {
            setError('Failed to load project');
            console.error('Error loading project:', err);
        } finally
        {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-4 bg-blue-900/30 p-4 rounded-lg">
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
                <div className="bg-blue-900/30 p-4 rounded-lg">
                    <h3 className="text-white font-semibold mb-3">Your Projects</h3>
                    {projects.length === 0 ? (
                        <p className="text-gray-400">No projects found</p>
                    ) : (
                        <div className="space-y-2">
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
            )}
        </div>
    );
}; 