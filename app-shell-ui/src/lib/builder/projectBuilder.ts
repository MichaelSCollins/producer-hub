import { MasterChannel, Channel } from "../interface"

class ProjectBuilder {
    private projectName: string = "New Project"
    private bpm: number = 87
    private userId: string = "guest"
    private quantizeDivision: string = 'none'
    private masterChannel?: MasterChannel
    private channels?: Channel[]
    setProjectName(projectName: string) {
        this.projectName = projectName
        return this
    }
    setBpm(bpm: number) {
        this.bpm = bpm
        return this
    }
    setQuantizeDivision(quantizeDivision: string) {
        this.quantizeDivision = quantizeDivision
        return this
    }
    setMasterChannel(masterChannel: MasterChannel) {
        this.masterChannel = masterChannel
        return this
    }
    setChannels(channels: Channel[]) {
        this.channels = channels
        return this
    }
    setUserId(userId: string) {
        this.userId = userId
        return this
    }
    build() {
        const project = {
            name: this.projectName,
            bpm: this.bpm,
            quantizeDivision: this.quantizeDivision,
            masterVolume: this.masterChannel?.volume,
            masterMuted: this.masterChannel?.muted
        }
        return project
    }
}

export default ProjectBuilder
