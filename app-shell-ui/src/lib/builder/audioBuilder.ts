import { Channel, AudioTrack } from "@/lib/interface";
import { audioStorageApi } from "../api/audioStorage";

export class ChannelAudioBuilder {
    private channels: Channel[] = [];
    setChannels = async (channels: Channel[]) => {
        this.channels = channels
    }
    buildAllChannels = async () =>
        await Promise.all(
            this.channels.map(this.buildChannel)
        )
    buildChannel = async (channel: Channel) => {
        const channelWithAudio = Object.assign(channel, {
            tracks: await Promise.all(
                channel.tracks.map(TrackAudioBuilder.build)
            )
        })
        return channelWithAudio
    }

    async build(): Promise<Channel[]> {
        return await this.buildAllChannels();
    }
}

export class TrackAudioBuilder {
    static build = async (track: AudioTrack) => {
        return await new TrackAudioBuilder()
            .setTrack(track)
            .build()
    }

    private track?: AudioTrack;

    setTrack = (track: AudioTrack) => {
        this.track = track
        return this
    }
    build = async () => {
        if (this.track?.audioFileId)
        {
            try
            {
                const blob = await audioStorageApi.downloadAudio(this.track.audioFileId);
                const url = URL.createObjectURL(blob);
                return Object.assign(this.track, {
                    url,
                });
            } catch (err)
            {
                console.error(`Failed to load audio file for track ${this.track.id}:`, err);
                return Object.assign(this.track, {
                    url: null,
                });
            }
        }
        return this.track
    }
}

export default ChannelAudioBuilder;
