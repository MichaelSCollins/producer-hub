package mike.dev.project_api.service

import mike.dev.project_api.model.*
import mike.dev.project_api.dto.*
import mike.dev.project_api.repository.ProjectRepo
import jakarta.persistence.EntityNotFoundException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
class ProjectService(
    private val projectRepo: ProjectRepo
) {
    @Transactional
    fun createProject(
        request: CreateProjectRequest,
        createdBy: String
    ): ProjectDto {
        val project = Project(
            name = request.name,
            createdBy = createdBy,
            bpm = request.bpm,
            quantizeDivision = request.quantizeDivision,
            masterVolume = request.masterVolume,
            masterMuted = request.masterMuted
        )
        return projectRepo.save(project).toDto()
    }

    @Transactional(readOnly = true)
    fun getProject(id: Long): ProjectDto {
        return findProject(id).toDto()
    }

    @Transactional(readOnly = true)
    fun getProjectsByUser(createdBy: String): List<ProjectDto> {
        return projectRepo.findByCreatedBy(createdBy).map { it.toDto() }
    }

    @Transactional
    fun updateProject(id: Long, request: UpdateProjectRequest): ProjectDto {
        val project = findProject(id)

        request.name?.let { project.name = it }
        request.bpm?.let { project.bpm = it }
        request.quantizeDivision?.let { project.quantizeDivision = it }
        request.masterMuted?.let { project.masterMuted = it }
        project.updatedAt = LocalDateTime.now()

        return projectRepo.save(project).toDto()
    }

    @Transactional
    fun deleteProject(id: Long) {
        if (!projectRepo.existsById(id)) {
            throw EntityNotFoundException("Project not found with id: $id")
        }
        projectRepo.deleteById(id)
    }

    @Transactional
    fun addChannel(
        projectId: Long,
        request: CreateChannelRequest
    ): ProjectDto {
        val project = findProject(projectId)
        val channel = Channel(
            project = project,
            name = request.name,
            volume = request.volume,
            muted = request.muted,
            solo = request.solo,
            position = request.position
        )

        // Add tracks to the channel
        request.tracks.forEachIndexed { index, trackDto ->
            val track = CreateTrackRequest(
                name = trackDto.name,
                audioFileId = trackDto.audioFileId,
                startTime = trackDto.startTime,
            )
            this.createTrack(
                projectId,
                channel.id,
                track
            )
        }

        project.updatedAt = LocalDateTime.now()
        project.channels.add(channel)
        return projectRepo.save(project).toDto()
    }

    @Transactional
    fun updateChannel(
        projectId: Long,
        channelId: Long,
        request: UpdateChannelRequest
    ): Channel {
        val project = findProject(projectId)
        val channel = project.channels.find {
            it.id == channelId
        } ?: throw EntityNotFoundException(
            "Channel not found with id: $channelId"
        )
        request.name?.let { channel.name = it }
        request.volume?.let { channel.volume = it }
        request.muted?.let { channel.muted = it }
        request.solo?.let { channel.solo = it }
        request.position?.let { channel.position = it }
        val updatedTracks: MutableList<Track> = updateTrack(
            channel.tracks,
            channel,
            request.tracks
        )
        channel.tracks = updatedTracks
        channel.updatedAt = LocalDateTime.now()
        project.updatedAt = LocalDateTime.now()
        projectRepo.save(project).toDto()
        return channel
    }

    @Transactional
    fun updateTrack(
        tracks: List<Track>,
        channel: Channel,
        trackUpdates: List<TrackDto>? = null
    ): MutableList<Track> {
        val trackUpdatesMap: MutableMap<Long, TrackDto> = mutableMapOf<Long, TrackDto>()
        trackUpdates?.forEach {
            trackUpdatesMap[it.id] = it
        }
        
        val updatedTracks = tracks.map { track ->
            trackUpdatesMap[track.id]?.let { update ->
                track.apply {
                    name = update.name
                    audioFileId = update.audioFileId
                    startTime = update.startTime
                    position = update.position ?: position
                    updatedAt = LocalDateTime.now()
                }
            } ?: track.apply {
                updatedAt = LocalDateTime.now()
            }
        }

        // Handle new tracks
        val newTracks = trackUpdates?.filter { update -> 
            tracks.none { it.id == update.id }
        }?.map { update ->
            Track(
                name = update.name,
                audioFileId = update.audioFileId,
                startTime = update.startTime,
                position = update.position ?: 0,
                channel = channel
            )
        } ?: emptyList()

        return (updatedTracks + newTracks).toMutableList()
    }

    @Transactional
    fun deleteChannel(projectId: Long, channelId: Long): ProjectDto {
        val project = findProject(projectId)
        project.channels.removeIf { it.id == channelId }
        project.updatedAt = LocalDateTime.now()
        return projectRepo.save(project).toDto()
    }

    @Transactional
    fun createTrack(projectId: Long,
                    channelId: Long, request: CreateTrackRequest): TrackDto {
        val project = findProject(projectId)
        val channel = project.channels.find { it.id == channelId }
            ?: throw EntityNotFoundException("Channel not found with id: $channelId")

        print("channel: ${channel.name}")
        print("creating track ${request.name} - ${request.audioFileId}")
        val track = Track(
            name = request.name,
            audioFileId = request.audioFileId,
            startTime = request.startTime,
            position = channel.tracks.size,
            channel = channel
        )
        channel.tracks.add(track)
        project.updatedAt = LocalDateTime.now()
        
        return projectRepo.save(project)
            .channels.find { it.id == channel.id }!!
            .tracks.find { it.id == track.id }!!
            .toDto()
    }

    @Transactional
    fun updateTrack(
        projectId: Long,
        channelId: Long,
        trackId: Long,
        request: UpdateTrackRequest
    ): TrackDto {
        val project = findProject(projectId)
        val channel = project.channels.find { it.id == channelId }
            ?: throw EntityNotFoundException("Channel not found with id: $channelId")
        
        val track = channel.tracks.find { it.id == trackId }
            ?: throw EntityNotFoundException("Track not found with id: $trackId")

        request.name?.let { track.name = it }
        request.audioFileId?.let { track.audioFileId = it }
        request.startTime?.let { track.startTime = it }
        request.position?.let { track.position = it }
        track.updatedAt = LocalDateTime.now()
        project.updatedAt = LocalDateTime.now()

        return projectRepo.save(project)
            .channels.find { it.id == channelId }!!
            .tracks.find { it.id == trackId }!!
            .toDto()
    }

    @Transactional
    fun deleteTrack(projectId: Long, channelId: Long, trackId: Long) {
        val project = findProject(projectId)
        val channel = project.channels.find { it.id == channelId }
            ?: throw EntityNotFoundException("Channel not found with id: $channelId")
        
        val track = channel.tracks.find { it.id == trackId }
            ?: throw EntityNotFoundException("Track not found with id: $trackId")

        channel.tracks.remove(track)
        project.updatedAt = LocalDateTime.now()
        projectRepo.save(project)
    }

    private fun findProject(id: Long): Project {
        return projectRepo.findById(id)
            .orElseThrow { EntityNotFoundException("Project not found with id: $id") }
    }

    private fun Project.toDto(): ProjectDto = ProjectDto(
        id = id,
        name = name,
        createdBy = createdBy,
        bpm = bpm,
        quantizeDivision = quantizeDivision,
        masterVolume = masterVolume,
        masterMuted = masterMuted,
        channels = channels.map { it.toDto() },
        effects = effects.map { it.toDto() },
        createdAt = createdAt,
        updatedAt = updatedAt
    )

    private fun Channel.toDto(): ChannelDto = ChannelDto(
        id = id,
        name = name,
        volume = volume,
        muted = muted,
        solo = solo,
        position = position,
        effects = effects.map { it.toDto() },
        tracks = tracks.map { it.toDto() }
    )

    private fun Effect.toDto(): EffectDto = EffectDto(
        id = id,
        type = type,
        enabled = enabled,
        parameters = parameters,
        position = position
    )

    private fun Track.toDto(): TrackDto = TrackDto(
        id = id,
        name = name,
        audioFileId = audioFileId,
        startTime = startTime
    )
} 