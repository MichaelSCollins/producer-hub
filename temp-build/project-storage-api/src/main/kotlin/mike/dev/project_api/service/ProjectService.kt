package mike.dev.project_api.service

import mike.dev.project_api.model.*
import mike.dev.project_api.dto.*
import mike.dev.project_api.repository.ProjectRepository
import jakarta.persistence.EntityNotFoundException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
class ProjectService(
    private val projectRepository: ProjectRepository
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
        return projectRepository.save(project).toDto()
    }

    @Transactional(readOnly = true)
    fun getProject(id: Long): ProjectDto {
        return findProject(id).toDto()
    }

    @Transactional(readOnly = true)
    fun getProjectsByUser(createdBy: String): List<ProjectDto> {
        return projectRepository.findByCreatedBy(createdBy).map { it.toDto() }
    }

    @Transactional
    fun updateProject(id: Long, request: UpdateProjectRequest): ProjectDto {
        val project = findProject(id)
        request.name?.let { project.name = it }
        request.bpm?.let { project.bpm = it }
        request.quantizeDivision?.let { project.quantizeDivision = it }
        request.masterVolume?.let { project.masterVolume = it }
        request.masterMuted?.let { project.masterMuted = it }
        project.updatedAt = LocalDateTime.now()
        return projectRepository.save(project).toDto()
    }

    @Transactional
    fun deleteProject(id: Long) {
        if (!projectRepository.existsById(id)) {
            throw EntityNotFoundException("Project not found with id: $id")
        }
        projectRepository.deleteById(id)
    }

    @Transactional
    fun addChannel(projectId: Long, request: CreateChannelRequest): ProjectDto {
        val project = findProject(projectId)
        val channel = Channel(
            project = project,
            name = request.name,
            volume = request.volume,
            muted = request.muted,
            solo = request.solo,
            position = request.position
        )
        project.channels.add(channel)
        project.updatedAt = LocalDateTime.now()
        return projectRepository.save(project).toDto()
    }

    @Transactional
    fun updateChannel(projectId: Long, channelId: Long, request: UpdateChannelRequest): ProjectDto {
        val project = findProject(projectId)
        val channel = project.channels.find { it.id == channelId }
            ?: throw EntityNotFoundException("Channel not found with id: $channelId")

        request.name?.let { channel.name = it }
        request.volume?.let { channel.volume = it }
        request.muted?.let { channel.muted = it }
        request.solo?.let { channel.solo = it }
        request.position?.let { channel.position = it }
        channel.updatedAt = LocalDateTime.now()
        project.updatedAt = LocalDateTime.now()
        return projectRepository.save(project).toDto()
    }

    @Transactional
    fun deleteChannel(projectId: Long, channelId: Long): ProjectDto {
        val project = findProject(projectId)
        project.channels.removeIf { it.id == channelId }
        project.updatedAt = LocalDateTime.now()
        return projectRepository.save(project).toDto()
    }

    private fun findProject(id: Long): Project {
        return projectRepository.findById(id)
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